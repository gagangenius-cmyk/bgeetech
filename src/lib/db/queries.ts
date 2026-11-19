import "server-only";
import { connection } from "next/server";
import { Op } from "sequelize";
import { posts as staticPosts } from "@/lib/content";
import { getDb, plain } from "@/lib/db";
import { BOOKING_TIMES } from "@/lib/booking";
import { seedDemos } from "@/lib/db/seed";

export type PostView = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMinutes: number;
  date: string; // ISO
  updated: string; // ISO (last edit)
  body: string; // markdown-lite
  coverUrl: string;
};

export type DemoView = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  url: string;
  demoUser: string;
  demoPass: string;
  imageUrl: string;
  features: string[];
};

type Raw = Record<string, unknown>;
const s = (v: unknown) => (v === null || v === undefined ? "" : String(v));

const toPost = (r: Raw): PostView => ({
  slug: s(r.slug),
  title: s(r.title),
  excerpt: s(r.excerpt),
  category: s(r.category) || "General",
  readMinutes: Number(r.readMinutes) || 3,
  date: r.publishedAt ? new Date(s(r.publishedAt)).toISOString() : new Date(s(r.createdAt)).toISOString(),
  updated: r.updatedAt ? new Date(s(r.updatedAt)).toISOString() : r.publishedAt ? new Date(s(r.publishedAt)).toISOString() : new Date(s(r.createdAt)).toISOString(),
  body: s(r.body),
  coverUrl: s(r.coverUrl),
});

const toDemo = (r: Raw): DemoView => ({
  slug: s(r.slug),
  title: s(r.title),
  category: s(r.category) || "Demo",
  summary: s(r.summary),
  description: s(r.description),
  url: s(r.url),
  demoUser: s(r.demoUser),
  demoPass: s(r.demoPass),
  imageUrl: s(r.imageUrl),
  features: s(r.features).split("\n").map((x) => x.trim()).filter(Boolean),
});

const fallbackPosts = (): PostView[] =>
  staticPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    readMinutes: p.readMinutes,
    date: new Date(p.date).toISOString(),
    updated: new Date(p.date).toISOString(),
    body: p.body.map((b) => (b.h ? `## ${b.h}\n\n${b.p}` : b.p)).join("\n\n"),
    coverUrl: "",
  }));

const fallbackDemos = (): DemoView[] => seedDemos.map((d) => toDemo({ ...d, url: "", demoUser: "", demoPass: "", imageUrl: "" }));

function warn(what: string) {
  console.error(`${what}: database unavailable, using built-in content`);
}

export async function getPosts(opts: { withBody?: boolean } = {}): Promise<PostView[]> {
  await connection(); // request-time only: never touch the database while prerendering
  try {
    const db = await getDb();
    const rows = await db.Post.findAll({
      where: { published: true, publishedAt: { [Op.lte]: new Date() } },
      order: [["publishedAt", "DESC"]],
      attributes: opts.withBody ? undefined : { exclude: ["body"] },
    });
    return rows.map((r) => toPost(plain<Raw>(r)!));
  } catch {
    warn("posts");
    return fallbackPosts().map((p) => (opts.withBody ? p : { ...p, body: "" }));
  }
}

export async function getPost(slug: string): Promise<PostView | null> {
  await connection();
  try {
    const db = await getDb();
    const row = await db.Post.findOne({ where: { slug, published: true, publishedAt: { [Op.lte]: new Date() } } });
    return row ? toPost(plain<Raw>(row)!) : null;
  } catch {
    warn("post");
    return fallbackPosts().find((p) => p.slug === slug) ?? null;
  }
}

/** The next free consultation slot (weekdays, same times the booking page offers), skipping slots already taken. */
export async function getNextFreeSlot(): Promise<{ date: string; time: string } | null> {
  await connection();
  const days: string[] = [];
  const d = new Date();
  while (days.length < 10) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
  }
  let taken = new Set<string>();
  try {
    const db = await getDb();
    const rows = await db.Booking.findAll({
      where: { slotDate: { [Op.in]: days }, [Op.or]: [{ status: { [Op.in]: ["paid", "confirmed"] } }, { status: "pending", createdAt: { [Op.gt]: new Date(Date.now() - 15 * 60_000) } }] },
      attributes: ["slotDate", "slotTime"],
    });
    taken = new Set(rows.map((r) => { const x = plain<{ slotDate: string; slotTime: string }>(r)!; return x.slotDate + " " + x.slotTime; }));
  } catch {
    warn("next slot");
  }
  for (const day of days) for (const time of BOOKING_TIMES) if (!taken.has(day + " " + time)) return { date: day, time };
  return null;
}

export async function getDemos(): Promise<DemoView[]> {
  await connection(); // request-time only: never touch the database while prerendering
  try {
    const db = await getDb();
    const rows = await db.Demo.findAll({ where: { published: true }, order: [["sortOrder", "ASC"], ["id", "ASC"]], attributes: { exclude: ["description"] } });
    return rows.map((r) => toDemo(plain<Raw>(r)!));
  } catch {
    warn("demos");
    return fallbackDemos();
  }
}

export async function getDemo(slug: string): Promise<DemoView | null> {
  await connection();
  try {
    const db = await getDb();
    const row = await db.Demo.findOne({ where: { slug, published: true } });
    return row ? toDemo(plain<Raw>(row)!) : null;
  } catch {
    warn("demo");
    return fallbackDemos().find((d) => d.slug === slug) ?? null;
  }
}
