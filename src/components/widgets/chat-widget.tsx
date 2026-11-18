"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Bot, Mic, MicOff, Send, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { openLeadPopup } from "@/components/widgets/lead-popup";
import { whatsappUrl } from "@/lib/chat-knowledge";
import { createRecognition, speak, voiceOn, type Recognition } from "@/lib/speech";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content: "Hi, I'm BGee! Ask me about our services, pricing, booking, or the latest in web, cloud and AI.",
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
  const toggleMicRef = useRef<() => void>(() => {});
  const abortRef = useRef<AbortController | null>(null);
  const recRef = useRef<Recognition | null>(null);
  const [listening, setListening] = useState(false);
  const [micOk, setMicOk] = useState(false);
  const [micError, setMicError] = useState("");

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

  useEffect(() => {
    const t = setTimeout(() => setMicOk(createRecognition() !== null), 0);
    return () => {
      clearTimeout(t);
      abortRef.current?.abort();
      recRef.current?.abort();
    };
  }, []);

  function toggleMic() {
    setMicError("");
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const rec = createRecognition();
    if (!rec) return;
    recRef.current = rec;
    rec.onresult = (e) => {
      const text = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(" ");
      setInput(text);
      if (Array.from(e.results).every((r) => r.isFinal) && text.trim()) void send(text);
    };
    rec.onerror = (e) => setMicError(e.error === "not-allowed" ? "Microphone blocked. Allow it in your browser to speak to BGee." : "I could not hear you. Please try again.");
    rec.onend = () => setListening(false);
    try {
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }

  // Lets other parts of the site (e.g. the hero) open the assistant.
  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true);
      if ((e as CustomEvent<{ listen?: boolean }>).detail?.listen) setTimeout(() => toggleMicRef.current(), 450);
    };
    window.addEventListener("bgee:open-chat", onOpen);
    return () => window.removeEventListener("bgee:open-chat", onOpen);
  }, []);

  useEffect(() => {
    toggleMicRef.current = toggleMic;
  });

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
      if (voiceOn()) speak(acc);
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
      <AnimatePresence>
        {open && (
          <motion.section
            id="chat-panel"
            role="dialog"
            aria-label="Ask BGee"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-[49] flex h-[min(38rem,calc(100dvh-9rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl sm:inset-x-auto sm:left-5 sm:w-[24rem] lg:bottom-40 lg:z-[46] lg:h-[min(34rem,calc(100dvh-11rem))]"
          >
            <header className="flex items-center gap-3 bg-ink px-4 py-3.5 text-white">
              <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-amber-400">
                <Bot className="size-5" aria-hidden />
              </span>
              <div className="flex-1">
                <p className="font-display font-bold leading-tight">BGee, your AI guide</p>
                <p className="flex items-center gap-1.5 text-xs text-white/70">
                  <span className="size-2 rounded-full bg-blue-400" aria-hidden /> AI assistant · replies instantly
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="grid size-11 place-items-center rounded-full hover:bg-white/10">
                <X className="size-5" />
              </button>
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
                      <span className="inline-flex gap-1" aria-label="BGee is typing">
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
                      className="min-h-11 rounded-full border border-accent/50 px-4 text-left text-sm font-medium transition-colors hover:bg-accent/10 active:bg-accent/10"
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
                placeholder={listening ? "Listening..." : "Ask BGee about services or tech..."}
                autoComplete="off"
                className="min-h-11 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/15"
              />
              {micOk && (
                <button
                  type="button"
                  onClick={toggleMic}
                  aria-label={listening ? "Stop listening" : "Speak your question"}
                  aria-pressed={listening}
                  className={cn("grid size-11 place-items-center rounded-full border border-border transition-all hover:border-brand/60", listening && "animate-pulse border-red-500 bg-red-500/10 text-red-600")}
                >
                  {listening ? <MicOff className="size-4" /> : <Mic className="size-4 text-brand" />}
                </button>
              )}
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send message"
                className="grid size-11 place-items-center rounded-full bg-brand-strong text-white transition-all hover:scale-105 disabled:opacity-40"
              >
                <Send className="size-4" />
              </button>
            </form>
            {micError && (
              <p role="alert" className="px-4 pb-1 text-center text-xs text-red-600">
                {micError}
              </p>
            )}
            <p className="px-4 pb-3 text-center text-[11px] text-muted-foreground">
              AI can make mistakes. Check important details with our team.
            </p>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
