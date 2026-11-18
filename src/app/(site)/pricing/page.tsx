import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe, ShieldCheck } from "lucide-react";
import { PackageBuilder } from "@/components/package-builder";
import { PageHero } from "@/components/page-hero";
import { Faq } from "@/components/sections/faq";
import { FinalCta, PricingCards } from "@/components/sections/more";
import { SectionHeading } from "@/components/sections/services-grid";

export const metadata: Metadata = {
  title: "Pricing & packages",
  description:
    "Transparent packages for websites, CRM, ERP, AI and bug fixing, a custom package calculator, and a free first 30-minute consultation.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Packages for every stage of your business"
        body="Websites, CRM, ERP, AI and ongoing care, with clear starting prices. Your first 30-minute consultation is free."
      />

      <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
        <PricingCards />
        <p className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <ShieldCheck className="size-4 text-accent" aria-hidden />
          Starting prices. You get a fixed-scope proposal after your free call, and payments are processed securely.
        </p>
      </section>

      <section className="bg-muted py-24" aria-labelledby="custom-package">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Custom package"
            title="Build your own package and see the price"
            body="Combine the products you need, choose the size and timeline, and add monthly services. Bundle two or more projects to save."
            center
          />
          <div id="custom-package" className="mt-12">
            <PackageBuilder />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-24 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-ink p-8 text-white sm:p-12">
          <div aria-hidden className="absolute -right-20 -top-20 size-72 animate-aurora rounded-full bg-blue-600/40 blur-[90px]" />
          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300">
                <Globe className="size-4" aria-hidden /> Website builder
              </p>
              <h2 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">Just need a website? Design it yourself in minutes.</h2>
              <p className="mt-2 max-w-xl text-white/70">Choose your industry, colours and style, preview it on every device, and go live from $10 a month.</p>
            </div>
            <Link href="/builder" className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-amber-400 px-6 font-semibold text-ink transition hover:bg-amber-300">
              Open the builder <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <SectionHeading eyebrow="FAQ" title="Pricing questions" center />
        <Faq />
      </section>
      <FinalCta />
    </>
  );
}
