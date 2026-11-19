import { JsonLd, webPage } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { Suspense } from "react";
import { PageHero } from "@/components/page-hero";
import { PostBrowser } from "@/components/post-browser";
import { getPosts } from "@/lib/db/queries";

export const metadata = pageMeta({
  title: "Insights: Websites, CRM, ERP and AI Guides",
  description: "Practical, plain-English guides on website costs, CRM vs ERP, bug fixing, AI chatbots and growing your business online.",
  path: "/blog",
});

async function PostGrid() {
  const posts = await getPosts();
  if (posts.length === 0) return <p className="py-16 text-center text-muted-foreground">New articles are on the way.</p>;
  return <PostBrowser posts={posts.map(({ slug, title, excerpt, category, readMinutes, coverUrl }) => ({ slug, title, excerpt, category, readMinutes, coverUrl }))} />;
}

export default function BlogPage() {
  return (
    <>
      <JsonLd data={webPage("CollectionPage", "BGeetech Insights", "Practical guides on websites, CRM, ERP and AI.", "/blog")} />
      <PageHero crumbs={[{ name: "Insights", path: "/blog" }]} eyebrow="Insights" title="Practical thinking on technology" body="Short, useful guides from our consulting work." />
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-16 sm:px-8">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-3xl bg-muted" />}>
          <PostGrid />
        </Suspense>
      </section>
    </>
  );
}
