"use client";

import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, ArrowRight, CheckCircle2, Globe, Loader2, Search, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { runAudit } from "@/actions/audit";
import { LeadForm } from "@/components/lead-form";
import { ButtonLink } from "@/components/ui/button";
import type { AuditResult, Category, Status } from "@/lib/audit";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

const STEPS = ["Opening your website", "Reading titles, headings and images", "Checking speed and mobile", "Testing security headers", "Scoring the results"];

const tone = (n: number) => (n >= 75 ? "text-emerald-600" : n >= 50 ? "text-amber-500" : "text-red-500");
const bar = (n: number) => (n >= 75 ? "bg-emerald-500" : n >= 50 ? "bg-amber-400" : "bg-red-500");

function Ring({ score, grade }: { score: number; grade: string }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-40 shrink-0" role="img" aria-label={`Overall score ${score} out of 100, grade ${grade}`}>
      <svg viewBox="0 0 128 128" className="size-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" strokeWidth="11" className="stroke-muted" />
        <circle cx="64" cy="64" r={r} fill="none" strokeWidth="11" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * score) / 100} className={cn("transition-[stroke-dashoffset] duration-1000", score >= 75 ? "stroke-emerald-500" : score >= 50 ? "stroke-amber-400" : "stroke-red-500")} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className={cn("font-display text-5xl font-extrabold leading-none", tone(score))}>{score}</p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">grade {grade}</p>
        </div>
      </div>
    </div>
  );
}

const Icon = ({ s }: { s: Status }) =>
  s === "pass" ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" aria-label="Passed" /> : s === "warn" ? <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-500" aria-label="Needs attention" /> : <XCircle className="mt-0.5 size-5 shrink-0 text-red-500" aria-label="Failed" />;

function Results({ r }: { r: AuditResult }) {
  const cats: Category[] = ["SEO", "Speed", "Mobile", "Security"];
  const issues = r.checks.filter((c) => c.status !== "pass").length;
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-8 rounded-3xl border border-border bg-card p-8 sm:flex-row">
        <Ring score={r.score} grade={r.grade} />
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm text-muted-foreground">Results for</p>
          <p className="break-all font-display text-xl font-bold">{r.finalUrl}</p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {issues === 0 ? "Excellent. Everything we checked passed." : `We found ${issues} thing${issues === 1 ? "" : "s"} to improve. The biggest wins are listed below.`} HTML loaded in {r.facts.responseMs} ms ({r.facts.htmlKb} KB), with {r.facts.scripts} script{r.facts.scripts === 1 ? "" : "s"} and {r.facts.images} image{r.facts.images === 1 ? "" : "s"}.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {r.categories.map((c) => (
          <div key={c.name} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-semibold text-muted-foreground">{c.name}</p>
            <p className={cn("mt-1 font-display text-3xl font-extrabold", tone(c.score))}>{c.score}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
              <div className={cn("h-full rounded-full transition-all duration-1000", bar(c.score))} style={{ width: `${c.score}%` }} />
            </div>
          </div>
        ))}
      </div>

      {r.topFixes.length > 0 && (
        <div className="rounded-3xl border border-accent/40 bg-accent/10 p-6 sm:p-8">
          <h3 className="font-display text-xl font-bold">Your top fixes</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-5 leading-relaxed">
            {r.topFixes.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {cats.map((cat) => (
          <section key={cat} aria-label={`${cat} checks`} className="rounded-3xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-bold">{cat}</h3>
            <ul className="mt-4 space-y-4">
              {r.checks
                .filter((c) => c.category === cat)
                .map((c) => (
                  <li key={c.id} className="flex gap-3">
                    <Icon s={c.status} />
                    <div className="min-w-0">
                      <p className="font-semibold leading-tight">{c.label}</p>
                      <p className="text-sm text-muted-foreground">{c.detail}</p>
                      {c.fix && c.status !== "pass" && <p className="mt-1 text-sm text-brand">Fix: {c.fix}</p>}
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="grid gap-8 rounded-3xl bg-ink p-6 text-white sm:p-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h3 className="font-display text-2xl font-bold sm:text-3xl">Want these fixed for you?</h3>
          <p className="mt-3 leading-relaxed text-white/75">
            Leave your details and our team will send a short, personal fix plan for {new URL(r.finalUrl).hostname}, with a clear price. No obligation. Or book a free 30-minute call to go through it together.
          </p>
          <div className="mt-6">
            <ButtonLink href="/book" variant="onDark">
              Book a free call <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
          <p className="mt-6 text-xs text-white/55">This is a quick automated check of one page, not a full audit. A manual review goes deeper.</p>
        </div>
        <div className="rounded-2xl bg-card p-5 text-foreground">
          <LeadForm source="audit" compact message="optional" submitLabel="Send me the fix plan" defaultMessage={`Website audit for ${r.finalUrl}: score ${r.score}/100 (SEO ${r.categories[0].score}, Speed ${r.categories[1].score}, Mobile ${r.categories[2].score}, Security ${r.categories[3].score}). Please send me the fix plan.`} />
        </div>
      </section>
    </div>
  );
}

export function AuditTool({ initialUrl = "" }: { initialUrl?: string }) {
  const [url, setUrl] = useState(initialUrl);
  const [step, setStep] = useState(0);
  const audit = useMutation({
    mutationFn: (u: string) => runAudit(u),
    onSuccess: (res) => {
      if (res.ok) track("audit_complete", { audit_score: res.result.score, audit_grade: res.result.grade });
    },
  });

  useEffect(() => {
    if (!audit.isPending) return;
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 1400);
    return () => clearInterval(t);
  }, [audit.isPending]);

  const data = audit.data;
  return (
    <div data-bgee="audit" className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!url.trim() || audit.isPending) return;
          setStep(0);
          track("audit_start");
          audit.mutate(url);
        }}
        className="mx-auto max-w-3xl"
      >
        <label htmlFor="audit-url" className="sr-only">
          Website address
        </label>
        <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-3 shadow-xl shadow-brand/10 sm:flex-row">
          <div className="relative flex-1">
            <Globe className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              id="audit-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="text"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              maxLength={300}
              placeholder="yourcompany.com"
              className="min-h-14 w-full rounded-2xl bg-transparent pl-12 pr-4 text-base outline-none focus:ring-4 focus:ring-brand/15"
            />
          </div>
          <button type="submit" disabled={audit.isPending || !url.trim()} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-brand-strong px-7 font-semibold text-white transition active:scale-[0.98] disabled:opacity-60">
            {audit.isPending ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Search className="size-5" aria-hidden />}
            {audit.isPending ? "Checking..." : "Check my website"}
          </button>
        </div>
        <p className="mt-3 text-center text-sm text-muted-foreground">Free, takes about 10 seconds, no sign-up. We read one public page and never change anything.</p>
      </form>

      <div className="mt-12" aria-live="polite">
        {audit.isPending && (
          <ul className="mx-auto max-w-md space-y-3">
            {STEPS.map((s, i) => (
              <li key={s} className={cn("flex items-center gap-3 transition-opacity", i > step && "opacity-30")}>
                {i < step ? <CheckCircle2 className="size-5 text-emerald-500" aria-hidden /> : i === step ? <Loader2 className="size-5 animate-spin text-brand" aria-hidden /> : <span className="size-5 rounded-full border border-border" aria-hidden />}
                <span className="font-medium">{s}</span>
              </li>
            ))}
          </ul>
        )}
        {data && !data.ok && (
          <p role="alert" className="mx-auto max-w-xl rounded-2xl border border-red-500/40 bg-red-500/10 p-5 text-center font-medium text-red-700 dark:text-red-300">
            {data.error}
          </p>
        )}
        {audit.isError && <p role="alert" className="mx-auto max-w-xl rounded-2xl border border-red-500/40 bg-red-500/10 p-5 text-center font-medium">Something went wrong. Please try again.</p>}
        {data?.ok && <Results r={data.result} />}
      </div>

      {!audit.isPending && !data && (
        <ul className="mx-auto mt-4 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["SEO", "Titles, headings, images, sitemap and structured data"],
            ["Speed", "Response time, compression, scripts and page weight"],
            ["Mobile", "Viewport, zoom and installable app signals"],
            ["Security", "HTTPS and the security headers that stop common attacks"],
          ].map(([t, d]) => (
            <li key={t} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-display text-lg font-bold text-brand">{t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
