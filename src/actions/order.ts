"use server";

import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { headers } from "next/headers";
import { z } from "zod";
import { cleanDomain, cycles, priceFor, styles, tiers, validDomain } from "@/lib/builder/config";
import { getIndustry } from "@/lib/builder/industries";
import { currencyCodes, toMinor, type CurrencyCode } from "@/lib/currency";
import { getDb } from "@/lib/db";
import { appendJsonl, postWebhook, rateLimit, sendEmail } from "@/lib/leads";
import { createCheckoutSession } from "@/lib/stripe";

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/);

const schema = z.object({
  currency: z.enum(currencyCodes as [CurrencyCode, ...CurrencyCode[]]),
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

export async function createOrder(input: OrderInput): Promise<OrderResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check your details." };
  const d = parsed.data;

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`order:${ip}`, 6, 30 * 60_000)) return { ok: false, error: "Too many attempts. Please try again later." };

  // The amount is always computed here from plan ids and the server's rate table; the browser never sends a price.
  const price = priceFor(d.plan.tier as never, d.plan.cycle as never);
  const amountMinor = toMinor(price.total, d.currency);
  const ref = `BG-${randomBytes(5).toString("hex").toUpperCase()}`;
  const ind = getIndustry(d.industry)!;
  const domain = cleanDomain(d.business.domain);
  const logoPath = d.business.logo ? await saveLogo(ref, d.business.logo).catch(() => "") : "";

  const record = {
    ref,
    status: "pending",
    tier: price.tier.id,
    cycle: price.cycle.id,
    amountCents: amountMinor,
    currency: d.currency.toLowerCase(),
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
  const total = `${(amountMinor / 100).toFixed(2)} ${d.currency}`;
  void postWebhook({ type: "order", ...record }).catch(() => {});
  void sendEmail(`New website order ${ref}: ${d.business.name}`, { ...record, total }, d.business.email).catch(() => {});

  let url: string | undefined;
  try {
    const session = await createCheckoutSession({
      mode: "subscription",
      ref,
      email: d.business.email,
      productName: `${price.tier.name} website plan (${price.cycle.label}) for ${domain}`,
      amountMinor,
      currency: d.currency,
      interval: price.cycle.id === "annual" ? "year" : "month",
      intervalCount: price.cycle.id === "quarterly" ? 3 : 1,
      successPath: `/builder/success?ref=${ref}`,
      cancelPath: "/builder?cancelled=1",
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
  } catch (e) {
    console.error("order checkout:", e instanceof Error ? e.message : "unknown");
    return { ok: false, error: "Payment could not be started. Your order was saved, and we will email you a payment link." };
  }

  return { ok: true, ref, url };
}
