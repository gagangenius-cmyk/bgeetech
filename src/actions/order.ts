"use server";

import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { headers } from "next/headers";
import { z } from "zod";
import { cleanDomain, cycles, priceFor, styles, tiers, validDomain } from "@/lib/builder/config";
import { getIndustry } from "@/lib/builder/industries";
import { getDb } from "@/lib/db";
import { appendJsonl, postWebhook, rateLimit, sendEmail } from "@/lib/leads";
import { site } from "@/lib/site";

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/);

const schema = z.object({
  business: z.object({
    name: z.string().trim().min(2).max(160),
    domain: z.string().trim().max(190).refine(validDomain, "Enter a valid domain such as mybusiness.com"),
    slogan: z.string().trim().max(300),
    email: z.string().trim().email().max(190),
    phone: z.string().trim().min(7).max(40).regex(/^[+()\d\s-]+$/),
    logo: z.string().max(260_000),
  }),
  industry: z.string().refine((v) => !!getIndustry(v), "Choose your business type"),
  theme: z.object({ id: z.string().max(60), colors: z.tuple([hex, hex, hex]) }),
  style: z.string().refine((v) => styles.some((s) => s.id === v)),
  plan: z.object({ tier: z.enum(tiers.map((t) => t.id) as [string, ...string[]]), cycle: z.enum(cycles.map((c) => c.id) as [string, ...string[]]) }),
  terms: z.literal(true),
});

export type OrderInput = z.input<typeof schema>;
export type OrderResult = { ok: true; ref: string; url?: string } | { ok: false; error: string };

async function saveLogo(ref: string, dataUrl: string): Promise<string> {
  const m = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!m) return "";
  const buf = Buffer.from(m[2], "base64");
  if (buf.length > 180_000) return "";
  const dir = path.join(process.cwd(), "data", "logos");
  await mkdir(dir, { recursive: true });
  const file = `${ref}.${m[1] === "jpeg" ? "jpg" : m[1]}`;
  await writeFile(path.join(dir, file), buf);
  return `data/logos/${file}`;
}

async function stripeCheckout(o: { ref: string; email: string; cents: number; name: string; interval: "month" | "year"; count: number }) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return undefined;
  const origin = (process.env.SITE_URL || site.url).replace(/\/$/, "");
  const p = new URLSearchParams({
    mode: "subscription",
    success_url: `${origin}/builder/success?ref=${o.ref}`,
    cancel_url: `${origin}/builder?cancelled=1`,
    customer_email: o.email,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": String(o.cents),
    "line_items[0][price_data][recurring][interval]": o.interval,
    "line_items[0][price_data][recurring][interval_count]": String(o.count),
    "line_items[0][price_data][product_data][name]": o.name,
    "metadata[ref]": o.ref,
    "subscription_data[metadata][ref]": o.ref,
    allow_promotion_codes: "true",
  });
  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: p,
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) throw new Error(`stripe ${res.status}`);
  const s = (await res.json()) as { id: string; url: string };
  return s;
}

export async function createOrder(input: OrderInput): Promise<OrderResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check your details." };
  const d = parsed.data;

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`order:${ip}`, 6, 30 * 60_000)) return { ok: false, error: "Too many attempts. Please try again later." };

  // Price is always computed here from the plan ids; amounts sent by the browser are never trusted.
  const price = priceFor(d.plan.tier as never, d.plan.cycle as never);
  const ref = `BG-${randomBytes(5).toString("hex").toUpperCase()}`;
  const ind = getIndustry(d.industry)!;
  const domain = cleanDomain(d.business.domain);
  const logoPath = d.business.logo ? await saveLogo(ref, d.business.logo).catch(() => "") : "";

  const record = {
    ref,
    status: "pending",
    tier: price.tier.id,
    cycle: price.cycle.id,
    amountCents: price.cents,
    currency: "usd",
    businessName: d.business.name,
    domain,
    slogan: d.business.slogan,
    email: d.business.email,
    phone: d.business.phone,
    industry: ind.label,
    style: d.style,
    colors: d.theme.colors.join(" "),
    logoPath,
  };

  let saved = false;
  try {
    const db = await getDb();
    await db.Order.create(record);
    saved = true;
  } catch {
    saved = await appendJsonl("orders.jsonl", { ...record, createdAt: new Date().toISOString() }).catch(() => false);
  }
  if (!saved) return { ok: false, error: "We could not save your order. Please contact us on WhatsApp." };

  // Best-effort notifications; never block the customer on these.
  void postWebhook({ type: "order", ...record }).catch(() => {});
  void sendEmail(`New website order ${ref}: ${d.business.name}`, { ...record, total: `$${price.total.toFixed(2)}` }, d.business.email).catch(() => {});

  let url: string | undefined;
  try {
    const session = await stripeCheckout({
      ref,
      email: d.business.email,
      cents: price.cents,
      name: `${price.tier.name} website plan (${price.cycle.label}) for ${domain}`,
      interval: price.cycle.id === "annual" ? "year" : "month",
      count: price.cycle.id === "quarterly" ? 3 : 1,
    });
    if (session) {
      url = session.url;
      try {
        const db = await getDb();
        await db.Order.update({ stripeSessionId: session.id }, { where: { ref } });
      } catch {
        /* the webhook matches on metadata.ref, so this is non-critical */
      }
    }
  } catch {
    return { ok: false, error: "Payment could not be started. Your order was saved, and we will email you a payment link." };
  }

  return { ok: true, ref, url };
}
