import { JsonLd, itemList } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { services } from "@/lib/site";
import { PageHero } from "@/components/page-hero";
import { FinalCta } from "@/components/sections/more";
import { ServicesGrid } from "@/components/sections/services-grid";

export const metadata = pageMeta({
  title: "Web, App, CRM, ERP & AI Development Services",
  description: "Websites, web and mobile apps, CRM, ERP, POS, HRMS, e-commerce, AI chatbots, bug fixing, SEO and hosting from one team. First 30 minutes free.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={itemList("BGeetech services", services.map((s) => ({ name: s.title, path: `/services/${s.slug}` })))} />
      <PageHero crumbs={[{"name":"Services","path":"/services"}]}
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
