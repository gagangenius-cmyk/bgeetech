import Link from "next/link";
import { ArrowRight, BadgeCheck, MonitorPlay, Quote, ScanSearch, Tag } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/services-grid";
import { caseStudies, testimonials } from "@/lib/proof";
import { cn } from "@/lib/utils";

const tryIt = [
  { icon: MonitorPlay, title: "See working software", body: "Open our CRM, POS and HRMS demos and click around before you decide.", href: "/demos", cta: "Open the demos" },
  { icon: ScanSearch, title: "Test your own website", body: "Our free audit scores your SEO, speed, mobile and security in seconds.", href: "/audit", cta: "Check my site" },
  { icon: Tag, title: "See real prices", body: "Starting prices are published, and every proposal is a fixed scope you approve first.", href: "/pricing", cta: "View pricing" },
];

const promises = ["Your first 30 minutes are free, with no obligation", "A written, fixed-scope proposal before any work starts", "One team for design, build, hosting and support", "A reply within one business day"];

/** Proof that does not depend on invented reviews: things visitors can verify themselves, plus real testimonials when added to src/lib/proof.ts. */
export function ProofSection() {
  return (
    <section data-bgee="proof" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <SectionHeading eyebrow="Proof, not promises" title="Don't take our word for it. Try us first." body="Everything below is something you can open and check yourself, before you spend anything." center />

      <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
        {tryIt.map((t) => (
          <StaggerItem key={t.title}>
            <Link href={t.href} className="group flex h-full flex-col rounded-3xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:border-brand/50 hover:shadow-xl hover:shadow-brand/10">
              <span className="grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand">
                <t.icon className="size-6" aria-hidden />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold">{t.title}</h3>
              <p className="mt-2 flex-1 leading-relaxed text-muted-foreground">{t.body}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-brand">
                {t.cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-8 rounded-3xl bg-ink p-8 text-white sm:p-10">
        <p className="font-display text-2xl font-bold">Our promises</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {promises.map((p) => (
            <li key={p} className="flex items-start gap-3">
              <BadgeCheck className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
              <span className="text-white/85">{p}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      {caseStudies.length > 0 && (
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {caseStudies.map((c) => (
            <article key={c.title} className="rounded-3xl border border-border bg-card p-7">
              <p className="text-sm font-semibold text-accent">{c.client}</p>
              <h3 className="mt-1 font-display text-xl font-bold">{c.title}</h3>
              <p className="mt-3 text-muted-foreground">
                <span className="font-semibold text-foreground">Challenge:</span> {c.challenge}
              </p>
              <p className="mt-2 text-muted-foreground">
                <span className="font-semibold text-foreground">Result:</span> {c.result}
              </p>
              {c.metrics && (
                <dl className="mt-4 flex flex-wrap gap-6">
                  {c.metrics.map((m) => (
                    <div key={m.label}>
                      <dd className="font-display text-2xl font-extrabold text-brand">{m.value}</dd>
                      <dt className="text-xs text-muted-foreground">{m.label}</dt>
                    </div>
                  ))}
                </dl>
              )}
              {c.href && (
                <Link href={c.href} className="mt-4 inline-flex items-center gap-1.5 font-semibold text-brand hover:underline">
                  Read the story <ArrowRight className="size-4" aria-hidden />
                </Link>
              )}
            </article>
          ))}
        </div>
      )}

      {testimonials.length > 0 && (
        <div className={cn("mt-12 grid gap-5", testimonials.length > 1 && "md:grid-cols-2 lg:grid-cols-3")}>
          {testimonials.map((t) => (
            <figure key={t.name + t.quote.slice(0, 12)} className="rounded-3xl border border-border bg-card p-7">
              <Quote className="size-7 text-accent" aria-hidden />
              <blockquote className="mt-3 leading-relaxed">{t.quote}</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold">{t.name}</span>
                <span className="text-muted-foreground">
                  {" "}
                  · {t.role}
                  {t.company ? `, ${t.company}` : ""}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
