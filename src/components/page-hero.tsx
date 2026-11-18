import type { ReactNode } from "react";
import { ArtImage } from "@/components/art-image";
import { SplitText } from "@/components/motion/split-text";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import type { Art } from "@/lib/art";
import { JsonLd, breadcrumbs } from "@/lib/jsonld";

export function PageHero({
  eyebrow,
  title,
  body,
  children,
  crumbs,
  art,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  children?: ReactNode;
  crumbs?: { name: string; path: string }[];
  /** Optional framed illustration shown beside the headline on large screens. */
  art?: Art;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink pb-20 pt-32 text-white sm:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero/page.webp" srcSet="/hero/page-sm.webp 1280w, /hero/page.webp 2400w" sizes="100vw" alt="" width={2400} height={1350} decoding="async" className="size-full object-cover object-[70%_50%]" />
        <div className="absolute inset-0 bg-linear-to-r from-ink/85 via-ink/55 to-ink/25" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-ink/80 to-transparent" />
      </div>
      <div className={art ? "mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]" : "mx-auto max-w-7xl px-5 sm:px-8"}>
        <div>
          {crumbs && crumbs.length > 0 && (
            <>
              <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, ...crumbs])} />
              <nav aria-label="Breadcrumb" className="mb-5 text-sm text-white/60">
                <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <li>
                    <Link href="/" className="inline-block py-1 hover:text-white">Home</Link>
                  </li>
                  {crumbs.map((c, i) => (
                    <li key={c.path} className="flex items-center gap-2">
                      <span aria-hidden>/</span>
                      {i === crumbs.length - 1 ? <span aria-current="page" className="text-white/90">{c.name}</span> : <Link href={c.path} className="inline-block py-1 hover:text-white">{c.name}</Link>}
                    </li>
                  ))}
                </ol>
              </nav>
            </>
          )}
          <Reveal y={10}>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">{eyebrow}</p>
          </Reveal>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
            <SplitText text={title} />
          </h1>
          {body && (
            <Reveal delay={0.4}>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">{body}</p>
            </Reveal>
          )}
          {children && <Reveal delay={0.55}><div className="mt-8">{children}</div></Reveal>}
        </div>
        {art && (
          <Reveal delay={0.3} className="hidden lg:block">
            <div className="relative">
              <div aria-hidden className="absolute -inset-3 rounded-[2rem] bg-linear-to-br from-brand/40 to-accent/40 opacity-70 blur-xl" />
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem] border border-white/20 shadow-2xl shadow-black/40">
                <ArtImage art={art} priority sizes="(min-width: 1024px) 40vw, 100vw" />
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
