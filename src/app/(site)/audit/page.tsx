import { JsonLd, webPage } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { AuditTool } from "@/components/audit-tool";
import { PageHero } from "@/components/page-hero";

export const metadata = pageMeta({
  title: "Free Website Audit: SEO, Speed, Mobile and Security Check",
  description: "Check any website in seconds. Get a score and the top fixes for SEO, speed, mobile friendliness and security, free and with no sign-up.",
  path: "/audit",
});

export default function AuditPage() {
  return (
    <>
      <JsonLd data={webPage("WebPage", "Free website audit", "Instant SEO, speed, mobile and security check for any public website.", "/audit")} />
      <PageHero
        crumbs={[{ name: "Free website audit", path: "/audit" }]}
        eyebrow="Free tool"
        title="How healthy is your website?"
        body="Enter your address and get a score for SEO, speed, mobile and security in seconds, plus the fixes that matter most."
      />
      <AuditTool />
    </>
  );
}
