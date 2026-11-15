import type { Metadata } from "next";
import { Estimator } from "@/components/estimator";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Project cost estimator",
  description: "Get an instant planning range for your website, app, e-commerce or AI project, then request a detailed quote.",
};

export default function EstimatePage() {
  return (
    <>
      <PageHero
        eyebrow="Estimator"
        title="What will your project cost?"
        body="Answer four quick questions for an instant planning range, then request a detailed quote."
      />
      <Estimator />
    </>
  );
}
