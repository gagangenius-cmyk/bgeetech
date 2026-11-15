import { cn } from "@/lib/utils";
import { useId } from "react";

export function LogoMark({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 80 80" className={cn("size-9", className)} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#047857" />
          <stop offset="1" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="72" height="72" rx="18" fill={`url(#${id})`} />
      <path d="M30 20v40" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
      <circle cx="45" cy="44" r="12" fill="none" stroke="#fff" strokeWidth="7" />
      <circle cx="56" cy="24" r="4.5" fill="#fff" />
    </svg>
  );
}

export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-display text-xl tracking-tight", className)}>
      <LogoMark />
      <span className={onDark ? "text-white" : "text-foreground"}>
        <span className="font-extrabold">bgee</span>
        <span className={cn("font-normal", onDark ? "text-amber-300" : "text-brand")}>tech</span>
      </span>
      <span className="sr-only">home</span>
    </span>
  );
}
