// Pushes events to the Google Tag Manager data layer, but only after the visitor accepted cookies.
// In GTM, create triggers on these event names (whatsapp_click, generate_lead, form_submit, ...).

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-MJXK8SKQ";
export const CONSENT_KEY = "bgee_consent";

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[]; gtag?: (...args: unknown[]) => void };

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(CONSENT_KEY) !== "granted") return;
  } catch {
    return;
  }
  const w = window as DataLayerWindow;
  if (GTM_ID) (w.dataLayer = w.dataLayer || []).push({ event, page_path: window.location.pathname, ...params });
  else w.gtag?.("event", event, { page_path: window.location.pathname, ...params }); // direct GA4 mode
}
