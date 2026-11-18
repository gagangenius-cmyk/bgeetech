"use client";

import { Check, Gift, Package } from "lucide-react";
import { useMemo, useState } from "react";
import { CurrencySwitcher, useCurrency } from "@/components/currency";
import { LeadForm } from "@/components/lead-form";
import { Button } from "@/components/ui/button";
import { cycles } from "@/lib/builder/config";
import { packageCatalog as cat } from "@/lib/site";
import { cn } from "@/lib/utils";

function Choice({ checked, onChange, label, note, price, type = "checkbox", name }: { checked: boolean; onChange: () => void; label: string; note: string; price?: string; type?: "checkbox" | "radio"; name?: string }) {
  return (
    <label className={cn("relative flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border p-4 transition hover:-translate-y-0.5", checked ? "border-brand bg-brand/10 ring-2 ring-brand/30" : "border-border bg-card hover:border-brand/50")}>
      <input type={type} name={name} checked={checked} onChange={onChange} className="size-5 shrink-0 accent-[var(--brand)]" />
      <span className="flex-1">
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-xs text-muted-foreground">{note}</span>
      </span>
      {price && <span className="shrink-0 text-sm font-bold tabular-nums text-brand">{price}</span>}
    </label>
  );
}

function Segmented<T extends string>({ legend, value, onChange, options }: { legend: string; value: T; onChange: (v: T) => void; options: { id: T; label: string; note: string }[] }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((o) => (
          <label key={o.id} className={cn("cursor-pointer rounded-xl border px-3 py-2.5 text-center transition", value === o.id ? "border-brand bg-brand-strong text-white" : "border-border bg-card hover:border-brand/50")}>
            <input type="radio" name={legend} checked={value === o.id} onChange={() => onChange(o.id)} className="sr-only" />
            <span className="block text-sm font-semibold">{o.label}</span>
            <span className={cn("block text-[11px]", value === o.id ? "text-white/75" : "text-muted-foreground")}>{o.note}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const toggle = (set: string[], id: string) => (set.includes(id) ? set.filter((x) => x !== id) : [...set, id]);

export function PackageBuilder() {
  const { money } = useCurrency();
  const [projects, setProjects] = useState<string[]>(["website"]);
  const [monthly, setMonthly] = useState<string[]>([]);
  const [scale, setScale] = useState<"small" | "medium" | "large">("medium");
  const [timeline, setTimeline] = useState<"flexible" | "standard" | "fast">("standard");
  const [cycle, setCycle] = useState<"monthly" | "quarterly" | "annual">("annual");
  const [requesting, setRequesting] = useState(false);

  const calc = useMemo(() => {
    const sc = cat.scale.find((s) => s.id === scale)!.mult;
    const tl = cat.timeline.find((t) => t.id === timeline)!.mult;
    const picked = cat.projects.filter((p) => projects.includes(p.id));
    const base = picked.reduce((s, p) => s + p.price, 0) * sc * tl;
    const off = cat.bundle.find((b) => picked.length >= b.min)?.off ?? 0;
    const oneOff = base * (1 - off);
    const cy = cycles.find((c) => c.id === cycle)!;
    const mItems = cat.monthly.filter((m) => monthly.includes(m.id));
    const mBase = mItems.reduce((s, m) => s + m.price, 0);
    const perMonth = mBase * (1 - cy.discount);
    return { picked, mItems, base, off, oneOff, saved: base - oneOff, cy, mBase, perMonth, cycleTotal: perMonth * cy.months, first: oneOff + perMonth * cy.months };
  }, [projects, monthly, scale, timeline, cycle]);

  const empty = calc.picked.length === 0 && calc.mItems.length === 0;

  const summary =
    `Custom package request. Projects: ${calc.picked.map((p) => p.label).join(", ") || "none"} (${scale} scope, ${timeline} timeline). ` +
    `Monthly services: ${calc.mItems.map((m) => m.label).join(", ") || "none"} billed ${cycle}. ` +
    `Indicative one-off ${money(calc.oneOff)}; recurring ${money(calc.perMonth)} per month.`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-8">
        <fieldset>
          <legend className="mb-3 font-display text-lg font-bold">1. What do you need built?</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {cat.projects.map((p) => (
              <Choice key={p.id} checked={projects.includes(p.id)} onChange={() => setProjects((s) => toggle(s, p.id))} label={p.label} note={p.note} price={money(p.price)} />
            ))}
          </div>
        </fieldset>

        <div className="grid gap-6">
          <Segmented legend="2. Project size" value={scale} onChange={setScale} options={cat.scale.map((s) => ({ id: s.id as "small" | "medium" | "large", label: s.label, note: s.note }))} />
          <Segmented legend="3. Timeline" value={timeline} onChange={setTimeline} options={cat.timeline.map((t) => ({ id: t.id as "flexible" | "standard" | "fast", label: t.label, note: t.note }))} />
        </div>

        <fieldset>
          <legend className="mb-3 font-display text-lg font-bold">4. Ongoing monthly services (optional)</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {cat.monthly.map((m) => (
              <Choice key={m.id} checked={monthly.includes(m.id)} onChange={() => setMonthly((s) => toggle(s, m.id))} label={m.label} note={m.note} price={`${money(m.price)}/mo`} />
            ))}
          </div>
          {monthly.length > 0 && (
            <div className="mt-4">
              <Segmented legend="Billing period for monthly services" value={cycle} onChange={setCycle} options={cycles.map((c) => ({ id: c.id, label: c.label, note: c.discount ? `Save ${Math.round(c.discount * 100)}%` : "Pay as you go" }))} />
            </div>
          )}
        </fieldset>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative overflow-hidden rounded-3xl bg-ink p-7 text-white shadow-2xl shadow-blue-950/30">
          <div aria-hidden className="absolute -right-16 -top-16 size-56 animate-aurora rounded-full bg-amber-400/25 blur-[70px]" />
          <div className="relative flex items-center justify-between">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300">
              <Package className="size-4" aria-hidden /> Your custom package
            </p>
            <CurrencySwitcher onDark />
          </div>

          {empty ? (
            <p className="relative mt-6 text-sm text-white/65">Select at least one item to see your price.</p>
          ) : (
            <div className="relative mt-5 space-y-3 text-sm" aria-live="polite">
              {calc.picked.length > 0 && (
                <>
                  <div className="flex justify-between"><span className="text-white/65">Projects ({calc.picked.length})</span><span className="tabular-nums">{money(calc.base)}</span></div>
                  {calc.off > 0 && (
                    <div className="flex justify-between text-amber-300"><span>Bundle discount ({Math.round(calc.off * 100)}%)</span><span className="tabular-nums">-{money(calc.saved)}</span></div>
                  )}
                  <div className="flex items-baseline justify-between border-t border-white/10 pt-3">
                    <span className="font-semibold">One-off total</span>
                    <span className="font-display text-3xl font-extrabold tabular-nums">{money(calc.oneOff)}</span>
                  </div>
                </>
              )}
              {calc.mItems.length > 0 && (
                <div className="flex items-baseline justify-between border-t border-white/10 pt-3">
                  <span className="font-semibold">Monthly services</span>
                  <span className="text-right"><span className="font-display text-2xl font-extrabold tabular-nums">{money(calc.perMonth)}</span><span className="text-white/60"> /month</span></span>
                </div>
              )}
              {calc.picked.length > 0 && calc.mItems.length > 0 && (
                <div className="flex justify-between rounded-xl bg-white/10 px-3 py-2 text-xs">
                  <span>Due at start (projects + first {calc.cy.label.toLowerCase()} period)</span>
                  <span className="font-bold tabular-nums">{money(calc.first)}</span>
                </div>
              )}
              {calc.picked.length >= 1 && calc.off === 0 && (
                <p className="flex items-start gap-2 text-xs text-white/60"><Gift className="mt-0.5 size-4 shrink-0 text-amber-300" aria-hidden /> Add a second project to save 5%, a third for 10%, or four or more for 15%.</p>
              )}
            </div>
          )}
          <p className="relative mt-5 text-xs leading-relaxed text-white/55">A planning price, not a quote. You get a fixed-scope proposal after your free 30-minute consultation.</p>
        </div>

        <div className="mt-5 rounded-3xl border border-border bg-card p-6">
          {requesting ? (
            <>
              <h3 className="font-display text-lg font-bold">Request this package</h3>
              <p className="mb-4 mt-1 text-sm text-muted-foreground">We will reply within one business day with a proposal.</p>
              <LeadForm key={summary} source="estimator" message="optional" defaultMessage={summary} defaultBudget={`${money(calc.oneOff)} + ${money(calc.perMonth)}/mo`} submitLabel="Send my package request" />
            </>
          ) : (
            <>
              <Button type="button" disabled={empty} onClick={() => setRequesting(true)} className="w-full disabled:opacity-50">
                <Check className="size-4" /> Request this package
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">No payment now. Your first 30 minutes with an expert are free.</p>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
