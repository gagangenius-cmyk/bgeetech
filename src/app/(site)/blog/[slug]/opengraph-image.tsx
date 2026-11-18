import { getPost } from "@/lib/db/queries";
import { ogSize, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Article";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getPost(slug);
  return renderOg({ kicker: p ? `Insights  |  ${p.category}` : "Insights", title: p?.title ?? "BGeetech insights", sub: p?.excerpt });
}
