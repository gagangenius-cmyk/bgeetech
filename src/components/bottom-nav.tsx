"use client";

import { motion } from "motion/react";
import { CalendarCheck, Grid2x2, House, MoreHorizontal, Tag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", icon: House },
  { href: "/services", label: "Services", icon: Grid2x2 },
  { href: "/book", label: "Free call", icon: CalendarCheck, primary: true },
  { href: "/pricing", label: "Pricing", icon: Tag },
] as const;

const haptic = () => {
  try {
    navigator.vibrate?.(8); // light tick on supporting devices (Android); ignored elsewhere
  } catch {
    /* not supported */
  }
};

/**
 * App-style bottom tab bar for phones and portrait tablets. Primary actions sit in the thumb zone,
 * the bar respects the home-indicator safe area, and it slides away while a form field has focus
 * so the on-screen keyboard never covers or pushes it.
 */
export function BottomNav() {
  const pathname = usePathname();
  const [typing, setTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const isField = (t: EventTarget | null) => t instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) && !/checkbox|radio|button|submit/.test((t as HTMLInputElement).type ?? "");
    const onIn = (e: FocusEvent) => isField(e.target) && setTyping(true);
    const onOut = () => setTyping(false);
    const onMenu = (e: Event) => setMenuOpen(Boolean((e as CustomEvent<boolean>).detail));
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    window.addEventListener("bgee:menu-state", onMenu);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
      window.removeEventListener("bgee:menu-state", onMenu);
    };
  }, []);

  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav
      aria-label="Quick navigation"
      className={cn(
        "glass fixed inset-x-0 bottom-0 z-[48] border-t border-border shadow-[0_-8px_30px_rgba(5,13,36,0.12)] transition-transform duration-300 lg:hidden",
        typing && "translate-y-full",
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid h-[4.25rem] max-w-xl grid-cols-5 items-stretch px-2">
        {tabs.map((t) => {
          const on = active(t.href);
          return (
            <li key={t.href} className="grid place-items-center">
              <Link
                href={t.href}
                onClick={haptic}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "relative flex min-h-12 min-w-14 flex-col items-center justify-center gap-0.5 rounded-2xl px-2 text-[11px] font-semibold transition-colors active:scale-95",
                  "primary" in t && t.primary ? "text-white" : on ? "text-brand" : "text-muted-foreground",
                )}
              >
                {"primary" in t && t.primary ? (
                  <span className="-mt-6 grid size-14 place-items-center rounded-full bg-linear-to-br from-brand-strong to-accent shadow-lg shadow-brand/40 ring-4 ring-background">
                    <t.icon className="size-6" aria-hidden />
                  </span>
                ) : (
                  <>
                    {on && <motion.span layoutId="tab-pill" className="absolute inset-x-1 inset-y-0.5 -z-10 rounded-2xl bg-brand/10" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
                    <t.icon className="size-5" aria-hidden />
                  </>
                )}
                <span className={cn("primary" in t && t.primary && "-mt-0.5 text-foreground")}>{t.label}</span>
              </Link>
            </li>
          );
        })}
        <li className="grid place-items-center">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label="More menu"
            onClick={() => {
              haptic();
              window.dispatchEvent(new Event("bgee:toggle-menu"));
            }}
            className={cn("flex min-h-12 min-w-14 flex-col items-center justify-center gap-0.5 rounded-2xl px-2 text-[11px] font-semibold transition-colors active:scale-95", menuOpen ? "text-brand" : "text-muted-foreground")}
          >
            <MoreHorizontal className="size-5" aria-hidden />
            More
          </button>
        </li>
      </ul>
    </nav>
  );
}
