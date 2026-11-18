import { Price } from "@/components/currency";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Counter } from "@/components/motion/counter";
import { Marquee } from "@/components/motion/marquee";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/services-grid";
import { industries, plans, stats, steps, tech, whyUs } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Stats() {
  return (
    <section aria-label="Results" className="mx-auto -mt-12 max-w-6xl px-5 sm:px-8">
      <Stagger className="relative z-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border shadow-xl shadow-brand/5 lg:grid-cols-4">
        {stats.map((s) => (
          <StaggerItem key={s.label} className="bg-card p-6 text-center sm:p-8">
            <p className="font-display text-4xl font-extrabold text-brand sm:text-5xl">
              <Counter value={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

export function TechMarquee() {
  return (
    <section aria-label="Technologies we work with" className="py-16">
      <p className="mb-6 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
        Technologies we work with
      </p>
      <Marquee>
        {tech.map((t) => (
          <span
            key={t}
            className="whitespace-nowrap rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-brand/50 hover:text-brand"
          >
            {t}
          </span>
        ))}
      </Marquee>
    </section>
  );
}

export function Process() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <SectionHeading eyebrow="How it works" title="From booking to a clear plan in three steps" center />
      <Stagger className="relative mt-16 grid gap-8 md:grid-cols-3">
        <div
          aria-hidden
          className="absolute left-[16%] right-[16%] top-7 hidden h-px bg-linear-to-r from-transparent via-brand/40 to-transparent md:block"
        />
        {steps.map((s, i) => (
          <StaggerItem key={s.title} className="relative text-center">
            <span className="relative mx-auto grid size-14 place-items-center rounded-2xl bg-brand-strong font-display text-xl font-bold text-white shadow-lg shadow-brand/30">
              {i + 1}
            </span>
            <h3 className="mt-6 font-display text-xl font-bold">{s.title}</h3>
            <p className="mx-auto mt-2 max-w-xs leading-relaxed text-muted-foreground">{s.body}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

export function WhyUs() {
  return (
    <section className="relative bg-muted py-24">
      <div aria-hidden className="royal-pattern absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Why BGeetech" title="Advice you can rely on, delivered with care" center />
        <div aria-hidden className="gold-rule mx-auto mt-8 max-w-xs" />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((w, i) => (
            <StaggerItem key={w.title}>
              <SpotlightCard className="h-full">
                <span className="font-display text-5xl font-extrabold text-accent/70">0{i + 1}</span>
                <h3 className="mt-3 font-display text-xl font-bold">{w.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{w.body}</p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function Industries() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <SectionHeading eyebrow="Industries" title="Experience across sectors" center />
      <Stagger className="mt-10 flex flex-wrap justify-center gap-3" gap={0.05}>
        {industries.map((i) => (
          <StaggerItem key={i}>
            <span className="inline-block rounded-full border border-accent/40 bg-card px-5 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-accent/10">
              {i}
            </span>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

export function PricingCards() {
  return (
    <Stagger className="mt-14 grid items-stretch gap-5 lg:grid-cols-3">
      {plans.map((p) => (
        <StaggerItem key={p.name}>
          <div
            className={cn(
              "relative flex h-full flex-col rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-1.5",
              p.highlight
                ? "border-transparent bg-ink text-white shadow-2xl shadow-brand/25 lg:scale-105"
                : "border-border bg-card hover:shadow-xl hover:shadow-brand/10",
            )}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-brand to-accent px-4 py-1 text-xs font-bold text-white">
                Most popular
              </span>
            )}
            <h3 className="font-display text-xl font-bold">{p.name}</h3>
            <p className={cn("mt-2 text-sm", p.highlight ? "text-white/65" : "text-muted-foreground")}>{p.blurb}</p>
            <p className="mt-6 font-display text-5xl font-extrabold">
              <Price usd={p.price} />
              <span className={cn("text-base font-medium", p.highlight ? "text-white/55" : "text-muted-foreground")}>
                {p.name === "Partner" ? " /month" : " /one-off"}
              </span>
            </p>
            <ul className="mt-7 flex-1 space-y-3 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
            <ButtonLink href="/book" variant={p.highlight ? "primary" : "secondary"} className="mt-8 w-full">
              Get started
            </ButtonLink>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function PricingTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <SectionHeading
        eyebrow="Pricing"
        title="Transparent pricing, no surprises"
        body="Pick a package, see the total up front. Corporate invoices and tax IDs supported."
        center
      />
      <PricingCards />
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-center text-white sm:px-16 sm:py-20">
          <div aria-hidden className="absolute -left-20 -top-20 -z-10 size-96 animate-aurora rounded-full bg-blue-600/40 blur-[100px]" />
          <div aria-hidden className="absolute -bottom-24 -right-16 -z-10 size-96 animate-aurora rounded-full bg-amber-400/30 blur-[100px] [animation-delay:-8s]" />
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            Ready to turn your idea into a plan?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Book a session today and get expert guidance within days, not weeks.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/book">
              Book a consultation <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </ButtonLink>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center rounded-full px-6 text-sm font-semibold text-white/80 transition-colors hover:text-white"
            >
              Or send a message
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
