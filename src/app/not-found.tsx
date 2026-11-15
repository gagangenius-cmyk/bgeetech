import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <PageHero eyebrow="Error 404" title="This page could not be found" body="The link may be broken or the page may have moved.">
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/">
            Back to home <ArrowRight className="size-4" />
          </ButtonLink>
          <ButtonLink href="/services" variant="onDark">
            Browse services
          </ButtonLink>
        </div>
      </PageHero>
    </>
  );
}
