import "server-only";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { getDb } from "@/lib/db";
import { deliver, notifyAddress } from "@/lib/mailer";

export type Lead = {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  budget?: string;
  message?: string;
  source: "popup" | "contact" | "estimator" | "chat" | "audit" | "newsletter" | "referral";
  createdAt: string;
};

/**
 * Delivers a lead through every configured channel. Failures in one channel never
 * block the others, and PII is never written to logs.
 *  1. MySQL (Lead table)  - primary store, visible in /admin/leads
 *  2. data/leads.jsonl    - fallback only when the database write fails
 *  3. LEAD_WEBHOOK_URL    - Zapier / Make / Google Apps Script / CRM
 *  4. Resend email        - RESEND_API_KEY + LEAD_NOTIFY_EMAIL + LEAD_FROM_EMAIL
 * Returns true when at least one channel accepted the lead.
 */
export async function saveLead(lead: Lead): Promise<boolean> {
  const [dbRes, hook, mail] = await Promise.allSettled([
    getDb().then((db) =>
      db.Lead.create({ name: lead.name, email: lead.email, phone: lead.phone, service: lead.service, budget: lead.budget, message: lead.message, source: lead.source }),
    ),
    postWebhook({ type: "lead", ...lead }),
    sendEmail(`New ${lead.source} lead: ${lead.name.slice(0, 60)}`, lead, lead.email),
    sendAutoReply(lead),
  ]);
  const dbOk = dbRes.status === "fulfilled";
  let fileOk = false;
  if (!dbOk) fileOk = await appendJsonl("leads.jsonl", lead).catch(() => false);
  return dbOk || fileOk || (hook.status === "fulfilled" && hook.value) || (mail.status === "fulfilled" && mail.value);
}

export async function appendJsonl(file: string, record: unknown) {
  const dir = path.join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, file), JSON.stringify(record) + "\n", "utf8");
  return true;
}

export async function postWebhook(payload: Record<string, unknown>) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  });
  return res.ok;
}

const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Notification to the team inbox (LEAD_NOTIFY_EMAIL), with the visitor set as reply-to. */
export async function sendEmail(subject: string, fields: Record<string, unknown>, replyTo?: string) {
  const rows = Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;vertical-align:top"><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`)
    .join("");
  return deliver({ to: notifyAddress(), subject, html: `<table>${rows}</table>`, replyTo });
}

/** Friendly acknowledgement to the visitor, so they know we received it and what happens next. */
export async function sendAutoReply(lead: Lead) {
  if (!lead.email) return false;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://bgeetech.com";
  const news = lead.source === "newsletter";
  const first = esc(lead.name.split(" ")[0] || "there");
  const html = news
    ? `<p>Thanks for subscribing to BGeetech's tech tips.</p><p>Each week we share one practical idea for your website or software. Unsubscribe any time by replying to this email.</p>`
    : `<p>Hi ${first},</p><p>Thanks for contacting BGeetech. We received your message and will reply within one business day.</p><p>While you wait: <a href="${site}/audit">check your website for free</a>, or <a href="${site}/book">book a free 30-minute consultation</a>.</p><p>BGeetech</p>`;
  return deliver({ to: lead.email, subject: news ? "You're subscribed to BGeetech tips" : "We received your message", html, replyTo: notifyAddress() });
}

// Small in-memory limiter (per server instance). Replace with Redis/Upstash when scaling out.
const hits = new Map<string, number[]>();
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return true;
}
