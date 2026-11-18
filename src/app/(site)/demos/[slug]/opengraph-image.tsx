import { getDemo } from "@/lib/db/queries";
import { ogSize, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Product demo";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await getDemo(slug);
  return renderOg({ kicker: d ? `Live demo  |  ${d.category}` : "Product demo", title: d?.title ?? "Product demos", sub: d?.summary });
}
