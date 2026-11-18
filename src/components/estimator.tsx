"use client";

import { AnimatePresence, motion } from "motion/react";
import { Calculator, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { useCurrency } from "@/components/currency";
import { LeadForm } from "@/components/lead-form";
import { estimator } from "@/lib/site";
import { cn } from "@/lib/utils";

function Choice<T extends string>({
  legend,
  value,
  onChange,
  options,
}: {
  legend: string;
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string; note?: string }[];
}) {
  return (
    <fieldset>
      <legend className="mb-3 font-display text-lg font-bold">{legend}</legend>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((o) => (
          <label
            key={o.id}
            className={cn(
              "relative flex min-h-14 cursor-pointer flex-col justify-center rounded-2xl border p-4 transition-all hover:-translate-y-0.5",
              value === o.id ? "border-brand bg-brand/10 ring-2 ring-brand/30" : "border-border hover:border-brand/50",
            )}
          >
            <input type="radio" name={legend} checked={value === o.id} onChange={() => onChange(o.id)} className="sr-only" />
            <span className="font-semibold">{o.label}</span>
            {o.note && <span className="text-sm text-muted-foreground">{o.note}</span>}
            {value === o.id && <Check className="absolute right-3 top-3 size-4 text-brand" aria-hidden />}
          </label>
        ))}
      </div>
    </fieldset>
  );
}


export function Estimator() {
  const { money } = useCurrency();
  const fmt = (n: number) => money(n);
  const [type, setType] = useState<keyof typeof estimator.types>("web");
  const [size, setSize] = useState<keyof typeof estimator.sizes>("medium");
  const [speed, setSpeed] = useState<keyof typeof estimator.speeds>("standard");
  const [extras, setExtras] = useState<string[]>([]);

  const range = useMemo(() => {
    const base = estimator.types[type].base * estimator.sizes[size].mult * estimator.speeds[speed].mult;
    const add = extras.reduce((s, id) => s + (estimator.extras.find((e) => e.id === id)?.price ?? 0), 0);
    const low = Math.round((base + add) / 100) * 100;
    return { low, high: Math.round((low * 1.35) / 100) * 100 };
  }, [type, size, speed, extras]);

  const summary =
    `Project estimate request: ${estimator.types[type].label}, ${estimator.sizes[size].label} scope, ${estimator.speeds[speed].label} timeline` +
    (extras.length ? `, extras: ${extras.map((id) => estimator.extras.find((e) => e.id === id)?.label).join(", ")}` : "") +
    `. Indicative range ${fmt(range.low)} - ${fmt(range.high)}.`;

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-10">
        <Choice
          legend="What are you building?"
          value={type}
          onChange={setType}
          options={Object.entries(estimator.types).map(([id, t]) => ({ id: id as keyof typeof estimator.types, label: t.label, note: t.note }))}
        />
        <Choice
          legend="How big is the scope?"
          value={size}
          onChange={setSize}
          options={Object.entries(estimator.sizes).map(([id, s]) => ({ id: id as keyof typeof estimator.sizes, label: s.label, note: s.note }))}
        />
        <Choice
          legend="Timeline"
          value={speed}
          onChange={setSpeed}
          options={Object.entries(estimator.speeds).map(([id, s]) => ({ id: id as keyof typeof estimator.speeds, label: s.label, note: s.note }))}
        />
        <fieldset>
          <legend className="mb-3 font-display text-lg font-bold">Add-ons</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {estimator.extras.map((e) => {
              const on = extras.includes(e.id);
              return (
                <label
                  key={e.id}
                  className={cn(
                    "flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all hover:-translate-y-0.5",
                    on ? "border-brand bg-brand/10 ring-2 ring-brand/30" : "border-border hover:border-brand/50",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => setExtras(on ? extras.filter((x) => x !== e.id) : [...extras, e.id])}
                    className="size-5 accent-[var(--brand)]"
                  />
                  <span className="flex-1 font-medium">{e.label}</span>
                  <span className="text-sm text-muted-foreground">+{fmt(e.price)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative overflow-hidden rounded-3xl bg-ink p-7 text-white shadow-2xl shadow-blue-950/30">
          <div aria-hidden className="absolute -right-16 -top-16 size-56 animate-aurora rounded-full bg-amber-400/25 blur-[70px]" />
          <p className="relative flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300">
            <Calculator className="size-4" aria-hidden /> Indicative estimate
          </p>
          <p className="relative mt-4 font-display text-4xl font-extrabold tabular-nums sm:text-5xl" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={`${range.low}-${range.high}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="block">
                {fmt(range.low)} <span className="text-white/50">to</span> {fmt(range.high)}
              </motion.span>
            </AnimatePresence>
          </p>
          <p className="relative mt-3 text-xs leading-relaxed text-white/60">
            A planning range only, not a quote. Final pricing depends on detailed requirements. Prices in USD.
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold">Get a detailed quote</h2>
          <p className="mb-5 mt-1 text-sm text-muted-foreground">We will review your choices and reply within one business day.</p>
          <LeadForm key={summary} source="estimator" message="optional" defaultMessage={summary} defaultBudget={`${fmt(range.low)} - ${fmt(range.high)}`} submitLabel="Request my quote" />
        </div>
      </aside>
    </div>
  );
}
