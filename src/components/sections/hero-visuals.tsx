"use client";

import { motion, useReducedMotion } from "motion/react";
import { Bot, Brain, Cpu, Sparkles, Workflow } from "lucide-react";

/* ---------- 1. Neural network ---------- */
const layers = [4, 5, 5, 3];
const xs = [70, 165, 275, 370];
const nodes = layers.map((n, li) => Array.from({ length: n }, (_, i) => ({ x: xs[li], y: 70 + ((300 / (n + 1)) * (i + 1)) })));

export function NeuralVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div aria-hidden className="absolute inset-8 rounded-full bg-blue-500/25 blur-[70px]" />
      <svg viewBox="0 0 440 440" className="relative size-full" role="img" aria-label="Animated neural network illustration">
        <defs>
          <linearGradient id="edge" x1="0" x2="1">
            <stop offset="0" stopColor="#7aa2ff" />
            <stop offset="1" stopColor="#e6c25a" />
          </linearGradient>
          <radialGradient id="core" cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="#fff" stopOpacity=".95" />
            <stop offset="1" stopColor="#7aa2ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="220" cy="220" r="190" fill="none" stroke="#fff" strokeOpacity=".08" strokeDasharray="2 8" className="spin-slow" />
        <circle cx="220" cy="220" r="150" fill="none" stroke="#fff" strokeOpacity=".06" />
        {nodes.slice(0, -1).flatMap((layer, li) =>
          layer.flatMap((a, ai) =>
            nodes[li + 1].map((b, bi) => (
              <line key={`${li}-${ai}-${bi}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="url(#edge)" strokeOpacity=".42" strokeWidth="1.2" className="neural-line" style={{ animationDelay: `${((li * 7 + ai * 3 + bi) % 10) * -0.24}s` }} />
            )),
          ),
        )}
        {nodes.flat().map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r="7" fill={i % 3 === 0 ? "#e6c25a" : "#9bb8ff"} className="neural-node" style={{ animationDelay: `${(i % 8) * -0.4}s` }} />
        ))}
        <circle cx="220" cy="220" r="46" fill="url(#core)" />
      </svg>
      <div className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-white/20 bg-ink/80 shadow-xl backdrop-blur">
        <Brain className="size-8 text-amber-300" aria-hidden />
      </div>
      <span className="absolute -left-2 top-6 flex animate-float items-center gap-2 rounded-2xl border border-white/15 bg-ink/85 px-3 py-2 text-xs font-medium text-white shadow-xl backdrop-blur">
        <Cpu className="size-4 text-blue-300" aria-hidden /> Machine learning
      </span>
      <span className="absolute -right-2 top-1/3 flex animate-float-slow items-center gap-2 rounded-2xl border border-white/15 bg-ink/85 px-3 py-2 text-xs font-medium text-white shadow-xl backdrop-blur">
        <Workflow className="size-4 text-amber-300" aria-hidden /> Automation
      </span>
      <span className="absolute bottom-6 left-4 flex animate-float items-center gap-2 rounded-2xl border border-white/15 bg-ink/85 px-3 py-2 text-xs font-medium text-white shadow-xl backdrop-blur [animation-delay:-3s]">
        <Sparkles className="size-4 text-blue-300" aria-hidden /> Insights
      </span>
    </div>
  );
}

/* ---------- 2. Website builder ---------- */
const palettes = [
  ["#1d4ed8", "#e6c25a", "#eef3ff"],
  ["#7c3aed", "#f472b6", "#f5f0ff"],
  ["#0f766e", "#f59e0b", "#ecfdf5"],
  ["#be123c", "#38bdf8", "#fff1f2"],
];

export function BuilderVisual() {
  const reduce = useReducedMotion();
  const loop = { duration: 12, repeat: Infinity, ease: "easeInOut" as const };
  const cyc = (i: number) => (reduce ? palettes[0][i] : [...palettes.map((p) => p[i]), palettes[0][i]]);
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div aria-hidden className="absolute inset-6 rounded-full bg-amber-400/20 blur-[70px]" />
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white shadow-2xl shadow-black/40">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-3 py-2">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-green-400" />
          <span className="mx-auto rounded-md bg-white px-3 py-0.5 text-[10px] text-slate-500">https://yourbusiness.com</span>
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between pb-3">
            <motion.span className="size-6 rounded-lg" animate={{ backgroundColor: cyc(0) }} transition={loop} />
            <div className="flex gap-3 text-[9px] font-semibold text-slate-400">
              <span>Home</span>
              <span>Services</span>
              <span>Contact</span>
            </div>
          </div>
          <motion.div className="rounded-xl p-4" animate={{ backgroundColor: cyc(2) }} transition={loop}>
            <div className="h-3 w-3/4 rounded bg-slate-800/80" />
            <div className="mt-2 h-3 w-1/2 rounded bg-slate-800/60" />
            <div className="mt-3 h-2 w-2/3 rounded bg-slate-400/50" />
            <motion.div className="mt-4 h-7 w-24 rounded-full" animate={{ backgroundColor: cyc(0) }} transition={loop} />
          </motion.div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-2">
                <motion.div className="size-5 rounded-md" animate={{ backgroundColor: cyc(1) }} transition={loop} />
                <div className="mt-2 h-2 w-4/5 rounded bg-slate-300" />
                <div className="mt-1 h-2 w-3/5 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <span className="absolute -right-3 -top-3 flex animate-float items-center gap-2 rounded-2xl border border-white/15 bg-ink/90 px-3 py-2 text-xs font-medium text-white shadow-xl backdrop-blur">
        <Sparkles className="size-4 text-amber-300" aria-hidden /> 100 colour themes
      </span>
      <div className="absolute -bottom-5 -left-3 flex animate-float-slow gap-1.5 rounded-2xl border border-white/15 bg-ink/90 p-2.5 shadow-xl backdrop-blur" aria-hidden>
        {palettes.map((p) => (
          <span key={p[0]} className="flex overflow-hidden rounded-md">
            {p.map((c) => (
              <span key={c} className="h-5 w-2.5" style={{ background: c }} />
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- 3. CRM / dashboard demo ---------- */
export function DashboardVisual() {
  const reduce = useReducedMotion();
  const bars = [40, 62, 48, 78, 56, 90, 70, 96];
  const kpis = [
    ["New leads", "24"],
    ["Open deals", "8"],
    ["Site visits", "12"],
  ];
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div aria-hidden className="absolute inset-6 rounded-full bg-blue-500/25 blur-[70px]" />
      <div className="relative rounded-2xl border border-white/15 bg-white/[0.08] p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg font-bold text-white">Real Estate CRM</p>
          <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">Live demo</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {kpis.map(([k, v]) => (
            <div key={k} className="rounded-xl bg-white/[0.07] p-2.5">
              <p className="text-[10px] text-white/55">{k}</p>
              <p className="font-display text-2xl font-extrabold text-white">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex h-28 items-end gap-2 rounded-xl bg-white/[0.05] p-3" aria-hidden>
          {bars.map((h, i) => (
            <motion.span
              key={i}
              className="flex-1 rounded-t-md bg-linear-to-t from-blue-500 to-amber-300"
              initial={{ height: `${h * 0.4}%` }}
              animate={reduce ? { height: `${h}%` } : { height: [`${h * 0.5}%`, `${h}%`, `${h * 0.65}%`, `${h}%`] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
            />
          ))}
        </div>
        <div className="mt-3 space-y-2">
          {["Villa enquiry, Dubai Marina", "Site visit booked, Saturday", "Follow-up due today"].map((t, i) => (
            <div key={t} className="flex items-center gap-2 rounded-lg bg-white/[0.05] px-3 py-2 text-[11px] text-white/80">
              <span className={`size-2 rounded-full ${["bg-amber-300", "bg-emerald-300", "bg-blue-300"][i]}`} /> {t}
            </div>
          ))}
        </div>
      </div>
      <span className="absolute -right-3 -top-3 animate-float rounded-2xl border border-white/15 bg-ink/90 px-3 py-2 text-xs font-medium text-white shadow-xl backdrop-blur">CRM · POS · HRMS</span>
    </div>
  );
}

/* ---------- 4. AI chat ---------- */
export function ChatVisual() {
  const reduce = useReducedMotion();
  const pop = (delay: number) => ({ initial: reduce ? false : { opacity: 0, y: 14, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } });
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div aria-hidden className="absolute inset-6 rounded-full bg-amber-400/20 blur-[70px]" />
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.08] shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-3 border-b border-white/10 bg-ink/70 px-4 py-3">
          <span className="grid size-9 place-items-center rounded-full bg-linear-to-br from-blue-500 to-amber-400">
            <Bot className="size-5 text-white" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-bold text-white">BGeetech AI</p>
            <p className="flex items-center gap-1.5 text-[11px] text-white/60">
              <span className="size-1.5 rounded-full bg-emerald-400" /> Online 24/7
            </p>
          </div>
        </div>
        <div className="space-y-3 p-4 text-[13px]">
          <motion.p {...pop(0.2)} className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-blue-600 px-3.5 py-2.5 text-white">
            What can AI automate for my business?
          </motion.p>
          <motion.p {...pop(1.1)} className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white/10 px-3.5 py-2.5 text-white/90">
            Great question! Usually repetitive work: lead follow-ups, reporting, data entry and support replies. Want me to map yours?
          </motion.p>
          <motion.div {...pop(2.0)} className="flex gap-1.5 pl-1" aria-hidden>
            {[0, 1, 2].map((d) => (
              <span key={d} className="size-2 animate-bounce rounded-full bg-white/50" style={{ animationDelay: `${d * 0.15}s` }} />
            ))}
          </motion.div>
        </div>
      </div>
      <span className="absolute -left-3 -top-3 flex animate-float items-center gap-2 rounded-2xl border border-white/15 bg-ink/90 px-3 py-2 text-xs font-medium text-white shadow-xl backdrop-blur">
        <Sparkles className="size-4 text-amber-300" aria-hidden /> Instant answers
      </span>
    </div>
  );
}
