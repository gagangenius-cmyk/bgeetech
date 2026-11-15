"use client";

import { useActionState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Send } from "lucide-react";
import { submitLead, type LeadState } from "@/actions/lead";
import { Button } from "@/components/ui/button";

const initial: LeadState = { ok: false };

function Field({ label, name, error, children }: { label: string; name: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-1.5 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

const input =
  "min-h-12 w-full rounded-xl border border-border bg-card px-4 text-base outline-none transition-all placeholder:text-muted-foreground/70 focus:border-brand focus:ring-4 focus:ring-brand/15 aria-[invalid=true]:border-red-500";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitLead, initial);

  return (
    <AnimatePresence mode="wait">
      {state.ok ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          role="status"
          className="rounded-3xl border border-accent/40 bg-accent/10 p-10 text-center"
        >
          <CheckCircle2 className="mx-auto size-12 text-accent" aria-hidden />
          <p className="mt-4 font-display text-2xl font-bold">Message sent</p>
          <p className="mt-2 text-muted-foreground">{state.message}</p>
        </motion.div>
      ) : (
        <motion.form key="form" action={action} className="space-y-5" noValidate>
          <Field label="Name" name="name" error={state.errors?.name}>
            <input id="name" name="name" autoComplete="name" required className={input} aria-invalid={!!state.errors?.name} aria-describedby={state.errors?.name ? "name-error" : undefined} />
          </Field>
          <Field label="Email" name="email" error={state.errors?.email}>
            <input id="email" name="email" type="email" autoComplete="email" required className={input} aria-invalid={!!state.errors?.email} aria-describedby={state.errors?.email ? "email-error" : undefined} />
          </Field>
          <Field label="How can we help?" name="message" error={state.errors?.message}>
            <textarea id="message" name="message" rows={5} required className={`${input} py-3`} aria-invalid={!!state.errors?.message} aria-describedby={state.errors?.message ? "message-error" : undefined} />
          </Field>
          {/* honeypot */}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          <Button type="submit" disabled={pending} className="w-full disabled:opacity-60">
            {pending ? "Sending..." : <>Send message <Send className="size-4" /></>}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
