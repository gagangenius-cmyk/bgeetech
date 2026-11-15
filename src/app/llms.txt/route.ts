import { plans, services, site } from "@/lib/site";

export function GET() {
  const body = [
    `# ${site.name}`,
    `> ${site.description}`,
    "",
    "## Services",
    ...services.map((s) => `- [${s.title}](${site.url}/services/${s.slug}): ${s.summary} From $${s.from} (${s.duration}).`),
    "",
    "## Pricing",
    ...plans.map((p) => `- ${p.name}: $${p.price}. ${p.blurb}`),
    "",
    "## Contact",
    `- ${site.email}`,
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
