import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Dark band that sits under the fixed header, then the page content. */
export function PortalShell({ title, sub, children, wide }: { title: string; sub?: string; children: ReactNode; wide?: boolean }) {
  return (
    <div>
      <div className="bg-ink pb-12 pt-36 text-white sm:pt-44">
        <div className={cn("mx-auto px-5 sm:px-8", wide ? "max-w-6xl" : "max-w-3xl")}>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Client portal</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          {sub && <p className="mt-2 text-white/70">{sub}</p>}
        </div>
      </div>
      <div className={cn("mx-auto px-5 py-12 sm:px-8", wide ? "max-w-6xl" : "max-w-3xl")}>{children}</div>
    </div>
  );
}

const tones: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  paid: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  answered: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  open: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  urgent: "bg-red-500/15 text-red-700 dark:text-red-300",
  cancelled: "bg-muted text-muted-foreground",
  closed: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", tones[status] ?? "bg-muted text-muted-foreground")}>{status}</span>;
}

export const fieldClass = "min-h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none focus:border-brand focus:ring-4 focus:ring-brand/15";
