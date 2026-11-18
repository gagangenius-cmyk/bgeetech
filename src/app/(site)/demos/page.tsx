import { JsonLd, webPage } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { Suspense } from "react";
import { DemoGrid } from "@/components/demo-grid";
import { PageHero } from "@/components/page-hero";
import { FinalCta } from "@/components/sections/more";
import { getDemos } from "@/lib/db/queries";

export const metadata = pageMeta({
  title: "Live Demos: CRM, POS, HRMS and ERP Software",
  description: "Try working demos of CRM for real estate and immigration, POS, HRMS, hotel, school and inventory software, then get one tailored to you.",
  path: "/demos",
});

async function Demos() {
  return <DemoGrid demos={await getDemos()} />;
}

export default function DemosPage() {
  return (
    <>
      <JsonLd data={webPage("CollectionPage", "Product demos", "Live demos of CRM, POS, HRMS and business software.", "/demos")} />
      <PageHero crumbs={[{"name":"Demos","path":"/demos"}]}
        eyebrow="Demos"
        title="See our software in action"
        body="Browse working demos of CRMs, POS, HRMS and other business systems. Open a live demo or ask for a guided walkthrough."
      />
      <section data-juju="demo-grid" className="mx-auto max-w-7xl px-5 pb-24 pt-16 sm:px-8">
        <Suspense fallback={<div className="h-72 animate-pulse rounded-3xl bg-muted" />}>
          <Demos />
        </Suspense>
      </section>
      <FinalCta />
    </>
  );
}
