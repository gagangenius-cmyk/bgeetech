"use client";

import { CheckCircle2 } from "lucide-react";
import { useSyncExternalStore, type ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";

const noop = () => () => {};
const readRef = () => {
  const r = new URLSearchParams(window.location.search).get("ref") ?? "";
  return /^B[GK]-[0-9A-F]{10}$/.test(r) ? r : "";
};

/** Shown after Stripe redirects back. Payment status itself is confirmed server-side by the webhook, never from this URL. */
export function PaymentSuccess({ title, children, nextHref, nextLabel }: { title: string; children: ReactNode; nextHref: string; nextLabel: string }) {
  const ref = useSyncExternalStore(noop, readRef, () => "");
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <CheckCircle2 className="mx-auto size-16 text-accent" aria-hidden />
      <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight">{title}</h1>
      <div className="mt-3 text-muted-foreground">{children}</div>
      {ref && (
        <p className="mt-6 inline-block rounded-full border border-border bg-card px-5 py-2 text-sm">
          Reference <strong className="font-mono">{ref}</strong>
        </p>
      )}
      <div className="mt-8">
        <ButtonLink href={nextHref}>{nextLabel}</ButtonLink>
      </div>
    </div>
  );
}
