import type { Metadata } from "next";
import { BookingFlow } from "@/components/booking-flow";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Book a consultation",
  description: "Choose a service, pick a time and book your online consultation in under a minute.",
};

export default function BookPage() {
  return (
    <>
      <PageHero eyebrow="Book" title="Book your consultation" body="Four quick steps. No account needed." />
      <section className="px-5 py-16 sm:px-8">
        <BookingFlow />
      </section>
    </>
  );
}
