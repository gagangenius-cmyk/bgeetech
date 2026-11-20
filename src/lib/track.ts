// Pushes events to the Google Tag Manager data layer, but only after the visitor accepted cookies.
// In GTM, create triggers on these event names (whatsapp_click, generate_lead, form_submit, ...).

import { readConsent } from "@/lib/consent";

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-MJXK8SKQ";

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[]; gtag?: (...args: unknown[]) => void };

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  if (readConsent()?.analytics !== true) return; // no consent, no tracking
  const w = window as DataLayerWindow;
  if (GTM_ID) (w.dataLayer = w.dataLayer || []).push({ event, page_path: window.location.pathname, ...params });
  else w.gtag?.("event", event, { page_path: window.location.pathname, ...params }); // direct GA4 mode
}
