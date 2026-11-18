import type { Metadata } from "next";
import { BookingFlow } from "@/components/booking-flow";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Book a free consultation",
  description: "Book your free 30-minute consultation: choose a topic, pick a time and confirm in under a minute.",
};

export default function BookPage() {
  return (
    <>
      <PageHero eyebrow="Book" title="Book your free consultation" body="Your first 30 minutes are free. Four quick steps, no account needed." />
      <section className="px-5 py-16 sm:px-8">
        <BookingFlow />
      </section>
    </>
  );
}
