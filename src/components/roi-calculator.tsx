"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Clock, PiggyBank, TrendingUp } from "lucide-react";
import { Price, useCurrency } from "@/components/currency";
import { ButtonLink } from "@/components/ui/button";
import { packageCatalog } from "@/lib/site";
import { cn } from "@/lib/utils";

const tasks = [
  { id: "data", label: "Re-typing data between tools", hours: 4, cut: 70 },
  { id: "followup", label: "Chasing leads and follow-ups", hours: 5, cut: 50 },
  { id: "invoices", label: "Invoices, orders and reports", hours: 4, cut: 60 },
  { id: "support", label: "Answering the same customer questions", hours: 6, cut: 55 },
] as const;

const wages = [
  { id: "low", label: "Entry level", usd: 8 },
  { id: "mid", label: "Experienced", usd: 15 },
  { id: "high", label: "Specialist", usd: 30 },
] as const;

const solutions = packageCatalog.projects.filter((p) => ["automation", "ai", "crm", "erp", "pos", "webapp"].includes(p.id));

export function RoiCalculator() {
  const { money } = useCurrency();
  const [staff, setStaff] = useState(3);
  const [picked, setPicked] = useState<Set<string>>(new Set(["data", "followup"]));
  const [wage, setWage] = useState<(typeof wages)[number]["id"]>("mid");
  const [sol, setSol] = useState("automation");

  const r = useMemo(() => {
    const chosen = tasks.filter((t) => picked.has(t.id));
    const hoursPerWeek = chosen.reduce((s, t) => s + t.hours, 0) * staff;
    const saved = chosen.reduce((s, t) => s + (t.hours * t.cut) / 100, 0) * staff;
    const rate = wages.find((w) => w.id === wage)!.usd;
    const monthlySaved = saved * 4.33 * rate;
    const price = solutions.find((s) => s.id === sol)?.price ?? 0;
    return { hoursPerWeek, savedHours: saved, monthlySaved, annual: monthlySaved * 12, price, payback: monthlySaved > 0 ? price / monthlySaved : Infinity };
  }, [picked, staff, wage, sol]);

  const toggle = (id: string) =>
    setPicked((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <div data-bgee="roi" className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-10">
        <fieldset>
          <legend className="font-display text-xl font-bold">1. Where does your team lose time?</legend>
          <p className="mt-1 text-sm text-muted-foreground">Pick all that apply. Hours are typical weekly hours per person, which you can compare with your own.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {tasks.map((t) => (
              <label key={t.id} className={cn("flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border p-4 transition", picked.has(t.id) ? "border-brand bg-brand/5" : "border-border bg-card hover:border-brand/40")}>
                <input type="checkbox" className="size-5 accent-[var(--brand)]" checked={picked.has(t.id)} onChange={() => toggle(t.id)} />
                <span>
                  <span className="block font-semibold leading-tight">{t.label}</span>
                  <span className="text-xs text-muted-foreground">about {t.hours} hours a week each</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="roi-staff" className="font-display text-xl font-bold">
            2. How many people do this work?
          </label>
          <div className="mt-4 flex items-center gap-4">
            <input id="roi-staff" type="range" min={1} max={30} value={staff} onChange={(e) => setStaff(Number(e.target.value))} className="h-2 flex-1 accent-[var(--brand)]" />
            <output className="w-12 text-right font-display text-2xl font-bold text-brand">{staff}</output>
          </div>
        </div>

        <fieldset>
          <legend className="font-display text-xl font-bold">3. What does an hour of their time cost you?</legend>
          <div className="mt-4 flex flex-wrap gap-3">
            {wages.map((w) => (
              <button key={w.id} type="button" aria-pressed={wage === w.id} onClick={() => setWage(w.id)} className={cn("min-h-12 rounded-full border px-5 text-sm font-semibold transition", wage === w.id ? "border-brand bg-brand text-white" : "border-border bg-card hover:border-brand/50")}>
                {w.label} · {money(w.usd)}/h
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-xl font-bold">4. What would you build?</legend>
          <div className="mt-4 flex flex-wrap gap-3">
            {solutions.map((s) => (
              <button key={s.id} type="button" aria-pressed={sol === s.id} onClick={() => setSol(s.id)} className={cn("min-h-12 rounded-full border px-5 text-sm font-semibold transition", sol === s.id ? "border-brand bg-brand text-white" : "border-border bg-card hover:border-brand/50")}>
                {s.label} · from <Price usd={s.price} />
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <aside aria-live="polite" className="h-fit rounded-3xl bg-ink p-7 text-white shadow-2xl shadow-brand/20 lg:sticky lg:top-28">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Your estimate</p>
        <dl className="mt-5 space-y-5">
          <div className="flex items-start gap-3">
            <Clock className="mt-1 size-5 text-accent" aria-hidden />
            <div>
              <dt className="text-sm text-white/65">Time you could save</dt>
              <dd className="font-display text-3xl font-extrabold">{Math.round(r.savedHours)} h/week</dd>
              <p className="text-xs text-white/50">of {Math.round(r.hoursPerWeek)} h now spent on these tasks</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <PiggyBank className="mt-1 size-5 text-accent" aria-hidden />
            <div>
              <dt className="text-sm text-white/65">Cost you could save</dt>
              <dd className="font-display text-3xl font-extrabold">{money(Math.round(r.monthlySaved))}/month</dd>
              <p className="text-xs text-white/50">{money(Math.round(r.annual))} a year</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="mt-1 size-5 text-accent" aria-hidden />
            <div>
              <dt className="text-sm text-white/65">Estimated payback</dt>
              <dd className="font-display text-3xl font-extrabold">{Number.isFinite(r.payback) ? (r.payback < 1 ? "under 1 month" : `${r.payback.toFixed(1)} months`) : "-"}</dd>
              <p className="text-xs text-white/50">on a starting price of {money(r.price)}</p>
            </div>
          </div>
        </dl>
        <ButtonLink href="/book" className="mt-7 w-full">
          Talk to an expert, free <ArrowRight className="size-4" />
        </ButtonLink>
        <p className="mt-5 text-xs leading-relaxed text-white/50">
          This is a simple estimate from the numbers above and typical savings of 50 to 70% on automated tasks. Your real results depend on your process. We will check these assumptions with you in the free consultation.
        </p>
      </aside>
    </div>
  );
}
