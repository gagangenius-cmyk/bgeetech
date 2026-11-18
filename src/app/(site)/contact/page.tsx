import { JsonLd, webPage } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { ContactMap } from "@/components/contact-map";
import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { whatsappUrl } from "@/lib/chat-knowledge";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Contact Us: Free 30-Minute Consultation",
  description: "Contact BGeetech in Dubai by form, email or WhatsApp. We reply within one business day, and your first 30-minute consultation is free.",
  path: "/contact",
});

function Item({ icon: Icon, title, children }: { icon: typeof Mail; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
        <Icon className="size-5" aria-hidden />
      </span>
      <div>
        <p className="font-semibold">{title}</p>
        <div className="text-muted-foreground">{children}</div>
      </div>
    </li>
  );
}

export default function ContactPage() {
  return (
    <>
      <JsonLd data={webPage("ContactPage", "Contact BGeetech", "Contact BGeetech by form, email or WhatsApp.", "/contact")} />
      <PageHero crumbs={[{ name: "Contact", path: "/contact" }]} eyebrow="Contact" title="Let's talk about your project" body="Send a message and we will reply within one business day." />
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1.2fr]">
        <Reveal className="space-y-8">
          <ul className="space-y-6">
            <Item icon={Mail} title="Email">
              <a className="hover:text-brand" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </Item>
            <Item icon={MessageCircle} title="WhatsApp">
              <a className="hover:text-brand" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                {site.whatsappDisplay}
              </a>
            </Item>
            <Item icon={MapPin} title="Location">
              {site.address.label}
            </Item>
            <Item icon={Clock} title="Response time">
              Within one business day
            </Item>
          </ul>
          <div data-juju="contact-map">
            <ContactMap label={site.address.label} query={site.address.mapQuery} />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div data-juju="contact-form">
            <LeadForm source="contact" message="required" submitLabel="Send message" />
          </div>
        </Reveal>
      </section>
    </>
  );
}
