// Generates the illustrated banners in /public/images (services, about) as WebP: 1600px plus an 800px mobile version.
// Run with:  node scripts/generate-page-images.mjs
// Original, procedurally drawn artwork in the site's royal-blue and gold style (license-free, reproducible).
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const W = 1600;
const H = 900;
const out = path.join(process.cwd(), "public", "images");

const rng = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const n = (v) => Number(v.toFixed(1));

const defs = `
  <filter id="b8" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
  <filter id="b30" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>
  <filter id="b70" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="70"/></filter>
  <filter id="shadow" x="-30%" y="-30%" width="160%" height="170%"><feGaussianBlur in="SourceAlpha" stdDeviation="22"/><feOffset dy="22"/><feComponentTransfer><feFuncA type="linear" slope=".45"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.2 0 0 0 -0.04"/></filter>
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity=".05"/></linearGradient>
  <linearGradient id="gold" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#f3d98a"/><stop offset="1" stop-color="#d4a017"/></linearGradient>
  <linearGradient id="blue" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#8fb0ff"/><stop offset="1" stop-color="#2563eb"/></linearGradient>
  <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9bb8ff" stop-opacity=".9"/><stop offset="1" stop-color="#2563eb" stop-opacity=".1"/></linearGradient>
  <radialGradient id="orb" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".3" stop-color="#9bb8ff" stop-opacity=".7"/><stop offset=".65" stop-color="#2563eb" stop-opacity=".22"/><stop offset="1" stop-color="#2563eb" stop-opacity="0"/></radialGradient>
`;

const G = (cx, cy, r, c, o) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" opacity="${o}" filter="url(#b70)"/>`;
const star = (x, y, s, o = 0.8) => `<path d="M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z" fill="#fff" opacity="${o}"/>`;
// `hl` highlights the card with a gold outline (one stroke definition only: duplicate attributes break the SVG parser).
const glass = (x, y, w, h, r = 28, hl = false) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#glass)" stroke="${hl ? "#e6c25a" : "#fff"}" stroke-opacity="${hl ? 0.95 : 0.3}" stroke-width="${hl ? 3 : 2}"/>`;
const bar = (x, y, w, h = 16, fill = "#fff", o = 0.3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" opacity="${o}"/>`;
const dots = (x, y) => `<circle cx="${x}" cy="${y}" r="7" fill="#fff" opacity=".45"/><circle cx="${x + 22}" cy="${y}" r="7" fill="#fff" opacity=".3"/><circle cx="${x + 44}" cy="${y}" r="7" fill="#fff" opacity=".2"/>`;
const gearPath = (cx, cy, r, teeth, inner = 0.78) => {
  const pts = [];
  for (let i = 0; i < teeth * 4; i++) {
    const a = (i / (teeth * 4)) * Math.PI * 2;
    const rr = i % 4 === 0 || i % 4 === 1 ? r : r * inner;
    pts.push(`${n(cx + Math.cos(a) * rr)},${n(cy + Math.sin(a) * rr)}`);
  }
  return pts.join(" ");
};

const browser = (x, y, w, h, rot, accent = "url(#blue)") => `<g transform="translate(${x} ${y}) rotate(${rot})" filter="url(#shadow)">
  ${glass(0, 0, w, h, 30)}${dots(34, 34)}
  ${bar(34, 82, w * 0.5, 26, accent, 0.9)}${bar(34, 128, w * 0.38)}${bar(34, 156, w * 0.3, 14, "#fff", 0.2)}
  <rect x="34" y="${h - 90}" width="140" height="48" rx="24" fill="url(#gold)"/>
  <rect x="${w - w * 0.34}" y="82" width="${w * 0.28}" height="${h * 0.52}" rx="22" fill="url(#blue)" opacity=".4"/>
</g>`;

const motifs = {
  "website-development": () => browser(300, 150, 620, 400, -5) + browser(700, 270, 620, 400, 4, "url(#gold)") + browser(540, 520, 520, 300, -2),
  "web-app-development": () => `<g transform="translate(330 150)" filter="url(#shadow)">${glass(0, 0, 940, 600, 34)}${dots(40, 40)}
      ${[0, 1, 2].map((i) => `${glass(40 + i * 290, 80, 260, 110, 20)}${bar(64 + i * 290, 108, 90, 16, "#fff", 0.5)}${bar(64 + i * 290, 140, 150, 28, i === 1 ? "url(#gold)" : "url(#blue)", 0.95)}`).join("")}
      ${[120, 200, 150, 260, 190, 300, 230, 340].map((h, i) => `<rect x="${64 + i * 62}" y="${560 - h}" width="40" height="${h}" rx="12" fill="${i % 3 === 1 ? "url(#gold)" : "url(#blue)"}" opacity=".85"/>`).join("")}
      <circle cx="760" cy="400" r="110" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="34"/>
      <circle cx="760" cy="400" r="110" fill="none" stroke="url(#gold)" stroke-width="34" stroke-dasharray="330 700" stroke-linecap="round" transform="rotate(-90 760 400)"/>
    </g>`,
  "mobile-app-development": () => [0, 1]
    .map((i) => `<g transform="translate(${i ? 830 : 520} ${i ? 160 : 120}) rotate(${i ? 7 : -8})" filter="url(#shadow)">
      ${glass(0, 0, 270, 560, 44)}<rect x="95" y="16" width="80" height="12" rx="6" fill="#fff" opacity=".35"/>
      ${bar(28, 64, 150, 24, i ? "url(#gold)" : "url(#blue)", 0.95)}
      ${[0, 1, 2].map((k) => `${glass(26, 120 + k * 120, 218, 96, 20)}${bar(46, 144 + k * 120, 90, 14, "#fff", 0.4)}${bar(46, 172 + k * 120, 140, 12, "#fff", 0.22)}`).join("")}
      <circle cx="135" cy="512" r="22" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="3"/>
    </g>`)
    .join(""),
  "crm-software": () => `<g transform="translate(250 170)">${[0, 1, 2, 3]
    .map((c) => `<g transform="translate(${c * 300} 0)" filter="url(#shadow)">${glass(0, 0, 270, 560, 28)}${bar(26, 28, 120, 18, c === 2 ? "url(#gold)" : "url(#blue)", 0.95)}
      ${Array.from({ length: 3 - (c % 2) }, (_, k) => `${glass(20, 84 + k * 150, 230, 128, 18, c === 2 && k === 0)}<circle cx="56" cy="${124 + k * 150}" r="20" fill="url(#${(c + k) % 2 ? "gold" : "blue"})"/>${bar(88, 112 + k * 150, 110, 14, "#fff", 0.4)}${bar(88, 138 + k * 150, 80, 12, "#fff", 0.22)}${bar(36, 180 + k * 150, 170, 10, "#fff", 0.18)}`).join("")}
    </g>`)
    .join("")}</g>`,
  "erp-software": () => {
    const cx = 800;
    const cy = 450;
    const mods = Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      return [cx + Math.cos(a) * 310, cy + Math.sin(a) * 290];
    });
    return `${mods.map(([x, y]) => `<line x1="${cx}" y1="${cy}" x2="${n(x)}" y2="${n(y)}" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-dasharray="4 12"/>`).join("")}
      ${mods.map(([x, y], i) => `<g transform="translate(${n(x - 80)} ${n(y - 80)})" filter="url(#shadow)">${glass(0, 0, 160, 160, 34)}${[0, 1, 2].map((k) => bar(30, 42 + k * 34, 100 - k * 22, 14, i % 2 ? "url(#gold)" : "url(#blue)", 0.9)).join("")}</g>`).join("")}
      <circle cx="${cx}" cy="${cy}" r="120" fill="url(#orb)"/><circle cx="${cx}" cy="${cy}" r="74" fill="url(#gold)" filter="url(#shadow)"/>
      <circle cx="${cx}" cy="${cy}" r="46" fill="none" stroke="#fff" stroke-width="8" stroke-opacity=".9"/>`;
  },
  "pos-hrms-software": () => `<g transform="translate(480 100) rotate(-4)" filter="url(#shadow)">
      <path d="M0 0H380V640l-32-24-31 24-32-24-31 24-32-24-31 24-32-24-31 24-32-24-31 24-32-24-31 24-3-2Z" fill="url(#glass)" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>
      ${bar(40, 50, 180, 24, "url(#gold)", 0.95)}
      ${Array.from({ length: 6 }, (_, k) => `${bar(40, 120 + k * 56, 190 - (k % 3) * 40, 14, "#fff", 0.35)}${bar(300, 120 + k * 56, 40, 14, "#fff", 0.35)}`).join("")}
      <rect x="40" y="500" width="300" height="54" rx="27" fill="url(#blue)"/>
    </g>
    <g transform="translate(920 360) rotate(5)" filter="url(#shadow)">${glass(0, 0, 330, 420, 36)}<rect x="30" y="30" width="270" height="110" rx="18" fill="url(#blue)" opacity=".55"/>
      ${Array.from({ length: 9 }, (_, k) => `<circle cx="${70 + (k % 3) * 100}" cy="${220 + Math.floor(k / 3) * 68}" r="24" fill="#fff" opacity="${k === 8 ? 0.9 : 0.25}"/>`).join("")}</g>`,
  "ecommerce-development": () => `<g filter="url(#shadow)">
      <path d="M430 240h110l90 340h500l80-260H600" fill="none" stroke="url(#gold)" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="690" cy="680" r="48" fill="url(#glass)" stroke="#fff" stroke-width="12" stroke-opacity=".8"/><circle cx="1090" cy="680" r="48" fill="url(#glass)" stroke="#fff" stroke-width="12" stroke-opacity=".8"/>
      ${[0, 1, 2].map((i) => `<g transform="translate(${660 + i * 190} ${180 - (i % 2) * 40}) rotate(${i * 6 - 6})">${glass(0, 0, 160, 170, 22)}<rect x="68" y="0" width="24" height="170" fill="url(#gold)" opacity=".85"/><rect x="0" y="62" width="160" height="22" fill="url(#blue)" opacity=".6"/></g>`).join("")}
    </g>`,
  "ai-solutions": () => {
    const r = rng(5);
    const pts = Array.from({ length: 34 }, () => ({ x: 420 + r() * 760, y: 130 + r() * 640 }));
    let e = "";
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y); if (d < 230) e += `<line x1="${n(pts[i].x)}" y1="${n(pts[i].y)}" x2="${n(pts[j].x)}" y2="${n(pts[j].y)}" stroke="#9bb8ff" stroke-opacity="${n((1 - d / 230) * 0.7)}" stroke-width="2"/>`; }
    return `${e}${pts.map((p, i) => `<circle cx="${n(p.x)}" cy="${n(p.y)}" r="${n(14 + (i % 3) * 5)}" fill="#4f8bff" opacity=".25" filter="url(#b8)"/><circle cx="${n(p.x)}" cy="${n(p.y)}" r="${6 + (i % 3) * 2}" fill="${i % 5 === 0 ? "#f3d98a" : "#e2ecff"}"/>`).join("")}
      <circle cx="1130" cy="440" r="240" fill="url(#orb)"/><circle cx="1130" cy="440" r="86" fill="url(#glass)" stroke="#fff" stroke-width="3" stroke-opacity=".6" filter="url(#shadow)"/>
      <text x="1130" y="472" font-size="92" font-weight="800" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif">AI</text>`;
  },
  "automation-integrations": () => `<g filter="url(#shadow)">
      <polygon points="${gearPath(760, 430, 210, 12)}" fill="url(#glass)" stroke="#fff" stroke-opacity=".5" stroke-width="3"/><circle cx="760" cy="430" r="84" fill="url(#gold)" opacity=".9"/><circle cx="760" cy="430" r="40" fill="#0a2063"/>
      <polygon points="${gearPath(1090, 280, 130, 9)}" fill="url(#glass)" stroke="#fff" stroke-opacity=".5" stroke-width="3" transform="rotate(14 1090 280)"/><circle cx="1090" cy="280" r="46" fill="url(#blue)"/>
      <polygon points="${gearPath(1010, 640, 110, 8)}" fill="url(#glass)" stroke="#fff" stroke-opacity=".5" stroke-width="3"/><circle cx="1010" cy="640" r="38" fill="url(#gold)" opacity=".85"/>
      <path d="M380 220C470 150 570 150 640 200" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 16"/><path d="M590 640C500 740 400 720 340 650" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 16"/>
    </g>`,
  "bug-fixing-maintenance": () => `<g filter="url(#shadow)">
      ${[-1, 1].flatMap((s) => [0, 1, 2].map((k) => `<path d="M${800 + s * 100} ${400 + k * 70}L${800 + s * 270} ${340 + k * 120}" stroke="#fff" stroke-opacity=".7" stroke-width="16" stroke-linecap="round"/>`)).join("")}
      <path d="M760 220C720 160 700 140 680 130M840 220C880 160 900 140 920 130" stroke="#fff" stroke-opacity=".7" stroke-width="10" stroke-linecap="round" fill="none"/>
      <ellipse cx="800" cy="470" rx="150" ry="210" fill="url(#glass)" stroke="#fff" stroke-opacity=".7" stroke-width="4"/><circle cx="800" cy="260" r="68" fill="url(#glass)" stroke="#fff" stroke-opacity=".7" stroke-width="4"/>
      <line x1="800" y1="300" x2="800" y2="670" stroke="#fff" stroke-opacity=".5" stroke-width="5"/>
      ${[400, 480, 560].map((y) => `<circle cx="${735}" cy="${y}" r="20" fill="url(#gold)"/><circle cx="${865}" cy="${y}" r="20" fill="url(#gold)"/>`).join("")}
      <circle cx="1090" cy="560" r="130" fill="url(#glass)" stroke="#fff" stroke-width="12" stroke-opacity=".85"/><line x1="1182" y1="652" x2="1290" y2="760" stroke="#fff" stroke-width="22" stroke-linecap="round" stroke-opacity=".85"/>
      <circle cx="1090" cy="560" r="62" fill="url(#gold)"/><path d="M1060 560l24 26 46-52" fill="none" stroke="#0a2063" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`,
  "ui-ux-design": () => `<g filter="url(#shadow)">
      <circle cx="660" cy="420" r="210" fill="#3b6dff" opacity=".7"/><circle cx="900" cy="420" r="210" fill="#e6c25a" opacity=".65"/><circle cx="780" cy="590" r="210" fill="#9bb8ff" opacity=".65"/>
      <circle cx="780" cy="470" r="64" fill="#fff" opacity=".85"/>
      <path d="M1180 250C1290 330 1230 450 1330 520" fill="none" stroke="url(#gold)" stroke-width="24" stroke-linecap="round"/><path d="M1200 190C1340 250 1380 380 1300 600" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="10" stroke-linecap="round" stroke-dasharray="2 18"/>
      ${["#3b6dff", "#e6c25a", "#9bb8ff", "#fff"].map((c, i) => `<rect x="${1090 + i * 64}" y="700" width="50" height="50" rx="14" fill="${c}" opacity=".9"/>`).join("")}
    </g>`,
  "seo-digital-marketing": () => `<g filter="url(#shadow)">
      ${[110, 170, 150, 250, 220, 340, 300, 420].map((h, i) => `<rect x="${360 + i * 90}" y="${700 - h}" width="60" height="${h}" rx="16" fill="${i === 7 ? "url(#gold)" : "url(#blue)"}" opacity=".9"/>`).join("")}
      <path d="M380 560L560 470 700 500 880 340 1030 380 1180 200" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M1120 190l70 6-14 68" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="1230" cy="610" r="120" fill="url(#glass)" stroke="#fff" stroke-width="14" stroke-opacity=".85"/><line x1="1316" y1="696" x2="1400" y2="780" stroke="#fff" stroke-width="26" stroke-linecap="round" stroke-opacity=".85"/>
    </g>`,
  "cloud-hosting-devops": () => `<g filter="url(#shadow)">
      <path d="M560 400a110 110 0 0 1 120-110 150 150 0 0 1 280-30 130 130 0 0 1 150 130 100 100 0 0 1 20 200H600a100 100 0 0 1-40-190Z" fill="url(#glass)" stroke="#fff" stroke-opacity=".6" stroke-width="4"/>
      ${[0, 1, 2].map((i) => `<g transform="translate(${580 + i * 230} 600)">${glass(0, 0, 190, 150, 20)}${[0, 1, 2].map((k) => `<circle cx="34" cy="${34 + k * 38}" r="8" fill="${k === 0 ? "#e6c25a" : "#8fb0ff"}"/>${bar(60, 28 + k * 38, 100, 12, "#fff", 0.3)}`).join("")}</g>`).join("")}
      ${[0, 1, 2].map((i) => `<path d="M${675 + i * 230} 596V500" stroke="#fff" stroke-opacity=".7" stroke-width="5" stroke-dasharray="3 12" stroke-linecap="round"/>`).join("")}
      <path d="M1180 340l-34-50-34 50M1146 290v100" fill="none" stroke="url(#gold)" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`,
  "security-audit": () => `<g filter="url(#shadow)">
      <circle cx="800" cy="450" r="330" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="3"/><circle cx="800" cy="450" r="270" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="3" stroke-dasharray="4 14"/>
      <path d="M800 130L1060 230V470C1060 650 930 750 800 800C670 750 540 650 540 470V230Z" fill="url(#glass)" stroke="#fff" stroke-opacity=".7" stroke-width="5"/>
      <path d="M800 190L1000 268V470C1000 610 905 690 800 735C695 690 600 610 600 470V268Z" fill="url(#blue)" opacity=".45"/>
      <circle cx="800" cy="460" r="100" fill="url(#gold)"/><path d="M752 460l36 38 70-80" fill="none" stroke="#0a2063" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`,
  "technology-consulting": () => `<g filter="url(#shadow)">
      <g transform="translate(430 180)"><path d="M40 0H620a40 40 0 0 1 40 40V260a40 40 0 0 1-40 40H260L130 380V300H40a40 40 0 0 1-40-40V40A40 40 0 0 1 40 0Z" fill="url(#glass)" stroke="#fff" stroke-opacity=".6" stroke-width="3"/>${bar(60, 60, 380, 22, "url(#blue)", 0.95)}${bar(60, 110, 520, 16)}${bar(60, 146, 440, 16, "#fff", 0.22)}${bar(60, 200, 160, 40, "url(#gold)", 0.95)}</g>
      <g transform="translate(830 470)"><path d="M40 0H460a40 40 0 0 1 40 40V180a40 40 0 0 1-40 40H400V300L290 220H40a40 40 0 0 1-40-40V40A40 40 0 0 1 40 0Z" fill="url(#blue)" opacity=".55" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>${[0, 1, 2].map((k) => `<circle cx="${90 + k * 50}" cy="110" r="14" fill="#fff" opacity="${0.9 - k * 0.25}"/>`).join("")}</g>
    </g>`,
  about: () => {
    const r = rng(9);
    const people = [[800, 330, 92], [560, 480, 70], [1040, 480, 70], [420, 330, 54], [1180, 330, 54], [680, 650, 60], [920, 650, 60]];
    return `${people.flatMap(([x, y], i) => people.slice(i + 1).map(([x2, y2]) => `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="#9bb8ff" stroke-opacity=".3" stroke-width="2.5" stroke-dasharray="3 10"/>`)).join("")}
      ${people.map(([x, y, rad], i) => `<g filter="url(#shadow)"><circle cx="${x}" cy="${y}" r="${rad + 18}" fill="${i === 0 ? "#e6c25a" : "#4f8bff"}" opacity=".2"/><circle cx="${x}" cy="${y}" r="${rad}" fill="url(#glass)" stroke="${i === 0 ? "#f3d98a" : "#fff"}" stroke-opacity=".8" stroke-width="4"/>
        <circle cx="${x}" cy="${y - rad * 0.2}" r="${rad * 0.32}" fill="${i === 0 ? "url(#gold)" : "#fff"}" opacity=".9"/><path d="M${x - rad * 0.58} ${y + rad * 0.72}a${rad * 0.58} ${rad * 0.5} 0 0 1 ${rad * 1.16} 0" fill="${i === 0 ? "url(#gold)" : "#fff"}" opacity=".85"/></g>`).join("")}
      ${Array.from({ length: 8 }, () => star(300 + r() * 1000, 120 + r() * 660, 10 + r() * 12, 0.6)).join("")}`;
  },
};

const hues = [
  ["#071b57", "#0a2368", "#050d24"],
  ["#06194f", "#0b2a7a", "#050d24"],
  ["#0a2063", "#0d3394", "#050d24"],
];

function scene(name, idx) {
  const r = rng(idx * 17 + 3);
  const [a, b, c] = hues[idx % 3];
  const bokeh = Array.from({ length: 12 }, () => `<circle cx="${n(r() * W)}" cy="${n(r() * H)}" r="${n(14 + r() * 56)}" fill="${r() > 0.5 ? "#e6c25a" : "#7aa2ff"}" opacity="${n(0.05 + r() * 0.1)}" filter="url(#b30)"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>${defs}<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    ${G(1250, 250, 560, "#3b6dff", 0.5)}${G(300, 780, 480, "#1d4ed8", 0.4)}${G(1450, 800, 380, "#ffb020", 0.1)}
    ${bokeh}
    ${motifs[name]()}
    ${star(300, 160, 20)}${star(1380, 130, 16, 0.7)}${star(1480, 640, 14, 0.6)}${star(240, 560, 12, 0.5)}
    <rect width="${W}" height="${H}" filter="url(#grain)"/>
  </svg>`;
}

const dirs = { services: path.join(out, "services") };
await mkdir(dirs.services, { recursive: true });
const names = Object.keys(motifs);
for (const [i, name] of names.entries()) {
  const file = name === "about" ? path.join(out, "about") : path.join(dirs.services, name);
  const base = sharp(Buffer.from(scene(name, i)), { density: 72 });
  await base.clone().webp({ quality: 76, effort: 5 }).toFile(`${file}.webp`);
  await base.clone().resize(800).webp({ quality: 72, effort: 5 }).toFile(`${file}-sm.webp`);
  console.log("wrote", name);
}
