"use client";

import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ImagePlus, Loader2, Lock, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createOrder } from "@/actions/order";
import { DevicePreview } from "@/components/builder/device-preview";
import { CurrencySwitcher, useCurrency } from "@/components/currency";
import { Button } from "@/components/ui/button";
import {
  cleanDomain, cycles, initialData, priceFor, styles, tiers,
  validDomain, validEmail, validPhone, type BuilderData,
} from "@/lib/builder/config";
import { getIndustry, industries, industryGroups } from "@/lib/builder/industries";
import { contrast, isHex, textOn, themes } from "@/lib/builder/themes";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

const STEPS = ["Your business", "Business type", "Colours", "Style", "Plan & payment"] as const;
const KEY = "bgee_builder_v1";

const inputCls =
  "min-h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15 aria-[invalid=true]:border-red-500";

function load(): { data: BuilderData; step: number } {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return { data: { ...initialData, ...p.data, business: { ...initialData.business, ...p.data?.business } }, step: Math.min(4, Math.max(0, p.step ?? 0)) };
    }
  } catch {
    /* ignore corrupt or unavailable storage */
  }
  return { data: initialData, step: 0 };
}

async function resizeLogo(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 256 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(bmp.width * scale));
  c.height = Math.max(1, Math.round(bmp.height * scale));
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL("image/png");
}

function Field({ label, hint, error, children, htmlFor }: { label: string; hint?: string; error?: string; children: React.ReactNode; htmlFor: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">
        {label} {hint && <span className="font-normal text-muted-foreground">({hint})</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default function BuilderWizard() {
  const [{ data: initial, step: initialStep }] = useState(load);
  const [data, setData] = useState<BuilderData>(initial);
  const [step, setStep] = useState(initialStep);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<{ ref: string } | null>(null);
  const [terms, setTerms] = useState(false);
  const [filterGroup, setFilterGroup] = useState("All");
  const [q, setQ] = useState("");
  const [logoBusy, setLogoBusy] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ data, step }));
    } catch {
      /* storage unavailable: progress simply is not remembered */
    }
  }, [data, step]);

  const set = <K extends keyof BuilderData>(k: K, v: BuilderData[K]) => setData((d) => ({ ...d, [k]: v }));
  const setBiz = (k: keyof BuilderData["business"], v: string) => setData((d) => ({ ...d, business: { ...d.business, [k]: v } }));

  const { code, money } = useCurrency();
  const price = priceFor(data.plan.tier, data.plan.cycle);

  const order = useMutation({
    mutationFn: () => createOrder({ ...data, currency: code, industry: data.industry ?? "", terms: true as const, business: { ...data.business, domain: cleanDomain(data.business.domain) } }),
    onSuccess: (r) => {
      if (!r.ok) return setErrors({ pay: r.error });
      track("form_submit", { form_name: "website_builder_order", plan: data.plan.tier, cycle: data.plan.cycle });
      try {
        localStorage.removeItem(KEY);
      } catch {
        /* ignore */
      }
      if (r.url) window.location.href = r.url;
      else setDone({ ref: r.ref });
    },
    onError: () => setErrors({ pay: "Something went wrong. Please try again or contact us on WhatsApp." }),
  });

  function validate(s: number) {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (data.business.name.trim().length < 2) e.name = "Enter your business name";
      if (!validDomain(data.business.domain)) e.domain = "Enter a domain like mybusiness.com";
      if (!validEmail(data.business.email)) e.email = "Enter a valid email address";
      if (!validPhone(data.business.phone)) e.phone = "Enter a valid phone number";
    }
    if (s === 1 && !data.industry) e.industry = "Please choose the type of business";
    if (s === 2 && !data.theme.colors.every(isHex)) e.colors = "Enter all three colours as #RRGGBB";
    if (s === 4 && !terms) e.terms = "Please accept the terms to continue";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function go(to: number) {
    setStep(to);
    setErrors({});
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const next = () => validate(step) && go(step + 1);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return industries.filter((i) => (filterGroup === "All" || i.group === filterGroup) && (!t || `${i.label} ${i.group}`.toLowerCase().includes(t)));
  }, [q, filterGroup]);

  if (done)
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <CheckCircle2 className="mx-auto size-16 text-accent" aria-hidden />
        <h2 className="mt-6 font-display text-3xl font-extrabold">Thank you, your order is in!</h2>
        <p className="mt-3 text-muted-foreground">
          Your reference is <strong className="text-foreground">{done.ref}</strong>. Online payment is not switched on yet, so we will email a secure payment link to{" "}
          <strong className="text-foreground">{data.business.email}</strong> shortly, and start designing as soon as it is paid.
        </p>
      </div>
    );

  const preview = <DevicePreview data={data} />;
  const sticky = "lg:sticky lg:top-24 lg:self-start";

  return (
    <div ref={topRef} className="mx-auto max-w-7xl scroll-mt-24 px-5 py-10 sm:px-8">
      {/* Progress */}
      <ol className="mx-auto mb-10 flex max-w-3xl items-center" aria-label="Progress">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <button
              type="button"
              disabled={i > step}
              onClick={() => i < step && go(i)}
              aria-current={i === step ? "step" : undefined}
              className="flex items-center gap-2 disabled:cursor-default"
            >
              <span className={cn("grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold transition", i < step && "bg-accent text-white", i === step && "bg-brand-strong text-white shadow-lg shadow-brand/40", i > step && "bg-muted text-muted-foreground")}>
                {i < step ? <Check className="size-4" aria-label="completed" /> : i + 1}
              </span>
              <span className={cn("hidden text-sm font-medium md:block", i === step ? "text-foreground" : "text-muted-foreground")}>{label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <span className="mx-3 h-0.5 flex-1 overflow-hidden rounded bg-border">
                <motion.span className="block h-full bg-accent" initial={false} animate={{ width: i < step ? "100%" : "0%" }} />
              </span>
            )}
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
          {/* 1. Business details */}
          {step === 0 && (
            <div className="mx-auto max-w-2xl">
              <h2 className="font-display text-3xl font-extrabold tracking-tight">Tell us about your business</h2>
              <p className="mt-2 text-muted-foreground">We use these details to personalise your website and contact you about your order.</p>
              <div className="mt-8 space-y-5">
                <Field htmlFor="b-name" label="Business name" error={errors.name}>
                  <input id="b-name" value={data.business.name} onChange={(e) => setBiz("name", e.target.value)} autoComplete="organization" maxLength={160} aria-invalid={!!errors.name} className={inputCls} />
                </Field>
                <Field htmlFor="b-domain" label="Domain name" hint="we will check availability and connect it" error={errors.domain}>
                  <input id="b-domain" value={data.business.domain} onChange={(e) => setBiz("domain", e.target.value)} placeholder="mybusiness.com" inputMode="url" autoCapitalize="none" aria-invalid={!!errors.domain} className={inputCls} />
                </Field>
                <Field htmlFor="b-slogan" label="Slogan or tagline" hint="optional">
                  <input id="b-slogan" value={data.business.slogan} onChange={(e) => setBiz("slogan", e.target.value)} maxLength={300} placeholder="Fresh cuts, sharp style" className={inputCls} />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field htmlFor="b-email" label="Email" error={errors.email}>
                    <input id="b-email" type="email" inputMode="email" autoCapitalize="none" spellCheck={false} value={data.business.email} onChange={(e) => setBiz("email", e.target.value)} autoComplete="email" aria-invalid={!!errors.email} className={inputCls} />
                  </Field>
                  <Field htmlFor="b-phone" label="Phone number" error={errors.phone}>
                    <input id="b-phone" type="tel" value={data.business.phone} onChange={(e) => setBiz("phone", e.target.value)} autoComplete="tel" aria-invalid={!!errors.phone} className={inputCls} />
                  </Field>
                </div>
                <div>
                  <p className="mb-1.5 text-sm font-semibold">
                    Logo <span className="font-normal text-muted-foreground">(optional, PNG, JPG or SVG-as-image up to 2 MB)</span>
                  </p>
                  <div className="flex items-center gap-4 rounded-2xl border border-dashed border-border p-4">
                    <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted">
                      {data.business.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={data.business.logo} alt="Your logo" className="size-full object-contain" />
                      ) : (
                        <ImagePlus className="size-7 text-muted-foreground" aria-hidden />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold hover:border-brand/60">
                        {logoBusy ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />} {data.business.logo ? "Replace" : "Upload logo"}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/svg+xml"
                          className="sr-only"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            if (f.size > 2_000_000) return setErrors({ logo: "That file is over 2 MB." });
                            setLogoBusy(true);
                            try {
                              setBiz("logo", await resizeLogo(f));
                              setErrors({});
                            } catch {
                              setErrors({ logo: "We could not read that image." });
                            } finally {
                              setLogoBusy(false);
                            }
                          }}
                        />
                      </label>
                      {data.business.logo && (
                        <button type="button" onClick={() => setBiz("logo", "")} className="inline-flex min-h-10 items-center gap-1 rounded-full px-3 text-sm font-semibold text-red-600 hover:bg-red-500/10">
                          <X className="size-4" /> Remove
                        </button>
                      )}
                    </div>
                  </div>
                  {errors.logo && <p role="alert" className="mt-1.5 text-sm text-red-600">{errors.logo}</p>}
                </div>
              </div>
            </div>
          )}

          {/* 2. Industry */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-3xl font-extrabold tracking-tight">What kind of website do you need?</h2>
              <p className="mt-2 text-muted-foreground">From a barber shop to a flight booking engine. Pick the closest match ({industries.length} types).</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="relative min-w-60 flex-1">
                  <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                  <label htmlFor="ind-q" className="sr-only">Search business types</label>
                  <input id="ind-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: barber, flights, clinic..." className={cn(inputCls, "pl-10")} />
                </div>
              </div>
              <div role="group" aria-label="Category" className="mt-4 flex flex-wrap gap-2">
                {["All", ...industryGroups].map((g) => (
                  <button key={g} type="button" aria-pressed={filterGroup === g} onClick={() => setFilterGroup(g)} className={cn("min-h-9 rounded-full border px-3.5 text-xs font-semibold transition", filterGroup === g ? "border-brand bg-brand-strong text-white" : "border-border hover:border-brand/50")}>
                    {g}
                  </button>
                ))}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {list.map((i) => {
                  const on = data.industry === i.id;
                  return (
                    <button key={i.id} type="button" aria-pressed={on} onClick={() => set("industry", i.id)} className={cn("relative flex min-h-16 flex-col justify-center rounded-2xl border p-4 text-left transition hover:-translate-y-0.5", on ? "border-brand bg-brand/10 ring-2 ring-brand/30" : "border-border bg-card hover:border-brand/50")}>
                      <span className="font-semibold">{i.label}</span>
                      <span className="text-xs text-muted-foreground">{i.group}</span>
                      {on && <Check className="absolute right-3 top-3 size-4 text-brand" aria-hidden />}
                    </button>
                  );
                })}
                {list.length === 0 && <p className="col-span-full py-10 text-center text-muted-foreground">No match. Choose &ldquo;Something else&rdquo; under Community &amp; other.</p>}
              </div>
              {errors.industry && <p role="alert" className="mt-4 text-sm text-red-600">{errors.industry}</p>}
            </div>
          )}

          {/* 3. Colours */}
          {step === 2 && (
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <h2 className="font-display text-3xl font-extrabold tracking-tight">Choose your colours</h2>
                <p className="mt-2 text-muted-foreground">Pick one of {themes.length} ready-made three-colour themes or create your own. The preview updates instantly.</p>

                <fieldset className="mt-6 rounded-2xl border border-border bg-card p-5">
                  <legend className="px-2 font-display text-lg font-bold">Custom colours</legend>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {(["Main", "Background", "Accent"] as const).map((label, idx) => (
                      <div key={label}>
                        <label htmlFor={`c-${idx}`} className="mb-1.5 block text-xs font-semibold">{label}</label>
                        <div className="flex items-center gap-2">
                          <input id={`c-${idx}`} type="color" value={isHex(data.theme.colors[idx]) ? data.theme.colors[idx] : "#000000"} onChange={(e) => set("theme", { id: "custom", colors: data.theme.colors.map((c, k) => (k === idx ? e.target.value : c)) as [string, string, string] })} className="size-11 shrink-0 cursor-pointer rounded-lg border border-border bg-transparent p-0.5" aria-label={`${label} colour`} />
                          <input value={data.theme.colors[idx]} onChange={(e) => set("theme", { id: "custom", colors: data.theme.colors.map((c, k) => (k === idx ? e.target.value : c)) as [string, string, string] })} maxLength={7} spellCheck={false} aria-label={`${label} hex`} className={cn(inputCls, "min-h-11 px-3 font-mono text-sm")} />
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.colors && <p role="alert" className="mt-3 text-sm text-red-600">{errors.colors}</p>}
                  {isHex(data.theme.colors[0]) && contrast(data.theme.colors[0], textOn(data.theme.colors[0])) < 4.5 && (
                    <p className="mt-3 text-xs text-amber-700 dark:text-amber-300">Tip: the main colour has low contrast with its text. A darker or lighter shade will be easier to read.</p>
                  )}
                </fieldset>

                <p className="mb-3 mt-8 text-sm font-semibold">Ready-made themes</p>
                <div className="grid max-h-[28rem] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 [scrollbar-width:thin]">
                  {themes.map((t) => {
                    const on = data.theme.id === t.id;
                    return (
                      <button key={t.id} type="button" aria-pressed={on} onClick={() => set("theme", { id: t.id, colors: t.colors })} className={cn("rounded-2xl border p-2.5 text-left transition hover:-translate-y-0.5", on ? "border-brand ring-2 ring-brand/40" : "border-border hover:border-brand/50")}>
                        <span className="flex h-10 overflow-hidden rounded-lg">
                          {t.colors.map((c) => (
                            <span key={c} className="flex-1" style={{ background: c }} />
                          ))}
                        </span>
                        <span className="mt-2 flex items-center justify-between text-xs font-semibold">
                          {t.name} {on && <Check className="size-3.5 text-brand" aria-label="selected" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className={sticky}>{preview}</div>
            </div>
          )}

          {/* 4. Style */}
          {step === 3 && (
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <h2 className="font-display text-3xl font-extrabold tracking-tight">Pick your website style</h2>
                <p className="mt-2 text-muted-foreground">Switch between Desktop, Tablet and Mobile in the preview to see how it will look on every screen.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {styles.map((s) => {
                    const on = data.style === s.id;
                    return (
                      <button key={s.id} type="button" aria-pressed={on} onClick={() => set("style", s.id)} className={cn("relative rounded-2xl border p-4 text-left transition hover:-translate-y-0.5", on ? "border-brand bg-brand/10 ring-2 ring-brand/30" : "border-border bg-card hover:border-brand/50")}>
                        <span className="block text-lg font-bold" style={{ fontFamily: s.font === "serif" ? "var(--font-display-var), serif" : "inherit", textTransform: s.upper ? "uppercase" : "none", fontWeight: s.weight }}>{s.label}</span>
                        <span className="text-sm text-muted-foreground">{s.note}</span>
                        <span className="mt-3 flex gap-2" aria-hidden>
                          <span className="h-6 w-14" style={{ background: data.theme.colors[0], borderRadius: Math.min(s.radius, 12) }} />
                          <span className="h-6 w-8 border border-border" style={{ background: data.theme.colors[1], borderRadius: Math.min(s.radius, 12) }} />
                        </span>
                        {on && <Check className="absolute right-3 top-3 size-4 text-brand" aria-hidden />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className={sticky}>{preview}</div>
            </div>
          )}

          {/* 5. Plan + payment */}
          {step === 4 && (
            <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display text-3xl font-extrabold tracking-tight">Choose a plan</h2>
                  <CurrencySwitcher />
                </div>
                <div role="radiogroup" aria-label="Billing period" className="mt-5 inline-flex rounded-full border border-border bg-card p-1">
                  {cycles.map((c) => (
                    <button key={c.id} type="button" role="radio" aria-checked={data.plan.cycle === c.id} onClick={() => set("plan", { ...data.plan, cycle: c.id })} className={cn("min-h-10 rounded-full px-4 text-sm font-semibold transition", data.plan.cycle === c.id ? "bg-brand-strong text-white" : "text-muted-foreground hover:text-foreground")}>
                      {c.label} {c.discount > 0 && <span className="ml-1 rounded-full bg-accent/25 px-1.5 py-0.5 text-[10px] font-bold">-{Math.round(c.discount * 100)}%</span>}
                    </button>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {tiers.map((t) => {
                    const p = priceFor(t.id, data.plan.cycle);
                    const on = data.plan.tier === t.id;
                    return (
                      <button key={t.id} type="button" aria-pressed={on} onClick={() => set("plan", { ...data.plan, tier: t.id })} className={cn("relative rounded-2xl border p-5 text-left transition hover:-translate-y-0.5", on ? "border-brand bg-brand/10 ring-2 ring-brand/30" : "border-border bg-card hover:border-brand/50")}>
                        <span className="font-display text-lg font-bold">{t.name}</span>
                        <span className="mt-1 block font-display text-3xl font-extrabold">{money(p.perMonth)}<span className="text-sm font-medium text-muted-foreground"> /month</span></span>
                        <span className="mt-1 block text-xs text-muted-foreground">{t.blurb}</span>
                        <ul className="mt-3 space-y-1.5 text-sm">
                          {t.features.map((f) => (
                            <li key={f} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden /> {f}</li>
                          ))}
                        </ul>
                        {on && <span className="absolute right-3 top-3 rounded-full bg-brand-strong px-2 py-0.5 text-[10px] font-bold text-white">Selected</span>}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-2xl border border-border bg-card p-5">
                  <h3 className="font-display text-lg font-bold">Order summary</h3>
                  <dl className="mt-3 space-y-2 text-sm">
                    {[
                      ["Business", data.business.name],
                      ["Domain", cleanDomain(data.business.domain)],
                      ["Type", getIndustry(data.industry)?.label ?? "-"],
                      ["Style", styles.find((s) => s.id === data.style)?.label ?? "-"],
                      ["Plan", `${price.tier.name}, billed ${price.cycle.label.toLowerCase()}`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
                    ))}
                    {price.saved > 0 && <div className="flex justify-between text-accent"><dt>You save</dt><dd className="font-semibold">{money(price.saved)}</dd></div>}
                    <div className="flex items-baseline justify-between border-t border-border pt-3">
                      <dt className="font-semibold">Total today</dt>
                      <dd className="font-display text-2xl font-extrabold text-brand">{money(price.total)} <span className="text-xs font-medium text-muted-foreground">{code}</span></dd>
                    </div>
                  </dl>
                  <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm">
                    <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[var(--brand)]" />
                    <span>I agree to the <a className="font-medium text-brand underline" href="/terms" target="_blank">terms</a> and <a className="font-medium text-brand underline" href="/privacy" target="_blank">privacy policy</a>. The plan renews every {price.cycle.months === 1 ? "month" : price.cycle.months === 3 ? "3 months" : "year"} until cancelled.</span>
                  </label>
                  {errors.terms && <p role="alert" className="mt-2 text-sm text-red-600">{errors.terms}</p>}
                  {errors.pay && <p role="alert" className="mt-3 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm">{errors.pay}</p>}
                  <Button type="button" disabled={order.isPending} onClick={() => validate(4) && order.mutate()} className="mt-5 w-full disabled:opacity-60">
                    {order.isPending ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />} Continue to secure payment
                  </Button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">Card details are entered on the payment provider&rsquo;s secure page, never on this site.</p>
                </div>
              </div>
              <div className={sticky}>{preview}</div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mx-auto mt-10 flex max-w-3xl items-center justify-between max-lg:sticky max-lg:bottom-[calc(4.75rem+env(safe-area-inset-bottom))] max-lg:z-30 max-lg:rounded-2xl max-lg:border max-lg:border-border max-lg:bg-background/90 max-lg:p-2 max-lg:shadow-lg max-lg:backdrop-blur">
        <Button variant="ghost" onClick={() => go(step - 1)} className={cn(step === 0 && "invisible")}>
          <ArrowLeft className="size-4" /> Back
        </Button>
        {step < 4 && (
          <Button onClick={next}>
            Continue <ArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
