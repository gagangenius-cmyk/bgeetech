"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { replyAsTeam, type ReplyState } from "@/actions/admin-tickets";

export function TicketReply({ refId }: { refId: string }) {
  const [state, action, pending] = useActionState(replyAsTeam.bind(null, refId), { ok: false } as ReplyState);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) form.current?.reset();
  }, [state]);
  return (
    <form ref={form} action={action} className="space-y-3">
      <label htmlFor="team-reply" className="text-sm font-medium">
        Reply to the client (they get an email)
      </label>
      <textarea id="team-reply" name="message" required rows={5} maxLength={5000} className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-brand focus:ring-4 focus:ring-brand/15" />
      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-600">
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
