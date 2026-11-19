"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Mail, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LeadForm } from "@/components/lead-form";
import { Logo } from "@/components/logo";
import { whatsappUrl } from "@/lib/chat-knowledge";
import { site } from "@/lib/site";

const perks = ["Free first conversation, no obligation", "Senior specialists, never juniors", "Written plan within days"];

export const OPEN_LEAD_EVENT = "bgee:open-lead";
const SKIP_ON = ["/book", "/contact", "/estimate", "/audit", "/builder", "/privacy", "/terms", "/admin"];
const DISMISS_KEY = "bgee_lead_dismissed";
const DONE_KEY = "bgee_lead_done";
const DAY = 86_400_000;

const read = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* storage unavailable: popup may repeat, which is acceptable */
  }
};

export function openLeadPopup() {
  window.dispatchEvent(new Event(OPEN_LEAD_EVENT));
}

/**
 * Lead capture dialog. Never fires on page load (Google penalises intrusive mobile interstitials):
 * it opens on explicit request (any "Get a quote" button), after a delay + engagement,
 * or on desktop exit intent. Shown at most once per visit and snoozed for 7 days when dismissed.
 */
export function LeadPopup() {
  const pathname = usePathname();
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const shown = useRef(false);

  const show = useCallback(() => {
    if (ref.current && !ref.current.open) {
      ref.current.showModal();
      setOpen(true);
    }
  }, []);

  const close = useCallback((snooze = true) => {
    ref.current?.close();
    setOpen(false);
    if (snooze) write(DISMISS_KEY, String(Date.now()));
  }, []);

  // Explicit open from buttons
  useEffect(() => {
    const onOpen = () => show();
    window.addEventListener(OPEN_LEAD_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_LEAD_EVENT, onOpen);
  }, [show]);

  // Automatic triggers
  useEffect(() => {
    if (SKIP_ON.some((p) => pathname.startsWith(p))) return;
    const dismissed = Number(read(DISMISS_KEY) ?? 0);
    if (read(DONE_KEY) || Date.now() - dismissed < 7 * DAY) return;

    const startedAt = Date.now();
    const trigger = () => {
      if (shown.current || document.querySelector("dialog[open]")) return;
      shown.current = true;
      show();
    };

    const timer = window.setTimeout(() => {
      // delay alone is not enough: require some engagement (scrolled a bit)
      if (window.scrollY > 300) trigger();
      else window.addEventListener("scroll", onScrollOnce, { passive: true, once: true });
    }, 30_000);

    const onScrollOnce = () => trigger();
    const onScroll = () => {
      const h = document.documentElement;
      if (h.scrollTop / (h.scrollHeight - h.clientHeight) > 0.6) trigger();
    };
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && Date.now() - startedAt > 10_000) trigger();
    };
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    window.addEventListener("scroll", onScroll, { passive: true });
    if (finePointer) document.addEventListener("mouseleave", onLeave);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScrollOnce);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [pathname, show]);

  return (
    <dialog
      ref={ref}
      aria-label="Request a call back"
      onClose={() => setOpen(false)}
      onCancel={() => write(DISMISS_KEY, String(Date.now()))}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
      className="m-auto w-[calc(100%-1.5rem)] max-w-3xl overflow-visible rounded-3xl border-0 bg-transparent p-0 text-foreground outline-none backdrop:bg-ink/75 backdrop:backdrop-blur-sm"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid max-h-[96dvh] overflow-y-auto overflow-x-hidden rounded-3xl bg-card shadow-2xl md:grid-cols-[1fr_1.05fr] md:overflow-hidden"
          >
            {/* Left: brand + value (hidden on small screens to keep the form on one screen) */}
            <div className="relative isolate hidden flex-col justify-between gap-8 overflow-hidden bg-ink p-8 text-white md:flex">
              <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -left-16 -top-16 size-64 animate-aurora rounded-full bg-blue-600/40 blur-[80px]" />
                <div className="absolute -bottom-20 -right-10 size-64 animate-aurora rounded-full bg-amber-400/25 blur-[80px] [animation-delay:-8s]" />
                <div className="grid-lines absolute inset-0 opacity-70" />
              </div>
              <Logo onDark />
              <div>
                <h2 id="lead-title" className="font-display text-3xl font-extrabold leading-tight tracking-tight">
                  Let&rsquo;s plan your <span className="text-gradient">next project</span>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  Tell us a little about what you need and a specialist will get back to you within one business day.
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  {perks.map((t) => (
                    <li key={t} className="flex items-center gap-3">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-amber-400/20 text-amber-300">
                        <Check className="size-3" aria-hidden />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-1.5 text-xs text-white/60">
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="block hover:text-white">
                  WhatsApp {site.whatsappDisplay}
                </a>
                <a href={`mailto:${site.email}`} className="flex items-center gap-1.5 hover:text-white">
                  <Mail className="size-3.5" aria-hidden /> {site.email}
                </a>
              </div>
            </div>

            {/* Right: compact form */}
            <div className="relative p-5 sm:p-7 md:flex md:flex-col md:justify-center">
              <button
                type="button"
                onClick={() => close()}
                aria-label="Close"
                className="absolute right-2 top-2 grid size-11 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" />
              </button>
              <div className="md:hidden">
                <Logo className="mb-3" />
              </div>
              <h3 className="pr-10 font-display text-xl font-extrabold tracking-tight md:text-2xl">Request a call back</h3>
              <p className="mb-4 mt-1 text-xs text-muted-foreground">Takes less than a minute.</p>
              <LeadForm
                source="popup"
                message="none"
                compact
                submitLabel="Request a call back"
                onSuccess={() => {
                  write(DONE_KEY, "1");
                  window.setTimeout(() => close(false), 2800);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}
