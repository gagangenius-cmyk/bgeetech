import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { localAnswer, systemPrompt } from "@/lib/chat-knowledge";
import { rateLimit } from "@/lib/leads";

export const maxDuration = 60;

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(1500),
      }),
    )
    .min(1)
    .max(14),
});

const text = (s: string, status = 200) =>
  new Response(s, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`chat:${ip}`, 25, 10 * 60_000)) {
    return text("You are sending messages quickly. Please wait a few minutes or message us on WhatsApp.", 429);
  }

  let parsed;
  try {
    parsed = bodySchema.safeParse(await req.json());
  } catch {
    return text("Invalid request.", 400);
  }
  if (!parsed.success || parsed.data.messages.at(-1)?.role !== "user") return text("Invalid request.", 400);
  const { messages } = parsed.data;

  // No credentials configured: fall back to scripted answers so the widget still works.
  if (!process.env.ANTHROPIC_API_KEY) {
    return text(localAnswer(messages.at(-1)!.content));
  }

  const client = new Anthropic();
  const model = process.env.CHAT_MODEL || "claude-opus-5-5";
  const webSearch = process.env.CHAT_WEB_SEARCH === "true";

  const encoder = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      const send = (s: string) => controller.enqueue(encoder.encode(s));
      try {
        const stream = client.beta.messages.stream({
          model,
          max_tokens: 1024,
          system: systemPrompt(),
          messages,
          output_config: { effort: "low" },
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          ...(webSearch ? { tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 3 }] } : {}),
        });

        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            send(event.delta.text);
          }
        }

        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          send("I am not able to help with that. Please message us on WhatsApp and a person will assist.");
        }
      } catch (err) {
        // Never expose provider details to visitors; keep a minimal server-side signal without user content.
        console.error("chat error:", err instanceof Anthropic.APIError ? `${err.status} ${err.name}` : "unexpected");
        send("Sorry, I could not answer just now. Please try again, or message us on WhatsApp.");
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
  });
}
