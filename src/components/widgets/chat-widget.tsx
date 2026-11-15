"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Bot, MessageCircle, Send, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { openLeadPopup } from "@/components/widgets/lead-popup";
import { whatsappUrl } from "@/lib/chat-knowledge";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content: "Hi! I am the bgeetech assistant. Ask me about our services, pricing, booking, or the latest in web, cloud and AI.",
};

const SUGGESTIONS = [
  "What services do you offer?",
  "How much does a session cost?",
  "Next.js or React Native for my app?",
  "How can AI help my business?",
];

export function ChatWidget() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "end" });
  }, [messages, open, reduce]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function send(raw: string) {
    const content = raw.trim();
    if (!content || busy) return;
    setInput("");
    const history: Msg[] = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // never send the greeting; keep the last 12 turns
        body: JSON.stringify({ messages: history.filter((m) => m !== GREETING).slice(-12) }),
        signal: controller.signal,
      });
      if (!res.body) throw new Error("no body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => [...m.slice(0, -1), { role: "assistant", content: acc }]);
      }
      if (!acc.trim()) throw new Error("empty");
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setMessages((m) => [
        ...m.slice(0, -1),
        { role: "assistant", content: "Sorry, I could not answer just now. Please try again or message us on WhatsApp." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={open}
        aria-controls="chat-panel"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-24 right-5 z-40 grid size-14 place-items-center rounded-full bg-brand-strong text-white shadow-xl shadow-black/30 ring-2 ring-accent/70 transition-transform duration-300 hover:scale-110 active:scale-95"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "m"}
            initial={{ rotate: -60, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 60, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
          </motion.span>
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.section
            id="chat-panel"
            role="dialog"
            aria-label="bgeetech assistant"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-40 z-40 flex h-[min(34rem,calc(100dvh-11rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl sm:inset-x-auto sm:right-5 sm:w-[24rem]"
          >
            <header className="flex items-center gap-3 bg-ink px-4 py-3.5 text-white">
              <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-emerald-600 to-amber-400">
                <Bot className="size-5" aria-hidden />
              </span>
              <div className="flex-1">
                <p className="font-display font-bold leading-tight">bgeetech assistant</p>
                <p className="flex items-center gap-1.5 text-xs text-white/70">
                  <span className="size-2 rounded-full bg-emerald-400" aria-hidden /> AI assistant · replies instantly
                </p>
              </div>
            </header>

            <div role="log" aria-live="polite" aria-label="Conversation" className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-2", m.role === "user" && "flex-row-reverse")}>
                  <span
                    className={cn(
                      "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full",
                      m.role === "user" ? "bg-brand/15 text-brand" : "bg-accent/20 text-accent",
                    )}
                    aria-hidden
                  >
                    {m.role === "user" ? <UserRound className="size-4" /> : <Bot className="size-4" />}
                  </span>
                  <p
                    className={cn(
                      "max-w-[82%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      m.role === "user" ? "rounded-tr-sm bg-brand-strong text-white" : "rounded-tl-sm bg-muted",
                    )}
                  >
                    {m.content || (
                      <span className="inline-flex gap-1" aria-label="Assistant is typing">
                        {[0, 1, 2].map((d) => (
                          <span key={d} className="size-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${d * 0.15}s` }} />
                        ))}
                      </span>
                    )}
                  </p>
                </div>
              ))}

              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="min-h-9 rounded-full border border-accent/50 px-3 text-left text-xs font-medium transition-colors hover:bg-accent/10"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="flex gap-2 border-t border-border px-4 pt-2 text-xs">
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="min-h-8 py-1.5 font-medium text-brand hover:underline">
                Talk to a person
              </a>
              <span aria-hidden className="py-1.5 text-border">|</span>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openLeadPopup();
                }}
                className="min-h-8 py-1.5 font-medium text-brand hover:underline"
              >
                Leave your details
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2 p-3 pt-1"
            >
              <label htmlFor="chat-input" className="sr-only">
                Your message
              </label>
              <input
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={1500}
                placeholder="Ask about services or tech..."
                autoComplete="off"
                className="min-h-11 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/15"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send message"
                className="grid size-11 place-items-center rounded-full bg-brand-strong text-white transition-all hover:scale-105 disabled:opacity-40"
              >
                <Send className="size-4" />
              </button>
            </form>
            <p className="px-4 pb-3 text-center text-[11px] text-muted-foreground">
              AI can make mistakes. Check important details with our team.
            </p>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
