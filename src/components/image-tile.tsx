"use client";

import { Check, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Brand-matched artwork palettes: deep navy through royal blue, with gold and sky accents.
const palettes = [
  { base: "#0b2a7a", glow: "#3b6dff", warm: "#d4af37" },
  { base: "#071a52", glow: "#2563eb", warm: "#7aa2ff" },
  { base: "#0d2f8f", glow: "#4f8bff", warm: "#e6c25a" },
  { base: "#06143f", glow: "#1d4ed8", warm: "#d4a017" },
] as const;
const positions = [
  [18, 12],
  [82, 20],
  [30, 85],
  [72, 78],
  [50, 8],
] as const;

type Props = {
  checked: boolean;
  onChange: () => void;
  type?: "checkbox" | "radio";
  name?: string;
  title: string;
  note?: string;
  price?: string;
  icon: LucideIcon;
  /** Varies the artwork so neighbouring tiles look related but not identical. */
  variant?: number;
  className?: string;
};

/**
 * Selectable tile with a full-bleed illustrated background instead of a checkbox.
 * The artwork is pure CSS/SVG (gradients, a dot grid and a large line icon), so it stays razor sharp on
 * retina and 4K screens and adds no image weight. A real, visually hidden input keeps it fully accessible
 * (keyboard, screen readers, form semantics) and a gold badge shows the selected state.
 */
export function ImageTile({ checked, onChange, type = "checkbox", name, title, note, price, icon: Icon, variant = 0, className }: Props) {
  const p = palettes[variant % palettes.length];
  const [x, y] = positions[variant % positions.length];
  const angle = 135 + (variant % 4) * 35;

  return (
    <label
      className={cn(
        "group relative isolate flex min-h-36 cursor-pointer flex-col justify-end overflow-hidden rounded-2xl p-4 text-white shadow-lg shadow-blue-950/20 transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-white",
        checked ? "ring-2 ring-accent shadow-xl shadow-amber-500/20" : "opacity-95 ring-1 ring-white/10 saturate-[0.8] hover:saturate-100",
        className,
      )}
    >
      <input type={type} name={name} checked={checked} onChange={onChange} className="peer sr-only" />

      {/* artwork: layered gradients, dot grid, large line icon */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(120% 90% at ${x}% ${y}%, ${p.glow} 0%, transparent 62%), radial-gradient(80% 70% at ${100 - x}% 105%, ${p.warm}66 0%, transparent 58%), linear-gradient(${angle}deg, ${p.base}, #050d24)`,
        }}
      />
      <span
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.18]"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "16px 16px", maskImage: "linear-gradient(135deg, #000 10%, transparent 75%)" }}
      />
      <span aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-linear-to-t from-black/55 to-transparent" />
      {checked && <span aria-hidden className="absolute inset-0 -z-10 bg-linear-to-tr from-amber-400/25 via-transparent to-transparent" />}
      <Icon aria-hidden className="absolute -right-3 -top-2 -z-10 size-32 -rotate-12 stroke-[1.1] text-white/[0.16] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110" />

      {/* selected badge */}
      <span
        aria-hidden
        className={cn(
          "absolute right-3 top-3 grid size-7 place-items-center rounded-full border transition-all duration-300",
          checked ? "scale-100 border-amber-300 bg-amber-400 text-ink shadow-lg shadow-amber-500/40" : "scale-90 border-white/30 bg-white/10 text-transparent backdrop-blur",
        )}
      >
        <Check className="size-4" strokeWidth={3} />
      </span>

      <span className="font-display text-lg font-bold leading-tight drop-shadow">{title}</span>
      {note && <span className="mt-0.5 text-xs leading-snug text-white/75">{note}</span>}
      {price && <span className="mt-2 inline-flex w-fit rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-bold tabular-nums backdrop-blur">{price}</span>}
    </label>
  );
}
