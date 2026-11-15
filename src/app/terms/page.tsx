import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" />
      <article className="mx-auto max-w-3xl space-y-4 px-5 py-16 leading-relaxed text-muted-foreground sm:px-8">
        <p>Placeholder: replace with terms reviewed by a qualified professional before launch.</p>
        <p>It should cover the scope of services, payment, rescheduling and cancellation or refund terms, liability and governing law.</p>
      </article>
    </>
  );
}
