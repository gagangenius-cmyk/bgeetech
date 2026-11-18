// Shared by client and server. All catalogue prices are authored in USD and converted for display and checkout.

export type CurrencyCode = "USD" | "AED" | "INR";

export const currencies: Record<CurrencyCode, { label: string; symbol: string; locale: string; rate: number }> = {
  USD: { label: "US Dollar", symbol: "$", locale: "en-US", rate: 1 },
  // AED is pegged to USD (3.6725). INR floats: PLACEHOLDER rate, keep it updated (or fetch live rates).
  AED: { label: "UAE Dirham", symbol: "AED", locale: "en-AE", rate: 3.6725 },
  INR: { label: "Indian Rupee", symbol: "₹", locale: "en-IN", rate: 88 },
};

export const currencyCodes = Object.keys(currencies) as CurrencyCode[];
export const isCurrency = (v: unknown): v is CurrencyCode => typeof v === "string" && v in currencies;

/** Converts a USD amount to whole units of the target currency (what customers see and are charged). */
export function convert(usd: number, code: CurrencyCode): number {
  const raw = usd * currencies[code].rate;
  if (code === "INR") return Math.round(raw / 10) * 10; // tidy rupee prices (nearest 10)
  return Math.round(raw);
}

export function formatMoney(amount: number, code: CurrencyCode, opts: { decimals?: boolean } = {}): string {
  return new Intl.NumberFormat(currencies[code].locale, {
    style: "currency",
    currency: code,
    maximumFractionDigits: opts.decimals ? 2 : 0,
    minimumFractionDigits: opts.decimals ? 2 : 0,
  }).format(amount);
}

/** Minor units (cents / fils / paise) charged by Stripe for a USD list price. Server-side use. */
export function toMinor(usd: number, code: CurrencyCode): number {
  return convert(usd, code) * 100;
}
