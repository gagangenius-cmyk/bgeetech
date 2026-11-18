import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { FinalCta } from "@/components/sections/more";
import { TeamAvatar } from "@/components/team-avatar";
import { team } from "@/lib/team";

export const metadata: Metadata = {
  title: "Our team",
  description: "Meet the BGeetech team: project leadership, content, SEO and digital branding.",
};

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Our team"
        title="The people behind BGeetech"
        body="A small, focused team covering delivery, content, search and brand, so every project gets joined-up expertise."
      />
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <StaggerItem key={m.slug}>
              <SpotlightCard className="flex h-full flex-col items-center p-8 text-center">
                <div className="relative">
                  <div aria-hidden className="absolute -inset-2 rounded-full bg-linear-to-br from-brand/50 to-accent/60 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
                  <TeamAvatar spec={m.avatar} name={m.name} className="relative size-40 rounded-full ring-4 ring-card transition-transform duration-500 group-hover:scale-105" />
                </div>
                <h2 className="mt-6 font-display text-xl font-bold">{m.name}</h2>
                <p className="mt-1 text-sm font-semibold text-brand">{m.role}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
                <ul className="mt-5 flex flex-wrap justify-center gap-2">
                  {m.skills.map((s) => (
                    <li key={s} className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium">
                      {s}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
      <FinalCta />
    </>
  );
}
