import type { Metadata } from "next";
import { BuilderClient } from "@/components/builder/builder-client";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Website builder",
  description: "Design your website in minutes: choose your business type, colours and style, preview it on desktop, tablet and mobile, then pick a plan from $10 a month.",
};

export default function BuilderPage() {
  return (
    <>
      <PageHero
        eyebrow="Website builder"
        title="Design your website in minutes"
        body="Tell us about your business, pick a look, preview it on every device, and choose a plan from $10 a month."
      />
      <BuilderClient />
    </>
  );
}
