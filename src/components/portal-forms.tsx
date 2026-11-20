"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, Mail } from "lucide-react";
import { createTicket, replyTicket, requestLogin, type LoginState, type TicketState } from "@/actions/portal";
import { fieldClass } from "@/components/portal-ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(requestLogin, { ok: false } as LoginState);
  return (
    <form action={action} className="space-y-4" noValidate>
      <label htmlFor="portal-email" className="block text-sm font-medium">
        Your email
      </label>
      <div className="relative">
        <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input id="portal-email" name="email" type="email" inputMode="email" autoComplete="email" required placeholder="you@company.com" className={`${fieldClass} pl-12`} />
      </div>
      <button type="submit" disabled={pending} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-strong px-6 font-semibold text-white transition active:scale-[0.98] disabled:opacity-60">
        {pending && <Loader2 className="size-5 animate-spin" aria-hidden />}
        Email me a sign-in link
      </button>
      {state.error && (
        <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm font-medium">
          {state.error}
        </p>
      )}
      {state.ok && (
        <div role="status" className="rounded-xl border border-border bg-card p-4 text-sm">
          <p>{state.message}</p>
          {state.devLink && (
            <p className="mt-2 break-all">
              <span className="font-semibold">Development only:</span>{" "}
              <a className="text-brand underline" href={state.devLink}>
                open the sign-in link
              </a>
            </p>
          )}
        </div>
      )}
    </form>
  );
}

export function NewTicketForm({ websites }: { websites: string[] }) {
  const [state, action, pending] = useActionState(createTicket, { ok: false } as TicketState);
  return (
    <form action={action} className="space-y-5 rounded-3xl border border-border bg-card p-6 sm:p-8" noValidate>
      <label className="block text-sm font-medium">
        Subject
        <input name="subject" required maxLength={200} placeholder="For example: update the opening hours" className={`${fieldClass} mt-1.5`} />
      </label>
      <label className="block text-sm font-medium">
        Which website?
        <input name="website" list="portal-sites" maxLength={190} placeholder="mybusiness.com" className={`${fieldClass} mt-1.5`} />
        <datalist id="portal-sites">
          {websites.map((w) => (
            <option key={w} value={w} />
          ))}
        </datalist>
      </label>
      <label className="block text-sm font-medium">
        What do you need?
        <textarea name="message" required rows={6} maxLength={5000} placeholder="Describe the change or problem. Links and screenshots' addresses help." className={`${fieldClass} mt-1.5 py-3`} />
      </label>
      <label className="flex cursor-pointer items-center gap-3 text-sm">
        <input type="checkbox" name="priority" value="urgent" className="size-5 accent-[var(--brand)]" />
        This is urgent (the site is down or broken)
      </label>
      {state.error && (
        <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm font-medium">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-strong px-6 font-semibold text-white transition active:scale-[0.98] disabled:opacity-60">
        {pending && <Loader2 className="size-5 animate-spin" aria-hidden />}
        Send request
      </button>
    </form>
  );
}

export function ReplyForm({ refId }: { refId: string }) {
  const bound = replyTicket.bind(null, refId);
  const [state, action, pending] = useActionState(bound, { ok: false } as TicketState);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state]);
  return (
    <form ref={ref} action={action} className="space-y-3" noValidate>
      <label htmlFor="reply" className="text-sm font-medium">
        Add a reply
      </label>
      <textarea id="reply" name="message" required rows={4} maxLength={5000} className={`${fieldClass} py-3`} />
      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-strong px-6 font-semibold text-white disabled:opacity-60">
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Send reply
      </button>
    </form>
  );
}
