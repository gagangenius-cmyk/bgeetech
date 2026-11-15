import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { FinalCta, Industries, PricingTeaser, Process, Stats, TechMarquee, WhyUs } from "@/components/sections/more";
import { SectionHeading, ServicesGrid } from "@/components/sections/services-grid";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8">
        <SectionHeading
          eyebrow="Services"
          title="Specialist help for every stage of delivery"
          body="Focused, outcome-led sessions with senior practitioners. Pick what you need, see the price, book instantly."
        />
        <ServicesGrid limit={6} />
        <div className="mt-10 text-center">
          <ButtonLink href="/services" variant="secondary">
            View all 12 services <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </section>
      <TechMarquee />
      <Process />
      <WhyUs />
      <Industries />
      <PricingTeaser />
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" center />
        <Faq />
      </section>
      <FinalCta />
    </>
  );
}
