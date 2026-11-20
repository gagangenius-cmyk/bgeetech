import Link from "next/link";
import { Logo } from "@/components/logo";
import { CookieSettingsLink } from "@/components/analytics";
import { NewsletterForm } from "@/components/newsletter-form";
import { SocialIcons } from "@/components/social-icons";
import { whatsappUrl } from "@/lib/chat-knowledge";
import { services, site } from "@/lib/site";

const company = [
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Insights" },
  { href: "/faq", label: "FAQ" },
  { href: "/demos", label: "Live demos" },
  { href: "/pricing", label: "Pricing" },
  { href: "/builder", label: "Site builder" },
  { href: "/care", label: "Care plans" },
  { href: "/portal", label: "Client portal" },
];

const tools = [
  { href: "/estimate", label: "Cost estimator" },
  { href: "/audit", label: "Free website audit" },
  { href: "/roi", label: "ROI calculator" },
  { href: "/industries", label: "Industries" },
  { href: "/referral", label: "Referral program" },
];

const linkClass = "inline-block py-1.5 transition-colors hover:text-white";

function Column({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      {children}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-ink text-white/70">
      <div aria-hidden className="grid-lines absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid max-w-7xl gap-x-10 gap-y-12 px-5 py-16 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo onDark />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{site.description}</p>
          <div className="mt-6 max-w-sm">
            <NewsletterForm />
          </div>
          <div className="mt-6 space-y-1 text-sm">
            <a href={`mailto:${site.email}`} className="block font-medium text-white underline-offset-4 hover:underline">
              {site.email}
            </a>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="block font-medium text-white underline-offset-4 hover:underline">
              WhatsApp {site.whatsappDisplay}
            </a>
            <p className="pt-1">{site.address.label}</p>
          </div>
          <SocialIcons className="-ml-2 mt-4" itemClassName="size-10 border border-white/15 text-white/80" />
        </div>

        <Column title="Services" className="lg:col-span-4">
          <ul className="mt-4 grid grid-cols-1 gap-x-6 text-sm sm:grid-cols-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link className={linkClass} href={`/services/${s.slug}`}>
                  {s.title}
                </Link>
              </li>
            ))}
            <li>
              <Link className={`${linkClass} font-semibold text-white`} href="/services">
                All services
              </Link>
            </li>
          </ul>
        </Column>

        <Column title="Company" className="lg:col-span-2">
          <ul className="mt-4 text-sm">
            {company.map((l) => (
              <li key={l.href}>
                <Link className={linkClass} href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Column>

        <Column title="Free tools" className="lg:col-span-2">
          <ul className="mt-4 text-sm">
            {tools.map((l) => (
              <li key={l.href}>
                <Link className={linkClass} href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Column>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs sm:px-8 md:flex-row">
          <p>© 2026 {site.name}. All rights reserved.</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            <li>
              <Link className={linkClass} href="/privacy">
                Privacy
              </Link>
            </li>
            <li>
              <Link className={linkClass} href="/terms">
                Terms
              </Link>
            </li>
            <li>
              <a className={linkClass} href="/feed.xml">
                RSS feed
              </a>
            </li>
            <li>
              <CookieSettingsLink className={`${linkClass} text-left`} />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
