import type { ReactNode } from "react";

/** Infinite, pause-on-hover marquee. Pure CSS, so it ships no JS. */
export function Marquee({ children }: { children: ReactNode }) {
  return (
    <div
      className="group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]"
      aria-hidden
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          className="flex min-w-full shrink-0 animate-marquee items-center gap-4 pr-4 group-hover:[animation-play-state:paused]"
        >
          {children}
        </div>
      ))}
    </div>
  );
}
