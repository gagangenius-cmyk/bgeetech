import Link from "next/link";
import { JsonLd, faqPage, webPage } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { CarePlans } from "@/components/care-plans";
import { PageHero } from "@/components/page-hero";
import { FinalCta } from "@/components/sections/more";
import { SectionHeading } from "@/components/sections/services-grid";

export const metadata = pageMeta({
  title: "Website Care Plans: Updates, Backups, Security and Support",
  description: "Monthly care plans that keep your website secure, fast and online, with backups, updates, monitoring and hours of fixes included.",
  path: "/care",
});

const faqs = [
  { q: "What does a care plan cover?", a: "Software and security updates, backups, uptime monitoring and a monthly allowance of hours for fixes and small changes, depending on the plan." },
  { q: "Can you look after a website you did not build?", a: "Usually yes. We review it first and tell you honestly if anything needs fixing before we take it on." },
  { q: "Can I cancel?", a: "Yes. Plans are billed monthly and you can cancel at any time." },
  { q: "How do I ask for changes?", a: "Sign in to the client portal, open a request and follow the replies from our team. Urgent issues can be marked as urgent." },
];

export default function CarePage() {
  return (
    <>
      <JsonLd data={[webPage("WebPage", "Website care plans", "Monthly care plans for websites and software.", "/care"), faqPage(faqs)]} />
      <PageHero crumbs={[{ name: "Care plans", path: "/care" }]} eyebrow="Care plans" title="Keep your website safe, fast and online" body="Updates, backups, monitoring and hours of fixes every month, with a client portal to ask for help." />
      <CarePlans />
      <section className="mx-auto max-w-4xl px-5 pb-24 sm:px-8">
        <SectionHeading eyebrow="FAQ" title="Care plan questions" />
        <div className="mt-8 divide-y divide-border rounded-3xl border border-border bg-card">
          {faqs.map((f) => (
            <details key={f.q} className="group px-6 py-5">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {f.q}
                <span aria-hidden className="text-brand transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-center text-muted-foreground">
          Already a client?{" "}
          <Link href="/portal" className="font-semibold text-brand hover:underline">
            Sign in to your portal
          </Link>
        </p>
      </section>
      <FinalCta />
    </>
  );
}
