"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Send } from "lucide-react";
import { useActionState, useId, type ReactNode } from "react";
import { submitLead, type LeadField, type LeadState } from "@/actions/lead";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/site";

const initial: LeadState = { ok: false };

const input =
  "min-h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none transition-all placeholder:text-muted-foreground/70 focus:border-brand focus:ring-4 focus:ring-brand/15 aria-[invalid=true]:border-red-500";

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label} {hint && <span className="font-normal text-muted-foreground">({hint})</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

type Props = {
  source: "popup" | "contact" | "estimator" | "chat";
  /** Show the free-text message box. */
  message?: "none" | "optional" | "required";
  defaultService?: string;
  defaultBudget?: string;
  defaultMessage?: string;
  submitLabel?: string;
  onSuccess?: () => void;
};

export function LeadForm({
  source,
  message = "optional",
  defaultService = "",
  defaultBudget = "",
  defaultMessage = "",
  submitLabel = "Send",
  onSuccess,
}: Props) {
  const uid = useId();
  const [state, action, pending] = useActionState(async (prev: LeadState, fd: FormData) => {
    const next = await submitLead(prev, fd);
    if (next.ok) onSuccess?.();
    return next;
  }, initial);

  const id = (n: string) => `${uid}-${n}`;
  const err = (f: LeadField) => state.errors?.[f];
  const aria = (f: LeadField) => ({ "aria-invalid": !!err(f), "aria-describedby": err(f) ? `${id(f)}-error` : undefined });

  return (
    <AnimatePresence mode="wait">
      {state.ok ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          role="status"
          className="rounded-3xl border border-accent/40 bg-accent/10 p-8 text-center"
        >
          <CheckCircle2 className="mx-auto size-12 text-accent" aria-hidden />
          <p className="mt-4 font-display text-2xl font-bold">Thank you!</p>
          <p className="mt-2 text-muted-foreground">{state.message}</p>
        </motion.div>
      ) : (
        <motion.form key="form" action={action} className="space-y-4" noValidate>
          <input type="hidden" name="source" value={source} />
          {defaultBudget && <input type="hidden" name="budget" value={defaultBudget} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id={id("name")} label="Full name" error={err("name")}>
              <input id={id("name")} name="name" autoComplete="name" required className={input} {...aria("name")} />
            </Field>
            <Field id={id("phone")} label="Phone / WhatsApp" hint="optional" error={err("phone")}>
              <input id={id("phone")} name="phone" type="tel" inputMode="tel" autoComplete="tel" className={input} {...aria("phone")} />
            </Field>
          </div>
          <Field id={id("email")} label="Email" error={err("email")}>
            <input id={id("email")} name="email" type="email" autoComplete="email" required className={input} {...aria("email")} />
          </Field>
          <Field id={id("service")} label="Interested in">
            <select id={id("service")} name="service" defaultValue={defaultService} className={input}>
              <option value="">Not sure yet</option>
              {services.map((s) => (
                <option key={s.slug} value={s.title}>
                  {s.title}
                </option>
              ))}
            </select>
          </Field>
          {message !== "none" && (
            <Field id={id("message")} label="How can we help?" hint={message === "optional" ? "optional" : undefined} error={err("message")}>
              <textarea
                id={id("message")}
                name="message"
                rows={message === "required" ? 5 : 3}
                defaultValue={defaultMessage}
                required={message === "required"}
                className={`${input} py-3`}
                {...aria("message")}
              />
            </Field>
          )}
          {/* honeypot */}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug">
              <input type="checkbox" name="consent" required className="mt-0.5 size-5 shrink-0 accent-[var(--brand)]" {...aria("consent")} />
              <span>
                I agree to be contacted about my enquiry. See our{" "}
                <a href="/privacy" className="font-medium text-brand underline-offset-4 hover:underline">
                  privacy policy
                </a>
                .
              </span>
            </label>
            {err("consent") && (
              <p id={`${id("consent")}-error`} role="alert" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                {err("consent")}
              </p>
            )}
          </div>

          {state.message && !state.ok && (
            <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm">
              {state.message}
            </p>
          )}

          <Button type="submit" disabled={pending} className="w-full disabled:opacity-60">
            {pending ? "Sending..." : <>{submitLabel} <Send className="size-4" /></>}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
