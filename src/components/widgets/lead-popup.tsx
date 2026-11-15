"use client";

import { AnimatePresence, motion } from "motion/react";
import { Sparkles, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LeadForm } from "@/components/lead-form";

export const OPEN_LEAD_EVENT = "bgee:open-lead";
const SKIP_ON = ["/book", "/contact", "/estimate", "/privacy", "/terms"];
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
      aria-labelledby="lead-title"
      onClose={() => setOpen(false)}
      onCancel={() => write(DISMISS_KEY, String(Date.now()))}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
      className="m-auto w-[calc(100%-1.5rem)] max-w-lg overflow-visible rounded-3xl border border-border bg-transparent p-0 text-foreground backdrop:bg-ink/70 backdrop:backdrop-blur-sm"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[90dvh] overflow-y-auto rounded-3xl bg-card p-6 shadow-2xl sm:p-8"
          >
            <div aria-hidden className="gold-rule absolute inset-x-8 top-0" />
            <button
              type="button"
              onClick={() => close()}
              aria-label="Close"
              className="absolute right-3 top-3 grid size-11 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-5" />
            </button>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent">
              <Sparkles className="size-4" aria-hidden /> Free consultation enquiry
            </p>
            <h2 id="lead-title" className="mt-2 pr-8 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Tell us about your project
            </h2>
            <p className="mb-6 mt-2 text-sm text-muted-foreground">
              Share a few details and a specialist will reply within one business day.
            </p>
            <LeadForm
              source="popup"
              submitLabel="Request a call back"
              onSuccess={() => {
                write(DONE_KEY, "1");
                window.setTimeout(() => close(false), 2800);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}
