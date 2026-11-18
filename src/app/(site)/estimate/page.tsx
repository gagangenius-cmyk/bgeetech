import { JsonLd, webPage } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { Estimator } from "@/components/estimator";
import { PageHero } from "@/components/page-hero";

export const metadata = pageMeta({
  title: "Project Cost Estimator: Website and App Pricing",
  description: "Get an instant planning price range for a website, web app, e-commerce store, mobile app or AI project, then request a detailed quote.",
  path: "/estimate",
});

export default function EstimatePage() {
  return (
    <>
      <JsonLd data={webPage("WebPage", "Project cost estimator", "Instant planning price range for websites, apps and AI projects.", "/estimate")} />
      <PageHero crumbs={[{"name":"Cost estimator","path":"/estimate"}]}
        eyebrow="Estimator"
        title="What will your project cost?"
        body="Answer four quick questions for an instant planning range, then request a detailed quote."
      />
      <Estimator />
    </>
  );
}
