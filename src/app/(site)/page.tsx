import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { FinalCta, Industries, PricingTeaser, Process, Stats, TechMarquee, WhyUs } from "@/components/sections/more";
import { SectionHeading, ServicesGrid } from "@/components/sections/services-grid";
import { JsonLd, faqPage } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { consultation, faqs, packageCatalog, plans, site } from "@/lib/site";

const home = pageMeta({
  title: "Website, App, CRM, ERP & AI Development",
  description: "BGeetech builds websites, web and mobile apps, CRM, ERP, POS, HRMS and AI chatbots, and fixes and maintains your software. First 30 minutes free.",
  path: "/",
});
export const metadata: Metadata = { ...home, title: { absolute: "BGeetech: Website, App, CRM, ERP & AI Development" } };

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
const price = (name: string) => plans.find((p) => p.name === name)?.price ?? 0;

/**
 * Answer-first summary in plain sentences. Search and AI answer engines extract text like this,
 * and it doubles as a quick orientation for human visitors.
 */
function AtAGlance() {
  const rows: [string, string][] = [
    ["What we do", `${site.name} is a web and software services company. We design, build and support websites, web and mobile apps, CRM, ERP, POS and HRMS software, e-commerce stores, AI chatbots and automations, and we fix and maintain existing software.`],
    ["Who we help", "Small and growing businesses, startups and agencies worldwide, from local services such as barbers, clinics and shops to booking engines, real estate and immigration firms."],
    ["What it costs", `Starting prices are published: websites from ${usd(price("Website Launch"))}, CRM and business apps from ${usd(price("CRM & Business App"))}, AI and automation from ${usd(price("AI & Automation"))}, ERP from ${usd(price("ERP Suite"))}, and care plans for bug fixing from ${usd(price("Care Plan"))} per month. Hosted websites built in our website builder start at ${usd(10)} per month. Every project gets a fixed-scope proposal.`],
    ["Free consultation", `Your first ${consultation.freeMinutes} minutes with an expert are free, with no obligation. A ${consultation.extendedMinutes}-minute deep-dive is ${usd(consultation.extendedUsd)}.`],
    ["How to start", "Book a free call, chat with our AI assistant, or message us on WhatsApp. We reply within one business day."],
    ["Payments", `Prices and payments are available in US dollars, UAE dirhams and Indian rupees (${packageCatalog.projects.length} project types and ${packageCatalog.monthly.length} monthly services can be combined in our custom package calculator).`],
  ];
  return (
    <section aria-labelledby="glance" className="mx-auto max-w-5xl px-5 py-24 sm:px-8">
      <SectionHeading eyebrow="At a glance" title={`${site.name} in a nutshell`} center />
      <dl className="mt-12 divide-y divide-border rounded-3xl border border-border bg-card">
        {rows.map(([k, v]) => (
          <div key={k} className="grid gap-2 px-6 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
            <dt className="font-display text-lg font-bold text-brand">{k}</dt>
            <dd className="leading-relaxed text-muted-foreground">{v}</dd>
          </div>
        ))}
      </dl>
      <p id="glance" className="sr-only">
        Summary of {site.name}
      </p>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqPage(faqs)} />
      <Hero />
      <Stats />
      <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8">
        <SectionHeading
          eyebrow="Services"
          title="Products and services for every stage of your business"
          body="Websites, apps, CRM, ERP, AI and ongoing support from one team, with clear starting prices."
        />
        <ServicesGrid limit={6} />
        <div className="mt-10 text-center">
          <ButtonLink href="/services" variant="secondary">
            View all services <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </section>
      <TechMarquee />
      <Process />
      <WhyUs />
      <AtAGlance />
      <Industries />
      <PricingTeaser />
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" center />
        <Faq />
        <p className="mt-8 text-center">
          <Link href="/faq" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand hover:underline">
            See all frequently asked questions <ArrowRight className="size-4" aria-hidden />
          </Link>
        </p>
      </section>
      <FinalCta />
    </>
  );
}
