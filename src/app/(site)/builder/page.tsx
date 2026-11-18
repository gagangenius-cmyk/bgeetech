import { JsonLd, webPage } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { BuilderClient } from "@/components/builder/builder-client";
import { PageHero } from "@/components/page-hero";

export const metadata = pageMeta({
  title: "Website Builder: Design Your Site Online",
  description: "Choose your business type, colours and style, preview on desktop, tablet and mobile, then go live from $10 a month.",
  path: "/builder",
});

export default function BuilderPage() {
  return (
    <>
      <JsonLd data={webPage("WebPage", "Website builder", "Design a website online with live previews on every device.", "/builder")} />
      <PageHero crumbs={[{"name":"Website builder","path":"/builder"}]}
        eyebrow="Website builder"
        title="Design your website in minutes"
        body="Tell us about your business, pick a look, preview it on every device, and choose a plan from $10 a month."
      />
      <div data-bgee="wizard">
        <BuilderClient />
      </div>
    </>
  );
}
