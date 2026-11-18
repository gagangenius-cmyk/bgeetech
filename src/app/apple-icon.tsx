import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS "Add to Home Screen" icon (iOS rounds the corners itself, so this is full-bleed).
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1d4ed8, #d4af37)" }}>
        <svg width="112" height="112" viewBox="0 0 80 80">
          <path d="M30 14v52" stroke="#fff" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="46" cy="46" r="14" fill="none" stroke="#fff" strokeWidth="8" />
          <circle cx="58" cy="22" r="5" fill="#fff" />
        </svg>
      </div>
    ),
    size,
  );
}
