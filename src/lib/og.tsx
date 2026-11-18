import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };

/** Shared 1200x630 social card. Every child of a flex parent sets display explicitly (a Satori requirement). */
export function renderOg({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  const long = title.length > 48;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#fff",
          background: "linear-gradient(135deg, #050d24 0%, #0f2a6b 55%, #1d4ed8 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", width: 64, height: 64, borderRadius: 16, alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1d4ed8, #d4af37)" }}>
            <svg width="40" height="40" viewBox="0 0 80 80">
              <path d="M30 14v52" stroke="#fff" strokeWidth="8" strokeLinecap="round" fill="none" />
              <circle cx="46" cy="46" r="14" fill="none" stroke="#fff" strokeWidth="8" />
              <circle cx="58" cy="22" r="5" fill="#fff" />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 38, fontWeight: 700, letterSpacing: -1 }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: "#e6c25a", textTransform: "uppercase", letterSpacing: 4 }}>{kicker}</div>
          <div style={{ display: "flex", fontSize: long ? 58 : 72, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2 }}>{title}</div>
          {sub && <div style={{ display: "flex", fontSize: 30, color: "rgba(255,255,255,0.72)", lineHeight: 1.35 }}>{sub.length > 130 ? `${sub.slice(0, 127)}...` : sub}</div>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "rgba(255,255,255,0.65)" }}>
          <div style={{ display: "flex" }}>{site.url.replace("https://", "")}</div>
          <div style={{ display: "flex" }}>Your first 30 minutes are free</div>
        </div>
      </div>
    ),
    ogSize,
  );
}
