import "server-only";
import { adminOrNull } from "@/lib/auth";

export const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

/**
 * Authorises an admin API request. Verifies the signed session (the proxy only checks the cookie exists)
 * and, for mutating methods, that the request came from this site (CSRF defence in depth on top of SameSite=Lax).
 */
export async function guard(req: Request): Promise<Response | null> {
  const session = await adminOrNull();
  if (!session) return json({ error: "Unauthorized" }, 401);

  if (!["GET", "HEAD"].includes(req.method)) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    if (!origin || !host || new URL(origin).host !== host) return json({ error: "Bad origin" }, 403);
    if (!req.headers.get("content-type")?.includes("application/json")) return json({ error: "Expected JSON" }, 415);
  }
  return null;
}

export function dbError(e: unknown) {
  const name = e instanceof Error ? e.name : "Error";
  if (name === "SequelizeUniqueConstraintError") return json({ error: "That slug or value already exists. Choose another." }, 409);
  console.error("admin api error:", name);
  return json({ error: "Database error" }, 500);
}
