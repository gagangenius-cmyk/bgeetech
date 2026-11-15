import type { Metadata } from "next";
import { Eye, Handshake, Rocket } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { FinalCta, Stats } from "@/components/sections/more";

export const metadata: Metadata = {
  title: "About",
  description: "Who we are and how bgeetech works with teams.",
};

const values = [
  { icon: Eye, title: "Clarity first", body: "Plain language, clear trade-offs and written outcomes you can share with your team." },
  { icon: Rocket, title: "Built to ship", body: "Advice grounded in delivery experience, not slideware. We focus on what moves the product." },
  { icon: Handshake, title: "Partnership", body: "We work alongside your engineers, designers and leaders, and we are honest when something is not worth doing." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A small team of senior practitioners"
        body="bgeetech brings hands-on engineering, design and strategy experience to teams that want expert input without long contracts."
      />
      <Stats />
      <section className="mx-auto max-w-3xl px-5 pt-24 sm:px-8">
        <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Our story</h2>
        <div aria-hidden className="gold-rule mt-5 max-w-24" />
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Good technology decisions are rarely about tools. They are about timing, trade-offs and people. We started bgeetech to give teams direct access to experienced practitioners without long contracts or sales cycles.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Every engagement is online, focused and documented. You bring the question, we bring the experience, and you leave with a plan written in plain language that your whole team can follow.
        </p>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <Stagger className="grid gap-5 md:grid-cols-3">
          {values.map((v) => (
            <StaggerItem key={v.title}>
              <SpotlightCard className="h-full">
                <span className="grid size-12 place-items-center rounded-xl bg-brand/10 text-brand">
                  <v.icon className="size-6" aria-hidden />
                </span>
                <h2 className="mt-5 font-display text-xl font-bold">{v.title}</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">{v.body}</p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
      <FinalCta />
    </>
  );
}
