import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { posts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Insights",
  description: "Practical articles on engineering, performance, AI and digital strategy.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero eyebrow="Insights" title="Practical thinking on technology" body="Short, useful guides from our consulting work." />
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-16 sm:px-8">
        <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <StaggerItem key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="block h-full">
                <SpotlightCard className="flex h-full flex-col">
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full bg-accent/15 px-3 py-1 font-semibold text-accent">{p.category}</span>
                    <ArrowUpRight className="size-5 text-muted-foreground transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand" aria-hidden />
                  </div>
                  <h2 className="mt-5 font-display text-2xl font-bold leading-snug">{p.title}</h2>
                  <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">{p.excerpt}</p>
                  <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="size-3.5" aria-hidden /> {p.readMinutes} min read
                  </p>
                </SpotlightCard>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </>
  );
}
