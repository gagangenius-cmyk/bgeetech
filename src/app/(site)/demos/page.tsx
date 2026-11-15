import type { Metadata } from "next";
import { Suspense } from "react";
import { DemoGrid } from "@/components/demo-grid";
import { PageHero } from "@/components/page-hero";
import { FinalCta } from "@/components/sections/more";
import { getDemos } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Product demos",
  description: "Explore live demos of our CRM, POS, HRMS and business software for real estate, immigration, retail, hospitality and more.",
};

async function Demos() {
  return <DemoGrid demos={await getDemos()} />;
}

export default function DemosPage() {
  return (
    <>
      <PageHero
        eyebrow="Demos"
        title="See our software in action"
        body="Browse working demos of CRMs, POS, HRMS and other business systems. Open a live demo or ask for a guided walkthrough."
      />
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-16 sm:px-8">
        <Suspense fallback={<div className="h-72 animate-pulse rounded-3xl bg-muted" />}>
          <Demos />
        </Suspense>
      </section>
      <FinalCta />
    </>
  );
}
