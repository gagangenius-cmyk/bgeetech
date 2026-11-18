"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { ArrowRight, MessageCircle, Search } from "lucide-react";
import { CurrencySwitcher } from "@/components/currency";
import { InstallButton } from "@/components/pwa/install-button";
import { whatsappUrl } from "@/lib/chat-knowledge";
import { OPEN_SEARCH_EVENT } from "@/components/widgets/command-palette";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";
import { nav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // The bottom tab bar's "More" button toggles this menu; broadcast its state back so the tab can show as active.
  useEffect(() => {
    const toggle = () => setOpen((v) => !v);
    window.addEventListener("bgee:toggle-menu", toggle);
    return () => window.removeEventListener("bgee:toggle-menu", toggle);
  }, []);
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("bgee:menu-state", { detail: open }));
  }, [open]);

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-all duration-300",
        scrolled || open ? "glass border-b border-border shadow-sm" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="BGeetech home" onClick={() => setOpen(false)}>
          <Logo onDark={!scrolled && !open} />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            const dark = !scrolled;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  dark ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-foreground",
                  active && (dark ? "text-white" : "text-foreground"),
                )}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className={cn("absolute inset-0 -z-10 rounded-full", dark ? "bg-white/15" : "bg-brand/10")}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            aria-label="Search the site (Ctrl or Command K)"
            onClick={() => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT))}
            className={cn(
              "grid size-11 place-items-center rounded-full transition-colors hover:bg-white/10",
              !scrolled && !open ? "text-white" : "text-foreground hover:bg-muted",
            )}
          >
            <Search className="size-5" />
          </button>
          <CurrencySwitcher onDark={!scrolled && !open} className="inline-flex" />
          <ButtonLink href="/book" className="hidden min-h-10! xl:inline-flex">
            Free consultation <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </ButtonLink>
        </div>
      </div>

      {/* scroll progress */}
      <motion.div
        aria-hidden
        className="h-0.5 origin-left bg-linear-to-r from-brand to-accent"
        style={{ scaleX: progress }}
      />
    </header>

      {/* Rendered outside <header>: its backdrop-filter would otherwise become the containing block
          for this fixed panel and collapse it to the header's height. */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[calc(4rem+env(safe-area-inset-top))] bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-[45] overflow-y-auto overscroll-contain border-t border-border bg-background lg:hidden"
          >
            <nav aria-label="Mobile" className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-6">
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-4 font-display text-2xl font-semibold hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <CurrencySwitcher className="mt-4 self-start" />
              <ButtonLink href="/book" onClick={() => setOpen(false)} className="mt-4 min-h-12!">
                Free consultation
              </ButtonLink>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    window.dispatchEvent(new Event("bgee:open-chat"));
                  }}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card text-sm font-semibold transition active:scale-[0.98]"
                >
                  <MessageCircle className="size-4 text-brand" aria-hidden /> Chat with AI
                </button>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#25D366] text-sm font-semibold text-white transition active:scale-[0.98]"
                >
                  WhatsApp
                </a>
              </div>
              <InstallButton className="mt-3" />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
