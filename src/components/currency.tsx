"use client";

import { Coins } from "lucide-react";
import { useSyncExternalStore } from "react";
import { convert, currencies, currencyCodes, formatMoney, isCurrency, type CurrencyCode } from "@/lib/currency";
import { cn } from "@/lib/utils";

const KEY = "bgee_currency";
const EVENT = "bgee:currency";

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function read(): CurrencyCode {
  try {
    const v = localStorage.getItem(KEY);
    return isCurrency(v) ? v : "USD";
  } catch {
    return "USD";
  }
}

export function setCurrency(code: CurrencyCode) {
  try {
    localStorage.setItem(KEY, code);
  } catch {
    /* storage unavailable: choice lasts for this page only */
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Selected display currency. The server snapshot is always USD, so there is no hydration mismatch. */
export function useCurrency() {
  const code = useSyncExternalStore(subscribe, read, () => "USD" as CurrencyCode);
  return {
    code,
    /** Format a USD list price in the selected currency. */
    money: (usd: number, opts?: { decimals?: boolean }) => formatMoney(convert(usd, code), code, opts),
  };
}

/** Inline price, e.g. <Price usd={150} />. */
export function Price({ usd, className }: { usd: number; className?: string }) {
  const { money } = useCurrency();
  return <span className={cn("tabular-nums", className)}>{money(usd)}</span>;
}

export function CurrencySwitcher({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  const { code } = useCurrency();
  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <Coins className={cn("pointer-events-none absolute left-2.5 size-4", onDark ? "text-white/70" : "text-muted-foreground")} aria-hidden />
      <label htmlFor="currency-select" className="sr-only">
        Currency
      </label>
      <select
        id="currency-select"
        value={code}
        onChange={(e) => isCurrency(e.target.value) && setCurrency(e.target.value)}
        className={cn(
          "min-h-10 cursor-pointer appearance-none rounded-full border py-1 pl-8 pr-3 text-xs font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-brand",
          onDark ? "border-white/20 bg-white/10 text-white hover:bg-white/15 [&>option]:text-slate-900" : "border-border bg-card text-foreground hover:border-brand/50",
        )}
      >
        {currencyCodes.map((c) => (
          <option key={c} value={c}>
            {c} ({currencies[c].symbol})
          </option>
        ))}
      </select>
    </div>
  );
}
