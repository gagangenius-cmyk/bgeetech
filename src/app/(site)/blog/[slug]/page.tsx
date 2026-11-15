import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import { PageHero } from "@/components/page-hero";
import { Prose } from "@/components/prose";
import { FinalCta } from "@/components/sections/more";
import { getPost } from "@/lib/db/queries";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPost(slug);
  return p
    ? { title: p.title, description: p.excerpt, openGraph: { type: "article", title: p.title, description: p.excerpt, ...(p.coverUrl ? { images: [p.coverUrl] } : {}) } }
    : {};
}

async function Article({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const { slug } = await params;
  const p = await getPost(slug);
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
        {p.coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.coverUrl} alt="" className="mb-10 w-full rounded-2xl border border-border object-cover" />
        )}
        {p.excerpt && <p className="mb-8 text-xl leading-relaxed text-muted-foreground">{p.excerpt}</p>}
        <Prose text={p.body} />
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
