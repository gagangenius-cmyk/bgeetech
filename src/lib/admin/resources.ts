import "server-only";
import { Op, type Model, type ModelStatic } from "sequelize";
import { z } from "zod";
import { getDb, type DB } from "@/lib/db";

const httpUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v) || v.startsWith("/"), "Must be an http(s) URL");

const bool = z.union([z.boolean(), z.literal("true").transform(() => true), z.literal("false").transform(() => false)]);

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);

const readMinutes = (body: string) => Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200));

type Def = {
  model: keyof Pick<DB, "Post" | "Demo" | "Lead" | "Order" | "Booking" | "CareSub">;
  schema: z.ZodObject;
  search: string[];
  order: [string, "ASC" | "DESC"][];
  canCreate: boolean;
  canDelete: boolean;
  /** Derived/normalised fields applied before saving. */
  prepare?: (data: Record<string, unknown>, isNew: boolean) => Record<string, unknown>;
};

export const defs: Record<string, Def> = {
  posts: {
    model: "Post",
    schema: z.object({
      title: z.string().trim().min(2).max(250),
      slug: z.string().trim().max(190).optional(),
      category: z.string().trim().max(60).optional(),
      excerpt: z.string().trim().max(1000).optional(),
      body: z.string().max(100_000).optional(),
      coverUrl: httpUrl.optional(),
      publishedAt: z.string().trim().max(40).optional(),
      published: bool.optional(),
    }),
    search: ["title", "category"],
    order: [["id", "DESC"]],
    canCreate: true,
    canDelete: true,
    prepare: (d, isNew) => {
      const out = { ...d };
      if (isNew || "slug" in d) out.slug = slugify(String(d.slug || d.title || "")) || undefined;
      if (typeof d.body === "string") out.readMinutes = readMinutes(d.body);
      if ("publishedAt" in d) out.publishedAt = d.publishedAt ? new Date(String(d.publishedAt)) : null;
      if (out.published && !out.publishedAt && isNew) out.publishedAt = new Date();
      return out;
    },
  },
  demos: {
    model: "Demo",
    schema: z.object({
      title: z.string().trim().min(2).max(200),
      slug: z.string().trim().max(190).optional(),
      category: z.string().trim().max(80).optional(),
      summary: z.string().trim().max(1000).optional(),
      description: z.string().max(50_000).optional(),
      features: z.string().max(5000).optional(),
      url: httpUrl.optional(),
      demoUser: z.string().trim().max(160).optional(),
      demoPass: z.string().trim().max(160).optional(),
      imageUrl: httpUrl.optional(),
      sortOrder: z.coerce.number().int().min(0).max(9999).optional(),
      published: bool.optional(),
    }),
    search: ["title", "category"],
    order: [["sortOrder", "ASC"], ["id", "ASC"]],
    canCreate: true,
    canDelete: true,
    prepare: (d, isNew) => {
      const out = { ...d };
      if (isNew || "slug" in d) out.slug = slugify(String(d.slug || d.title || "")) || undefined;
      return out;
    },
  },
  leads: {
    model: "Lead",
    schema: z.object({ status: z.enum(["new", "contacted", "won", "lost"]).optional(), notes: z.string().max(5000).optional() }),
    search: ["name", "email", "service", "phone"],
    order: [["id", "DESC"]],
    canCreate: false,
    canDelete: true,
  },
  bookings: {
    model: "Booking",
    schema: z.object({ status: z.enum(["pending", "paid", "confirmed", "cancelled"]).optional(), notes: z.string().max(5000).optional() }),
    search: ["ref", "name", "email", "service"],
    order: [["id", "DESC"]],
    canCreate: false,
    canDelete: false,
  },
  care: {
    model: "CareSub",
    schema: z.object({ status: z.enum(["pending", "active", "cancelled"]).optional(), notes: z.string().max(5000).optional() }),
    search: ["ref", "name", "email", "website"],
    order: [["id", "DESC"]],
    canCreate: false,
    canDelete: false,
  },
  orders: {
    model: "Order",
    schema: z.object({ status: z.enum(["pending", "paid", "confirmed", "cancelled"]).optional(), notes: z.string().max(5000).optional() }),
    search: ["ref", "businessName", "domain", "email"],
    order: [["id", "DESC"]],
    canCreate: false,
    canDelete: false,
  },
};

export async function modelFor(resource: string): Promise<{ def: Def; model: ModelStatic<Model> } | null> {
  const def = defs[resource];
  if (!def) return null;
  const db = await getDb();
  return { def, model: db[def.model] };
}

export const searchWhere = (def: Def, q: string) =>
  q ? { [Op.or]: def.search.map((f) => ({ [f]: { [Op.like]: `%${q.replace(/[%_\\]/g, "\\$&")}%` } })) } : {};

/** Public URL paths to announce via IndexNow after a post or demo is saved (published items only). */
export function indexNowPaths(resource: string, row: Record<string, unknown>): string[] {
  if (!row.published || !row.slug) return [];
  if (resource === "posts") return [`/blog/${row.slug}`, "/blog", "/sitemap.xml"];
  if (resource === "demos") return [`/demos/${row.slug}`, "/demos"];
  return [];
}
