"use client";

import { useState } from "react";
import { Check, Loader2, ShieldCheck } from "lucide-react";
import { createCareSubscription } from "@/actions/care";
import { Price, useCurrency } from "@/components/currency";
import { carePlans, type CarePlanId } from "@/lib/site";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

const inputClass = "min-h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none focus:border-brand focus:ring-4 focus:ring-brand/15";

export function CarePlans() {
  const { code } = useCurrency();
  const [plan, setPlan] = useState<CarePlanId | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const selected = carePlans.find((p) => p.id === plan);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!plan || busy) return;
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      const r = await createCareSubscription({
        planId: plan,
        currency: code,
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? ""),
        website: String(fd.get("website") ?? ""),
        terms: fd.get("terms") === "on" ? true : (false as never),
      });
      if (!r.ok) return setError(r.error);
      track("form_submit", { form_name: "care_plan", plan });
      if (r.url) window.location.href = r.url;
      else setDone(r.ref);
    } catch {
      setError("Something went wrong. Please try again or message us on WhatsApp.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div data-bgee="care" className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="grid gap-6 lg:grid-cols-3">
        {carePlans.map((p) => (
          <div key={p.id} className={cn("relative flex flex-col rounded-3xl border p-8", p.highlight ? "border-brand bg-ink text-white shadow-2xl shadow-brand/20" : "border-border bg-card")}>
            {p.highlight && <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-xs font-bold text-ink">Most popular</span>}
            <h2 className="font-display text-2xl font-bold">{p.name}</h2>
            <p className={cn("mt-1 text-sm", p.highlight ? "text-white/70" : "text-muted-foreground")}>{p.blurb}</p>
            <p className="mt-6 font-display text-5xl font-extrabold">
              <Price usd={p.price} />
              <span className={cn("text-base font-medium", p.highlight ? "text-white/60" : "text-muted-foreground")}> /month</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                setPlan(p.id);
                setDone(null);
                setTimeout(() => document.getElementById("care-form")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
              }}
              aria-pressed={plan === p.id}
              className={cn("mt-8 min-h-12 rounded-full px-6 font-semibold transition active:scale-[0.98]", p.highlight ? "bg-accent text-ink hover:opacity-90" : "bg-brand-strong text-white hover:opacity-90", plan === p.id && "ring-4 ring-brand/30")}
            >
              {plan === p.id ? "Selected" : `Choose ${p.name}`}
            </button>
          </div>
        ))}
      </div>

      <div id="care-form" className="mx-auto mt-12 max-w-2xl scroll-mt-28">
        {done ? (
          <div role="status" className="rounded-3xl border border-border bg-card p-8 text-center">
            <ShieldCheck className="mx-auto size-12 text-accent" aria-hidden />
            <h2 className="mt-4 font-display text-2xl font-bold">Request received</h2>
            <p className="mt-2 text-muted-foreground">
              Reference <strong className="font-mono">{done}</strong>. We will email you a secure payment link shortly. Once active, you can sign in to your client portal.
            </p>
          </div>
        ) : selected ? (
          <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-6 sm:p-8" noValidate>
            <h2 className="font-display text-2xl font-bold">
              Start the {selected.name} plan · <Price usd={selected.price} />
              /month
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Billed monthly through Stripe. Cancel any time.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Your name
                <input name="name" autoComplete="name" required className={cn(inputClass, "mt-1.5")} />
              </label>
              <label className="block text-sm font-medium">
                Email
                <input name="email" type="email" inputMode="email" autoComplete="email" required className={cn(inputClass, "mt-1.5")} />
              </label>
              <label className="block text-sm font-medium sm:col-span-2">
                Website we will look after
                <input name="website" placeholder="mybusiness.com" autoCapitalize="none" spellCheck={false} required className={cn(inputClass, "mt-1.5")} />
              </label>
            </div>
            <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-snug">
              <input type="checkbox" name="terms" required className="mt-0.5 size-5 shrink-0 accent-[var(--brand)]" />
              <span>
                I agree to the{" "}
                <a href="/terms" className="font-medium text-brand underline-offset-4 hover:underline">
                  terms
                </a>{" "}
                and the{" "}
                <a href="/privacy" className="font-medium text-brand underline-offset-4 hover:underline">
                  privacy policy
                </a>
                .
              </span>
            </label>
            {error && (
              <p role="alert" className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm font-medium">
                {error}
              </p>
            )}
            <button type="submit" disabled={busy} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-strong px-6 font-semibold text-white transition active:scale-[0.98] disabled:opacity-60">
              {busy && <Loader2 className="size-5 animate-spin" aria-hidden />}
              {busy ? "Please wait..." : "Continue to secure payment"}
            </button>
          </form>
        ) : (
          <p className="text-center text-muted-foreground">Pick a plan above to get started.</p>
        )}
      </div>
    </div>
  );
}
