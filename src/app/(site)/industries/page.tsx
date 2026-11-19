import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ArtImage } from "@/components/art-image";
import { PageHero } from "@/components/page-hero";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { FinalCta } from "@/components/sections/more";
import { serviceArt } from "@/lib/art";
import { JsonLd, itemList, webPage } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { verticals } from "@/lib/verticals";

export const metadata = pageMeta({
  title: "Industries: Software and Websites Built for Your Business",
  description: "Websites, CRM, POS, ERP and AI for real estate, immigration, clinics, restaurants, retail, education, logistics and startups.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <JsonLd data={[webPage("CollectionPage", "Industries", "Software and websites built for specific industries.", "/industries"), itemList("Industries", verticals.map((v) => ({ name: v.name, path: `/industries/${v.slug}` })))]} />
      <PageHero crumbs={[{ name: "Industries", path: "/industries" }]} eyebrow="Industries" title="Built for the way your business works" body="Pick your industry to see the problems we solve, what we build and what it costs." />
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-16 sm:px-8">
        <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {verticals.map((v) => (
            <StaggerItem key={v.slug}>
              <Link href={`/industries/${v.slug}`} className="block h-full">
                <SpotlightCard className="flex h-full flex-col p-0">
                  <div className="aspect-[16/9] overflow-hidden">
                    <ArtImage art={serviceArt(v.artService)} className="transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="flex items-start justify-between gap-2 font-display text-xl font-bold">
                      {v.name}
                      <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand" aria-hidden />
                    </h2>
                    <p className="mt-2 text-muted-foreground">{v.short}</p>
                  </div>
                </SpotlightCard>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
      <FinalCta />
    </>
  );
}
