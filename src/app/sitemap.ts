import type { MetadataRoute } from "next";
import { getDemos, getPosts } from "@/lib/db/queries";
import { services, site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, demos] = await Promise.all([getPosts(), getDemos()]);
  const pages = ["", "/services", "/pricing", "/about", "/contact", "/book", "/estimate", "/blog", "/demos", "/builder", "/team", "/privacy", "/terms"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...services.map((s) => ({ url: `${site.url}/services/${s.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.date, changeFrequency: "yearly" as const, priority: 0.6 })),
    ...demos.map((d) => ({ url: `${site.url}/demos/${d.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
