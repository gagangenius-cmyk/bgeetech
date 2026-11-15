"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Card whose border glow follows the cursor. */
export function SpotlightCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={cn(
        "spotlight group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-xl hover:shadow-brand/10",
        className,
      )}
    >
      {children}
    </div>
  );
}
