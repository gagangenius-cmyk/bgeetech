import { ImageResponse } from "next/og";

// Generates the PWA icons from code (no image files, nothing native): /icons/192, /icons/512, /icons/maskable-512
export function generateStaticParams() {
  return [{ size: "192" }, { size: "512" }, { size: "maskable-512" }];
}

export async function GET(_req: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  const maskable = size.startsWith("maskable");
  const px = Number(size.replace("maskable-", ""));
  if (![192, 512].includes(px)) return new Response("Not found", { status: 404 });

  // Maskable icons need the artwork inside the central ~60% "safe zone"; normal icons get rounded corners.
  const glyph = Math.round(px * (maskable ? 0.52 : 0.62));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1d4ed8, #d4af37)",
          borderRadius: maskable ? 0 : Math.round(px * 0.22),
        }}
      >
        <svg width={glyph} height={glyph} viewBox="0 0 80 80">
          <path d="M30 14v52" stroke="#fff" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="46" cy="46" r="14" fill="none" stroke="#fff" strokeWidth="8" />
          <circle cx="58" cy="22" r="5" fill="#fff" />
        </svg>
      </div>
    ),
    { width: px, height: px },
  );
}
