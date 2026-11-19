"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { rateLimit, saveLead } from "@/lib/leads";

const base = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(200),
  phone: z
    .string()
    .trim()
    .max(25)
    .regex(/^[+()\d\s-]*$/, "Use digits, spaces, + or - only")
    .optional(),
  service: z.string().trim().max(120).optional(),
  budget: z.string().trim().max(60).optional(),
  message: z.string().trim().max(2000).optional(),
  source: z.enum(["popup", "contact", "estimator", "chat", "audit", "newsletter", "referral"]).default("contact"),
  consent: z.literal("on", { error: "Please agree so we can contact you" }),
  company: z.string().max(0).optional(), // honeypot: must stay empty
});

export type LeadField = "name" | "email" | "phone" | "message" | "consent";
export type LeadState = {
  ok: boolean;
  errors?: Partial<Record<LeadField, string>>;
  message?: string;
};

export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const raw = Object.fromEntries(
    [...formData.entries()].filter(([, v]) => typeof v === "string" && v !== ""),
  );
  const parsed = base.safeParse(raw);

  if (!parsed.success) {
    const errors: NonNullable<LeadState["errors"]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as LeadField;
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return { ok: false, errors };
  }

  const d = parsed.data;
  if ((d.source === "contact" || d.source === "referral") && (d.message?.length ?? 0) < 10) {
    return { ok: false, errors: { message: "Tell us a little more (10+ characters)" } };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`lead:${ip}`, 5, 10 * 60_000)) {
    return { ok: false, message: "Too many requests. Please try again in a few minutes." };
  }

  const stored = await saveLead({
    name: d.name,
    email: d.email,
    phone: d.phone,
    service: d.service,
    budget: d.budget,
    message: d.message,
    source: d.source,
    createdAt: new Date().toISOString(),
  });

  if (!stored) return { ok: false, message: "Sorry, something went wrong. Please try WhatsApp or email us." };
  return { ok: true, message: "Thank you! We will contact you within one business day." };
}
