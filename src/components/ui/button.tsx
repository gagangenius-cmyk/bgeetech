import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const base =
  "group relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-sm font-semibold transition-all duration-300 active:scale-[0.97] focus-visible:outline-offset-4";

const variants = {
  primary:
    "bg-brand-strong text-white shadow-lg shadow-brand/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand/40 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:transition-transform before:duration-700 hover:before:translate-x-full",
  secondary:
    "border border-border bg-card text-foreground hover:-translate-y-0.5 hover:border-brand/60 hover:text-brand",
  ghost: "text-foreground hover:bg-muted",
  onDark:
    "border border-white/20 bg-white/5 text-white backdrop-blur hover:border-white/40 hover:bg-white/10",
} as const;

type Props = ComponentProps<typeof Link> & { variant?: keyof typeof variants };

export function ButtonLink({ variant = "primary", className, children, ...props }: Props) {
  return (
    <Link className={cn(base, variants[variant], className)} {...props}>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </Link>
  );
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ComponentProps<"button"> & { variant?: keyof typeof variants }) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
