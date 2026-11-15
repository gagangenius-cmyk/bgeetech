import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <article className="mx-auto max-w-3xl space-y-4 px-5 py-16 leading-relaxed text-muted-foreground sm:px-8">
        <p>Placeholder: replace with a privacy policy reviewed by a qualified professional before launch.</p>
        <p>It should describe what data is collected (contact details, booking details, payment status), why, retention periods, processors (for example Stripe and email providers), and how to exercise access and deletion rights.</p>
      </article>
    </>
  );
}
