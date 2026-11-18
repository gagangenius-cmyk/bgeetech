import { JsonLd, webPage } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { BookingFlow } from "@/components/booking-flow";
import { PageHero } from "@/components/page-hero";

export const metadata = pageMeta({
  title: "Book a Free 30-Minute Consultation",
  description: "Book your free 30-minute video consultation about your website, app, CRM, ERP or AI idea. Pick a time in under a minute, no account needed.",
  path: "/book",
});

export default function BookPage() {
  return (
    <>
      <JsonLd data={webPage("WebPage", "Book a free consultation", "Book a free 30-minute video consultation.", "/book")} />
      <PageHero crumbs={[{"name":"Book a consultation","path":"/book"}]} eyebrow="Book" title="Book your free consultation" body="Your first 30 minutes are free. Four quick steps, no account needed." />
      <section className="px-5 py-16 sm:px-8">
        <BookingFlow />
      </section>
    </>
  );
}
