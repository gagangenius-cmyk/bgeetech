import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Suspense } from "react";
import { PageHero } from "@/components/page-hero";
import { Prose } from "@/components/prose";
import { FinalCta } from "@/components/sections/more";
import { getPost } from "@/lib/db/queries";
import { JsonLd, blogPosting } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { services } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p) return {};
  return pageMeta({ title: p.title, description: p.excerpt || p.body.slice(0, 155), path: `/blog/${p.slug}`, type: "article", publishedTime: p.date, modifiedTime: p.updated, image: p.coverUrl || undefined, ownOgImage: true });
}

// Contextual internal links: each article category points to the services most relevant to it.
const related: Record<string, string[]> = {
  Websites: ["website-development", "ecommerce-development", "seo-digital-marketing"],
  "Business software": ["crm-software", "erp-software", "pos-hrms-software"],
  Support: ["bug-fixing-maintenance", "cloud-hosting-devops", "security-audit"],
  AI: ["ai-solutions", "automation-integrations", "web-app-development"],
};
const relatedFor = (category: string) =>
  (related[category] ?? ["technology-consulting", "website-development", "web-app-development", "ai-solutions"])
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

async function Article({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p) notFound();

  return (
    <>
      <JsonLd data={blogPosting(p)} />
      <PageHero
        crumbs={[{ name: "Insights", path: "/blog" }, { name: p.title, path: `/blog/${p.slug}` }]}
        eyebrow={p.category}
        title={p.title}
        body={`By BGeetech Team · Published ${new Date(p.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · ${p.readMinutes} min read`}
      />
      <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        {p.coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.coverUrl} alt="" className="mb-10 w-full rounded-2xl border border-border object-cover" />
        )}
        {p.excerpt && <p className="mb-8 text-xl leading-relaxed text-muted-foreground">{p.excerpt}</p>}
        <Prose text={p.body} />
        <section aria-labelledby="related" className="mt-14 rounded-2xl border border-border bg-card p-6">
          <h2 id="related" className="font-display text-xl font-bold">Related services</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {relatedFor(p.category).map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 py-2 font-medium hover:bg-muted hover:text-brand">
                  {s.title} <ArrowRight className="size-4 shrink-0" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">Not sure what you need? Book a free 30-minute consultation and get honest advice.</p>
        </section>
        <div className="gold-rule mt-14" aria-hidden />
        <Link href="/blog" className="mt-8 inline-flex min-h-11 items-center gap-2 font-semibold text-brand hover:underline">
          <ArrowLeft className="size-4" aria-hidden /> All insights
        </Link>
      </article>
    </>
  );
}

export default function PostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <>
      <Suspense fallback={<div className="min-h-dvh" />}>
        <Article params={params} />
      </Suspense>
      <FinalCta />
    </>
  );
}
