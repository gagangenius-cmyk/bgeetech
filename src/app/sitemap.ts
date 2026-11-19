import type { MetadataRoute } from "next";
import { getDemos, getPosts } from "@/lib/db/queries";
import { absoluteUrl } from "@/lib/seo";
import { services } from "@/lib/site";

type Freq = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

// Only list canonical, indexable pages (no search, success, offline or admin URLs).
const pages: { path: string; priority: number; freq: Freq }[] = [
  { path: "/", priority: 1, freq: "weekly" },
  { path: "/services", priority: 0.9, freq: "weekly" },
  { path: "/pricing", priority: 0.9, freq: "weekly" },
  { path: "/builder", priority: 0.8, freq: "monthly" },
  { path: "/demos", priority: 0.8, freq: "weekly" },
  { path: "/book", priority: 0.8, freq: "monthly" },
  { path: "/estimate", priority: 0.7, freq: "monthly" },
  { path: "/audit", priority: 0.8, freq: "monthly" },
  { path: "/roi", priority: 0.7, freq: "monthly" },
  { path: "/referral", priority: 0.5, freq: "yearly" },
  { path: "/industries", priority: 0.8, freq: "monthly" },
  { path: "/faq", priority: 0.7, freq: "monthly" },
  { path: "/blog", priority: 0.7, freq: "daily" },
  { path: "/about", priority: 0.6, freq: "monthly" },
  { path: "/team", priority: 0.6, freq: "monthly" },
  { path: "/contact", priority: 0.6, freq: "yearly" },
  { path: "/privacy", priority: 0.2, freq: "yearly" },
  { path: "/terms", priority: 0.2, freq: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, demos] = await Promise.all([getPosts(), getDemos()]);
  // lastModified is given only where we know it (articles); a fake "now" on every page would teach crawlers to ignore it.
  return [
    ...pages.map((p) => ({ url: absoluteUrl(p.path), changeFrequency: p.freq, priority: p.priority })),
    ...services.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...demos.map((d) => ({ url: absoluteUrl(`/demos/${d.slug}`), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: p.updated, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
