import { dbError, guard, json } from "@/lib/admin/api";
import { after } from "next/server";
import { indexNowPaths, modelFor } from "@/lib/admin/resources";
import { submitIndexNow } from "@/lib/indexnow";

type Ctx = { params: Promise<{ resource: string; id: string }> };

async function load({ params }: Ctx) {
  const { resource, id } = await params;
  const m = await modelFor(resource);
  const numeric = Number(id);
  if (!m || !Number.isInteger(numeric)) return null;
  const row = await m.model.findByPk(numeric);
  return row ? { m, row, resource } : null;
}

export async function GET(req: Request, ctx: Ctx) {
  const denied = await guard(req);
  if (denied) return denied;
  try {
    const found = await load(ctx);
    return found ? json(found.row.get({ plain: true })) : json({ error: "Not found" }, 404);
  } catch (e) {
    return dbError(e);
  }
}

export async function PUT(req: Request, ctx: Ctx) {
  const denied = await guard(req);
  if (denied) return denied;
  try {
    const found = await load(ctx);
    if (!found) return json({ error: "Not found" }, 404);
    const { m, row } = found;

    // Partial update: only validated, known keys are applied.
    const parsed = m.def.schema.partial().safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.issues[0]?.message ?? "Invalid data", field: parsed.error.issues[0]?.path[0] }, 400);

    const data = m.def.prepare ? m.def.prepare(parsed.data, false) : parsed.data;
    await row.update(data);
    const plain = row.get({ plain: true });
    after(() => submitIndexNow(indexNowPaths(found.resource, plain)));
    return json(plain);
  } catch (e) {
    return dbError(e);
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  const denied = await guard(req);
  if (denied) return denied;
  try {
    const found = await load(ctx);
    if (!found) return json({ error: "Not found" }, 404);
    if (!found.m.def.canDelete) return json({ error: "Not allowed" }, 405);
    await found.row.destroy();
    return json({ ok: true });
  } catch (e) {
    return dbError(e);
  }
}
