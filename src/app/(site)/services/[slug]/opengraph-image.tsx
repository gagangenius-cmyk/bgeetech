import { ogSize, renderOg } from "@/lib/og";
import { priceText, services } from "@/lib/site";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Service";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  return renderOg({ kicker: s ? `Service  |  ${priceText(s)}` : "Service", title: s?.title ?? "Our services", sub: s?.summary });
}
