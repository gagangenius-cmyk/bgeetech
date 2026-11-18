import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { FinalCta } from "@/components/sections/more";
import { ServicesGrid } from "@/components/sections/services-grid";

export const metadata: Metadata = {
  title: "Services",
  description: "Websites, web and mobile apps, CRM, ERP, POS, HRMS, e-commerce, AI, automation, bug fixing, SEO, hosting and security.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything your business needs online"
        body="Websites, apps, CRM, ERP, AI and ongoing support, all from one team. Every product shows its starting price, and your first 30-minute consultation is free."
      />
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <ServicesGrid />
      </section>
      <FinalCta />
    </>
  );
}
