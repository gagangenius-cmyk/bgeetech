"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { Op } from "sequelize";
import { z } from "zod";
import { BOOKING_TIMES } from "@/lib/booking";
import { currencyCodes, toMinor, type CurrencyCode } from "@/lib/currency";
import { getDb } from "@/lib/db";
import { appendJsonl, postWebhook, rateLimit, sendEmail } from "@/lib/leads";
import { consultation, services } from "@/lib/site";
import { createCheckoutSession } from "@/lib/stripe";



const schema = z.object({
  currency: z.enum(currencyCodes as [CurrencyCode, ...CurrencyCode[]]),
  serviceSlug: z.string().refine((v) => services.some((s) => s.slug === v), "Choose a service"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date"),
  time: z.enum(BOOKING_TIMES),
  timezone: z.string().max(60).optional(),
  name: z.string().trim().min(2, "Enter your name").max(120),
  email: z.string().trim().email("Enter a valid email").max(190),
  goal: z.string().trim().max(2000).optional(),
  minutes: z.enum(["30", "60"]).default("30"),
});

export type BookingInput = z.input<typeof schema>;
export type BookingResult = { ok: true; ref: string; url?: string; free?: boolean } | { ok: false; error: string };

export async function createBooking(input: BookingInput): Promise<BookingResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check your details." };
  const d = parsed.data;

  // Sessions must be on a weekday, in the future, within 60 days.
  const day = new Date(`${d.date}T00:00:00Z`);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const diffDays = (day.getTime() - today.getTime()) / 86_400_000;
  if (Number.isNaN(day.getTime()) || diffDays < 1 || diffDays > 60 || [0, 6].includes(day.getUTCDay())) {
    return { ok: false, error: "Please choose a weekday within the next 60 days." };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`booking:${ip}`, 6, 30 * 60_000)) return { ok: false, error: "Too many attempts. Please try again later." };

  const service = services.find((s) => s.slug === d.serviceSlug)!;
  const free = d.minutes === "30"; // the first 30 minutes are free; the 60-minute deep-dive is paid
  const amountMinor = free ? 0 : toMinor(consultation.extendedUsd, d.currency);
  const ref = `BK-${randomBytes(5).toString("hex").toUpperCase()}`;

  const record = {
    ref,
    status: free ? "confirmed" : "pending",
    minutes: Number(d.minutes),
    serviceSlug: service.slug,
    service: service.title,
    slotDate: d.date,
    slotTime: d.time,
    timezone: d.timezone,
    name: d.name,
    email: d.email,
    goal: d.goal,
    amountCents: amountMinor,
    currency: d.currency.toLowerCase(),
  };

  let saved = false;
  try {
    const db = await getDb();
    // Prevent double-booking the same slot (paid, or pending created in the last 15 minutes).
    const taken = await db.Booking.findOne({
      where: {
        slotDate: d.date,
        slotTime: d.time,
        [Op.or]: [{ status: { [Op.in]: ["paid", "confirmed"] } }, { status: "pending", createdAt: { [Op.gt]: new Date(Date.now() - 15 * 60_000) } }],
      },
    });
    if (taken) return { ok: false, error: "That time was just taken. Please choose another slot." };
    await db.Booking.create(record);
    saved = true;
  } catch {
    saved = await appendJsonl("bookings.jsonl", { ...record, createdAt: new Date().toISOString() }).catch(() => false);
  }
  if (!saved) return { ok: false, error: "We could not save your booking. Please contact us on WhatsApp." };

  const total = free ? "Free" : `${(amountMinor / 100).toFixed(2)} ${d.currency}`;
  void postWebhook({ type: "booking", ...record }).catch(() => {});
  void sendEmail(`New booking ${ref}: ${service.title}`, { ...record, total }, d.email).catch(() => {});

  if (free) return { ok: true, ref, free: true }; // nothing to pay, so no checkout

  let url: string | undefined;
  try {
    const session = await createCheckoutSession({
      mode: "payment",
      ref,
      email: d.email,
      productName: `${consultation.extendedMinutes}-minute consultation: ${service.title} on ${d.date} at ${d.time}`,
      amountMinor,
      currency: d.currency,
      successPath: `/book/success?ref=${ref}`,
      cancelPath: "/book?cancelled=1",
    });
    if (session) {
      url = session.url;
      try {
        const db = await getDb();
        await db.Booking.update({ stripeSessionId: session.id }, { where: { ref } });
      } catch {
        /* non-critical: the webhook matches on metadata.ref */
      }
    }
  } catch (e) {
    console.error("booking checkout:", e instanceof Error ? e.message : "unknown");
    return { ok: false, error: "Payment could not be started. Your booking was saved, and we will email you a payment link." };
  }
  return { ok: true, ref, url };
}
