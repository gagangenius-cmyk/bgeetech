"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { faqs } from "@/lib/site";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto mt-12 max-w-3xl divide-y divide-border rounded-2xl border border-border bg-card">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-14 w-full items-center justify-between gap-4 px-6 py-4 text-left font-semibold transition-colors hover:text-brand"
              >
                {f.q}
                <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.25 }}>
                  <Plus className="size-5 shrink-0" aria-hidden />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-${i}`}
                  role="region"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 leading-relaxed text-muted-foreground">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
