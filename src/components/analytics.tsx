"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { CONSENT_EVENT, OPEN_COOKIE_SETTINGS, clearAnalyticsCookies, consentSnapshot, openCookieSettings, readConsent, saveConsent } from "@/lib/consent";
import { GTM_ID, track } from "@/lib/track";
import { cn } from "@/lib/utils";

// GA4 is loaded directly only when no Tag Manager container is set (otherwise add the GA4 tag inside GTM, to avoid double counting).
const GA_ID = GTM_ID ? undefined : (process.env.NEXT_PUBLIC_GA_ID ?? "G-BTVYKMJJB6");
const TRACKING = Boolean(GA_ID || GTM_ID);

function subscribe(cb: () => void) {
  window.addEventListener(CONSENT_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CONSENT_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
/** The saved choice, or null while the visitor has not chosen (and on the server, so nothing loads before consent). */
function useConsent() {
  const snap = useSyncExternalStore(subscribe, consentSnapshot, () => "");
  return snap ? readConsent() : null;
}

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] };

/**
 * Loads Google Tag Manager (and GA4 when used directly) ONLY after the visitor opts in, and tells Google
 * which purposes were allowed (Consent Mode v2). Withdrawing consent stops tracking and clears analytics cookies.
 */
export function Analytics() {
  const consent = useConsent();
  const pathname = usePathname();
  const analytics = consent?.analytics === true;
  const marketing = consent?.marketing === true;
  const [wasOn, setWasOn] = useState(false);

  useEffect(() => {
    if (analytics || marketing) {
      const t = setTimeout(() => setWasOn(true), 0);
      return () => clearTimeout(t);
    }
    if (wasOn) {
      clearAnalyticsCookies();
      const w = window as GtagWindow;
      w.gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      window.location.reload(); // unloads the tag scripts completely
    }
  }, [analytics, marketing, wasOn]);

  useEffect(() => {
    if (!analytics) return;
    if (GA_ID) (window as GtagWindow).gtag?.("event", "page_view", { page_path: pathname, page_location: window.location.href });
    if (GTM_ID) track("virtual_page_view", { page_location: window.location.href, page_title: document.title });
  }, [pathname, analytics]);

  // Every WhatsApp link on the site (button, footer, top bar, chat, BGee) reports one event.
  useEffect(() => {
    if (!analytics) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || !/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(a.href)) return;
      track("whatsapp_click", { link_url: a.href.split("?")[0], link_text: (a.textContent ?? "").trim().slice(0, 60) || a.getAttribute("aria-label") || "WhatsApp" });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [analytics]);

  if (!analytics && !marketing) return null;
  const grant = (on: boolean) => (on ? "granted" : "denied");
  return (
    <>
      <Script id="consent-mode" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = window.gtag || gtag;
        gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 });
        gtag('consent', 'update', { analytics_storage: '${grant(analytics)}', ad_storage: '${grant(marketing)}', ad_user_data: '${grant(marketing)}', ad_personalization: '${grant(marketing)}' });
      `}</Script>
      {GTM_ID && (
        <Script id="gtm-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
          (function(){var f=document.getElementsByTagName('script')[0],j=document.createElement('script');
          j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id=${GTM_ID}';f.parentNode.insertBefore(j,f);})();
        `}</Script>
      )}
      {GA_ID && analytics && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">{`
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { send_page_view: false, anonymize_ip: true });
          `}</Script>
        </>
      )}
    </>
  );
}

function Switch({ id, label, desc, checked, onChange, locked }: { id: string; label: string; desc: string; checked: boolean; onChange?: (v: boolean) => void; locked?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border p-4">
      <div>
        <label htmlFor={id} className="font-semibold">
          {label}
        </label>
        <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={locked}
        onClick={() => onChange?.(!checked)}
        className={cn("relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-60", checked ? "bg-brand-strong" : "bg-muted-foreground/40")}
      >
        <span className={cn("absolute top-0.5 size-6 rounded-full bg-white shadow transition-all", checked ? "left-[1.4rem]" : "left-0.5")} />
        <span className="sr-only">{locked ? "Always on" : checked ? "On" : "Off"}</span>
      </button>
    </div>
  );
}

/**
 * Cookie notice. Shown until a choice is made. "Reject all" is as prominent as "Accept all", categories are
 * off by default, and the footer "Cookie settings" link reopens it so consent can be changed or withdrawn any time.
 */
export function ConsentBanner() {
  const consent = useConsent();
  const [forced, setForced] = useState(false);
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const open = () => {
      const c = readConsent();
      setAnalytics(c?.analytics ?? false);
      setMarketing(c?.marketing ?? false);
      setDetails(true);
      setForced(true);
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS, open);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS, open);
  }, []);

  if (!TRACKING || (consent !== null && !forced)) return null;

  const done = (a: boolean, m: boolean) => {
    saveConsent(a, m);
    setForced(false);
    setDetails(false);
  };
  const btn = "min-h-11 flex-1 rounded-full border px-5 text-sm font-semibold transition active:scale-[0.98]";

  return (
    <div role="dialog" aria-modal="false" aria-label="Cookie preferences" className="fixed inset-x-3 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[60] mx-auto max-h-[80dvh] max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl lg:bottom-5">
      <p className="font-display text-lg font-bold">Your privacy choices</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        We use essential cookies to run the site. With your permission we also use analytics and marketing cookies to understand how it is used and to measure our advertising. You can change your mind at any time. See our{" "}
        <Link href="/privacy" className="font-semibold text-brand underline">
          privacy policy
        </Link>
        .
      </p>

      {details && (
        <div className="mt-4 space-y-3">
          <Switch id="ck-essential" label="Essential" desc="Needed for the site to work: security, your currency, theme and cookie choices. Always on." checked locked />
          <Switch id="ck-analytics" label="Analytics" desc="Anonymous statistics about visits, so we can improve the site (Google Analytics through Google Tag Manager)." checked={analytics} onChange={setAnalytics} />
          <Switch id="ck-marketing" label="Marketing" desc="Lets us measure and improve advertising. Not used at the moment, but ready if we run ads." checked={marketing} onChange={setMarketing} />
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={() => done(false, false)} className={cn(btn, "border-border bg-card hover:bg-muted")}>
          Reject all
        </button>
        {details ? (
          <button type="button" onClick={() => done(analytics, marketing)} className={cn(btn, "border-border bg-card hover:bg-muted")}>
            Save my choices
          </button>
        ) : (
          <button type="button" onClick={() => setDetails(true)} className={cn(btn, "border-border bg-card hover:bg-muted")}>
            Customize
          </button>
        )}
        <button type="button" onClick={() => done(true, true)} className={cn(btn, "border-brand-strong bg-brand-strong text-white hover:opacity-90")}>
          Accept all
        </button>
      </div>
    </div>
  );
}

/** Footer link to review or withdraw consent. */
export function CookieSettingsLink({ className }: { className?: string }) {
  if (!TRACKING) return null;
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookie settings
    </button>
  );
}
