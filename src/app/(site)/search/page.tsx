import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { Suspense, type ReactNode } from "react";
import { PageHero } from "@/components/page-hero";
import { searchSite, tokenize, type SearchKind } from "@/lib/search";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: true } };

const popular = ["CRM", "pricing", "website builder", "SEO", "real estate", "cloud", "AI"];

const kindStyle: Record<SearchKind, string> = {
  Service: "bg-brand/10 text-brand",
  Insight: "bg-accent/15 text-accent",
  Demo: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
  Team: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
  Page: "bg-muted text-muted-foreground",
  "Website type": "bg-teal-500/10 text-teal-700 dark:text-teal-300",
};

/** Wraps matched terms in <mark>. Output is React nodes only, so user input is never interpreted as HTML. */
function Highlight({ text, terms }: { text: string; terms: string[] }): ReactNode {
  if (!terms.length || !text) return text;
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return text.split(re).map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded bg-accent/30 px-0.5 text-inherit">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

async function Results({ searchParams }: { searchParams: PageProps<"/search">["searchParams"] }) {
  const sp = await searchParams;
  const raw = (Array.isArray(sp.q) ? sp.q[0] : sp.q) ?? "";
  const q = raw.slice(0, 100);
  const { terms, hits } = await searchSite(q);

  return (
    <>
      <form action="/search" role="search" className="mx-auto flex max-w-2xl gap-2">
        <label htmlFor="search-q" className="sr-only">
          Search the site
        </label>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="search-q"
            name="q"
            defaultValue={q}
            maxLength={100}
            placeholder="Search services, articles, demos..."
            autoComplete="off"
            className="min-h-14 w-full rounded-full border border-border bg-card pl-12 pr-4 text-base outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15"
          />
        </div>
        <button type="submit" className="min-h-14 rounded-full bg-brand-strong px-7 font-semibold text-white transition hover:-translate-y-0.5">
          Search
        </button>
      </form>

      <div className="mx-auto mt-10 max-w-3xl" aria-live="polite">
        {terms.length === 0 ? (
          <div className="text-center">
            <p className="text-muted-foreground">Try one of these popular searches:</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {popular.map((p) => (
                <Link key={p} href={`/search?q=${encodeURIComponent(p)}`} className="min-h-10 rounded-full border border-border px-4 py-2 text-sm font-semibold transition hover:border-brand/60 hover:text-brand">
                  {p}
                </Link>
              ))}
            </div>
          </div>
        ) : hits.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="font-display text-xl font-bold">No results for &ldquo;{q}&rdquo;</p>
            <p className="mt-2 text-muted-foreground">Check the spelling, try fewer words, or browse our services.</p>
            <Link href="/services" className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-brand hover:underline">
              Browse services <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {hits.length} result{hits.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
            </p>
            <ul className="space-y-3">
              {hits.map((h) => (
                <li key={`${h.kind}-${h.href}-${h.title}`}>
                  <Link href={h.href} className="group block rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-lg hover:shadow-brand/10">
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${kindStyle[h.kind]}`}>{h.kind}</span>
                      <ArrowUpRight className="ml-auto size-4 text-muted-foreground transition group-hover:text-brand" aria-hidden />
                    </div>
                    <h2 className="mt-2 font-display text-lg font-bold group-hover:text-brand">
                      <Highlight text={h.title} terms={tokenize(q)} />
                    </h2>
                    {h.snippet && (
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        <Highlight text={h.snippet} terms={tokenize(q)} />
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <>
      <PageHero eyebrow="Search" title="Find what you need" body="Search our services, articles, demos, team and website types." />
      <section className="px-5 py-16 sm:px-8">
        <Suspense fallback={<div className="mx-auto h-40 max-w-2xl animate-pulse rounded-3xl bg-muted" />}>
          <Results searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}
