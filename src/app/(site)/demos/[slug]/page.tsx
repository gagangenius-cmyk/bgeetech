import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, ExternalLink, KeyRound } from "lucide-react";
import { Suspense } from "react";
import { RequestDemoButton } from "@/components/demo-grid";
import { PageHero } from "@/components/page-hero";
import { Prose } from "@/components/prose";
import { FinalCta } from "@/components/sections/more";
import { ButtonLink } from "@/components/ui/button";
import { getDemo } from "@/lib/db/queries";
import { JsonLd, softwareApplication } from "@/lib/jsonld";
import { demoArt } from "@/lib/art";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/demos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDemo(slug);
  if (!d) return {};
  return pageMeta({ title: `${d.title}: Live Demo`, description: `${d.summary} Try the live demo, or get a version tailored to your business.`.slice(0, 158), path: `/demos/${d.slug}`, image: d.imageUrl || undefined, ownOgImage: true });
}

async function Detail({ params }: { params: PageProps<"/demos/[slug]">["params"] }) {
  const { slug } = await params;
  const d = await getDemo(slug);
  if (!d) notFound();

  return (
    <>
      <JsonLd data={softwareApplication(d)} />
      <PageHero crumbs={[{ name: "Demos", path: "/demos" }, { name: d.title, path: `/demos/${d.slug}` }]} art={d.imageUrl ? { src: d.imageUrl, srcSet: d.imageUrl } : demoArt(d.category)} eyebrow={d.category} title={d.title} body={d.summary}>
        <div className="flex flex-wrap items-center gap-3">
          {d.url ? (
            <ButtonLink href={d.url} target="_blank" rel="noopener noreferrer">
              Open live demo <ExternalLink className="size-4" />
            </ButtonLink>
          ) : null}
          <RequestDemoButton className="border-white/25 bg-white/5 text-white hover:text-white">Request a walkthrough</RequestDemoButton>
        </div>
      </PageHero>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          {d.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={d.imageUrl} alt={`${d.title} screenshot`} className="mb-8 w-full rounded-2xl border border-border shadow-xl" />
          )}
          {d.description ? <Prose text={d.description} /> : <p className="text-lg text-muted-foreground">{d.summary}</p>}
        </div>
        <aside className="space-y-6">
          {d.features.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-bold">Key features</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {d.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent/20 text-accent">
                      <Check className="size-3" aria-hidden />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {d.url && (d.demoUser || d.demoPass) && (
            <div className="rounded-2xl border border-accent/40 bg-accent/10 p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <KeyRound className="size-5 text-accent" aria-hidden /> Demo login
              </h2>
              <dl className="mt-3 space-y-1 font-mono text-sm">
                {d.demoUser && (
                  <div>
                    <dt className="inline text-muted-foreground">User: </dt>
                    <dd className="inline font-semibold">{d.demoUser}</dd>
                  </div>
                )}
                {d.demoPass && (
                  <div>
                    <dt className="inline text-muted-foreground">Password: </dt>
                    <dd className="inline font-semibold">{d.demoPass}</dd>
                  </div>
                )}
              </dl>
              <p className="mt-3 text-xs text-muted-foreground">Shared demo account with sample data. Please do not enter real information.</p>
            </div>
          )}
          <Link href="/demos" className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand hover:underline">
            <ArrowLeft className="size-4" aria-hidden /> All demos
          </Link>
        </aside>
      </div>
    </>
  );
}

export default function DemoPage({ params }: PageProps<"/demos/[slug]">) {
  return (
    <>
      <Suspense fallback={<div className="min-h-dvh" />}>
        <Detail params={params} />
      </Suspense>
      <FinalCta />
    </>
  );
}
