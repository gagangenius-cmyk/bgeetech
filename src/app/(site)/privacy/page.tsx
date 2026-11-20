import Link from "next/link";
import { CookieSettingsLink } from "@/components/analytics";
import { PageHero } from "@/components/page-hero";
import { JsonLd, webPage } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Privacy Policy and Cookies (GDPR)",
  description: "How BGeetech collects, uses and protects personal data, your rights under the GDPR, and how to manage cookies.",
  path: "/privacy",
});

const updated = "20 November 2026";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28">
      <h2 id={`${id}-h`} className="font-display text-2xl font-bold text-foreground">
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

const List = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="list-disc space-y-1.5 pl-5">
    {items.map((i, n) => (
      <li key={n}>{i}</li>
    ))}
  </ul>
);

const mail = `mailto:${site.email}?subject=${encodeURIComponent("Privacy request")}`;

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={webPage("WebPage", "Privacy Policy", "How BGeetech handles personal data and cookies.", "/privacy")} />
      <PageHero crumbs={[{ name: "Privacy policy", path: "/privacy" }]} eyebrow="Legal" title="Privacy policy" body={`How we handle your personal data, and the choices and rights you have. Last updated ${updated}.`} />
      <article className="mx-auto max-w-3xl space-y-10 px-5 py-16 leading-relaxed text-muted-foreground sm:px-8">
        <nav aria-label="On this page" className="rounded-2xl border border-border bg-card p-5 text-sm">
          <p className="font-semibold text-foreground">On this page</p>
          <ul className="mt-2 grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {[
              ["who", "Who we are"],
              ["data", "What we collect and why"],
              ["basis", "Our legal bases"],
              ["share", "Who we share data with"],
              ["transfers", "International transfers"],
              ["retention", "How long we keep data"],
              ["rights", "Your rights"],
              ["cookies", "Cookies and tracking"],
              ["security", "Security and children"],
              ["contact", "Contact and complaints"],
            ].map(([id, label]) => (
              <li key={id}>
                <a className="font-medium text-brand hover:underline" href={`#${id}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Section id="who" title="Who we are">
          <p>
            {site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is a web and software services company based in {site.address.label}. We are the controller of the personal data described here. You can reach us at{" "}
            <a className="font-medium text-brand hover:underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
          <p>We serve clients worldwide, including in the European Economic Area (EEA) and the United Kingdom. This policy is written to meet the EU and UK GDPR.</p>
        </Section>

        <Section id="data" title="What we collect and why">
          <List
            items={[
              <>
                <strong className="text-foreground">Enquiries and contact forms.</strong> Name, email, phone (optional) and your message, so we can reply and discuss your project.
              </>,
              <>
                <strong className="text-foreground">Consultation bookings.</strong> Name, email, topic, chosen time and time zone, so we can run the call and send the video link. Paid sessions also involve payment details handled by Stripe.
              </>,
              <>
                <strong className="text-foreground">Website builder orders.</strong> Business details you enter (name, domain, slogan, contact details, logo), your chosen plan and payment status, so we can build and bill your website.
              </>,
              <>
                <strong className="text-foreground">Newsletter.</strong> Your email address, if you subscribe, to send tips and updates. You can unsubscribe at any time.
              </>,
              <>
                <strong className="text-foreground">Free website audit.</strong> The website address you enter is fetched once to produce your score. We do not store the result unless you send us the fix-plan form.
              </>,
              <>
                <strong className="text-foreground">Chat with BGee.</strong> Messages you type or speak are sent to our AI provider to generate an answer. Please do not share sensitive personal data in chat. If you use the microphone, your browser may send the audio to its own speech service.
              </>,
              <>
                <strong className="text-foreground">Technical and usage data.</strong> Only if you allow analytics cookies: pages viewed, device and approximate location, and events such as WhatsApp clicks and form submissions, in aggregated form.
              </>,
            ]}
          />
          <p>We do not sell personal data, and we do not make decisions about you by solely automated means.</p>
        </Section>

        <Section id="basis" title="Our legal bases">
          <List
            items={[
              <>
                <strong className="text-foreground">Consent</strong> (Article 6(1)(a)): contact forms, newsletter, analytics and marketing cookies. You can withdraw consent at any time.
              </>,
              <>
                <strong className="text-foreground">Contract</strong> (Article 6(1)(b)): bookings and orders, and steps you ask for before a contract.
              </>,
              <>
                <strong className="text-foreground">Legitimate interests</strong> (Article 6(1)(f)): keeping the site secure, preventing spam and abuse, and improving our services, balanced against your rights.
              </>,
              <>
                <strong className="text-foreground">Legal obligation</strong> (Article 6(1)(c)): accounting and tax records.
              </>,
            ]}
          />
        </Section>

        <Section id="share" title="Who we share data with">
          <p>We share data only with service providers who process it for us, under agreements that protect it:</p>
          <List
            items={[
              "Stripe, to take payments (we never see or store full card numbers).",
              "Our email provider, to send replies, confirmations and notifications.",
              "Our hosting and database providers, to run the website.",
              "Our AI provider, to answer questions in the BGee chat.",
              "Google, for Tag Manager and Analytics (only with your consent) and for Google Maps (only when you click Show map).",
              "WhatsApp, if you choose to message us there.",
            ]}
          />
          <p>We may also disclose data where the law requires it.</p>
        </Section>

        <Section id="transfers" title="International transfers">
          <p>
            We are based in the United Arab Emirates and our providers operate in several countries, including the United States. When personal data from the EEA or UK is transferred outside those areas, we rely on an adequacy decision or on appropriate safeguards such as the European Commission&apos;s Standard Contractual Clauses.
          </p>
        </Section>

        <Section id="retention" title="How long we keep data">
          <List
            items={[
              "Enquiries that do not become a project: typically up to 24 months after our last contact, then deleted.",
              "Clients: for the length of the work and for as long as accounting and tax law requires.",
              "Newsletter: until you unsubscribe.",
              "Analytics: for the period set in our Google Analytics account, and only if you consented.",
            ]}
          />
        </Section>

        <Section id="rights" title="Your rights">
          <p>Under the GDPR you have the right to:</p>
          <List items={["access the personal data we hold about you", "have inaccurate data corrected", "have your data erased", "restrict or object to our processing", "receive your data in a portable format", "withdraw consent at any time, without affecting earlier processing"]} />
          <p>
            To use any of these rights,{" "}
            <a className="font-medium text-brand hover:underline" href={mail}>
              email us
            </a>
            . We will reply within one month, and we may need to confirm your identity first.
          </p>
        </Section>

        <Section id="cookies" title="Cookies and tracking">
          <p>
            We only set essential cookies and storage by default. Analytics and marketing run only if you opt in, and you can change your choice at any time:{" "}
            <CookieSettingsLink className="font-medium text-brand underline-offset-4 hover:underline" />.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="bg-muted text-foreground">
                <tr>
                  <th className="p-3 font-semibold">Name</th>
                  <th className="p-3 font-semibold">Purpose</th>
                  <th className="p-3 font-semibold">Type</th>
                  <th className="p-3 font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["bgee_consent_v2", "Remembers your cookie choices", "Essential", "Until you change it"],
                  ["bgee_currency, bgee_theme", "Remember your currency and light/dark mode", "Essential", "Until cleared"],
                  ["bgee_guide_*", "Remember whether BGee has greeted you or was hidden", "Essential", "Until cleared"],
                  ["_ga, _ga_*", "Google Analytics: counts visits and pages (via Google Tag Manager)", "Analytics (consent)", "Up to 2 years"],
                  ["Google advertising cookies", "Not used at the moment", "Marketing (consent)", "-"],
                ].map((r) => (
                  <tr key={r[0]}>
                    {r.map((c, i) => (
                      <td key={i} className="p-3 align-top">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>Google Maps loads only when you click &ldquo;Show map&rdquo;. Google may then set its own cookies under its own policy.</p>
        </Section>

        <Section id="security" title="Security and children">
          <p>We use encrypted connections, access controls, rate limiting and regular backups to protect personal data. No system is perfectly secure, and we will tell you and the authorities if a breach affecting you occurs, as the law requires.</p>
          <p>Our services are for businesses and are not directed at children under 16.</p>
        </Section>

        <Section id="contact" title="Contact and complaints">
          <p>
            Questions about this policy or your data? Email{" "}
            <a className="font-medium text-brand hover:underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            . You also have the right to complain to your local data protection authority, for example in the EU or the UK Information Commissioner&apos;s Office.
          </p>
          <p>
            We may update this policy and will change the date above when we do. See also our{" "}
            <Link href="/terms" className="font-medium text-brand hover:underline">
              terms
            </Link>
            .
          </p>
        </Section>
      </article>
    </>
  );
}
