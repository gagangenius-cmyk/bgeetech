import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { FinalCta } from "@/components/sections/more";
import { ServicesGrid } from "@/components/sections/services-grid";

export const metadata: Metadata = {
  title: "Services",
  description: "Technology consulting services: engineering, cloud, AI, design, security and strategy, delivered online.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Consulting that moves your product forward"
        body="Choose a focused session with a senior specialist. Every service shows its price and duration up front."
      />
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <ServicesGrid />
      </section>
      <FinalCta />
    </>
  );
}
