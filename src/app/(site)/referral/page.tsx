import { Gift, Handshake, Send } from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { JsonLd, webPage } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Referral Program: Introduce a Business, Get Thanked",
  description: "Know a business that needs a website, app, CRM or AI? Introduce them to BGeetech and we will thank you when they become a client.",
  path: "/referral",
});

const steps = [
  { icon: Send, title: "Introduce", body: "Tell us who might need a website, software or AI help, and how to reach them." },
  { icon: Handshake, title: "We help them", body: "We contact them respectfully, offer the free 30-minute consultation and give honest advice." },
  { icon: Gift, title: "We thank you", body: "If they become a client, we thank you. We agree what that looks like with you directly, in writing, before anything starts." },
];

export default function ReferralPage() {
  return (
    <>
      <JsonLd data={webPage("WebPage", "Referral program", "Introduce a business to BGeetech and get thanked.", "/referral")} />
      <PageHero crumbs={[{ name: "Referral program", path: "/referral" }]} eyebrow="Referral program" title="Know someone who needs a website or software?" body="Introduce them to us. Good work travels by word of mouth, and we want to thank the people who send it our way." />
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
        <Reveal className="space-y-6">
          <ol className="space-y-6">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                  <s.icon className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold">
                    {i + 1}. {s.title}
                  </p>
                  <p className="text-muted-foreground">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
            Please only share contact details of people who would welcome an introduction. We never add anyone to a mailing list without their consent.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <LeadForm source="referral" message="required" defaultService="Referral" defaultMessage="Who are you introducing (name, business, how to reach them) and what might they need?" submitLabel="Send my referral" />
        </Reveal>
      </section>
    </>
  );
}
