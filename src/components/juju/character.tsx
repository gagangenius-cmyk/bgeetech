import { useId } from "react";
import { cn } from "@/lib/utils";

export type Mood = "happy" | "talking" | "wave" | "think" | "wow";

/**
 * Juju: a friendly little robot drawn in SVG. Everything animates with CSS (bobbing, antenna pulse, waving,
 * talking mouth) except the pupils, which follow `look` (-1..1) and the blink, driven by the parent.
 */
export function JujuCharacter({ mood, look, blink, className }: { mood: Mood; look: { x: number; y: number }; blink: boolean; className?: string }) {
  const id = useId();
  const px = look.x * 4.2;
  const py = look.y * 3.6;

  return (
    <svg viewBox="0 0 120 150" className={cn("overflow-visible drop-shadow-xl", className)} aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f8bff" />
          <stop offset="1" stopColor="#1a3aa8" />
        </linearGradient>
        <linearGradient id={`${id}-shell`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#bcd0ff" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#f3d98a" stopOpacity=".9" />
          <stop offset="1" stopColor="#f3d98a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse className="juju-shadow" cx="60" cy="144" rx="30" ry="5" fill="#000" />

      <g className="juju-bob">
        {/* antenna */}
        <line x1="60" y1="24" x2="60" y2="10" stroke="#9bb8ff" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="60" cy="8" r="13" fill={`url(#${id}-glow)`} />
        <circle className="juju-antenna" cx="60" cy="8" r="6" fill="#e6c25a" />

        {/* arms (behind body) */}
        <g style={{ transformOrigin: "32px 102px", transform: mood === "think" ? "rotate(-120deg)" : undefined, transition: "transform .3s" }}>
          <rect x="8" y="96" width="28" height="13" rx="6.5" fill={`url(#${id}-body)`} />
          <circle cx="10" cy="102" r="7" fill="#e6c25a" />
        </g>
        <g className={cn((mood === "wave" || mood === "wow") && "juju-waving")} style={{ transformOrigin: "88px 102px" }}>
          <rect x="84" y="96" width="28" height="13" rx="6.5" fill={`url(#${id}-body)`} />
          <circle cx="110" cy="102" r="7" fill="#e6c25a" />
        </g>

        {/* body */}
        <path d="M32 92Q60 84 88 92L95 130Q60 146 25 130Z" fill={`url(#${id}-body)`} />
        <circle cx="60" cy="113" r="11" fill="#fff" opacity=".95" />
        <path d="M57 106v14" stroke="#1a3aa8" strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="62.5" cy="116" r="4" fill="none" stroke="#1a3aa8" strokeWidth="3.4" />
        <circle cx="65" cy="108" r="1.8" fill="#d4a017" />

        {/* head */}
        <rect x="14" y="22" width="92" height="74" rx="35" fill={`url(#${id}-shell)`} />
        <rect x="23" y="31" width="74" height="57" rx="27" fill="#0b1b4d" />
        <rect x="23" y="31" width="74" height="57" rx="27" fill="none" stroke="#7aa2ff" strokeOpacity=".45" strokeWidth="1.5" />

        {/* eyes */}
        <g className={cn("juju-eyes", blink && "juju-blink")} style={{ transformOrigin: "60px 56px" }}>
          {[44, 76].map((cx) => (
            <g key={cx}>
              <ellipse cx={cx} cy="56" rx="10.5" ry="11.5" fill="#fff" />
              <g className="juju-pupil" style={{ transform: `translate(${px}px, ${py}px)` }}>
                <circle cx={cx} cy="56" r={mood === "wow" ? 6.8 : 5.6} fill="#0b1b4d" />
                <circle cx={cx + 2} cy="53.5" r="1.9" fill="#fff" />
              </g>
            </g>
          ))}
        </g>

        {/* cheeks */}
        <circle cx="33" cy="72" r="5" fill="#e6c25a" opacity=".38" />
        <circle cx="87" cy="72" r="5" fill="#e6c25a" opacity=".38" />

        {/* mouth */}
        {mood === "talking" ? (
          <>
            <path className="juju-mouth-a" d="M49 71Q60 86 71 71Z" fill="#f3d98a" />
            <path className="juju-mouth-b" d="M50 74Q60 80 70 74" stroke="#f3d98a" strokeWidth="3.4" strokeLinecap="round" fill="none" />
          </>
        ) : mood === "wow" ? (
          <ellipse cx="60" cy="76" rx="6" ry="7" fill="#f3d98a" />
        ) : mood === "think" ? (
          <path d="M51 76Q60 73 69 77" stroke="#f3d98a" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M49 72Q60 84 71 72" stroke="#f3d98a" strokeWidth="3.6" strokeLinecap="round" fill="none" />
        )}
      </g>
    </svg>
  );
}
