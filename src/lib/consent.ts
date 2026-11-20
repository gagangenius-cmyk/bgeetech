// Cookie and tracking consent (GDPR / ePrivacy style): nothing non-essential runs until the visitor opts in,
// choices are per category, rejecting is as easy as accepting, and they can be changed or withdrawn at any time.

export const CONSENT_KEY = "bgee_consent_v2";
export const CONSENT_EVENT = "bgee:consent";
export const OPEN_COOKIE_SETTINGS = "bgee:cookie-settings";

export type Consent = { v: 2; analytics: boolean; marketing: boolean; at: string };

/** Reads the saved choice. Understands the old "granted"/"denied" value so nobody is asked twice. */
export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (raw) {
      const c = JSON.parse(raw) as Consent;
      if (c && c.v === 2 && typeof c.analytics === "boolean") return c;
    }
    const old = localStorage.getItem("bgee_consent");
    if (old === "granted" || old === "denied") return { v: 2, analytics: old === "granted", marketing: false, at: "legacy" };
  } catch {
    /* storage unavailable: treated as "no choice yet", so nothing non-essential loads */
  }
  return null;
}

/** The raw string is the snapshot for useSyncExternalStore (it must be a stable primitive). */
export function consentSnapshot(): string {
  try {
    return localStorage.getItem(CONSENT_KEY) ?? localStorage.getItem("bgee_consent") ?? "";
  } catch {
    return "";
  }
}

export function saveConsent(analytics: boolean, marketing: boolean) {
  const c: Consent = { v: 2, analytics, marketing, at: new Date().toISOString() };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
    localStorage.removeItem("bgee_consent");
  } catch {
    /* ignore: choice lasts for this visit only */
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS));

/** Removes Google Analytics cookies when someone withdraws consent. */
export function clearAnalyticsCookies() {
  const host = location.hostname;
  const parts = host.split(".");
  const domains = [host, `.${host}`, parts.length > 2 ? `.${parts.slice(-2).join(".")}` : ""].filter(Boolean);
  for (const name of document.cookie.split(";").map((c) => c.split("=")[0].trim())) {
    if (!/^(_ga|_gid|_gat|_gcl)/.test(name)) continue;
    for (const d of domains) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}
