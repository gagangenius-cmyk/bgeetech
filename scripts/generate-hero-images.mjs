// Generates the hero artwork in /public/hero (WebP, 2400px wide plus a 1280px mobile version).
// Run with:  node scripts/generate-hero-images.mjs
// Everything is drawn procedurally (seeded), so the images are original, license-free and reproducible.
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const W = 2400;
const H = 1350;
const out = path.join(process.cwd(), "public", "hero");

const rng = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const f = (n) => n.toFixed(1);

const defs = `
  <filter id="b4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>
  <filter id="b12" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12"/></filter>
  <filter id="b40" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>
  <filter id="b90" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="90"/></filter>
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.2 0 0 0 -0.04"/>
  </filter>
  <linearGradient id="edge" x1="0" x2="1"><stop offset="0" stop-color="#7aa2ff"/><stop offset="1" stop-color="#e6c25a"/></linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity=".03"/></linearGradient>
  <linearGradient id="gold" x1="0" x2="1"><stop offset="0" stop-color="#e6c25a"/><stop offset="1" stop-color="#d4a017"/></linearGradient>
  <linearGradient id="blue" x1="0" x2="1"><stop offset="0" stop-color="#4f8bff"/><stop offset="1" stop-color="#1d4ed8"/></linearGradient>
  <radialGradient id="orb" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".25" stop-color="#9bb8ff" stop-opacity=".7"/><stop offset=".6" stop-color="#2563eb" stop-opacity=".25"/><stop offset="1" stop-color="#2563eb" stop-opacity="0"/></radialGradient>
`;

const frame = (bg, body, grain = true) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>${defs}${bg.defs ?? ""}</defs>
  <rect width="${W}" height="${H}" fill="${bg.fill}"/>
  ${body}
  ${grain ? `<rect width="${W}" height="${H}" filter="url(#grain)"/>` : ""}
</svg>`;

// Gold over blue averages to a muddy gray, so gold glows use a warmer amber at lower strength.
const glow = (cx, cy, r, color, op) => {
  const [c, o] = color === "#d4af37" ? ["#ffb020", op * 0.45] : [color, op];
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" opacity="${o}" filter="url(#b90)"/>`;
};
const bokeh = (rand, n, colors) =>
  Array.from({ length: n }, () => {
    const r = 18 + rand() * 80;
    return `<circle cx="${f(rand() * W)}" cy="${f(rand() * H)}" r="${f(r)}" fill="${colors[Math.floor(rand() * colors.length)]}" opacity="${f(0.05 + rand() * 0.12)}" filter="url(#b12)"/>`;
  }).join("");
const star = (x, y, s, op) => `<path d="M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z" fill="#fff" opacity="${op}"/>`;

/* 1: neural network */
function neural() {
  const rand = rng(11);
  const pts = Array.from({ length: 78 }, () => ({ x: 520 + rand() * 1800, y: 60 + rand() * 1230, r: 2 + rand() * 5 }));
  let edges = "";
  for (let i = 0; i < pts.length; i++)
    for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < 290) edges += `<line x1="${f(pts[i].x)}" y1="${f(pts[i].y)}" x2="${f(pts[j].x)}" y2="${f(pts[j].y)}" stroke="url(#edge)" stroke-opacity="${f((1 - d / 290) * 0.55)}" stroke-width="1.5"/>`;
    }
  const halos = pts.map((p) => `<circle cx="${f(p.x)}" cy="${f(p.y)}" r="${f(p.r * 5)}" fill="#4f8bff" opacity=".22"/>`).join("");
  const nodes = pts.map((p, i) => `<circle cx="${f(p.x)}" cy="${f(p.y)}" r="${f(p.r)}" fill="${i % 4 === 0 ? "#e6c25a" : "#d7e4ff"}"/>`).join("");
  const body = `${glow(1750, 520, 900, "#3b6dff", 0.55)}${glow(2250, 1180, 700, "#d4af37", 0.24)}${glow(150, 80, 800, "#1d4ed8", 0.4)}
    ${bokeh(rand, 20, ["#d4af37", "#7aa2ff", "#4f8bff"])}
    <g filter="url(#b4)" opacity=".7">${edges}</g>${edges}
    <g filter="url(#b12)">${halos}</g>${nodes}
    <circle cx="1760" cy="560" r="330" fill="url(#orb)"/>
    <circle cx="1760" cy="560" r="330" fill="none" stroke="#fff" stroke-opacity=".22" stroke-dasharray="3 14"/>
    <circle cx="1760" cy="560" r="470" fill="none" stroke="#9bb8ff" stroke-opacity=".12"/>
    ${star(1300, 260, 26, 0.8)}${star(2150, 900, 20, 0.7)}${star(900, 1050, 16, 0.6)}`;
  return frame({ fill: "url(#bg1)", defs: `<linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#071b57"/><stop offset=".55" stop-color="#0a2368"/><stop offset="1" stop-color="#050d24"/></linearGradient>` }, body);
}

/* 2: glass UI panels (website builder) */
function glassPanels() {
  const rand = rng(23);
  const card = (x, y, rot, s, hue) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
      <rect width="560" height="360" rx="40" fill="url(#glass)" stroke="#fff" stroke-opacity=".22" stroke-width="2"/>
      <circle cx="44" cy="44" r="10" fill="#fff" opacity=".35"/><circle cx="76" cy="44" r="10" fill="#fff" opacity=".25"/><circle cx="108" cy="44" r="10" fill="#fff" opacity=".18"/>
      <rect x="40" y="96" width="300" height="26" rx="13" fill="${hue}" opacity=".85"/>
      <rect x="40" y="140" width="220" height="16" rx="8" fill="#fff" opacity=".3"/>
      <rect x="40" y="170" width="260" height="16" rx="8" fill="#fff" opacity=".2"/>
      <rect x="40" y="240" width="130" height="52" rx="26" fill="url(#gold)"/>
      <rect x="360" y="96" width="160" height="200" rx="24" fill="${hue}" opacity=".35"/>
    </g>`;
  const beams = [0, 1, 2, 3]
    .map((i) => `<polygon points="${f(1300 + i * 330)},-100 ${f(1500 + i * 330)},-100 ${f(1000 + i * 330)},${H + 100} ${f(760 + i * 330)},${H + 100}" fill="${i % 2 ? "#d4af37" : "#5b8cff"}" opacity=".08" filter="url(#b40)"/>`)
    .join("");
  const body = `${glow(2150, 260, 800, "#d4af37", 0.28)}${glow(1500, 1150, 900, "#2563eb", 0.5)}${glow(100, 200, 700, "#1d4ed8", 0.4)}
    ${beams}${bokeh(rand, 14, ["#7aa2ff", "#e6c25a"])}
    ${card(1050, 120, -6, 1.15, "#4f8bff")}${card(1550, 520, 5, 1.05, "#7aa2ff")}${card(980, 760, 3, 0.95, "#e6c25a")}
    ${star(1450, 160, 22, 0.8)}${star(2250, 640, 18, 0.7)}${star(850, 700, 14, 0.5)}`;
  return frame({ fill: "url(#bg2)", defs: `<linearGradient id="bg2" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#050d24"/><stop offset=".5" stop-color="#0a2873"/><stop offset="1" stop-color="#0d3394"/></linearGradient>` }, body);
}

/* 3: data waves (CRM / ERP) */
function dataWaves() {
  const rand = rng(37);
  const wave = (base, amp, freq, phase) => {
    const pts = Array.from({ length: 41 }, (_, i) => {
      const x = (i / 40) * (W + 200) - 100;
      return [x, base + Math.sin(i * freq + phase) * amp + Math.sin(i * freq * 2.3 + phase * 1.7) * amp * 0.35];
    });
    return pts;
  };
  const path = (pts) => pts.map(([x, y], i) => (i === 0 ? `M${f(x)} ${f(y)}` : `L${f(x)} ${f(y)}`)).join(" ");
  const layers = [
    { base: 780, amp: 130, freq: 0.34, ph: 0.4, a: 0.5, grad: "sky", stroke: "#f3d98a" },
    { base: 900, amp: 110, freq: 0.3, ph: 1.9, a: 0.42, grad: "deep", stroke: "#cfe0ff" },
    { base: 1020, amp: 90, freq: 0.4, ph: 3.1, a: 0.5, grad: "deep", stroke: "#9bb8ff" },
    { base: 640, amp: 90, freq: 0.28, ph: 5.2, a: 0.28, grad: "sky", stroke: "#cfe0ff" },
  ];
  const waves = layers
    .map((l) => {
      const p = wave(l.base, l.amp, l.freq, l.ph);
      return `<path d="${path(p)} L${W + 100} ${H + 50} L-100 ${H + 50} Z" fill="url(#${l.grad})" opacity="${l.a}"/>
        <path d="${path(p)}" fill="none" stroke="${l.stroke}" stroke-opacity=".6" stroke-width="2.6"/>
        ${p.filter((_, i) => i % 3 === 0).map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="5" fill="#fff" opacity=".8"/><circle cx="${f(x)}" cy="${f(y)}" r="16" fill="#9bb8ff" opacity=".18"/>`).join("")}`;
    })
    .join("");
  const verticals = Array.from({ length: 16 }, (_, i) => `<line x1="${200 + i * 140}" y1="0" x2="${200 + i * 140}" y2="${H}" stroke="#fff" stroke-opacity=".05" stroke-dasharray="2 10"/>`).join("");
  const body = `${glow(1850, 380, 800, "#3b6dff", 0.5)}${glow(2300, 900, 600, "#d4af37", 0.22)}${glow(150, 1200, 700, "#1d4ed8", 0.4)}
    ${verticals}${waves}${bokeh(rand, 12, ["#7aa2ff", "#e6c25a"])}
    ${star(1500, 300, 24, 0.8)}${star(2100, 520, 18, 0.7)}${star(1000, 400, 14, 0.5)}`;
  return frame({ fill: "url(#bg3)", defs: `<linearGradient id="bg3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a2063"/><stop offset="1" stop-color="#050d24"/></linearGradient><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fb0ff" stop-opacity=".85"/><stop offset="1" stop-color="#2563eb" stop-opacity="0"/></linearGradient><linearGradient id="deep" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b6dff" stop-opacity=".8"/><stop offset="1" stop-color="#0a2063" stop-opacity="0"/></linearGradient>` }, body);
}

/* 4: orbit rings (talk to an expert) */
function orbits() {
  const rand = rng(53);
  const cx = 1780;
  const cy = 640;
  const rings = Array.from({ length: 8 }, (_, i) => {
    const r = 130 + i * 125;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#fff" stroke-opacity="${f(0.28 - i * 0.03)}" stroke-width="${i % 3 === 0 ? 2.2 : 1.2}" ${i % 2 ? 'stroke-dasharray="4 16"' : ""}/>`;
  }).join("");
  const dots = Array.from({ length: 14 }, (_, i) => {
    const r = 130 + (i % 8) * 125;
    const a = rand() * Math.PI * 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(18 + rand() * 20)}" fill="${i % 3 === 0 ? "#e6c25a" : "#7aa2ff"}" opacity=".18" filter="url(#b12)"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(5 + rand() * 5)}" fill="${i % 3 === 0 ? "#f3d98a" : "#d7e4ff"}"/>`;
  }).join("");
  const body = `${glow(cx, cy, 800, "#3b6dff", 0.55)}${glow(200, 150, 700, "#1d4ed8", 0.4)}${glow(2200, 1250, 600, "#d4af37", 0.25)}
    <circle cx="${cx}" cy="${cy}" r="260" fill="url(#orb)"/>
    ${rings}${dots}${bokeh(rand, 16, ["#7aa2ff", "#e6c25a", "#4f8bff"])}
    ${star(1200, 180, 24, 0.8)}${star(2250, 330, 20, 0.7)}${star(950, 1100, 16, 0.55)}${star(1500, 1200, 18, 0.6)}`;
  return frame({ fill: "url(#bg4)", defs: `<linearGradient id="bg4" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b2a7a"/><stop offset=".6" stop-color="#071a52"/><stop offset="1" stop-color="#050d24"/></linearGradient>` }, body);
}

/* inner-page header: calm and darker */
function page() {
  const rand = rng(71);
  const body = `${glow(1900, 250, 800, "#2563eb", 0.45)}${glow(2300, 1100, 600, "#d4af37", 0.18)}${glow(100, 150, 700, "#1d4ed8", 0.35)}
    <path d="M-100 900 Q500 700 1100 860 T2500 760 V1400 H-100Z" fill="url(#blue)" opacity=".12"/>
    <path d="M-100 1000 Q600 860 1200 980 T2500 900" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="2"/>
    ${bokeh(rand, 10, ["#7aa2ff", "#e6c25a"])}${star(1700, 300, 20, 0.7)}${star(2150, 560, 14, 0.5)}`;
  return frame({ fill: "url(#bg5)", defs: `<linearGradient id="bg5" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#071b57"/><stop offset="1" stop-color="#050d24"/></linearGradient>` }, body);
}

const jobs = { "slide-1": neural, "slide-2": glassPanels, "slide-3": dataWaves, "slide-4": orbits, page };
await mkdir(out, { recursive: true });
for (const [name, build] of Object.entries(jobs)) {
  const svg = Buffer.from(build());
  const base = sharp(svg, { density: 72 });
  await base.clone().webp({ quality: 74, effort: 5 }).toFile(path.join(out, `${name}.webp`));
  await base.clone().resize(1280).webp({ quality: 72, effort: 5 }).toFile(path.join(out, `${name}-sm.webp`));
  console.log("wrote", name);
}
