import { serviceDetails } from "@/lib/content";
import { getDemos, getPosts } from "@/lib/db/queries";
import { absoluteUrl } from "@/lib/seo";
import { consultation, faqs, packageCatalog, plans, priceText, services, site } from "@/lib/site";
import { team } from "@/lib/team";

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
const planPrice = (p: (typeof plans)[number]) => (p.price === null ? "custom quote" : p.price === 0 ? "free" : `${usd(p.price)}${p.period === "month" ? " per month" : " starting price"}`);

const overview = `${site.name} is a web and software services company. It designs, builds and supports websites, web and mobile apps, CRM, ERP, POS and HRMS software, e-commerce stores, AI chatbots and automations, and offers bug fixing, maintenance, hosting, SEO, UI/UX design and security audits. Technology consulting is one of its products: the first ${consultation.freeMinutes} minutes are free. Everything is delivered online, for clients worldwide.`;

/** /llms.txt: a concise, curated index following the llmstxt.org format (H1, blockquote, H2 link lists). */
export async function buildLlmsTxt(): Promise<string> {
  const [posts, demos] = await Promise.all([getPosts(), getDemos()]);
  return [
    `# ${site.name}`,
    "",
    `> ${site.tagline} ${overview}`,
    "",
    "Key facts: first 30-minute consultation is free (no obligation); starting prices are published and projects get a fixed-scope proposal; payments in USD, AED or INR; contact " + `${site.email} or WhatsApp ${site.whatsappDisplay}.`,
    "",
    "## Services",
    ...services.map((s) => `- [${s.title}](${absoluteUrl(`/services/${s.slug}`)}): ${s.summary} (${priceText(s)})`),
    "",
    "## Pricing and tools",
    `- [Pricing and packages](${absoluteUrl("/pricing")}): ${plans.map((p) => `${p.name} (${planPrice(p)})`).join("; ")}. Includes a custom package calculator.`,
    `- [Website builder](${absoluteUrl("/builder")}): design a website by choosing business type, colours and style, preview on desktop, tablet and mobile; hosting plans from $10 per month.`,
    `- [Project cost estimator](${absoluteUrl("/estimate")}): instant planning range for websites, apps, e-commerce and AI projects.`,
    `- [Free website audit](${absoluteUrl("/audit")}): instant SEO, speed, mobile and security check of any public website.`,
    `- [Book a free consultation](${absoluteUrl("/book")}): 30 minutes free, 60-minute deep-dive available.`,
    "",
    "## Product demos",
    ...demos.map((d) => `- [${d.title}](${absoluteUrl(`/demos/${d.slug}`)}): ${d.summary}`),
    "",
    "## Articles",
    ...posts.map((p) => `- [${p.title}](${absoluteUrl(`/blog/${p.slug}`)}): ${p.excerpt}`),
    "",
    "## Company",
    `- [About](${absoluteUrl("/about")}): who we are and how we work.`,
    `- [Team](${absoluteUrl("/team")}): ${team.map((m) => `${m.name} (${m.role})`).join(", ")}.`,
    `- [FAQ](${absoluteUrl("/faq")}): answers about pricing, process, support and the free consultation.`,
    `- [Contact](${absoluteUrl("/contact")}): ${site.email}, WhatsApp ${site.whatsappDisplay}.`,
    "",
    "## Optional",
    `- [Full content for LLMs](${absoluteUrl("/llms-full.txt")}): all services, packages, FAQs and articles in one Markdown file.`,
    `- [Sitemap](${absoluteUrl("/sitemap.xml")})`,
    `- [RSS feed](${absoluteUrl("/feed.xml")})`,
    "",
  ].join("\n");
}

/** /llms-full.txt: the same site expanded into one Markdown document an LLM can read in a single fetch. */
export async function buildLlmsFull(): Promise<string> {
  const [posts, demos] = await Promise.all([getPosts({ withBody: true }), getDemos()]);
  const out: string[] = [`# ${site.name}: full content`, "", `> ${site.tagline}`, "", overview, "", `Website: ${site.url}`, `Email: ${site.email}`, `WhatsApp: ${site.whatsappDisplay}`, ""];

  out.push("## Free consultation", "", `The first ${consultation.freeMinutes} minutes with an expert are free, with no obligation and no card required. Longer ${consultation.extendedMinutes}-minute deep-dive sessions are ${usd(consultation.extendedUsd)}. Book at ${absoluteUrl("/book")}.`, "");

  out.push("## Services", "");
  for (const s of services) {
    const d = serviceDetails[s.slug];
    out.push(`### ${s.title}`, "", `URL: ${absoluteUrl(`/services/${s.slug}`)}`, `Price: ${priceText(s)}`, "", s.summary, "", "Includes:", ...s.outcomes.map((o) => `- ${o}`), "");
    if (d) {
      out.push("Who it is for:", ...d.audience.map((a) => `- ${a}`), "", "How it works:", ...d.process.map((p, i) => `${i + 1}. ${p.title}: ${p.body}`), "", "Deliverables:", ...d.deliverables.map((x) => `- ${x}`), "");
      if (d.faqs.length) out.push("Common questions:", ...d.faqs.flatMap((f) => [`- Q: ${f.q}`, `  A: ${f.a}`]), "");
    }
  }

  out.push("## Packages", "", ...plans.flatMap((p) => [`### ${p.name} (${planPrice(p)})`, p.blurb, ...p.features.map((f) => `- ${f}`), ""]));
  out.push("## Custom package calculator", "", `At ${absoluteUrl("/pricing")} customers combine projects and monthly services. One-off projects: ${packageCatalog.projects.map((p) => `${p.label} (from ${usd(p.price)})`).join("; ")}. Monthly services: ${packageCatalog.monthly.map((m) => `${m.label} (${usd(m.price)} per month)`).join("; ")}. Bundle discounts: 5% for two projects, 10% for three, 15% for four or more. Prices are starting prices; final pricing is a fixed-scope proposal.`, "");

  out.push("## Frequently asked questions", "", ...faqs.flatMap((f) => [`### ${f.q}`, f.a, ""]));
  out.push("## Team", "", ...team.map((m) => `- ${m.name}, ${m.role}: ${m.bio}`), "");
  out.push("## Product demos", "", ...demos.flatMap((d) => [`### ${d.title}`, `URL: ${absoluteUrl(`/demos/${d.slug}`)}`, d.summary, ...d.features.map((f) => `- ${f}`), ""]));
  out.push("## Articles", "");
  for (const p of posts) out.push(`### ${p.title}`, `URL: ${absoluteUrl(`/blog/${p.slug}`)}`, `Published: ${p.date.slice(0, 10)}`, "", p.body, "");
  return out.join("\n");
}
