import type { Metadata } from "next";
import { Clock, Mail } from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with BGeetech.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk about your project" body="Send a message and we will reply within one business day." />
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand"><Mail className="size-5" aria-hidden /></span>
              <div>
                <p className="font-semibold">Email</p>
                <a className="text-muted-foreground hover:text-brand" href={`mailto:${site.email}`}>{site.email}</a>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand"><Clock className="size-5" aria-hidden /></span>
              <div>
                <p className="font-semibold">Response time</p>
                <p className="text-muted-foreground">Within one business day</p>
              </div>
            </li>
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <LeadForm source="contact" message="required" submitLabel="Send message" />
        </Reveal>
      </section>
    </>
  );
}
