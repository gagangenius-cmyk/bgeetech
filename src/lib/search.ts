import "server-only";
import { getDemos, getPosts } from "@/lib/db/queries";
import { industries } from "@/lib/builder/industries";
import { nav, plans, services } from "@/lib/site";
import { team } from "@/lib/team";

export type SearchKind = "Service" | "Insight" | "Demo" | "Team" | "Page" | "Website type";
export type SearchHit = { kind: SearchKind; title: string; href: string; snippet: string; score: number };

const stop = new Set(["the", "a", "an", "and", "or", "of", "for", "to", "in", "on", "is", "we", "our"]);

export const tokenize = (q: string) =>
  q
    .toLowerCase()
    .split(/[^\p{L}\p{N}+#.]+/u)
    .filter((t) => t.length > 1 && !stop.has(t))
    .slice(0, 8);

/** Weighted match: title hits count most, then keywords/category, then body text. */
function score(terms: string[], fields: { title: string; keys?: string; body?: string }) {
  const title = fields.title.toLowerCase();
  const keys = (fields.keys ?? "").toLowerCase();
  const body = (fields.body ?? "").toLowerCase();
  let s = 0;
  for (const t of terms) {
    let hit = 0;
    if (title === t) hit += 12;
    else if (title.startsWith(t)) hit += 8;
    else if (title.includes(t)) hit += 6;
    if (keys.includes(t)) hit += 3;
    if (body.includes(t)) hit += 1;
    if (hit === 0) return 0; // every term must match somewhere (AND search)
    s += hit;
  }
  return s;
}

function snippet(text: string, terms: string[], len = 170) {
  const clean = text.replace(/[#*>\-\[\]`]/g, " ").replace(/\s+/g, " ").trim();
  const lower = clean.toLowerCase();
  const at = terms.map((t) => lower.indexOf(t)).filter((i) => i >= 0).sort((a, b) => a - b)[0] ?? 0;
  const start = Math.max(0, at - 50);
  return (start > 0 ? "…" : "") + clean.slice(start, start + len) + (start + len < clean.length ? "…" : "");
}

export async function searchSite(query: string): Promise<{ terms: string[]; hits: SearchHit[] }> {
  const terms = tokenize(query);
  if (terms.length === 0) return { terms, hits: [] };
  const hits: SearchHit[] = [];
  const push = (h: Omit<SearchHit, "score">, s: number) => s > 0 && hits.push({ ...h, score: s });

  for (const s of services) {
    const body = `${s.summary} ${s.outcomes.join(" ")}`;
    push({ kind: "Service", title: s.title, href: `/services/${s.slug}`, snippet: snippet(body, terms) }, score(terms, { title: s.title, keys: s.slug.replace(/-/g, " "), body }));
  }
  for (const n of nav) push({ kind: "Page", title: n.label, href: n.href, snippet: "" }, score(terms, { title: n.label }));
  push({ kind: "Page", title: "Pricing and plans", href: "/pricing", snippet: plans.map((p) => p.name).join(", ") }, score(terms, { title: "pricing plans cost price", body: plans.map((p) => p.name + " " + p.blurb).join(" ") }));
  push({ kind: "Page", title: "Project cost estimator", href: "/estimate", snippet: "Get an instant planning range for your project." }, score(terms, { title: "estimator estimate quote cost" }));
  push({ kind: "Page", title: "Book a free consultation", href: "/book", snippet: "Choose a service, pick a time and book online." }, score(terms, { title: "book booking consultation appointment" }));
  for (const m of team) push({ kind: "Team", title: m.name, href: "/team", snippet: `${m.role}. ${m.bio}` }, score(terms, { title: m.name, keys: `${m.role} ${m.skills.join(" ")}`, body: m.bio }));
  for (const i of industries) push({ kind: "Website type", title: `${i.label} website`, href: "/builder", snippet: `Design a ${i.label.toLowerCase()} website in the Site Builder.` }, score(terms, { title: i.label, keys: i.group, body: i.services.join(" ") }) * 0.6);

  const [posts, demos] = await Promise.all([getPosts({ withBody: true }), getDemos()]);
  for (const p of posts) push({ kind: "Insight", title: p.title, href: `/blog/${p.slug}`, snippet: snippet(p.excerpt || p.body, terms) }, score(terms, { title: p.title, keys: p.category, body: `${p.excerpt} ${p.body}` }));
  for (const d of demos) push({ kind: "Demo", title: d.title, href: `/demos/${d.slug}`, snippet: snippet(`${d.summary} ${d.features.join(". ")}`, terms) }, score(terms, { title: d.title, keys: d.category, body: `${d.summary} ${d.features.join(" ")}` }));

  hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  return { terms, hits: hits.slice(0, 40) };
}
