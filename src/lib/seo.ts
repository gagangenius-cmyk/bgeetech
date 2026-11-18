import type { Metadata } from "next";
import { site } from "@/lib/site";

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

type PageMeta = {
  title: string;
  description: string;
  /** Path starting with "/", used for the canonical URL. */
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  /** True when the route has its own opengraph-image file, so no default image should be added. */
  ownOgImage?: boolean;
};

/**
 * One helper so every page gets a self-referencing canonical, matching Open Graph and Twitter tags,
 * and a title that fits the template ("%s | BGeetech") without being duplicated.
 */
export function pageMeta({ title, description, path, image, type = "website", publishedTime, modifiedTime, noindex, ownOgImage }: PageMeta): Metadata {
  const url = absoluteUrl(path);
  // Setting openGraph/twitter on a page replaces the parent's (including its image), so fall back to the site card explicitly.
  const img = image ?? (ownOgImage ? undefined : absoluteUrl("/opengraph-image"));
  return {
    title,
    description,
    alternates: { canonical: path, types: { "application/rss+xml": "/feed.xml" } },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url,
      type,
      siteName: site.name,
      locale: "en_US",
      ...(img ? { images: [{ url: img, width: 1200, height: 630, alt: title }] } : {}),
      ...(type === "article" ? { publishedTime, modifiedTime, authors: [site.name] } : {}),
    },
    twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description, ...(img ? { images: [img] } : {}) },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
