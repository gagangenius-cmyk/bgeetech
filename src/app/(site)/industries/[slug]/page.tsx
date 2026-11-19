import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowRight, Check } from "lucide-react";
import { ServiceFrom } from "@/components/currency";
import { DemoGrid } from "@/components/demo-grid";
import { PageHero } from "@/components/page-hero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { FinalCta } from "@/components/sections/more";
import { SectionHeading } from "@/components/sections/services-grid";
import { ButtonLink } from "@/components/ui/button";
import { serviceArt } from "@/lib/art";
import { getDemos } from "@/lib/db/queries";
import { JsonLd, faqPage, webPage } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { services } from "@/lib/site";
import { verticalBySlug, verticals } from "@/lib/verticals";

export function generateStaticParams() {
  return verticals.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/industries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const v = verticalBySlug(slug);
  if (!v) return {};
  return pageMeta({ title: v.headline, description: v.intro.slice(0, 158), path: `/industries/${v.slug}` });
}

async function Demos({ categories }: { categories: string[] }) {
  const demos = (await getDemos()).filter((d) => categories.includes(d.category));
  if (demos.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
      <SectionHeading eyebrow="Live demos" title="See it working" body="Open a demo and click around before you decide." />
      <div className="mt-10">
        <DemoGrid demos={demos} />
      </div>
    </section>
  );
}

export default async function IndustryPage({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const v = verticalBySlug(slug);
  if (!v) notFound();

  return (
    <>
      <JsonLd data={[webPage("WebPage", v.headline, v.intro, `/industries/${v.slug}`), faqPage(v.faqs)]} />
      <PageHero crumbs={[{ name: "Industries", path: "/industries" }, { name: v.name, path: `/industries/${v.slug}` }]} art={serviceArt(v.artService)} eyebrow={v.name} title={v.headline} body={v.intro}>
        <div className="flex flex-wrap gap-4">
          <ButtonLink href="/book">
            Free 30-minute consultation <ArrowRight className="size-4" />
          </ButtonLink>
          <ButtonLink href="/audit" variant="onDark">
            Check my website
          </ButtonLink>
        </div>
      </PageHero>

      <section className="mx-auto max-w-5xl px-5 py-24 sm:px-8">
        <SectionHeading eyebrow="Sound familiar?" title="Problems we hear from this industry" />
        <ul className="mt-8 space-y-3">
          {v.pains.map((p) => (
            <li key={p} className="flex gap-3 rounded-2xl border border-border bg-card p-5">
              <Check className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
              <span className="leading-relaxed">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <SectionHeading eyebrow="What we build" title={`What we build for ${v.name.toLowerCase()}`} center />
        <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
          {v.solutions.map((s) => {
            const svc = services.find((x) => x.slug === s.service);
            return (
              <StaggerItem key={s.title}>
                <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-7">
                  <h3 className="font-display text-xl font-bold">{s.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">{s.body}</p>
                  {svc && (
                    <>
                      <p className="mt-5 text-sm font-semibold text-brand">
                        <ServiceFrom s={svc} />
                      </p>
                      <Link href={`/services/${svc.slug}`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold hover:text-brand">
                        About {svc.title} <ArrowRight className="size-4" aria-hidden />
                      </Link>
                    </>
                  )}
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {v.demoCategories.length > 0 && (
        <Suspense fallback={null}>
          <Demos categories={v.demoCategories} />
        </Suspense>
      )}

      <section className="mx-auto max-w-4xl px-5 pb-24 sm:px-8">
        <SectionHeading eyebrow="FAQ" title={`${v.name}: common questions`} />
        <Reveal className="mt-8 divide-y divide-border rounded-3xl border border-border bg-card">
          {v.faqs.map((f) => (
            <details key={f.q} className="group px-6 py-5">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {f.q}
                <span aria-hidden className="text-brand transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </section>
      <FinalCta />
    </>
  );
}
