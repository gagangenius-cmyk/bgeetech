"use client";

import { Loader2, LogIn } from "lucide-react";
import { useActionState } from "react";
import { login, type LoginState } from "@/actions/auth";

const field =
  "min-h-12 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-base text-white outline-none placeholder:text-white/40 focus:border-amber-300 focus:ring-4 focus:ring-amber-300/20";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className={field} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={field} />
      </div>
      {state.error && (
        <p role="alert" className="rounded-xl border border-red-400/40 bg-red-500/15 p-3 text-sm">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-amber-400 font-semibold text-ink transition hover:bg-amber-300 disabled:opacity-60"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />} Sign in
      </button>
    </form>
  );
}
