import { ArrowRight, CalendarCheck, ShieldCheck, Star } from "lucide-react";
import { SplitText } from "@/components/motion/split-text";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { HeroPanel } from "@/components/sections/hero-panel";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink pb-24 pt-32 text-white sm:pt-40">
      {/* animated aurora + grid background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 size-[44rem] animate-aurora rounded-full bg-emerald-600/40 blur-[120px]" />
        <div className="absolute -right-32 top-20 size-[38rem] animate-aurora rounded-full bg-amber-400/30 blur-[120px] [animation-delay:-6s]" />
        <div className="absolute bottom-0 left-1/3 size-[30rem] animate-aurora rounded-full bg-emerald-700/30 blur-[120px] [animation-delay:-12s]" />
        <div className="grid-lines absolute inset-0" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Reveal y={12}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
              <span className="size-2 animate-pulse-ring rounded-full bg-accent" aria-hidden />
              Now booking online consultations
            </span>
          </Reveal>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            <SplitText text="Expert technology consulting," />{" "}
            <span className="text-gradient">
              <SplitText text="delivered online." delay={0.35} />
            </span>
          </h1>

          <Reveal delay={0.6}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              Plan, design and ship digital products with senior specialists. Book a session in under a minute,
              pay securely, and leave with a clear plan.
            </p>
          </Reveal>

          <Reveal delay={0.75}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="/book">
                Book a consultation <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </ButtonLink>
              <ButtonLink href="/services" variant="onDark">
                Explore services
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.9}>
            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/65">
              <li className="flex items-center gap-2"><Star className="size-4 text-amber-300" aria-hidden /> Rated by clients worldwide</li>
              <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-amber-300" aria-hidden /> Secure Stripe payments</li>
              <li className="flex items-center gap-2"><CalendarCheck className="size-4 text-emerald-300" aria-hidden /> Free rescheduling</li>
            </ul>
          </Reveal>
        </div>

        <HeroPanel />
      </div>
    </section>
  );
}
