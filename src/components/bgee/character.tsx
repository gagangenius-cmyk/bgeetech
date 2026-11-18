import { useId } from "react";
import { cn } from "@/lib/utils";

export type Mood = "happy" | "talking" | "wave" | "think" | "wow";

/**
 * BGee: a friendly little robot drawn in SVG. Everything animates with CSS (bobbing, antenna pulse, waving,
 * talking mouth) except the pupils, which follow `look` (-1..1) and the blink, driven by the parent.
 */
export function BGeeCharacter({ mood, look, blink, walking = false, className }: { mood: Mood; look: { x: number; y: number }; blink: boolean; walking?: boolean; className?: string }) {
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

      <ellipse className="bgee-shadow" cx="60" cy="148" rx="28" ry="4" fill="#000" />

      <g className={walking ? "bgee-step" : "bgee-bob"}>
        {/* legs (behind body) */}
        <g className={walking ? "bgee-leg-a" : undefined} style={{ transformOrigin: "46px 128px" }}>
          <rect x="41" y="126" width="11" height="18" rx="5" fill="#1a3aa8" />
          <ellipse cx="46" cy="145" rx="10" ry="4.5" fill="#e6c25a" />
        </g>
        <g className={walking ? "bgee-leg-b" : undefined} style={{ transformOrigin: "74px 128px" }}>
          <rect x="68" y="126" width="11" height="18" rx="5" fill="#1a3aa8" />
          <ellipse cx="74" cy="145" rx="10" ry="4.5" fill="#e6c25a" />
        </g>
        {/* antenna */}
        <line x1="60" y1="24" x2="60" y2="10" stroke="#9bb8ff" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="60" cy="8" r="13" fill={`url(#${id}-glow)`} />
        <circle className="bgee-antenna" cx="60" cy="8" r="6" fill="#e6c25a" />

        {/* arms (behind body) */}
        <g className={walking ? "bgee-arm-a" : undefined} style={{ transformOrigin: "32px 102px", transform: !walking && mood === "think" ? "rotate(-120deg)" : undefined, transition: "transform .3s" }}>
          <rect x="8" y="96" width="28" height="13" rx="6.5" fill={`url(#${id}-body)`} />
          <circle cx="10" cy="102" r="7" fill="#e6c25a" />
        </g>
        <g className={cn(walking ? "bgee-arm-b" : (mood === "wave" || mood === "wow") && "bgee-waving")} style={{ transformOrigin: "88px 102px" }}>
          <rect x="84" y="96" width="28" height="13" rx="6.5" fill={`url(#${id}-body)`} />
          <circle cx="110" cy="102" r="7" fill="#e6c25a" />
        </g>

        {/* body */}
        <path d="M32 92Q60 84 88 92L98 132Q60 148 22 132Z" fill={`url(#${id}-body)`} />
        <circle cx="60" cy="113" r="11" fill="#fff" opacity=".95" />
        <path d="M57 106v14" stroke="#1a3aa8" strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="62.5" cy="116" r="4" fill="none" stroke="#1a3aa8" strokeWidth="3.4" />
        <circle cx="65" cy="108" r="1.8" fill="#d4a017" />

        {/* hair: side buns and fringe (BGee is a girl) */}
        <circle cx="17" cy="42" r="15" fill="#0b1b4d" />
        <circle cx="103" cy="42" r="15" fill="#0b1b4d" />
        <circle cx="17" cy="42" r="15" fill="none" stroke="#7aa2ff" strokeOpacity=".35" strokeWidth="1.5" />
        <circle cx="103" cy="42" r="15" fill="none" stroke="#7aa2ff" strokeOpacity=".35" strokeWidth="1.5" />
        <rect x="12" y="52" width="10" height="5" rx="2.5" fill="#e6c25a" transform="rotate(-24 17 54)" />
        <rect x="98" y="52" width="10" height="5" rx="2.5" fill="#e6c25a" transform="rotate(24 103 54)" />

        {/* head */}
        <rect x="14" y="22" width="92" height="74" rx="35" fill={`url(#${id}-shell)`} />
        <rect x="23" y="31" width="74" height="57" rx="27" fill="#0b1b4d" />
        <rect x="23" y="31" width="74" height="57" rx="27" fill="none" stroke="#7aa2ff" strokeOpacity=".45" strokeWidth="1.5" />

        {/* eyes */}
        <g className={cn("bgee-eyes", blink && "bgee-blink")} style={{ transformOrigin: "60px 56px" }}>
          {[44, 76].map((cx) => (
            <g key={cx}>
              <ellipse cx={cx} cy="56" rx="10.5" ry="11.5" fill="#fff" />
              <g className="bgee-pupil" style={{ transform: `translate(${px}px, ${py}px)` }}>
                <circle cx={cx} cy="56" r={mood === "wow" ? 6.8 : 5.6} fill="#0b1b4d" />
                <circle cx={cx + 2} cy="53.5" r="1.9" fill="#fff" />
              </g>
            </g>
          ))}
        </g>

        {/* eyelashes */}
        <g stroke="#0b1b4d" strokeWidth="2.6" strokeLinecap="round" className={cn(blink && "bgee-blink")} style={{ transformOrigin: "60px 56px" }}>
          <path d="M33 49l-5-3M35 44l-3-5" />
          <path d="M87 49l5-3M85 44l3-5" />
        </g>
        {/* bow */}
        <g transform="translate(80 24) rotate(18)">
          <path d="M0 0L-13 -8V8Z" fill="#e6c25a" />
          <path d="M0 0L13 -8V8Z" fill="#e6c25a" />
          <circle r="4.2" fill="#c9a227" />
        </g>

        {/* cheeks */}
        <circle cx="33" cy="72" r="5.5" fill="#ff9db8" opacity=".5" />
        <circle cx="87" cy="72" r="5.5" fill="#ff9db8" opacity=".5" />

        {/* mouth */}
        {mood === "talking" ? (
          <>
            <path className="bgee-mouth-a" d="M49 71Q60 86 71 71Z" fill="#f3d98a" />
            <path className="bgee-mouth-b" d="M50 74Q60 80 70 74" stroke="#f3d98a" strokeWidth="3.4" strokeLinecap="round" fill="none" />
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
