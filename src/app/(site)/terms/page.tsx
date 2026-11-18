import { JsonLd, webPage } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/page-hero";

export const metadata = pageMeta({
  title: "Terms of Service",
  description: "The terms that apply when you use BGeetech websites and services.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <JsonLd data={webPage("WebPage", "Terms of Service", "Terms for using BGeetech services.", "/terms")} />
      <PageHero crumbs={[{"name":"Terms of service","path":"/terms"}]} eyebrow="Legal" title="Terms of Service" />
      <article className="mx-auto max-w-3xl space-y-4 px-5 py-16 leading-relaxed text-muted-foreground sm:px-8">
        <p>Placeholder: replace with terms reviewed by a qualified professional before launch.</p>
        <p>It should cover the scope of services, payment, rescheduling and cancellation or refund terms, liability and governing law.</p>
      </article>
    </>
  );
}
