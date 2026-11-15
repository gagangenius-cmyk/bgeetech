import { getDemos, getPosts } from "@/lib/db/queries";
import { plans, services, site } from "@/lib/site";

export async function GET() {
  const [posts, demos] = await Promise.all([getPosts(), getDemos()]);
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
    "## Insights",
    ...posts.map((p) => `- [${p.title}](${site.url}/blog/${p.slug}): ${p.excerpt}`),
    "",
    "## Product demos",
    ...demos.map((d) => `- [${d.title}](${site.url}/demos/${d.slug}): ${d.summary}`),
    "",
    "## Contact",
    `- ${site.email}`,
    `- WhatsApp ${site.whatsappDisplay}`,
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
