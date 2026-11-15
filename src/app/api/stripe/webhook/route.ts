import { createHmac, timingSafeEqual } from "node:crypto";
import { getDb } from "@/lib/db";

/** Verifies Stripe's signature (HMAC-SHA256 over "t.payload", 5 minute tolerance) without the SDK. */
function verify(payload: string, header: string, secret: string) {
  const parts = Object.fromEntries(header.split(",").map((kv) => kv.split("=") as [string, string]));
  const t = Number(parts.t);
  if (!t || Math.abs(Date.now() / 1000 - t) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${parts.t}.${payload}`).digest("hex");
  const given = header.split(",").filter((kv) => kv.startsWith("v1=")).map((kv) => kv.slice(3));
  return given.some((sig) => sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected)));
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!secret || !sig) return new Response("Not configured", { status: 400 });

  const raw = await req.text();
  if (!verify(raw, sig, secret)) return new Response("Bad signature", { status: 400 });

  const event = JSON.parse(raw) as { type: string; data: { object: { metadata?: { ref?: string } } } };
  const ref = event.data.object.metadata?.ref;
  if (ref && /^BG-[0-9A-F]{10}$/.test(ref)) {
    const status = event.type === "checkout.session.completed" || event.type === "invoice.paid" ? "paid" : event.type === "checkout.session.expired" ? "cancelled" : null;
    if (status) {
      try {
        const db = await getDb();
        await db.Order.update({ status }, { where: { ref } }); // idempotent: repeated events set the same value
      } catch {
        return new Response("db error", { status: 500 }); // Stripe will retry
      }
    }
  }
  return new Response("ok");
}
