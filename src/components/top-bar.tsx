import Link from "next/link";
import { ArrowRight, Phone, Sparkles } from "lucide-react";
import { SocialIcons } from "@/components/social-icons";
import { topLinks, site } from "@/lib/site";

/** Slim bar above the header: company links, a free-consultation promo and contact details, plus social icons. It scrolls away; the header then docks to the top. */
export function TopBar() {
  return (
    <div className="absolute inset-x-0 top-0 z-[51] bg-gradient-to-r from-ink via-[#0b1d5c] to-ink pt-[env(safe-area-inset-top)] text-white/80 shadow-[0_1px_0_0_rgba(230,194,90,0.35)]">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-3 px-3 sm:px-8">
        <nav aria-label="Company" className="flex shrink-0 items-center">
          {topLinks.map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex min-h-9 items-center rounded-full px-2.5 text-xs font-medium transition-colors hover:bg-white/10 hover:text-white sm:px-3">
              {l.label}
            </Link>
          ))}
        </nav>

        <Link href="/book" className="group hidden items-center gap-2 rounded-full bg-white/[0.07] px-3.5 py-1 text-xs font-medium text-white ring-1 ring-white/15 transition hover:bg-white/[0.13] md:inline-flex">
          <Sparkles className="size-3.5 text-accent" aria-hidden />
          Your first 30 minutes with an expert are free
          <span className="inline-flex items-center gap-1 font-semibold text-accent">
            Book now <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-1">
          <a href={`tel:+${site.whatsappNumber}`} className="hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition hover:bg-white/10 hover:text-white xl:inline-flex">
            <Phone className="size-3.5 text-accent" aria-hidden />
            {site.whatsappDisplay}
          </a>
          <span aria-hidden className="mx-1 hidden h-4 w-px bg-white/15 xl:block" />
          <SocialIcons itemClassName="size-8 text-white/80" />
        </div>
      </div>
    </div>
  );
}
