"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { GTM_ID, track } from "@/lib/track";

// GA4 is loaded directly only when no Tag Manager container is set (otherwise add the GA4 tag inside GTM, to avoid double counting).
const GA_ID = GTM_ID ? undefined : (process.env.NEXT_PUBLIC_GA_ID ?? "G-BTVYKMJJB6");
const TRACKING = Boolean(GA_ID || GTM_ID);
const KEY = "bgee_consent";
const EVENT = "bgee:consent";

type Choice = "granted" | "denied" | "unset";

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
function read(): Choice {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : "unset";
  } catch {
    return "unset";
  }
}
const useConsent = () => useSyncExternalStore(subscribe, read, () => "unset" as Choice);

function choose(v: "granted" | "denied" | "reset") {
  try {
    if (v === "reset") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, v);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] };

/**
 * Google Analytics 4, loaded ONLY when NEXT_PUBLIC_GA_ID is set and the visitor has accepted.
 * Without a measurement ID nothing loads and no banner is shown.
 */
export function Analytics() {
  const consent = useConsent();
  const pathname = usePathname();

  useEffect(() => {
    if (consent !== "granted") return;
    if (GA_ID) (window as GtagWindow).gtag?.("event", "page_view", { page_path: pathname, page_location: window.location.href });
    if (GTM_ID) track("virtual_page_view", { page_location: window.location.href, page_title: document.title });
  }, [pathname, consent]);

  // Every WhatsApp link on the site (button, header, footer, chat, BGee) reports one event.
  useEffect(() => {
    if (consent !== "granted") return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || !/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(a.href)) return;
      track("whatsapp_click", { link_url: a.href.split("?")[0], link_text: (a.textContent ?? "").trim().slice(0, 60) || a.getAttribute("aria-label") || "WhatsApp" });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [consent]);

  if (consent !== "granted") return null;
  return (
    <>
      {GTM_ID && (
        <>
          <Script id="gtm-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
            (function(){var f=document.getElementsByTagName('script')[0],j=document.createElement('script');
            j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id=${GTM_ID}';f.parentNode.insertBefore(j,f);})();
          `}</Script>
        </>
      )}
      {GA_ID && (
        <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { send_page_view: false, anonymize_ip: true });
      `}</Script>
        </>
      )}
    </>
  );
}

/** Cookie notice: shown only when analytics is configured and no choice has been made yet. */
export function ConsentBanner() {
  const consent = useConsent();
  if (!TRACKING || consent !== "unset") return null;
  return (
    <div role="dialog" aria-label="Cookie preferences" className="fixed inset-x-3 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[60] mx-auto max-w-2xl rounded-2xl border border-border bg-card p-4 shadow-2xl lg:bottom-5">
      <p className="text-sm leading-relaxed">
        We use analytics cookies to understand how the site is used and improve it. See our{" "}
        <Link href="/privacy" className="font-semibold text-brand underline">privacy policy</Link>.
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => choose("granted")} className="min-h-11 flex-1 rounded-full bg-brand-strong px-5 text-sm font-semibold text-white">Accept</button>
        <button type="button" onClick={() => choose("denied")} className="min-h-11 flex-1 rounded-full border border-border px-5 text-sm font-semibold hover:bg-muted">Decline</button>
      </div>
    </div>
  );
}

/** Footer link to change the choice later (only when analytics is configured). */
export function CookieSettingsLink({ className }: { className?: string }) {
  if (!TRACKING) return null;
  return (
    <button type="button" onClick={() => choose("reset")} className={className}>
      Cookie settings
    </button>
  );
}
