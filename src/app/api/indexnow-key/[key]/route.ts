import { indexNowKey } from "@/lib/indexnow";

// Served at /<key>.txt through a rewrite in next.config.mjs. The file content must equal the key.
export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const configured = indexNowKey();
  if (!configured || key !== configured) return new Response("Not found", { status: 404 });
  return new Response(configured, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
