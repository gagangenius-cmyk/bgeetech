"use client";

import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Compass, Footprints, Mic, Sparkles, Volume2, VolumeX, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BGeeCharacter, type Mood } from "@/components/bgee/character";
import { whatsappUrl } from "@/lib/chat-knowledge";
import { actions, introFor, tourFor, walk, type TourStep } from "@/lib/bgee-content";
import { VOICE_KEY, canSpeak, speak, stopSpeaking } from "@/lib/speech";
import { cn } from "@/lib/utils";

const HIDDEN_KEY = "bgee_guide_hidden";
const SEEN_KEY = "bgee_guide_seen";
const EVENT = "bgee:guide";
const OFFSCREEN = -280;
// Step-by-step flows keep a sticky Back/Continue bar at the bottom on phones, so BGee steps aside there.
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

type Mode = "idle" | "tip" | "menu" | "tour" | "walk";
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

export function BGee() {
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion() ?? false;
  const hidden = useSyncExternalStore(subscribe, () => store.get(HIDDEN_KEY) === "1", () => true);
  const voice = useSyncExternalStore(subscribe, () => store.get(VOICE_KEY) === "1", () => false);
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
  const [walking, setWalking] = useState(false);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [walkIdx, setWalkIdx] = useState(0);
  const [stationReady, setStationReady] = useState(false);
  const [shift, setShift] = useState(0);

  const x = useMotionValue(OFFSCREEN);
  const modeRef = useRef<Mode>("idle");
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const boxRef = useRef<HTMLDivElement>(null);
  const clicks = useRef<number[]>([]);
  const rectRef = useRef<Rect | null>(null);
  const anim = useRef<{ stop: () => void } | null>(null);
  const moveToken = useRef(0);
  const walkToken = useRef(0);
  const nextRef = useRef<(() => void) | null>(null);
  const lastIntro = useRef("");

  const inTour = mode === "tour" && tourPath === pathname && steps.length > 0;
  const walkActive = mode === "walk";
  const station = walk[walkIdx];
  const message = inTour ? (steps[stepIdx]?.text ?? "") : mode === "menu" ? "What would you like to do?" : walkActive ? (stationReady ? station.text : "") : tipText;
  const bubbleOpen = mode !== "idle" && (mode === "walk" ? stationReady : mode !== "tour" || inTour);
  const typed = useTyped(message, reduce);
  const mood: Mood = bubbleOpen && !typed.done ? "talking" : walking ? "happy" : baseMood;

  useEffect(() => {
    modeRef.current = mode;
    rectRef.current = inTour ? rect : null;
  }, [mode, inTour, rect]);

  // Read messages aloud when the visitor has switched the voice on.
  useEffect(() => {
    if (!voice || !bubbleOpen || !message) return;
    speak(message);
    return () => stopSpeaking();
  }, [voice, bubbleOpen, message]);

  /** Walks BGee along the bottom of the screen to horizontal offset `target` (px from the dock). */
  const moveTo = useCallback(
    (target: number) =>
      new Promise<boolean>((resolve) => {
        anim.current?.stop();
        const token = ++moveToken.current;
        const cur = x.get();
        const dist = Math.abs(target - cur);
        if (reduce || dist < 2) {
          x.set(target);
          setWalking(false);
          setFacing(1);
          resolve(true);
          return;
        }
        setFacing(target > cur ? 1 : -1);
        setWalking(true);
        anim.current = animate(x, target, {
          duration: Math.min(3.4, Math.max(0.6, dist / 230)),
          ease: "easeInOut",
          onComplete: () => {
            const current = token === moveToken.current;
            if (current) {
              setWalking(false);
              setFacing(1);
            }
            resolve(current);
          },
        });
      }),
    [x, reduce],
  );

  /** Show a message. Auto messages fade after a few seconds. */
  const say = useCallback((text: string, m: Mood = "happy") => {
    clearTimeout(hideTimer.current);
    setShift(0);
    setTipText(text);
    setBaseMood(m);
    setMode("tip");
    hideTimer.current = setTimeout(() => {
      if (modeRef.current === "tip") setMode("idle");
    }, 6500 + text.length * 55);
  }, []);

  /** Closes whatever is open (and cancels a walk in progress, sending BGee home). */
  const close = useCallback(() => {
    clearTimeout(hideTimer.current);
    walkToken.current++;
    nextRef.current?.();
    setMode("idle");
    setBaseMood("happy");
    setStationReady(false);
    setShift(0);
    if (Math.abs(x.get()) > 2) void moveTo(0);
  }, [x, moveTo]);

  /** The complete website introduction: stroll left to right, stopping at each part of the site. */
  const runWalk = useCallback(async () => {
    const token = ++walkToken.current;
    const alive = () => walkToken.current === token;
    clearTimeout(hideTimer.current);
    setBaseMood("happy");
    setMode("walk");
    const box = boxRef.current;
    const width = box?.offsetWidth ?? 90;
    const margin = box ? parseFloat(getComputedStyle(box).left) || 12 : 12;
    const bubbleW = Math.min(336, window.innerWidth - 24);
    for (let i = 0; i < walk.length; i++) {
      if (!alive()) return;
      setWalkIdx(i);
      setStationReady(false);
      const avail = Math.max(0, window.innerWidth - width - margin * 2);
      const target = (avail * i) / (walk.length - 1);
      const arrived = await moveTo(target);
      if (!alive() || !arrived) return;
      const r = box?.getBoundingClientRect();
      if (r) setShift(Math.min(Math.max(r.left, 12), window.innerWidth - 12 - bubbleW) - r.left);
      setBaseMood(i === 0 ? "wave" : "happy");
      setStationReady(true);
      await new Promise<void>((res) => {
        const timer = setTimeout(res, 5200 + walk[i].text.length * 55);
        nextRef.current = () => {
          clearTimeout(timer);
          res();
        };
      });
      nextRef.current = null;
    }
    if (!alive()) return;
    setStationReady(false);
    setShift(0);
    await moveTo(0);
    if (!alive()) return;
    say("That's everything! Ask me anything, or book your free 30-minute call.", "wave");
  }, [moveTo, say]);

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

  // On every page: BGee walks in from the left and introduces it. First-time visitors get the full walk.
  useEffect(() => {
    if (!mounted || hidden) return;
    const first = !store.get(SEEN_KEY);
    const t = setTimeout(
      async () => {
        if (modeRef.current !== "idle" && modeRef.current !== "tip") return;
        if (first) {
          store.set(SEEN_KEY, "1");
          lastIntro.current = pathname;
          x.set(reduce ? 0 : OFFSCREEN);
          await moveTo(0);
          void runWalk();
          return;
        }
        if (lastIntro.current === pathname) {
          if (Math.abs(x.get()) > 2) void moveTo(0);
          return;
        }
        lastIntro.current = pathname;
        const h1 = document.querySelector("h1")?.textContent?.trim() ?? "";
        x.set(reduce ? 0 : OFFSCREEN);
        const arrived = await moveTo(0);
        if (arrived && (modeRef.current === "idle" || modeRef.current === "tip")) say(introFor(pathname, h1), "wave");
      },
      first ? 1600 : 900,
    );
    return () => clearTimeout(t);
  }, [pathname, mounted, hidden, reduce, x, moveTo, runWalk, say]);

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

  // Escape closes whatever is open; opening the chat panel tucks the bubble away.
  useEffect(() => {
    if (mode === "idle") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, close]);
  useEffect(() => {
    window.addEventListener("bgee:open-chat", close);
    return () => window.removeEventListener("bgee:open-chat", close);
  }, [close]);

  function startTour() {
    const found = tourFor(pathname).filter((s) => document.querySelector(s.selector));
    if (found.length === 0) {
      say("I don't have a section tour for this page yet, but I can walk you through the whole site!", "think");
      return;
    }
    clearTimeout(hideTimer.current);
    setShift(0);
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
    if (mode !== "idle" && mode !== "tip") close();
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

  const inFlow = FLOWS.some((p) => pathname.startsWith(p));

  if (hidden) {
    return (
      <button
        type="button"
        onClick={() => {
          store.set(HIDDEN_KEY, null);
          lastIntro.current = "";
        }}
        aria-label="Bring back BGee, the site guide"
        className={cn(
          "fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-3 z-[44] inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-xs font-semibold shadow-lg transition hover:-translate-y-0.5 lg:bottom-5 lg:left-5",
          inFlow && "max-lg:hidden",
        )}
      >
        <Sparkles className="size-4 text-accent" aria-hidden /> BGee
      </button>
    );
  }

  const hasTour = tourFor(pathname).length > 0;
  const last = stepIdx >= steps.length - 1;
  const speechOk = canSpeak();

  return (
    <>
      {/* Spotlight dims the page and rings the section BGee is talking about. */}
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

      <motion.div
        ref={boxRef}
        style={{ x }}
        className={cn("fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] left-3 z-[44] lg:bottom-5 lg:left-5", inFlow && "max-lg:hidden")}
      >
        <AnimatePresence>
          {bubbleOpen && (
            <motion.div
              key={mode}
              role="dialog"
              aria-label="BGee, your site guide"
              aria-live="polite"
              initial={{ opacity: 0, y: 12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              style={{ left: shift }}
              className="absolute bottom-full mb-2 w-[min(21rem,calc(100vw-1.5rem))] origin-bottom rounded-3xl border border-border bg-card p-4 text-sm shadow-2xl shadow-brand/20"
            >
              {speechOk && (
                <button
                  type="button"
                  onClick={() => {
                    store.set(VOICE_KEY, voice ? null : "1");
                    if (voice) stopSpeaking();
                  }}
                  aria-label={voice ? "Turn BGee's voice off" : "Turn BGee's voice on"}
                  aria-pressed={voice}
                  className="absolute right-11 top-1.5 grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-muted"
                >
                  {voice ? <Volume2 className="size-4 text-brand" /> : <VolumeX className="size-4" />}
                </button>
              )}
              <button type="button" onClick={close} aria-label="Close BGee" className="absolute right-1.5 top-1.5 grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-muted">
                <X className="size-4" />
              </button>
              {walkActive && <p className="pr-20 text-[11px] font-bold uppercase tracking-wider text-brand">{station.title}</p>}
              <p className={cn("pr-20 font-semibold leading-relaxed", walkActive && "mt-1")}>
                {typed.shown}
                {!typed.done && <span aria-hidden className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-brand align-middle" />}
              </p>

              {mode === "menu" && (
                <div className="mt-3 grid gap-2">
                  <button type="button" onClick={() => void runWalk()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-brand-strong px-4 font-semibold text-white transition active:scale-[0.98]">
                    <Footprints className="size-4" aria-hidden /> Walk me through the site
                  </button>
                  {hasTour && (
                    <button type="button" onClick={startTour} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-brand/40 px-4 text-[13px] font-semibold text-brand transition active:scale-[0.98]">
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
                        window.dispatchEvent(new CustomEvent("bgee:open-chat", { detail: { listen: false } }));
                      }}
                      className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-2xl border border-border text-[13px] font-medium transition hover:border-brand/60 active:scale-[0.98]"
                    >
                      <Sparkles className="size-4 text-brand" aria-hidden /> Ask me anything
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        close();
                        window.dispatchEvent(new CustomEvent("bgee:open-chat", { detail: { listen: true } }));
                      }}
                      className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-2xl border border-border text-[13px] font-medium transition hover:border-brand/60 active:scale-[0.98]"
                    >
                      <Mic className="size-4 text-brand" aria-hidden /> Speak to me
                    </button>
                  </div>
                  <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#25D366] text-[13px] font-semibold text-white transition active:scale-[0.98]">
                    WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      store.set(HIDDEN_KEY, "1");
                    }}
                    className="min-h-9 text-xs font-medium text-muted-foreground underline-offset-4 hover:underline"
                  >
                    Hide BGee
                  </button>
                </div>
              )}

              {mode === "walk" && (
                <div className="mt-3 space-y-2.5">
                  <span className="flex items-center gap-1" aria-label={`Stop ${walkIdx + 1} of ${walk.length}`}>
                    {walk.map((_, i) => (
                      <span key={i} className={cn("h-1.5 rounded-full transition-all", i === walkIdx ? "w-5 bg-accent" : "w-1.5 bg-border")} />
                    ))}
                  </span>
                  <div className="flex items-center gap-2">
                    {station.href && (
                      <button type="button" onClick={() => go(station.href!)} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-brand-strong px-4 text-[13px] font-semibold text-white active:scale-[0.98]">
                        {station.cta}
                      </button>
                    )}
                    <button type="button" onClick={() => nextRef.current?.()} className="inline-flex min-h-11 items-center gap-1 rounded-full border border-border px-4 text-[13px] font-semibold active:scale-[0.98]">
                      {walkIdx === walk.length - 1 ? "Finish" : "Next"} <ChevronRight className="size-4" />
                    </button>
                    <button type="button" onClick={close} className="min-h-11 px-2 text-xs font-medium text-muted-foreground hover:underline">
                      Stop
                    </button>
                  </div>
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
          aria-label="BGee, your site guide. Open the help menu"
          aria-expanded={mode === "menu"}
          className="group relative block rounded-3xl outline-offset-4 transition-transform active:scale-95"
        >
          <span className="block" style={{ transform: `scaleX(${facing})` }}>
            <BGeeCharacter
              mood={mood}
              look={walking ? { x: 0.85, y: 0 } : { x: facing === -1 ? -look.x : look.x, y: look.y }}
              blink={blink}
              walking={walking}
              className={cn("h-24 w-auto transition-transform duration-300 group-hover:scale-110 lg:h-28", spin && "bgee-spin")}
            />
          </span>
        </button>
      </motion.div>
    </>
  );
}
