"use client";

import { ArrowUpRight, ExternalLink, MonitorPlay } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { openLeadPopup } from "@/components/widgets/lead-popup";
import type { DemoView } from "@/lib/db/queries";
import { cn } from "@/lib/utils";

export function RequestDemoButton({ className, children = "Request a walkthrough" }: { className?: string; children?: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={openLeadPopup}
      className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-brand/60 hover:text-brand", className)}
    >
      {children}
    </button>
  );
}

export function DemoGrid({ demos }: { demos: DemoView[] }) {
  const [cat, setCat] = useState("All");
  const cats = useMemo(() => ["All", ...Array.from(new Set(demos.map((d) => d.category)))], [demos]);
  const shown = cat === "All" ? demos : demos.filter((d) => d.category === cat);

  return (
    <div>
      <div role="group" aria-label="Filter demos by category" className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
            className={cn(
              "min-h-10 rounded-full border px-4 text-sm font-semibold transition",
              cat === c ? "border-brand bg-brand-strong text-white" : "border-border hover:border-brand/50",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((d) => (
          <SpotlightCard key={d.slug} className="flex flex-col p-0">
            <div className="relative grid h-44 place-items-center overflow-hidden bg-linear-to-br from-emerald-900 to-ink">
              {d.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={d.imageUrl} alt={`${d.title} screenshot`} className="size-full object-cover object-top" loading="lazy" />
              ) : (
                <MonitorPlay className="size-14 text-amber-300/80" aria-hidden />
              )}
              <span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{d.category}</span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-xl font-bold">{d.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{d.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href={`/demos/${d.slug}`} className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-brand-strong px-4 text-sm font-semibold text-white">
                  View details <ArrowUpRight className="size-4" aria-hidden />
                </Link>
                {d.url && (
                  <a href={d.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border px-4 text-sm font-semibold hover:border-brand/60 hover:text-brand">
                    Live demo <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                )}
              </div>
            </div>
          </SpotlightCard>
        ))}
        {shown.length === 0 && <p className="col-span-full py-16 text-center text-muted-foreground">No demos in this category yet.</p>}
      </div>
    </div>
  );
}
