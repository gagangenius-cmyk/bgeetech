import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { FinalCta } from "@/components/sections/more";
import { serviceDetails } from "@/lib/content";
import { JsonLd, faqPage } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { faqs, services } from "@/lib/site";

export const metadata = pageMeta({
  title: "FAQ: Pricing, Process, Support and Free Consultation",
  description: "Answers to common questions about our free 30-minute consultation, pricing, how projects work, bug fixing, support and payments.",
  path: "/faq",
});

export default function FaqPage() {
  const perService = services.map((s) => ({ s, faqs: serviceDetails[s.slug]?.faqs ?? [] })).filter((x) => x.faqs.length > 0);
  const all = [...faqs, ...perService.flatMap((x) => x.faqs)];

  return (
    <>
      <JsonLd data={faqPage(all)} />
      <PageHero
        crumbs={[{ name: "FAQ", path: "/faq" }]}
        eyebrow="FAQ"
        title="Frequently asked questions"
        body="Short, direct answers about pricing, how projects work, support and your free first consultation."
      />

      <div className="mx-auto max-w-4xl space-y-16 px-5 py-20 sm:px-8">
        <section aria-labelledby="general">
          <h2 id="general" className="font-display text-3xl font-extrabold tracking-tight">General questions</h2>
          <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
            {faqs.map((f) => (
              <details key={f.q} className="group p-6" name="general">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  <h3 className="text-base">{f.q}</h3>
                  <span aria-hidden className="text-2xl leading-none text-accent transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {perService.map(({ s, faqs: list }) => (
          <section key={s.slug} aria-labelledby={`svc-${s.slug}`}>
            <h2 id={`svc-${s.slug}`} className="font-display text-2xl font-extrabold tracking-tight">{s.title}</h2>
            <div className="mt-5 divide-y divide-border rounded-2xl border border-border bg-card">
              {list.map((f) => (
                <details key={f.q} className="group p-5">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    <h3 className="text-base">{f.q}</h3>
                    <span aria-hidden className="text-2xl leading-none text-accent transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
            <Link href={`/services/${s.slug}`} className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
              About {s.title} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </section>
        ))}
      </div>
      <FinalCta />
    </>
  );
}
