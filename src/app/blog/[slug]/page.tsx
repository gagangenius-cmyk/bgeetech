import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { FinalCta } from "@/components/sections/more";
import { posts } from "@/lib/content";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.excerpt, openGraph: { type: "article", title: p.title, description: p.excerpt } } : {};
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  if (!p) notFound();

  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.excerpt,
    datePublished: p.date,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <>
      <PageHero eyebrow={p.category} title={p.title} body={`${p.readMinutes} min read`} />
      <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
        <p className="text-xl leading-relaxed text-muted-foreground">{p.excerpt}</p>
        {p.body.map((b, i) => (
          <section key={i} className="mt-10">
            {b.h && <h2 className="font-display text-2xl font-bold tracking-tight">{b.h}</h2>}
            <p className="mt-3 text-lg leading-relaxed">{b.p}</p>
          </section>
        ))}
        <div className="gold-rule mt-14" aria-hidden />
        <Link href="/blog" className="mt-8 inline-flex min-h-11 items-center gap-2 font-semibold text-brand hover:underline">
          <ArrowLeft className="size-4" aria-hidden /> All insights
        </Link>
      </article>
      <FinalCta />
    </>
  );
}
