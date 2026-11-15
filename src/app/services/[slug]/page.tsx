import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { FinalCta } from "@/components/sections/more";
import { ButtonLink } from "@/components/ui/button";
import { services } from "@/lib/site";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  return s ? { title: s.title, description: s.summary } : {};
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();

  return (
    <>
      <PageHero eyebrow="Service" title={s.title} body={s.summary}>
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href={`/book?service=${s.slug}`}>
            Book this session <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </ButtonLink>
          <span className="inline-flex items-center gap-2 text-sm text-white/70">
            <Clock className="size-4" aria-hidden /> {s.duration} · from ${s.from}
          </span>
        </div>
      </PageHero>
      <section className="mx-auto max-w-4xl px-5 py-24 sm:px-8">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold tracking-tight">What you get</h2>
        </Reveal>
        <Stagger className="mt-8 space-y-4">
          {s.outcomes.map((o) => (
            <StaggerItem key={o}>
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-brand/50 hover:shadow-lg hover:shadow-brand/10">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                  <Check className="size-4" aria-hidden />
                </span>
                <p className="pt-0.5 font-medium">{o}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
      <FinalCta />
    </>
  );
}
