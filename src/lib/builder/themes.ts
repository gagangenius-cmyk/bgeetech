/** 100 generated colour themes (3 colours each) + helpers for custom palettes. */

export type Theme = { id: string; name: string; colors: [string, string, string] }; // [primary, soft surface, accent]

function hslToHex(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const x = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0");
  return `#${x(f(0))}${x(f(8))}${x(f(4))}`;
}

const hues: [string, number][] = [
  ["Crimson", 350], ["Coral", 10], ["Tangerine", 24], ["Amber", 38], ["Gold", 48],
  ["Lime", 78], ["Fern", 110], ["Emerald", 150], ["Jade", 165], ["Teal", 178],
  ["Cyan", 190], ["Azure", 207], ["Cobalt", 221], ["Indigo", 240], ["Violet", 262],
  ["Purple", 280], ["Orchid", 300], ["Magenta", 322], ["Rose", 338], ["Slate", 215],
];

const schemes: { name: string; build: (h: number, mute: boolean) => [string, string, string] }[] = [
  { name: "Mono", build: (h, m) => [hslToHex(h, m ? 18 : 68, 34), hslToHex(h, m ? 14 : 45, 95), hslToHex(h + 30, m ? 30 : 85, 52)] },
  { name: "Contrast", build: (h, m) => [hslToHex(h, m ? 20 : 62, 36), hslToHex(h + 180, m ? 12 : 35, 95), hslToHex(h + 180, m ? 35 : 75, 48)] },
  { name: "Triad", build: (h, m) => [hslToHex(h, m ? 20 : 60, 38), hslToHex(h + 120, m ? 12 : 40, 94), hslToHex(h + 240, m ? 35 : 70, 50)] },
  { name: "Split", build: (h, m) => [hslToHex(h, m ? 22 : 64, 35), hslToHex(h + 150, m ? 12 : 38, 94), hslToHex(h + 210, m ? 35 : 72, 50)] },
  { name: "Midnight", build: (h, m) => [hslToHex(h, m ? 25 : 55, 17), hslToHex(h, m ? 15 : 35, 96), hslToHex(h + 15, m ? 40 : 88, 56)] },
];

export const themes: Theme[] = hues.flatMap(([name, h]) =>
  schemes.map((s) => ({
    id: `${name}-${s.name}`.toLowerCase(),
    name: `${name} ${s.name}`,
    colors: s.build(h, name === "Slate"),
  })),
);

export const isHex = (v: string) => /^#[0-9a-fA-F]{6}$/.test(v);

function luminance(hex: string) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

/** Readable text colour (near-black or white) for a given background. */
export const textOn = (bg: string) => (isHex(bg) && luminance(bg) > 0.4 ? "#0f172a" : "#ffffff");

/** Contrast ratio between two hex colours (WCAG). */
export function contrast(a: string, b: string) {
  if (!isHex(a) || !isHex(b)) return 21;
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}
