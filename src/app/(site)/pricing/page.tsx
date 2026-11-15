import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Faq } from "@/components/sections/faq";
import { FinalCta, PricingCards } from "@/components/sections/more";
import { SectionHeading } from "@/components/sections/services-grid";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Transparent consulting packages with secure online payment and compliant invoices.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Simple, transparent packages"
        body="See the total before you book. Secure checkout, free rescheduling and PDF invoices for companies."
      />
      <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
        <PricingCards />
        <p className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <ShieldCheck className="size-4 text-accent" aria-hidden />
          Payments are processed securely. Cancellation terms are shown before you pay.
        </p>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <SectionHeading eyebrow="FAQ" title="Pricing questions" center />
        <Faq />
      </section>
      <FinalCta />
    </>
  );
}
