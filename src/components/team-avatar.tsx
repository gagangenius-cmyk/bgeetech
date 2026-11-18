import { useId } from "react";

export type AvatarSpec = {
  skin: string;
  hair: string;
  hairStyle: "short" | "quiff" | "crop" | "long" | "bun" | "wavy";
  shirt: string;
  bg: [string, string];
  glasses?: boolean;
  beard?: boolean;
  mustache?: boolean;
  /** Feminine presentation details: lashes, fuller lips, earrings. */
  feminine?: boolean;
};

/** Flat vector avatar drawn entirely in SVG (no image files), themed per person. */
export function TeamAvatar({ spec, name, className }: { spec: AvatarSpec; name: string; className?: string }) {
  const id = useId();
  const { skin, hair, hairStyle, shirt, bg, glasses, beard, mustache, feminine } = spec;
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
        <circle cx="38" cy="44" r="22" fill="#fff" opacity=".1" />
        <circle cx="168" cy="150" r="30" fill="#fff" opacity=".08" />
        <path d="M0 150 Q60 120 120 150 T200 140 V200 H0Z" fill="#000" opacity=".06" />

        {/* back hair */}
        {hairStyle === "long" && <path d="M52 92c-6 50 6 76 20 82h56c14-6 26-32 20-82 0-34-22-54-48-54S56 58 52 92Z" fill={hair} />}
        {hairStyle === "wavy" && (
          <path d="M52 96c-6 22 0 40 10 52 6 6 10-2 8-10-4-14 0-24 4-34l60 0c4 10 8 20 4 34-2 8 2 16 8 10 10-12 16-30 10-52-4-30-24-48-52-48S56 66 52 96Z" fill={hair} />
        )}

        {/* shoulders + collar (blazer look) */}
        <path d="M28 200c2-38 28-58 72-58s70 20 72 58Z" fill={shirt} />
        <path d="M84 142h32l-4 22q-12 10-24 0Z" fill="#fff" opacity=".92" />
        <path d="M84 142l-14 14 22 44h-8Z M116 142l14 14-22 44h8Z" fill="#000" opacity=".16" />
        {/* neck */}
        <path d="M86 118h28v28q-14 12-28 0Z" fill={skin} />
        <path d="M86 132q14 10 28 0v-8h-28Z" fill="#000" opacity=".08" />

        {/* head + ears */}
        <ellipse cx="100" cy="92" rx={feminine ? 32 : 35} ry={feminine ? 37 : 38} fill={skin} />
        <ellipse cx="66" cy="96" rx="5" ry="8" fill={skin} />
        <ellipse cx="134" cy="96" rx="5" ry="8" fill={skin} />
        {feminine && (
          <g fill="#facc15">
            <circle cx="65" cy="106" r="3.6" />
            <circle cx="135" cy="106" r="3.6" />
          </g>
        )}

        {/* beard / mustache (behind mouth) */}
        {beard && <path d="M66 100c0 30 14 44 34 44s34-14 34-44c-6 14-16 20-34 20S72 114 66 100Z" fill={hair} opacity=".92" />}

        {/* front hair */}
        {hairStyle === "short" && <path d="M64 86c-2-30 18-46 38-44 22 2 36 18 32 44-6-12-14-20-28-22-14 4-30 6-42 22Z" fill={hair} />}
        {hairStyle === "crop" && <path d="M65 84c0-24 14-38 36-38s36 14 34 38c-6-8-12-14-18-16-14 6-34 6-52 16Z" fill={hair} />}
        {hairStyle === "quiff" && <path d="M62 88c-4-30 14-52 42-50 26 2 38 22 30 50-4-12-8-20-16-24-10 4-12-6-26-6-14 0-22 14-30 30Z" fill={hair} />}
        {hairStyle === "long" && <path d="M62 86c0-28 16-44 40-44s38 16 36 44c-10-6-22-18-30-24-8 12-24 20-46 24Z" fill={hair} />}
        {hairStyle === "bun" && (
          <>
            <circle cx="100" cy="40" r="14" fill={hair} />
            <path d="M64 88c-2-30 16-44 36-44s38 14 36 44c-8-14-22-22-36-22S72 74 64 88Z" fill={hair} />
          </>
        )}
        {hairStyle === "wavy" && <path d="M62 86c0-28 16-44 40-44s38 16 36 44c-8-4-16-14-20-24-12 10-34 18-56 24Z" fill={hair} />}

        {/* face */}
        <ellipse cx="86" cy="94" rx="3.4" ry="4.2" fill="#1f2937" />
        <ellipse cx="114" cy="94" rx="3.4" ry="4.2" fill="#1f2937" />
        {feminine && <path d="M80 90l-4-3M83 88l-2-4M92 89l3-4M117 89l-3-4M120 88l2-4M123 90l4-3" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />}
        <path d="M80 85q6-4 12-1M108 84q6-3 12 1" stroke="#1f2937" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity={feminine ? 0.55 : 0.75} />
        <path d="M100 98q-3 8 1 10" stroke="#000" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".22" />
        {mustache && <path d="M86 108q7-6 14-1q7-5 14 1q-7 3-14 0q-7 3-14 0Z" fill={hair} />}
        {feminine ? (
          <path d="M88 111q12 10 24 0q-12-3-24 0Z" fill="#be123c" />
        ) : (
          <path d="M88 112q12 8 24 0" stroke="#7c2d2d" strokeWidth="3" strokeLinecap="round" fill="none" />
        )}
        <circle cx="80" cy="106" r="5" fill="#f472b6" opacity={feminine ? 0.3 : 0.15} />
        <circle cx="120" cy="106" r="5" fill="#f472b6" opacity={feminine ? 0.3 : 0.15} />
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
