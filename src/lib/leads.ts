import "server-only";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export type Lead = {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  budget?: string;
  message?: string;
  source: "popup" | "contact" | "estimator" | "chat";
  createdAt: string;
};

/**
 * Delivers a lead through every configured channel. Failures in one channel never
 * block the others, and PII is never written to logs.
 *  1. data/leads.jsonl  (persistent Node hosts; NOT durable on serverless platforms)
 *  2. LEAD_WEBHOOK_URL  (Zapier / Make / Google Apps Script / CRM)
 *  3. Resend email      (RESEND_API_KEY + LEAD_NOTIFY_EMAIL + LEAD_FROM_EMAIL)
 * Returns true when at least one channel accepted the lead.
 */
export async function saveLead(lead: Lead): Promise<boolean> {
  const results = await Promise.allSettled([toFile(lead), toWebhook(lead), toEmail(lead)]);
  return results.some((r) => r.status === "fulfilled" && r.value === true);
}

async function toFile(lead: Lead) {
  const dir = path.join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, "leads.jsonl"), JSON.stringify(lead) + "\n", "utf8");
  return true;
}

async function toWebhook(lead: Lead) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
    signal: AbortSignal.timeout(8000),
  });
  return res.ok;
}

const esc = (s = "") => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function toEmail(lead: Lead) {
  const { RESEND_API_KEY: key, LEAD_NOTIFY_EMAIL: to, LEAD_FROM_EMAIL: from } = process.env;
  if (!key || !to || !from) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: lead.email,
      subject: `New ${lead.source} lead: ${lead.name.slice(0, 60)}`,
      html: `<h2>New lead (${esc(lead.source)})</h2>
<p><b>Name:</b> ${esc(lead.name)}<br><b>Email:</b> ${esc(lead.email)}<br><b>Phone:</b> ${esc(lead.phone)}<br>
<b>Service:</b> ${esc(lead.service)}<br><b>Budget:</b> ${esc(lead.budget)}</p><p>${esc(lead.message)}</p>`,
    }),
    signal: AbortSignal.timeout(8000),
  });
  return res.ok;
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
