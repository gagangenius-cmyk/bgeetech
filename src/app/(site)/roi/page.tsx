import { JsonLd, webPage } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/page-hero";
import { RoiCalculator } from "@/components/roi-calculator";

export const metadata = pageMeta({
  title: "ROI Calculator: How Much Could Automation Save You?",
  description: "Estimate the hours and money your business could save by automating repetitive work with a CRM, ERP, AI assistant or custom software.",
  path: "/roi",
});

export default function RoiPage() {
  return (
    <>
      <JsonLd data={webPage("WebPage", "Automation ROI calculator", "Estimate time and cost saved by automating repetitive business tasks.", "/roi")} />
      <PageHero crumbs={[{ name: "ROI calculator", path: "/roi" }]} eyebrow="Calculator" title="How much could you save?" body="Tell us where your team loses time and see what automation could give back, and how fast it pays for itself." />
      <RoiCalculator />
    </>
  );
}
