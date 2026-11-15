import { dbError, guard, json } from "@/lib/admin/api";
import { modelFor, searchWhere } from "@/lib/admin/resources";

type Ctx = { params: Promise<{ resource: string }> };

export async function GET(req: Request, { params }: Ctx) {
  const denied = await guard(req);
  if (denied) return denied;
  const { resource } = await params;
  try {
    const m = await modelFor(resource);
    if (!m) return json({ error: "Not found" }, 404);

    const url = new URL(req.url);
    const q = (url.searchParams.get("q") ?? "").trim().slice(0, 80);
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const size = Math.min(100, Math.max(1, Number(url.searchParams.get("size")) || 20));

    const { rows, count } = await m.model.findAndCountAll({
      where: searchWhere(m.def, q),
      order: m.def.order,
      limit: size,
      offset: (page - 1) * size,
      attributes: { exclude: ["body", "description", "logoPath"] },
    });
    return json({ rows: rows.map((r) => r.get({ plain: true })), total: count, page, size });
  } catch (e) {
    return dbError(e);
  }
}

export async function POST(req: Request, { params }: Ctx) {
  const denied = await guard(req);
  if (denied) return denied;
  const { resource } = await params;
  try {
    const m = await modelFor(resource);
    if (!m) return json({ error: "Not found" }, 404);
    if (!m.def.canCreate) return json({ error: "Not allowed" }, 405);

    const parsed = m.def.schema.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.issues[0]?.message ?? "Invalid data", field: parsed.error.issues[0]?.path[0] }, 400);

    const data = m.def.prepare ? m.def.prepare(parsed.data, true) : parsed.data;
    const row = await m.model.create(data);
    return json(row.get({ plain: true }), 201);
  } catch (e) {
    return dbError(e);
  }
}
