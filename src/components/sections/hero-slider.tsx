"use client";

import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { HeroPanel } from "@/components/sections/hero-panel";
import { BuilderVisual, DashboardVisual, NeuralVisual } from "@/components/sections/hero-visuals";
import { SplitText } from "@/components/motion/split-text";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const INTERVAL = 7000;

type Slide = {
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  primary: { label: string; href?: string; event?: string };
  secondary: { label: string; href?: string; event?: string };
  visual: ReactNode;
};

const slides: Slide[] = [
  {
    eyebrow: "AI solutions & automation",
    title: "Put AI to work for",
    accent: "your business.",
    body: "We build AI chatbots, assistants and smart automations that save time, answer customers 24/7 and grow your business.",
    primary: { label: "Book a free consultation", href: "/book" },
    secondary: { label: "Explore services", href: "/services" },
    visual: <NeuralVisual />,
  },
  {
    eyebrow: "Website builder",
    title: "Launch a stunning website",
    accent: "in minutes.",
    body: "Pick your industry, colours and style, preview it on desktop, tablet and mobile, and go live from $10 a month.",
    primary: { label: "Build your website", href: "/builder" },
    secondary: { label: "See pricing", href: "/pricing" },
    visual: <BuilderVisual />,
  },
  {
    eyebrow: "CRM, ERP, POS & HRMS",
    title: "Business software built for",
    accent: "your industry.",
    body: "From real estate and immigration CRMs to ERP, POS and HRMS, explore live demos, then get a system tailored to how you work.",
    primary: { label: "Explore live demos", href: "/demos" },
    secondary: { label: "Talk to us", href: "/contact" },
    visual: <DashboardVisual />,
  },
  {
    eyebrow: "First 30 minutes free",
    title: "Talk to an expert,",
    accent: "free for 30 minutes.",
    body: "Book a free video consultation about your website, app, CRM, ERP or AI idea, or chat with our AI assistant right now.",
    primary: { label: "Book free consultation", href: "/book" },
    secondary: { label: "Chat with our AI", event: "bgee:open-chat" },
    visual: <HeroPanel />,
  },
];

export function HeroSlider() {
  const reduce = useReducedMotion();
  const [[index, dir], setPage] = useState<[number, number]>([0, 0]);
  const [hovering, setHovering] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [hidden, setHidden] = useState(false);

  const go = useCallback((to: number, d: number) => setPage([(to + slides.length) % slides.length, d]), []);
  const next = useCallback(() => setPage(([i]) => [(i + 1) % slides.length, 1]), []);
  const prev = useCallback(() => setPage(([i]) => [(i - 1 + slides.length) % slides.length, -1]), []);

  const playing = !reduce && !userPaused && !hovering && !hidden;

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(next, INTERVAL);
    return () => window.clearTimeout(t);
  }, [playing, index, next]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -70 || info.velocity.x < -450) next();
    else if (info.offset.x > 70 || info.velocity.x > 450) prev();
  };

  const s = slides[index];
  const variants = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 60 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -60 }),
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured highlights"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
    >
      <div className="relative min-h-[46rem] sm:min-h-[40rem] lg:min-h-[35rem]">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={index}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            drag={reduce ? false : "x"}
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={onDragEnd}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
            className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]"
          >
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/85 backdrop-blur">
                <span className="size-2 animate-pulse-ring rounded-full bg-accent" aria-hidden />
                {s.eyebrow}
              </span>
              <div role="heading" aria-level={2} className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                <SplitText text={s.title} />{" "}
                <span className="text-gradient">
                  <SplitText text={s.accent} delay={0.3} />
                </span>
              </div>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">{s.body}</p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                {s.primary.href ? (
                  <ButtonLink href={s.primary.href}>
                    {s.primary.label} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </ButtonLink>
                ) : (
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new Event(s.primary.event!))}
                    className="group relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-full bg-brand-strong px-6 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    {s.primary.label} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </button>
                )}
                {s.secondary.href ? (
                  <ButtonLink href={s.secondary.href} variant="onDark">
                    {s.secondary.label}
                  </ButtonLink>
                ) : (
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new Event(s.secondary.event!))}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/10"
                  >
                    {s.secondary.label}
                  </button>
                )}
              </div>
            </div>
            <div className="select-none">{s.visual}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={prev} aria-label="Previous slide" className="grid size-11 place-items-center rounded-full border border-white/20 bg-white/5 text-white transition hover:bg-white/15">
            <ChevronLeft className="size-5" />
          </button>
          <button type="button" onClick={next} aria-label="Next slide" className="grid size-11 place-items-center rounded-full border border-white/20 bg-white/5 text-white transition hover:bg-white/15">
            <ChevronRight className="size-5" />
          </button>
          {!reduce && (
            <button type="button" onClick={() => setUserPaused((v) => !v)} aria-label={userPaused ? "Play slideshow" : "Pause slideshow"} className="grid size-11 place-items-center rounded-full border border-white/20 bg-white/5 text-white transition hover:bg-white/15">
              {userPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
            </button>
          )}
        </div>
        <div className="flex flex-1 items-center gap-2" role="tablist" aria-label="Choose slide">
          {slides.map((sl, i) => (
            <button
              key={sl.eyebrow}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}: ${sl.eyebrow}`}
              onClick={() => go(i, i > index ? 1 : -1)}
              className="group relative h-11 flex-1 max-w-24"
            >
              <span className={cn("absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full transition-colors", i === index ? "bg-white/25" : "bg-white/15 group-hover:bg-white/30")}>
                {i === index && (
                  <motion.span
                    key={`${index}-${playing}`}
                    className="block h-full origin-left rounded-full bg-accent"
                    initial={{ scaleX: playing ? 0 : 1 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: playing ? INTERVAL / 1000 : 0, ease: "linear" }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
        <p className="hidden text-sm tabular-nums text-white/50 sm:block" aria-hidden>
          {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </p>
      </div>
      <div className="sr-only" aria-live={playing ? "off" : "polite"}>{`Slide ${index + 1} of ${slides.length}: ${s.eyebrow}`}</div>
    </div>
  );
}
