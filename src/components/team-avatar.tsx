import { useId } from "react";

export type AvatarSpec = {
  skin: string;
  hair: string;
  hairStyle: "short" | "long" | "bun" | "wavy";
  shirt: string;
  bg: [string, string];
  glasses?: boolean;
};

/** Flat vector avatar drawn entirely in SVG (no image files), themed per person. */
export function TeamAvatar({ spec, name, className }: { spec: AvatarSpec; name: string; className?: string }) {
  const id = useId();
  const { skin, hair, hairStyle, shirt, bg, glasses } = spec;
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={`Illustrated portrait of ${name}`}>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={bg[0]} />
          <stop offset="1" stopColor={bg[1]} />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <circle cx="100" cy="100" r="100" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect width="200" height="200" fill={`url(#${id}-bg)`} />
        {/* soft decorative shapes */}
        <circle cx="38" cy="44" r="22" fill="#fff" opacity=".1" />
        <circle cx="168" cy="150" r="30" fill="#fff" opacity=".08" />
        <path d="M0 150 Q60 120 120 150 T200 140 V200 H0Z" fill="#000" opacity=".06" />

        {/* back hair for long / wavy styles */}
        {hairStyle === "long" && <path d="M54 92c-4 46 6 70 18 76h56c12-6 22-30 18-76 0-34-22-52-46-52S58 58 54 92Z" fill={hair} />}
        {hairStyle === "wavy" && (
          <path d="M52 96c-6 22 0 40 10 52 6 6 10-2 8-10-4-14 0-24 4-34l60 0c4 10 8 20 4 34-2 8 2 16 8 10 10-12 16-30 10-52-4-30-24-48-52-48S56 66 52 96Z" fill={hair} />
        )}

        {/* shoulders */}
        <path d="M28 200c2-38 28-58 72-58s70 20 72 58Z" fill={shirt} />
        <path d="M84 142h32l-4 22q-12 10-24 0Z" fill="#fff" opacity=".9" />
        {/* neck */}
        <path d="M86 118h28v28q-14 12-28 0Z" fill={skin} />
        <path d="M86 132q14 10 28 0v-8h-28Z" fill="#000" opacity=".08" />

        {/* head */}
        <ellipse cx="100" cy="92" rx="34" ry="38" fill={skin} />
        <ellipse cx="66" cy="96" rx="5" ry="8" fill={skin} />
        <ellipse cx="134" cy="96" rx="5" ry="8" fill={skin} />

        {/* front hair */}
        {hairStyle === "short" && <path d="M64 86c-2-30 18-46 38-44 22 2 36 18 32 44-6-12-14-20-28-22-14 4-30 6-42 22Z" fill={hair} />}
        {hairStyle === "long" && <path d="M64 84c0-26 16-42 38-42s36 16 34 42c-10-6-22-18-30-24-8 12-24 20-42 24Z" fill={hair} />}
        {hairStyle === "bun" && (
          <>
            <circle cx="100" cy="42" r="13" fill={hair} />
            <path d="M64 88c-2-30 16-44 36-44s38 14 36 44c-8-14-22-22-36-22S72 74 64 88Z" fill={hair} />
          </>
        )}
        {hairStyle === "wavy" && <path d="M62 86c0-28 16-44 40-44s38 16 36 44c-8-4-16-14-20-24-12 10-34 18-56 24Z" fill={hair} />}

        {/* face */}
        <ellipse cx="86" cy="94" rx="3.4" ry="4.2" fill="#1f2937" />
        <ellipse cx="114" cy="94" rx="3.4" ry="4.2" fill="#1f2937" />
        <path d="M80 85q6-4 12-1M108 84q6-3 12 1" stroke="#1f2937" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity=".7" />
        <path d="M100 98q-3 8 1 10" stroke="#000" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".22" />
        <path d="M88 111q12 9 24 0" stroke="#7c2d2d" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="80" cy="106" r="5" fill="#f472b6" opacity=".18" />
        <circle cx="120" cy="106" r="5" fill="#f472b6" opacity=".18" />
        {glasses && (
          <g fill="none" stroke="#111827" strokeWidth="2.6">
            <rect x="73" y="84" width="24" height="18" rx="8" />
            <rect x="103" y="84" width="24" height="18" rx="8" />
            <path d="M97 92h6" />
          </g>
        )}
      </g>
    </svg>
  );
}
