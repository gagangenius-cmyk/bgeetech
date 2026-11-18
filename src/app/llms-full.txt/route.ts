import { buildLlmsFull } from "@/lib/llm-content";

export async function GET() {
  return new Response(await buildLlmsFull(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
