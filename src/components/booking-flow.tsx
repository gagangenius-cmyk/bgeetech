"use client";

import { useMutation } from "@tanstack/react-query";
import { createBooking } from "@/actions/booking";
import { CurrencySwitcher, Price, useCurrency } from "@/components/currency";
import { BOOKING_TIMES } from "@/lib/booking";
import { consultation } from "@/lib/site";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, CalendarDays, Check, CheckCircle2, Loader2, Lock } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { ServiceIcon } from "@/components/service-icon";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/track";
import { services } from "@/lib/site";
import { cn } from "@/lib/utils";

const steps = ["Service", "Time", "Details", "Review"] as const;
const times = BOOKING_TIMES;

const noopSubscribe = () => () => {};
function readPresetService(): string | null {
  const s = new URLSearchParams(window.location.search).get("service");
  return s && services.some((x) => x.slug === s) ? s : null;
}

function nextDays(count: number) {
  // Computed on the client only (see `mounted`), so it never affects prerendering.
  const out: Date[] = [];
  const d = new Date();
  while (out.length < count) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d));
  }
  return out;
}

export function BookingFlow() {
  // Client-only values via useSyncExternalStore: server snapshot is the SSR-safe default,
  // so there is no hydration mismatch and no setState-in-effect.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const preset = useSyncExternalStore(noopSubscribe, readPresetService, () => null);

  const [stepState, setStep] = useState<number | null>(null);
  const [slugState, setSlug] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [details, setDetails] = useState({ name: "", email: "", goal: "" });
  const { code } = useCurrency();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ ref: string; free: boolean } | null>(null);
  const [minutes, setMinutes] = useState<30 | 60>(30);

  const pay = useMutation({
    mutationFn: () =>
      createBooking({
        currency: code,
        serviceSlug: slug ?? "",
        date: date ?? "",
        time: (time ?? "") as (typeof BOOKING_TIMES)[number],
        timezone: tz,
        name: details.name,
        email: details.email,
        goal: details.goal,
        minutes: String(minutes) as "30" | "60",
      }),
    onSuccess: (r) => {
      if (!r.ok) return setError(r.error);
      track("form_submit", { form_name: "consultation_booking", free: Boolean(r.free), minutes });
      if (r.url) window.location.href = r.url;
      else setDone({ ref: r.ref, free: Boolean(r.free) });
    },
    onError: () => setError("Something went wrong. Please try again or message us on WhatsApp."),
  });

  const slug = slugState ?? preset;
  const step = stepState ?? (preset ? 1 : 0);

  const days = useMemo(() => (mounted ? nextDays(10) : []), [mounted]);
  const service = services.find((s) => s.slug === slug);
  const tz = mounted ? Intl.DateTimeFormat().resolvedOptions().timeZone : "";

  const canNext =
    (step === 0 && !!slug) ||
    (step === 1 && !!date && !!time) ||
    (step === 2 && details.name.trim().length > 1 && /\S+@\S+\.\S+/.test(details.email));

  if (done)
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-10 text-center shadow-xl shadow-brand/5">
        <CheckCircle2 className="mx-auto size-14 text-accent" aria-hidden />
        <h2 className="mt-5 font-display text-2xl font-extrabold">{done.free ? "Your free consultation is booked" : "Booking received"}</h2>
        <p className="mt-2 text-muted-foreground">
          Your reference is <strong className="text-foreground">{done.ref}</strong>.{" "}
          {done.free ? (
            <>We will email a confirmation with your video link to <strong className="text-foreground">{details.email}</strong> shortly.</>
          ) : (
            <>Online payment is not switched on yet, so we will email a secure payment link to <strong className="text-foreground">{details.email}</strong> to confirm your slot.</>
          )}
        </p>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl">
      {/* progress */}
      <ol className="mb-10 flex items-center" aria-label="Booking progress">
        {steps.map((label, i) => (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <span
              aria-current={i === step ? "step" : undefined}
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold transition-all duration-300",
                i < step && "bg-accent text-white",
                i === step && "bg-brand-strong text-white shadow-lg shadow-brand/40",
                i > step && "bg-muted text-muted-foreground",
              )}
            >
              {i < step ? <Check className="size-4" aria-label="completed" /> : i + 1}
            </span>
            <span className={cn("ml-2 hidden text-sm font-medium sm:block", i === step ? "text-foreground" : "text-muted-foreground")}>
              {label}
            </span>
            {i < steps.length - 1 && (
              <span className="mx-3 h-0.5 flex-1 overflow-hidden rounded bg-border">
                <motion.span
                  className="block h-full bg-accent"
                  initial={false}
                  animate={{ width: i < step ? "100%" : "0%" }}
                  transition={{ duration: 0.4 }}
                />
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="min-h-88 rounded-3xl border border-border bg-card p-6 shadow-xl shadow-brand/5 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28 }}
          >
            {step === 0 && (
              <div>
                <h2 className="font-display text-2xl font-bold">What would you like to discuss?</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {services.map((s) => (
                    <button
                      key={s.slug}
                      type="button"
                      aria-pressed={slug === s.slug}
                      onClick={() => setSlug(s.slug)}
                      className={cn(
                        "flex items-start gap-3 rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5",
                        slug === s.slug ? "border-brand bg-brand/10 ring-2 ring-brand/30" : "border-border hover:border-brand/50",
                      )}
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                        <ServiceIcon name={s.icon} className="size-5" />
                      </span>
                      <span>
                        <span className="block font-semibold">{s.title}</span>
                        <span className="line-clamp-1 text-sm text-muted-foreground">{s.summary}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="font-display text-2xl font-bold">Pick a date and time</h2>
                {tz && <p className="mt-1 text-sm text-muted-foreground">Times shown in your timezone: {tz}</p>}
                <div className="mt-6 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Date">
                  {days.map((d) => {
                    const key = d.toISOString().slice(0, 10);
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={date === key}
                        onClick={() => setDate(key)}
                        className={cn(
                          "min-h-16 min-w-16 shrink-0 rounded-2xl border px-3 py-2 text-center transition-all",
                          date === key ? "border-brand bg-brand-strong text-white shadow-lg shadow-brand/30" : "border-border hover:border-brand/50",
                        )}
                      >
                        <span className="block text-xs opacity-70">{d.toLocaleDateString(undefined, { weekday: "short" })}</span>
                        <span className="block font-display text-xl font-bold">{d.getDate()}</span>
                        <span className="block text-xs opacity-70">{d.toLocaleDateString(undefined, { month: "short" })}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3" role="group" aria-label="Time">
                  {times.map((t) => (
                    <button
                      key={t}
                      type="button"
                      disabled={!date}
                      aria-pressed={time === t}
                      onClick={() => setTime(t)}
                      className={cn(
                        "min-h-12 rounded-xl border text-sm font-semibold tabular-nums transition-all disabled:opacity-40",
                        time === t ? "border-brand bg-brand-strong text-white" : "border-border hover:border-brand/50",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-xs text-muted-foreground">Sample availability. Live slots arrive with the calendar integration.</p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="font-display text-2xl font-bold">Your details</h2>
                {(["name", "email"] as const).map((k) => (
                  <div key={k}>
                    <label htmlFor={`b-${k}`} className="mb-1.5 block text-sm font-semibold capitalize">{k}</label>
                    <input
                      id={`b-${k}`}
                      type={k === "email" ? "email" : "text"}
                      autoComplete={k} inputMode={k === "email" ? "email" : "text"} autoCapitalize={k === "email" ? "none" : "words"} spellCheck={false}
                      value={details[k]}
                      onChange={(e) => setDetails({ ...details, [k]: e.target.value })}
                      className="min-h-12 w-full rounded-xl border border-border bg-background px-4 outline-none transition-all focus:border-brand focus:ring-4 focus:ring-brand/15"
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="b-goal" className="mb-1.5 block text-sm font-semibold">What would you like to cover? (optional)</label>
                  <textarea
                    id="b-goal"
                    rows={3}
                    value={details.goal}
                    onChange={(e) => setDetails({ ...details, goal: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition-all focus:border-brand focus:ring-4 focus:ring-brand/15"
                  />
                </div>
              </div>
            )}

            {step === 3 && service && (
              <div>
                <h2 className="font-display text-2xl font-bold">Review your booking</h2>
                <div role="radiogroup" aria-label="Call length" className="mt-5 grid gap-3 sm:grid-cols-2">
                  {([30, 60] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      role="radio"
                      aria-checked={minutes === m}
                      onClick={() => setMinutes(m)}
                      className={cn("rounded-2xl border p-4 text-left transition", minutes === m ? "border-brand bg-brand/10 ring-2 ring-brand/30" : "border-border hover:border-brand/50")}
                    >
                      <span className="flex items-center justify-between font-semibold">
                        {m} minutes
                        <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-bold">{m === 30 ? "FREE" : <Price usd={consultation.extendedUsd} />}</span>
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">{m === 30 ? "Your first consultation. No obligation." : "A longer deep-dive with a written summary."}</span>
                    </button>
                  ))}
                </div>
                <dl className="mt-6 divide-y divide-border rounded-2xl border border-border">
                  {[
                    ["Topic", service.title],
                    ["When", `${date} at ${time}`],
                    ["Length", `${minutes} minutes`],
                    ["Name", details.name],
                    ["Email", details.email],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 px-5 py-3.5 text-sm">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="text-right font-medium">{v}</dd>
                    </div>
                  ))}
                  <div className="flex justify-between bg-muted px-5 py-4">
                    <dt className="font-semibold">Total</dt>
                    <dd className="font-display text-xl font-extrabold text-brand">{minutes === 30 ? "Free" : <Price usd={consultation.extendedUsd} />}</dd>
                  </div>
                </dl>
                {minutes === 60 && (
                  <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">Pay in</span>
                    <CurrencySwitcher />
                  </div>
                )}
                {error && (
                  <p role="alert" className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm">
                    {error}
                  </p>
                )}
                <Button
                  className="mt-4 w-full disabled:opacity-60"
                  disabled={pay.isPending}
                  onClick={() => {
                    setError(null);
                    pay.mutate();
                  }}
                >
                  {pay.isPending ? <Loader2 className="size-4 animate-spin" /> : minutes === 30 ? <CalendarDays className="size-4" /> : <Lock className="size-4" />}{" "}
                  {minutes === 30 ? "Confirm my free consultation" : "Continue to secure payment"}
                </Button>
                {minutes === 60 && <p className="mt-3 text-center text-xs text-muted-foreground">Card details are entered on Stripe&rsquo;s secure page, never on this site.</p>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between max-lg:sticky max-lg:bottom-[calc(4.75rem+env(safe-area-inset-bottom))] max-lg:z-30 max-lg:rounded-2xl max-lg:border max-lg:border-border max-lg:bg-background/90 max-lg:p-2 max-lg:shadow-lg max-lg:backdrop-blur">
        <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} className={cn(step === 0 && "invisible")}>
          <ArrowLeft className="size-4" /> Back
        </Button>
        {step < 3 && (
          <Button onClick={() => setStep(step + 1)} disabled={!canNext} className="disabled:opacity-40 disabled:shadow-none">
            Continue <ArrowRight className="size-4" />
          </Button>
        )}
        {step === 3 && (
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="size-4" aria-hidden /> Free rescheduling
          </span>
        )}
      </div>
    </div>
  );
}
