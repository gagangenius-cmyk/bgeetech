"use server";

import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(200),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(2000),
  company: z.string().max(0).optional(), // honeypot: must stay empty
});

export type LeadState = {
  ok: boolean;
  errors?: Partial<Record<"name" | "email" | "message", string>>;
  message?: string;
};

export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errors: NonNullable<LeadState["errors"]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as "name" | "email" | "message";
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return { ok: false, errors };
  }

  // TODO(phase 4): persist to Postgres (`Lead`) and notify via Resend.
  // Intentionally logs nothing sensitive until storage is wired up.
  return { ok: true, message: "Thanks! We will reply within one business day." };
}
