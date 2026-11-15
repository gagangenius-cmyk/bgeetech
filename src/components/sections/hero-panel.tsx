"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { CheckCircle2, Video, Zap } from "lucide-react";

/** Floating glass "booking preview" card with cursor-driven 3D tilt and drifting chips. */
export function HeroPanel() {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-9, 9]), { stiffness: 120, damping: 18 });

  const slots = ["09:00", "10:30", "13:00", "15:30"];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.94, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onPointerMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ perspective: 1000 }}
      className="relative mx-auto w-full max-w-md"
    >
      <motion.div
        style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative rounded-3xl border border-white/15 bg-white/[0.07] p-6 shadow-2xl shadow-blue-950/50 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/50">Next available</p>
            <p className="mt-1 font-display text-xl font-bold">Strategy session</p>
          </div>
          <span className="rounded-full bg-teal-400/15 px-3 py-1 text-xs font-semibold text-teal-300">60 min</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {slots.map((s, i) => (
            <motion.button
              key={s}
              type="button"
              tabIndex={-1}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className={`min-h-11 rounded-xl border px-3 text-sm font-medium tabular-nums ${
                i === 1
                  ? "border-blue-400 bg-blue-500/25 text-white"
                  : "border-white/10 bg-white/5 text-white/75 hover:border-white/30"
              }`}
            >
              {s}
            </motion.button>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/5 p-3.5 text-sm">
          <Video className="size-5 text-blue-300" aria-hidden />
          <span className="text-white/75">Video link sent instantly after booking</span>
        </div>

        {/* floating chips */}
        <motion.div
          style={reduce ? undefined : { translateZ: 60 }}
          className="absolute -left-6 -top-5 flex animate-float items-center gap-2 rounded-2xl border border-white/15 bg-ink/90 px-3.5 py-2.5 text-xs font-medium shadow-xl backdrop-blur"
        >
          <CheckCircle2 className="size-4 text-teal-300" aria-hidden /> Booking confirmed
        </motion.div>
        <motion.div
          style={reduce ? undefined : { translateZ: 80 }}
          className="absolute -bottom-6 -right-4 flex animate-float-slow items-center gap-2 rounded-2xl border border-white/15 bg-ink/90 px-3.5 py-2.5 text-xs font-medium shadow-xl backdrop-blur"
        >
          <Zap className="size-4 text-amber-300" aria-hidden /> Reply within 24h
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
