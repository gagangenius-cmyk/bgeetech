import { ServiceFrom } from "@/components/currency";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Clock, Users } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { FinalCta } from "@/components/sections/more";
import { ServiceIcon } from "@/components/service-icon";
import { ButtonLink } from "@/components/ui/button";
import { serviceDetails } from "@/lib/content";
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
  const d = serviceDetails[s.slug];
  const related = services.filter((x) => x.slug !== s.slug).slice(0, 3);

  return (
    <>
      <PageHero eyebrow="Service" title={s.title} body={s.summary}>
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href={`/book?service=${s.slug}`}>
            {s.from === 0 ? "Book your free consultation" : "Get started with a free call"} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </ButtonLink>
          <span className="inline-flex items-center gap-2 text-sm text-white/70">
            <Clock className="size-4" aria-hidden /> <ServiceFrom s={s} />
          </span>
        </div>
      </PageHero>

      <div className="mx-auto max-w-4xl space-y-20 px-5 py-24 sm:px-8">
        {d && (
          <Reveal>
            <h2 className="flex items-center gap-3 font-display text-3xl font-extrabold tracking-tight">
              <Users className="size-7 text-accent" aria-hidden /> Who it is for
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {d.audience.map((a) => (
                <li key={a} className="rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed">
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        <section>
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold tracking-tight">What you get</h2>
          </Reveal>
          <Stagger className="mt-8 space-y-4">
            {[...s.outcomes, ...(d?.deliverables ?? [])].map((o) => (
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

        {d && (
          <section>
            <Reveal>
              <h2 className="font-display text-3xl font-extrabold tracking-tight">How it works</h2>
            </Reveal>
            <Stagger className="mt-8 grid gap-5 sm:grid-cols-3">
              {d.process.map((p, i) => (
                <StaggerItem key={p.title}>
                  <div className="h-full rounded-2xl border border-border bg-card p-6">
                    <span className="font-display text-4xl font-extrabold text-accent/70">0{i + 1}</span>
                    <h3 className="mt-2 font-display text-lg font-bold">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        )}

        {d && (
          <section>
            <Reveal>
              <h2 className="font-display text-3xl font-extrabold tracking-tight">Common questions</h2>
            </Reveal>
            <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card">
              {d.faqs.map((f) => (
                <details key={f.q} className="group p-6">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    {f.q}
                    <span aria-hidden className="text-2xl leading-none text-accent transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <section>
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold tracking-tight">Related services</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/services/${r.slug}`}
                className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-brand/50 hover:shadow-lg hover:shadow-brand/10"
              >
                <span className="grid size-10 place-items-center rounded-lg bg-brand/10 text-brand">
                  <ServiceIcon name={r.icon} className="size-5" />
                </span>
                <p className="mt-3 font-semibold group-hover:text-brand">{r.title}</p>
                <p className="text-sm text-muted-foreground"><ServiceFrom s={r} /></p>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <FinalCta />
    </>
  );
}
