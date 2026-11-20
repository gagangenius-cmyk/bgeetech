import { getDb } from "@/lib/db";
import { verifyWebhook } from "@/lib/stripe";

type StripeEvent = { id: string; type: string; data: { object: { metadata?: { ref?: string }; payment_status?: string } } };

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!secret || !sig) return new Response("Not configured", { status: 400 });

  const raw = await req.text();
  if (!verifyWebhook(raw, sig, secret)) return new Response("Bad signature", { status: 400 });

  const event = JSON.parse(raw) as StripeEvent;
  const obj = event.data.object;
  const ref = obj.metadata?.ref;

  const status =
    event.type === "checkout.session.completed" ? (obj.payment_status === "paid" || obj.payment_status === "no_payment_required" ? "paid" : null)
    : event.type === "checkout.session.async_payment_succeeded" || event.type === "invoice.paid" ? "paid"
    : event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed" ? "cancelled"
    : event.type === "customer.subscription.deleted" ? "ended"
    : null;

  const match = ref ? /^(BG|BK|CP)-[0-9A-F]{10}$/.exec(ref) : null;
  if (match && status) {
    try {
      const db = await getDb();
      if (match[1] === "CP") {
        // Care plans: paid means the subscription is active; a deleted subscription ends it.
        const next = status === "paid" ? "active" : status === "ended" ? "cancelled" : "cancelled";
        await db.CareSub.update({ status: next }, { where: next === "cancelled" && status !== "ended" ? { ref, status: "pending" } : { ref } });
      } else {
        const model = match[1] === "BG" ? db.Order : db.Booking;
        if (status !== "ended") {
          // Idempotent: replays set the same value. A paid record is never moved back to cancelled.
          await model.update({ status }, { where: status === "cancelled" ? { ref, status: "pending" } : { ref } });
        }
      }
    } catch {
      return new Response("db error", { status: 500 }); // Stripe retries on non-2xx
    }
  }
  return new Response("ok");
}
