import type { Theme } from "@/lib/builder/themes";

export type Device = "desktop" | "tablet" | "mobile";

export type StyleDef = {
  id: string;
  label: string;
  note: string;
  font: "sans" | "serif";
  radius: number; // px
  hero: "split" | "center" | "bleed";
  upper: boolean; // uppercase headings
  weight: number;
};

export const styles: StyleDef[] = [
  { id: "modern", label: "Modern", note: "Clean, rounded, split hero", font: "sans", radius: 16, hero: "split", upper: false, weight: 800 },
  { id: "classic", label: "Classic", note: "Serif, centred, timeless", font: "serif", radius: 6, hero: "center", upper: false, weight: 700 },
  { id: "bold", label: "Bold", note: "Big colour, strong type", font: "sans", radius: 4, hero: "bleed", upper: true, weight: 900 },
  { id: "minimal", label: "Minimal", note: "Airy, light, understated", font: "sans", radius: 2, hero: "center", upper: false, weight: 600 },
  { id: "elegant", label: "Elegant", note: "Refined serif, split hero", font: "serif", radius: 10, hero: "split", upper: false, weight: 600 },
  { id: "playful", label: "Playful", note: "Very rounded and friendly", font: "sans", radius: 28, hero: "split", upper: false, weight: 800 },
  { id: "corporate", label: "Corporate", note: "Trustworthy, structured", font: "sans", radius: 8, hero: "bleed", upper: false, weight: 700 },
  { id: "editorial", label: "Editorial", note: "Magazine feel, centred", font: "serif", radius: 0, hero: "center", upper: true, weight: 800 },
];

export type Tier = { id: "starter" | "business" | "pro" | "premium"; name: string; monthly: number; blurb: string; features: string[] };

// PLACEHOLDER pricing (USD per month). Replace with real offers before launch.
export const tiers: Tier[] = [
  { id: "starter", name: "Starter", monthly: 10, blurb: "A simple, fast one-page presence.", features: ["Up to 3 pages", "Mobile-friendly design", "Free SSL", "Contact form"] },
  { id: "business", name: "Business", monthly: 20, blurb: "Everything a small business needs.", features: ["Up to 8 pages", "Custom domain connection", "Basic SEO", "Google Maps and WhatsApp button"] },
  { id: "pro", name: "Professional", monthly: 30, blurb: "Grow with bookings and content.", features: ["Up to 20 pages", "Online booking or enquiry system", "Blog", "Analytics"] },
  { id: "premium", name: "Premium", monthly: 50, blurb: "Full-featured for serious growth.", features: ["Unlimited pages", "E-commerce or booking engine", "Priority support", "Monthly updates"] },
];

export type Cycle = { id: "monthly" | "quarterly" | "annual"; label: string; months: number; discount: number };
export const cycles: Cycle[] = [
  { id: "monthly", label: "Monthly", months: 1, discount: 0 },
  { id: "quarterly", label: "Quarterly", months: 3, discount: 0.05 },
  { id: "annual", label: "Annual", months: 12, discount: 0.15 },
];

export function priceFor(tierId: Tier["id"], cycleId: Cycle["id"]) {
  const t = tiers.find((x) => x.id === tierId) ?? tiers[1];
  const c = cycles.find((x) => x.id === cycleId) ?? cycles[0];
  const cents = Math.round(t.monthly * c.months * (1 - c.discount) * 100);
  const full = t.monthly * c.months * 100;
  return { tier: t, cycle: c, cents, total: cents / 100, perMonth: cents / 100 / c.months, saved: (full - cents) / 100 };
}

export type BuilderData = {
  business: { name: string; domain: string; slogan: string; email: string; phone: string; logo: string };
  industry: string | null;
  theme: { id: string; colors: [string, string, string] };
  style: string;
  plan: { tier: Tier["id"]; cycle: Cycle["id"] };
};

export const defaultTheme: Theme = { id: "emerald-mono", name: "Emerald Mono", colors: ["#0b7a4f", "#eef7f2", "#d98a2b"] };

export const initialData: BuilderData = {
  business: { name: "", domain: "", slogan: "", email: "", phone: "", logo: "" },
  industry: null,
  theme: { id: "custom", colors: ["#0b6e4f", "#eef7f2", "#d4a017"] },
  style: "modern",
  plan: { tier: "business", cycle: "annual" },
};

export const cleanDomain = (v: string) =>
  v.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
export const validDomain = (v: string) => /^(?=.{4,100}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/.test(cleanDomain(v));
export const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const validPhone = (v: string) => /^[+()\d\s-]{7,20}$/.test(v.trim()) && v.replace(/\D/g, "").length >= 7;
