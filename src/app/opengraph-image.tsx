import { ogSize, renderOg } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ kicker: "Web & software services", title: site.tagline, sub: "Websites, apps, CRM, ERP, AI and ongoing support from one team." });
}
