"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { currencyCodes, toMinor, type CurrencyCode } from "@/lib/currency";
import { getDb } from "@/lib/db";
import { appendJsonl, postWebhook, rateLimit, sendEmail } from "@/lib/leads";
import { carePlans } from "@/lib/site";
import { createCheckoutSession } from "@/lib/stripe";
import { cleanDomain, validDomain } from "@/lib/builder/config";

const schema = z.object({
  planId: z.enum(carePlans.map((p) => p.id) as [string, ...string[]]),
  currency: z.enum(currencyCodes as [CurrencyCode, ...CurrencyCode[]]),
  name: z.string().trim().min(2, "Enter your name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(190),
  website: z.string().trim().max(190).refine(validDomain, "Enter your website, for example mybusiness.com"),
  terms: z.literal(true, { error: "Please accept the terms to continue" }),
});

export type CareInput = z.input<typeof schema>;
export type CareResult = { ok: true; ref: string; url?: string } | { ok: false; error: string };

/** Starts a monthly care plan. The price is worked out here from the plan id; the browser never sends an amount. */
export async function createCareSubscription(input: CareInput): Promise<CareResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check your details." };
  const d = parsed.data;

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`care:${ip}`, 6, 30 * 60_000)) return { ok: false, error: "Too many attempts. Please try again later." };

  const plan = carePlans.find((p) => p.id === d.planId)!;
  const amountMinor = toMinor(plan.price, d.currency);
  const ref = `CP-${randomBytes(5).toString("hex").toUpperCase()}`;
  const website = cleanDomain(d.website);

  const record = { ref, status: "pending", planId: plan.id, name: d.name, email: d.email.toLowerCase(), website, amountCents: amountMinor, currency: d.currency.toLowerCase() };
  let saved = false;
  try {
    const db = await getDb();
    await db.CareSub.create(record);
    saved = true;
  } catch {
    saved = await appendJsonl("care.jsonl", { ...record, createdAt: new Date().toISOString() }).catch(() => false);
  }
  if (!saved) return { ok: false, error: "We could not save your request. Please contact us on WhatsApp." };

  void postWebhook({ type: "care", ...record }).catch(() => {});
  void sendEmail(`New care plan ${ref}: ${plan.name} for ${website}`, { ...record, total: `${(amountMinor / 100).toFixed(2)} ${d.currency}` }, d.email).catch(() => {});

  let url: string | undefined;
  try {
    const session = await createCheckoutSession({
      mode: "subscription",
      ref,
      email: d.email,
      productName: `${plan.name} care plan for ${website}`,
      amountMinor,
      currency: d.currency,
      interval: "month",
      successPath: `/care/success?ref=${ref}`,
      cancelPath: "/care?cancelled=1",
    });
    if (session) {
      url = session.url;
      try {
        const db = await getDb();
        await db.CareSub.update({ stripeSessionId: session.id }, { where: { ref } });
      } catch {
        /* the webhook matches on metadata.ref, so this is non-critical */
      }
    }
  } catch (e) {
    console.error("care checkout:", e instanceof Error ? e.message : "unknown");
    return { ok: false, error: "Payment could not be started. Your request was saved, and we will email you a payment link." };
  }
  return { ok: true, ref, url };
}
