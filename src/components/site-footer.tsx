import Link from "next/link";
import { Logo } from "@/components/logo";
import { whatsappUrl } from "@/lib/chat-knowledge";
import { CookieSettingsLink } from "@/components/analytics";
import { nav, services, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-ink text-white/70">
      <div aria-hidden className="grid-lines absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo onDark />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{site.description}</p>
          <a href={`mailto:${site.email}`} className="mt-5 inline-block text-sm font-medium text-white underline-offset-4 hover:underline">
            {site.email}
          </a>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm font-medium text-white underline-offset-4 hover:underline">
            WhatsApp {site.whatsappDisplay}
          </a>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Services</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {services.slice(0, 8).map((s) => (
              <li key={s.slug}>
                <Link className="inline-block py-1.5 transition-colors hover:text-white" href={`/services/${s.slug}`}>
                  {s.title}
                </Link>
              </li>
            ))}
            <li>
              <Link className="inline-block py-1.5 font-semibold text-white transition-colors" href="/services">All services</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Company</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <Link className="inline-block py-1.5 transition-colors hover:text-white" href={n.href}>
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="inline-block py-1.5 transition-colors hover:text-white" href="/faq">FAQ</Link>
            </li>
            <li>
              <Link className="inline-block py-1.5 transition-colors hover:text-white" href="/estimate">Cost estimator</Link>
              </li>
              <li>
                <Link className="inline-block py-1.5 transition-colors hover:text-white" href="/audit">Free website audit</Link>
            </li>
            <li>
              <Link className="inline-block py-1.5 transition-colors hover:text-white" href="/privacy">Privacy</Link>
            </li>
            <li>
              <Link className="inline-block py-1.5 transition-colors hover:text-white" href="/terms">Terms</Link>
            </li>
            <li>
              <a className="inline-block py-1.5 transition-colors hover:text-white" href="/feed.xml">RSS feed</a>
            </li>
            <li>
              <CookieSettingsLink className="inline-block py-1.5 text-left transition-colors hover:text-white" />
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10 py-6 text-center text-xs">
        © 2026 {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
