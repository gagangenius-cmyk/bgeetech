"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { rateLimit, saveLead } from "@/lib/leads";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(200),
  consent: z.literal("on", { error: "Please tick the box to subscribe" }),
  company: z.string().max(0).optional(), // honeypot
});

export type NewsletterState = { ok: boolean; message?: string; error?: string };

export async function subscribe(_prev: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const parsed = schema.safeParse(Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === "string" && v !== "")));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check your email address" };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`news:${ip}`, 4, 10 * 60_000)) return { ok: false, error: "Too many attempts. Please try again in a few minutes." };

  const ok = await saveLead({
    name: "Newsletter subscriber",
    email: parsed.data.email,
    service: "Newsletter",
    message: "Subscribed to the weekly tech tips email.",
    source: "newsletter",
    createdAt: new Date().toISOString(),
  });
  return ok ? { ok: true, message: "You're subscribed. Watch your inbox for our next tip." } : { ok: false, error: "Sorry, something went wrong. Please try again." };
}
