import { absoluteUrl } from "@/lib/seo";
import { consultation, plans, site, type Service } from "@/lib/site";
import { team } from "@/lib/team";

type Json = Record<string, unknown>;

/** Renders JSON-LD. "<" is escaped so content can never break out of the script tag. */
export function JsonLd({ data }: { data: Json | Json[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;

/** Social profiles for the `sameAs` property. Add real URLs in `site.socials` (LinkedIn, X, Facebook, Instagram, YouTube...). */
const sameAs = (site as { socials?: string[] }).socials ?? [];

export const organization = (): Json => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: site.name,
  url: site.url,
  logo: { "@type": "ImageObject", url: absoluteUrl("/icons/512"), width: 512, height: 512 },
  image: absoluteUrl("/opengraph-image"),
  description: site.description,
  slogan: site.tagline,
  email: site.email,
  telephone: `+${site.whatsappNumber}`,
  address: { "@type": "PostalAddress", addressLocality: site.address.city, addressCountry: site.address.country },
  areaServed: "Worldwide",
  founder: { "@type": "Person", name: "Karan" },
  knowsAbout: ["Website development", "Web application development", "Mobile app development", "CRM software", "ERP software", "POS software", "HRMS software", "AI chatbots", "Business automation", "Bug fixing and software maintenance", "SEO"],
  contactPoint: [
    { "@type": "ContactPoint", contactType: "sales", email: site.email, telephone: `+${site.whatsappNumber}`, availableLanguage: ["English", "Hindi"] },
  ],
  ...(sameAs.length ? { sameAs } : {}),
});

export const website = (): Json => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": SITE_ID,
  url: site.url,
  name: site.name,
  description: site.description,
  inLanguage: "en",
  publisher: { "@id": ORG_ID },
  potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${site.url}/search?q={search_term_string}` }, "query-input": "required name=search_term_string" },
});

export const breadcrumbs = (items: { name: string; path: string }[]): Json => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
});

export const faqPage = (faqs: { q: string; a: string }[]): Json => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const serviceSchema = (s: Service, faqs?: { q: string; a: string }[]): Json => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${absoluteUrl(`/services/${s.slug}`)}#service`,
  name: s.title,
  description: s.summary,
  url: absoluteUrl(`/services/${s.slug}`),
  serviceType: s.title,
  provider: { "@id": ORG_ID },
  areaServed: "Worldwide",
  isRelatedTo: undefined,
  hasOfferCatalog: { "@type": "OfferCatalog", name: `${s.title}: what you get`, itemListElement: s.outcomes.map((o) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: o } })) },
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    price: s.from,
    ...(s.from === 0 ? { description: `First ${consultation.freeMinutes} minutes free` } : { description: `Starting price ${s.unit}` }),
    availability: "https://schema.org/InStock",
    url: absoluteUrl(`/services/${s.slug}`),
  },
  ...(faqs?.length ? { mainEntityOfPage: { "@type": "WebPage", url: absoluteUrl(`/services/${s.slug}`) } } : {}),
});

export const itemList = (name: string, items: { name: string; path: string }[]): Json => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: absoluteUrl(it.path) })),
});

export const pricingSchema = (): Json => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `${site.name} packages`,
  itemListElement: plans.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Product",
      name: `${p.name} package`,
      description: `${p.blurb} Includes: ${p.features.join(", ")}.`,
      brand: { "@id": ORG_ID },
      ...(p.price !== null ? { offers: { "@type": "Offer", priceCurrency: "USD", price: p.price, url: absoluteUrl("/pricing"), availability: "https://schema.org/InStock" } } : {}),
    },
  })),
});

export const blogPosting = (p: { slug: string; title: string; excerpt: string; date: string; updated?: string; coverUrl?: string; category: string; body?: string }): Json => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": `${absoluteUrl(`/blog/${p.slug}`)}#article`,
  headline: p.title,
  description: p.excerpt,
  datePublished: p.date,
  dateModified: p.updated ?? p.date,
  articleSection: p.category,
  inLanguage: "en",
  image: [p.coverUrl || absoluteUrl("/opengraph-image")],
  mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${p.slug}`) },
  author: { "@id": ORG_ID },
  publisher: { "@id": ORG_ID },
  ...(p.body ? { wordCount: p.body.split(/\s+/).filter(Boolean).length } : {}),
});

export const softwareApplication = (d: { slug: string; title: string; summary: string; category: string; imageUrl?: string; features: string[]; url?: string }): Json => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: d.title,
  description: d.summary,
  applicationCategory: "BusinessApplication",
  applicationSubCategory: d.category,
  operatingSystem: "Web",
  featureList: d.features,
  url: absoluteUrl(`/demos/${d.slug}`),
  ...(d.imageUrl ? { image: d.imageUrl } : {}),
  provider: { "@id": ORG_ID },
  offers: { "@type": "Offer", price: 0, priceCurrency: "USD", description: "Free live demo. Custom versions are quoted per project." },
});

export const teamSchema = (): Json[] =>
  team.map((m) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: m.name,
    jobTitle: m.role,
    description: m.bio,
    worksFor: { "@id": ORG_ID },
    knowsAbout: m.skills,
    url: absoluteUrl("/team"),
  }));

export const webPage = (type: "AboutPage" | "ContactPage" | "CollectionPage" | "WebPage", name: string, description: string, path: string): Json => ({
  "@context": "https://schema.org",
  "@type": type,
  name,
  description,
  url: absoluteUrl(path),
  isPartOf: { "@id": SITE_ID },
  about: { "@id": ORG_ID },
  inLanguage: "en",
});
