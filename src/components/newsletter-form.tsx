"use client";

import { useActionState } from "react";
import { Check, Loader2, Mail } from "lucide-react";
import { subscribe, type NewsletterState } from "@/actions/newsletter";
import { track } from "@/lib/track";

const initial: NewsletterState = { ok: false };

export function NewsletterForm() {
  const [state, action, pending] = useActionState(async (prev: NewsletterState, fd: FormData) => {
    const next = await subscribe(prev, fd);
    if (next.ok) track("newsletter_signup");
    return next;
  }, initial);

  if (state.ok) {
    return (
      <p role="status" className="flex items-center gap-2 text-sm font-medium text-white">
        <Check className="size-5 text-accent" aria-hidden /> {state.message}
      </p>
    );
  }
  return (
    <form action={action} noValidate>
      <label htmlFor="news-email" className="text-sm font-semibold text-white">
        One practical tech tip a week
      </label>
      <div className="mt-3 flex gap-2">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/50" aria-hidden />
          <input id="news-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@company.com" aria-invalid={Boolean(state.error)} className="min-h-12 w-full rounded-full border border-white/20 bg-white/10 pl-10 pr-4 text-base text-white outline-none placeholder:text-white/40 focus:border-accent" />
        </div>
        <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-5 text-sm font-bold text-ink transition active:scale-[0.98] disabled:opacity-60">
          {pending ? <Loader2 className="size-4 animate-spin" aria-label="Subscribing" /> : "Subscribe"}
        </button>
      </div>
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <label className="mt-3 flex items-start gap-2 text-xs text-white/60">
        <input type="checkbox" name="consent" className="mt-0.5 size-4 accent-[var(--accent)]" />
        <span>Yes, email me tips and updates. Unsubscribe any time. See our privacy policy.</span>
      </label>
      {state.error && (
        <p role="alert" className="mt-2 text-xs text-red-300">
          {state.error}
        </p>
      )}
    </form>
  );
}
