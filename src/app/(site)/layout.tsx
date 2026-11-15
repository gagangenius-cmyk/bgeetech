import { Suspense } from "react";
import { AdminProviders as QueryProvider } from "@/components/admin/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ChatWidget } from "@/components/widgets/chat-widget";
import { CommandPalette } from "@/components/widgets/command-palette";
import { LeadPopup } from "@/components/widgets/lead-popup";
import { WhatsAppButton } from "@/components/widgets/whatsapp-button";
import { site } from "@/lib/site";

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  url: site.url,
  description: site.description,
  email: site.email,
  telephone: `+${site.whatsappNumber}`,
  logo: `${site.url}/brand/logo-mark.svg`,
  areaServed: "Worldwide",
};

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <QueryProvider>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-brand-strong px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      {/* usePathname() suspends on routes with runtime params; keep these client pieces in Suspense */}
      <Suspense fallback={<div className="h-16" aria-hidden />}>
        <SiteHeader />
      </Suspense>
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <WhatsAppButton />
      <ChatWidget />
      <Suspense fallback={null}>
        <LeadPopup />
      </Suspense>
      <CommandPalette />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c") }} />
    </QueryProvider>
  );
}
