import { getDemos, getPosts } from "@/lib/db/queries";
import { nav, services } from "@/lib/site";

/** Public, read-only index for the Cmd/Ctrl+K palette. */
export async function GET() {
  const [posts, demos] = await Promise.all([getPosts(), getDemos()]);
  return Response.json(
    {
      pages: nav.map((n) => ({ label: n.label, href: n.href })),
      services: services.map((s) => ({ label: s.title, href: `/services/${s.slug}`, hint: `from $${s.from}` })),
      posts: posts.map((p) => ({ label: p.title, href: `/blog/${p.slug}`, hint: p.category })),
      demos: demos.map((d) => ({ label: d.title, href: `/demos/${d.slug}`, hint: d.category })),
    },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
  );
}
