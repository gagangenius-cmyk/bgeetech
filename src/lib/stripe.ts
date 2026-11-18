import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { site } from "@/lib/site";

export const stripeEnabled = () => Boolean(process.env.STRIPE_SECRET_KEY);
export const siteOrigin = () => (process.env.SITE_URL || site.url).replace(/\/$/, "");

export type CheckoutInput = {
  mode: "subscription" | "payment";
  ref: string; // our order/booking reference, echoed back in webhooks via metadata
  email: string;
  productName: string;
  amountMinor: number; // smallest currency unit (cents, fils, paise)
  currency: string; // ISO code, any case
  interval?: "month" | "year"; // subscription only
  intervalCount?: number; // subscription only
  successPath: string;
  cancelPath: string;
};

/**
 * Creates a Stripe Checkout Session through the REST API (no SDK, so nothing native).
 * Card details are entered on Stripe's hosted page and never reach this server.
 * Returns null when Stripe is not configured.
 */
export async function createCheckoutSession(i: CheckoutInput): Promise<{ id: string; url: string } | null> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;

  const origin = siteOrigin();
  const p = new URLSearchParams({
    mode: i.mode,
    success_url: `${origin}${i.successPath}`,
    cancel_url: `${origin}${i.cancelPath}`,
    customer_email: i.email,
    client_reference_id: i.ref,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": i.currency.toLowerCase(),
    "line_items[0][price_data][unit_amount]": String(Math.round(i.amountMinor)),
    "line_items[0][price_data][product_data][name]": i.productName.slice(0, 250),
    "metadata[ref]": i.ref,
    allow_promotion_codes: "true",
  });
  if (i.mode === "subscription") {
    p.set("line_items[0][price_data][recurring][interval]", i.interval ?? "month");
    p.set("line_items[0][price_data][recurring][interval_count]", String(i.intervalCount ?? 1));
    p.set("subscription_data[metadata][ref]", i.ref);
  } else {
    p.set("payment_intent_data[metadata][ref]", i.ref);
  }

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded", "Idempotency-Key": `checkout-${i.ref}` },
    body: p,
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) {
    // Log Stripe's error type only (never request data, which contains the customer's email).
    const body = (await res.json().catch(() => ({}))) as { error?: { type?: string; code?: string } };
    throw new Error(`stripe ${res.status} ${body.error?.type ?? ""} ${body.error?.code ?? ""}`.trim());
  }
  const s = (await res.json()) as { id: string; url: string };
  return { id: s.id, url: s.url };
}

/** Verifies a webhook signature: HMAC-SHA256 over "timestamp.payload" with a 5 minute tolerance. */
export function verifyWebhook(payload: string, header: string, secret: string): boolean {
  const parts = header.split(",").map((kv) => kv.split("=") as [string, string]);
  const t = Number(parts.find(([k]) => k === "t")?.[1]);
  if (!t || Math.abs(Date.now() / 1000 - t) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  return parts
    .filter(([k]) => k === "v1")
    .some(([, sig]) => sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected)));
}
