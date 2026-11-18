"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Compass, MessageCircle, Sparkles, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { JujuCharacter, type Mood } from "@/components/juju/character";
import { whatsappUrl } from "@/lib/chat-knowledge";
import { actions, greeting, tipsFor, tourFor, type TourStep } from "@/lib/juju-content";
import { cn } from "@/lib/utils";

const HIDDEN_KEY = "bgee_juju_hidden";
const SEEN_KEY = "bgee_juju_seen";
const EVENT = "bgee:juju";
// Step-by-step flows keep a sticky Back/Continue bar at the bottom on phones, so Juju steps aside there.
const FLOWS = ["/builder", "/book", "/estimate"];

const store = {
  get: (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string | null) => {
    try {
      if (v === null) localStorage.removeItem(k);
      else localStorage.setItem(k, v);
    } catch {
      /* storage unavailable: preference lasts for this page only */
    }
    window.dispatchEvent(new Event(EVENT));
  },
};
const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
};
const session = {
  has: (k: string) => {
    try {
      return sessionStorage.getItem(k) === "1";
    } catch {
      return false;
    }
  },
  mark: (k: string) => {
    try {
      sessionStorage.setItem(k, "1");
    } catch {
      /* ignore */
    }
  },
};

type Mode = "idle" | "tip" | "menu" | "tour";
type Rect = { top: number; left: number; width: number; height: number };

/** Types the message out character by character (instantly for reduced motion). */
function useTyped(full: string, instant: boolean) {
  const [n, setN] = useState(0);
  const [prev, setPrev] = useState(full);
  if (prev !== full) {
    setPrev(full);
    setN(0);
  }
  useEffect(() => {
    if (instant || n >= full.length) return;
    const t = setTimeout(() => setN((v) => v + 2), 18);
    return () => clearTimeout(t);
  }, [n, full, instant]);
  const done = instant || n >= full.length;
  return { shown: done ? full : full.slice(0, n), done };
}

export function Juju() {
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion() ?? false;
  const hidden = useSyncExternalStore(subscribe, () => store.get(HIDDEN_KEY) === "1", () => true);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [mode, setMode] = useState<Mode>("idle");
  const [tipText, setTipText] = useState("");
  const [baseMood, setBaseMood] = useState<Mood>("happy");
  const [steps, setSteps] = useState<TourStep[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [tourPath, setTourPath] = useState("");
  const [rect, setRect] = useState<Rect | null>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [spin, setSpin] = useState(false);

  const modeRef = useRef<Mode>("idle");
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const boxRef = useRef<HTMLDivElement>(null);
  const clicks = useRef<number[]>([]);
  const rectRef = useRef<Rect | null>(null);

  const inTour = mode === "tour" && tourPath === pathname && steps.length > 0;
  const message = inTour ? (steps[stepIdx]?.text ?? "") : mode === "menu" ? "What would you like to do?" : tipText;
  const typed = useTyped(message, reduce);
  const mood: Mood = mode !== "idle" && !typed.done ? "talking" : baseMood;

  useEffect(() => {
    modeRef.current = mode;
    rectRef.current = inTour ? rect : null;
  }, [mode, inTour, rect]);

  /** Show a message. Auto messages fade after a few seconds. */
  const say = useCallback((text: string, m: Mood = "happy") => {
    clearTimeout(hideTimer.current);
    setTipText(text);
    setBaseMood(m);
    setMode("tip");
    hideTimer.current = setTimeout(() => {
      if (modeRef.current === "tip") setMode("idle");
    }, 4500 + text.length * 55);
  }, []);

  const close = useCallback(() => {
    clearTimeout(hideTimer.current);
    setMode("idle");
    setBaseMood("happy");
  }, []);

  // Eyes follow the pointer (or the highlighted section during a tour).
  useEffect(() => {
    if (reduce || hidden) return;
    let raf = 0;
    let pointer = { x: 0, y: 0, set: false };
    const update = () => {
      raf = 0;
      const box = boxRef.current?.getBoundingClientRect();
      if (!box) return;
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height * 0.38;
      const r = rectRef.current;
      const tx = r ? r.left + r.width / 2 : pointer.x;
      const ty = r ? r.top + Math.min(r.height / 2, 200) : pointer.y;
      if (!r && !pointer.set) return;
      const dx = tx - cx;
      const dy = ty - cy;
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 260);
      setLook({ x: (dx / d) * k, y: (dy / d) * k });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY, set: true };
      schedule();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    const interval = setInterval(schedule, 400); // keeps the gaze on the tour target while it scrolls
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", schedule);
      clearInterval(interval);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce, hidden]);

  // Random blinking.
  useEffect(() => {
    if (reduce || hidden) return;
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      t = setTimeout(() => {
        setBlink(true);
        t = setTimeout(() => {
          setBlink(false);
          loop();
        }, 140);
      }, 2200 + Math.random() * 3200);
    };
    loop();
    return () => clearTimeout(t);
  }, [reduce, hidden]);

  // Greets first-time visitors, then gives one helpful tip per page per session.
  useEffect(() => {
    if (hidden) return;
    const first = !store.get(SEEN_KEY);
    const key = `bgee_juju_tip:${pathname}`;
    if (!first && session.has(key)) return;
    const t = setTimeout(
      () => {
        if (modeRef.current !== "idle") return;
        session.mark(key);
        if (first) {
          store.set(SEEN_KEY, "1");
          say(greeting, "wave");
        } else say(tipsFor(pathname)[0], "happy");
      },
      first ? 2200 : 1700,
    );
    return () => clearTimeout(t);
  }, [pathname, hidden, say]);

  // Spotlight: follow the current tour target while it scrolls into view.
  useEffect(() => {
    if (!inTour) return;
    const el = document.querySelector<HTMLElement>(steps[stepIdx]?.selector ?? "");
    if (!el) return;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    let raf = 0;
    let last = "";
    const loop = () => {
      const r = el.getBoundingClientRect();
      const key = `${r.top | 0},${r.left | 0},${r.width | 0},${r.height | 0}`;
      if (key !== last) {
        last = key;
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [inTour, steps, stepIdx, reduce]);

  // Escape closes whatever is open.
  useEffect(() => {
    if (mode === "idle") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, close]);

  function startTour() {
    const found = tourFor(pathname).filter((s) => document.querySelector(s.selector));
    if (found.length === 0) {
      say("I don't have a tour for this page yet, but tap me any time for shortcuts!", "think");
      return;
    }
    clearTimeout(hideTimer.current);
    setSteps(found);
    setStepIdx(0);
    setRect(null);
    setTourPath(pathname);
    setBaseMood("happy");
    setMode("tour");
  }

  function onCharacterClick() {
    const now = Date.now();
    clicks.current = [...clicks.current.filter((t) => now - t < 2200), now];
    if (clicks.current.length >= 5) {
      clicks.current = [];
      setSpin(true);
      setTimeout(() => setSpin(false), 850);
      say("Hehe, that tickles! 😄", "wow");
      return;
    }
    if (mode === "menu" || mode === "tour") close();
    else {
      clearTimeout(hideTimer.current);
      setBaseMood("happy");
      setMode("menu");
    }
  }

  function go(href: string) {
    close();
    router.push(href);
  }

  // Render nothing until hydrated, so the saved "hidden" preference never flashes the wrong state.
  if (!mounted) return null;

  if (hidden) {
    return (
      <button
        type="button"
        onClick={() => {
          store.set(HIDDEN_KEY, null);
          setTimeout(() => say("I'm back! Where would you like to go?", "wave"), 300);
        }}
        aria-label="Bring back Juju, the site guide"
        className={cn(
          "fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-3 z-[44] inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-xs font-semibold shadow-lg transition hover:-translate-y-0.5 lg:bottom-5 lg:left-5",
          FLOWS.some((p) => pathname.startsWith(p)) && "max-lg:hidden",
        )}
      >
        <Sparkles className="size-4 text-accent" aria-hidden /> Juju
      </button>
    );
  }

  const hasTour = tourFor(pathname).length > 0;
  const last = stepIdx >= steps.length - 1;

  return (
    <>
      {/* Spotlight dims the page and rings the section Juju is talking about. */}
      <AnimatePresence>
        {inTour && rect && (
          <motion.div
            aria-hidden
            className="pointer-events-none fixed z-[43] rounded-2xl border-2 border-amber-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, top: rect.top - 10, left: rect.left - 10, width: rect.width + 20, height: rect.height + 20 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 30, opacity: { duration: 0.2 } }}
            style={{ boxShadow: "0 0 0 9999px rgba(5,13,36,0.6), 0 0 40px 6px rgba(230,194,90,0.35)" }}
          />
        )}
      </AnimatePresence>

      <div
        ref={boxRef}
        className={cn(
          "fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] left-3 z-[44] lg:bottom-5 lg:left-5",
          FLOWS.some((p) => pathname.startsWith(p)) && "max-lg:hidden",
        )}
      >
        <AnimatePresence>
          {mode !== "idle" && (mode !== "tour" || inTour) && (
            <motion.div
              key={mode}
              role="dialog"
              aria-label="Juju, your site guide"
              aria-live="polite"
              initial={{ opacity: 0, y: 12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="absolute bottom-full left-0 mb-2 w-[min(21rem,calc(100vw-1.5rem))] origin-bottom-left rounded-3xl rounded-bl-md border border-border bg-card p-4 text-sm shadow-2xl shadow-brand/20"
            >
              <button type="button" onClick={close} aria-label="Close Juju" className="absolute right-1.5 top-1.5 grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-muted">
                <X className="size-4" />
              </button>
              <p className="pr-8 font-semibold leading-relaxed">
                {typed.shown}
                {!typed.done && <span aria-hidden className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-brand align-middle" />}
              </p>

              {mode === "menu" && (
                <div className="mt-3 grid gap-2">
                  {hasTour && (
                    <button type="button" onClick={startTour} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-brand-strong px-4 font-semibold text-white transition active:scale-[0.98]">
                      <Compass className="size-4" aria-hidden /> Show me around this page
                    </button>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    {actions.map((a) => (
                      <button key={a.id} type="button" onClick={() => go(a.href)} className="min-h-11 rounded-2xl border border-border px-3 text-left text-[13px] font-medium leading-tight transition hover:border-brand/60 hover:bg-brand/5 active:scale-[0.98]">
                        {a.label}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        close();
                        window.dispatchEvent(new Event("bgee:open-chat"));
                      }}
                      className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-2xl border border-border text-[13px] font-medium transition hover:border-brand/60 active:scale-[0.98]"
                    >
                      <MessageCircle className="size-4 text-brand" aria-hidden /> Ask the AI
                    </button>
                    <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#25D366] text-[13px] font-semibold text-white transition active:scale-[0.98]">
                      WhatsApp
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      store.set(HIDDEN_KEY, "1");
                    }}
                    className="min-h-9 text-xs font-medium text-muted-foreground underline-offset-4 hover:underline"
                  >
                    Hide Juju
                  </button>
                </div>
              )}

              {mode === "tour" && (
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1" aria-label={`Step ${stepIdx + 1} of ${steps.length}`}>
                    {steps.map((_, i) => (
                      <span key={i} className={cn("h-1.5 rounded-full transition-all", i === stepIdx ? "w-5 bg-accent" : "w-1.5 bg-border")} />
                    ))}
                  </span>
                  <span className="flex gap-1.5">
                    <button type="button" disabled={stepIdx === 0} onClick={() => setStepIdx((i) => i - 1)} aria-label="Previous step" className="grid size-11 place-items-center rounded-full border border-border disabled:opacity-30">
                      <ChevronLeft className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (last) {
                          close();
                          say("That's the tour! Ready to book your free 30-minute call?", "wave");
                        } else setStepIdx((i) => i + 1);
                      }}
                      className="inline-flex min-h-11 items-center gap-1 rounded-full bg-brand-strong px-4 font-semibold text-white"
                    >
                      {last ? "Done" : "Next"} {!last && <ChevronRight className="size-4" />}
                    </button>
                  </span>
                </div>
              )}

              {mode === "tip" && typed.done && (
                <button type="button" onClick={() => setMode("menu")} className="mt-2 min-h-9 text-xs font-semibold text-brand hover:underline">
                  Show me shortcuts
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={onCharacterClick}
          aria-label="Juju, your site guide. Open the help menu"
          aria-expanded={mode === "menu"}
          className="group relative block rounded-3xl outline-offset-4 transition-transform active:scale-95"
        >
          <JujuCharacter mood={mood} look={look} blink={blink} className={cn("h-24 w-auto transition-transform duration-300 group-hover:scale-110 lg:h-28", spin && "juju-spin")} />
        </button>
      </div>
    </>
  );
}
