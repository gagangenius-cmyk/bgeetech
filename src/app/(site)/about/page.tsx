import { JsonLd, webPage } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { Eye, Handshake, Rocket } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { FinalCta, Stats } from "@/components/sections/more";

export const metadata = pageMeta({
  title: "About Us: Web & Software Services Company",
  description: "BGeetech designs, builds and supports websites, apps, CRM, ERP and AI solutions for businesses worldwide. Learn how we work.",
  path: "/about",
});

const values = [
  { icon: Eye, title: "Clarity first", body: "Plain language, clear trade-offs and written outcomes you can share with your team." },
  { icon: Rocket, title: "Built to ship", body: "Advice grounded in delivery experience, not slideware. We focus on what moves the product." },
  { icon: Handshake, title: "Partnership", body: "We work alongside your engineers, designers and leaders, and we are honest when something is not worth doing." },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={webPage("AboutPage", "About BGeetech", site.description, "/about")} />
      <PageHero crumbs={[{"name":"About","path":"/about"}]}
        eyebrow="About"
        title="A web and software company for growing businesses"
        body="BGeetech designs, builds and supports websites, apps, CRM, ERP and AI solutions, and offers your first 30-minute consultation free."
      />
      <Stats />
      <section className="mx-auto max-w-3xl px-5 pt-24 sm:px-8">
        <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Our story</h2>
        <div aria-hidden className="gold-rule mt-5 max-w-24" />
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          We started BGeetech to make professional technology simple and affordable for every business, from a neighbourhood barber to a growing enterprise. Many companies struggle to find one trustworthy team that can design, build and look after their software.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          So we bring it all together: websites, mobile and web apps, CRM, ERP, POS, HRMS, AI and automation, plus bug fixing and care plans after launch. Every relationship begins with a free 30-minute conversation, and every project with a fixed scope and price you approve first.
        </p>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <Stagger className="grid gap-5 md:grid-cols-3">
          {values.map((v) => (
            <StaggerItem key={v.title}>
              <SpotlightCard className="h-full">
                <span className="grid size-12 place-items-center rounded-xl bg-brand/10 text-brand">
                  <v.icon className="size-6" aria-hidden />
                </span>
                <h2 className="mt-5 font-display text-xl font-bold">{v.title}</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">{v.body}</p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
      <FinalCta />
    </>
  );
}
