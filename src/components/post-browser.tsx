"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Clock, Search } from "lucide-react";
import { ArtImage } from "@/components/art-image";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { blogArt } from "@/lib/art";
import { cn } from "@/lib/utils";

export type CardPost = { slug: string; title: string; excerpt: string; category: string; readMinutes: number; coverUrl: string };

export function PostCard({ p }: { p: CardPost }) {
  return (
    <Link href={`/blog/${p.slug}`} className="block h-full">
      <SpotlightCard className="flex h-full flex-col p-0">
        <div className="aspect-[16/9] overflow-hidden">
          <ArtImage art={p.coverUrl ? { src: p.coverUrl, srcSet: p.coverUrl } : blogArt(p.category)} className="transition-transform duration-700 group-hover:scale-105" />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center justify-between text-xs">
            <span className="rounded-full bg-accent/15 px-3 py-1 font-semibold text-accent">{p.category}</span>
            <ArrowUpRight className="size-5 text-muted-foreground transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand" aria-hidden />
          </div>
          <h2 className="mt-5 font-display text-2xl font-bold leading-snug">{p.title}</h2>
          <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">{p.excerpt}</p>
          <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="size-3.5" aria-hidden /> {p.readMinutes} min read
          </p>
        </div>
      </SpotlightCard>
    </Link>
  );
}

/** Search box and category chips over the article list. Filtering happens in the browser, so it is instant. */
export function PostBrowser({ posts }: { posts: CardPost[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const categories = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.category))).sort()], [posts]);
  const shown = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return posts.filter((p) => (cat === "All" || p.category === cat) && terms.every((t) => `${p.title} ${p.excerpt} ${p.category}`.toLowerCase().includes(t)));
  }, [posts, q, cat]);

  return (
    <>
      <div className="mb-8 space-y-4">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <label htmlFor="post-search" className="sr-only">
            Search articles
          </label>
          <input id="post-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${posts.length} articles`} className="min-h-12 w-full rounded-full border border-border bg-card pl-12 pr-4 outline-none focus:border-brand focus:ring-4 focus:ring-brand/15" />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {categories.map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={cn("min-h-10 rounded-full border px-4 text-sm font-semibold transition", cat === c ? "border-brand bg-brand text-white" : "border-border bg-card hover:border-brand/50")}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-5 text-sm text-muted-foreground" aria-live="polite">
        {shown.length} article{shown.length === 1 ? "" : "s"}
      </p>
      {shown.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">No articles match. Try another word or category.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <PostCard key={p.slug} p={p} />
          ))}
        </div>
      )}
    </>
  );
}
