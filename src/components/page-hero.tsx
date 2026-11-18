import type { ReactNode } from "react";
import { SplitText } from "@/components/motion/split-text";
import { Reveal } from "@/components/motion/reveal";

export function PageHero({ eyebrow, title, body, children }: { eyebrow: string; title: string; body?: string; children?: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink pb-20 pt-32 text-white sm:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-32 size-[34rem] animate-aurora rounded-full bg-blue-600/35 blur-[110px]" />
        <div className="absolute -right-24 top-10 size-[28rem] animate-aurora rounded-full bg-amber-400/25 blur-[110px] [animation-delay:-7s]" />
        <div className="grid-lines absolute inset-0" />
      </div>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal y={10}>
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">{eyebrow}</p>
        </Reveal>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
          <SplitText text={title} />
        </h1>
        {body && (
          <Reveal delay={0.4}>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">{body}</p>
          </Reveal>
        )}
        {children && <Reveal delay={0.55}><div className="mt-8">{children}</div></Reveal>}
      </div>
    </section>
  );
}
