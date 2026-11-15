import { Check, Mail, Menu, Phone, Search, Sparkles, Star } from "lucide-react";
import type { CSSProperties } from "react";
import { cleanDomain, styles, type BuilderData, type Device } from "@/lib/builder/config";
import { getIndustry } from "@/lib/builder/industries";
import { textOn } from "@/lib/builder/themes";

export const DEVICE_WIDTH: Record<Device, number> = { desktop: 1100, tablet: 768, mobile: 375 };

const searchFields = (id: string): [string, string, string, string] => {
  if (id.includes("flight")) return ["From", "To", "Departure", "Passengers"];
  if (id.includes("hotel") || id.includes("vacation")) return ["Destination", "Check-in", "Check-out", "Guests"];
  if (id.includes("car") || id.includes("cab")) return ["Pick-up", "Drop-off", "Date", "Time"];
  if (id.includes("bus") || id.includes("train")) return ["From", "To", "Date", "Seats"];
  if (id.includes("event")) return ["Event", "City", "Date", "Tickets"];
  return ["Destination", "Dates", "Travellers", "Budget"];
};

/** Pure mock website. Layout depends on `device` (not media queries) so it can be shown at any size. */
export function SitePreview({ data, device }: { data: BuilderData; device: Device }) {
  const ind = getIndustry(data.industry);
  const st = styles.find((s) => s.id === data.style) ?? styles[0];
  const [p, s, a] = data.theme.colors;
  const pt = textOn(p);
  const at = textOn(a);
  const mobile = device === "mobile";
  const tablet = device === "tablet";
  const name = data.business.name.trim() || "Your Business";
  const slogan = data.business.slogan.trim() || (ind ? `Quality ${ind.label.toLowerCase()} you can trust` : "Your tagline goes here");
  const domain = cleanDomain(data.business.domain) || "yourbusiness.com";
  const services = ind?.services ?? ["Service one", "Service two", "Service three"];
  const cta = ind?.cta ?? "Get started";
  const r = st.radius;
  const pad = mobile ? 20 : tablet ? 36 : 64;
  const font = st.font === "serif" ? "var(--font-display-var), Georgia, serif" : "var(--font-sans-var), system-ui, sans-serif";
  const h1: CSSProperties = {
    fontFamily: font,
    fontWeight: st.weight,
    textTransform: st.upper ? "uppercase" : "none",
    letterSpacing: st.upper ? "0.02em" : "-0.02em",
    lineHeight: 1.08,
    fontSize: mobile ? 30 : tablet ? 40 : 52,
  };
  const btn = (bg: string, fg: string): CSSProperties => ({
    background: bg,
    color: fg,
    borderRadius: Math.min(r, 999),
    padding: mobile ? "12px 18px" : "14px 26px",
    fontWeight: 700,
    fontSize: mobile ? 14 : 15,
    display: "inline-block",
  });

  const logo = data.business.logo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={data.business.logo} alt="" style={{ height: 36, width: "auto", maxWidth: 120, objectFit: "contain" }} />
  ) : (
    <span
      style={{ background: p, color: pt, width: 36, height: 36, borderRadius: Math.min(r, 12), display: "grid", placeItems: "center", fontFamily: font, fontWeight: 800 }}
    >
      {name[0]?.toUpperCase()}
    </span>
  );

  const cols = (n: number) => ({ display: "grid", gap: mobile ? 14 : 20, gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }) as CSSProperties;

  return (
    <div style={{ background: "#fff", color: "#101828", fontFamily: "var(--font-sans-var), system-ui, sans-serif", fontSize: 16, lineHeight: 1.5 }}>
      {/* Nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `14px ${pad}px`, borderBottom: "1px solid #eef0f3" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {logo}
          <strong style={{ fontFamily: font, fontSize: 18, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: mobile ? 170 : 260 }}>{name}</strong>
        </div>
        {mobile ? (
          <Menu size={24} color={p} />
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: tablet ? 16 : 28, fontSize: 14, fontWeight: 600, color: "#475467" }}>
            <span>Home</span>
            <span>{ind?.kind === "shop" ? "Shop" : "Services"}</span>
            <span>About</span>
            <span>Contact</span>
            <span style={btn(p, pt)}>{tablet ? "Book" : cta}</span>
          </div>
        )}
      </div>

      {/* Hero */}
      {st.hero === "bleed" && (
        <div style={{ background: p, color: pt, padding: `${mobile ? 48 : 84}px ${pad}px`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -60, top: -60, width: 280, height: 280, borderRadius: 999, background: a, opacity: 0.25 }} />
          <div style={{ position: "absolute", right: 120, bottom: -90, width: 200, height: 200, borderRadius: 999, background: s, opacity: 0.18 }} />
          <h1 style={{ ...h1, maxWidth: 640, position: "relative" }}>{slogan}</h1>
          <p style={{ marginTop: 16, maxWidth: 520, opacity: 0.85, position: "relative" }}>
            {ind ? `Trusted ${ind.label.toLowerCase()} services, now online.` : "Welcome to our website."}
          </p>
          <div style={{ marginTop: 28, position: "relative" }}>
            <span style={btn(a, at)}>{cta}</span>
          </div>
        </div>
      )}
      {st.hero === "center" && (
        <div style={{ background: s, textAlign: "center", padding: `${mobile ? 48 : 80}px ${pad}px` }}>
          <h1 style={{ ...h1, maxWidth: 720, margin: "0 auto", color: "#101828" }}>{slogan}</h1>
          <p style={{ margin: "16px auto 0", maxWidth: 520, color: "#475467" }}>
            {ind ? `Trusted ${ind.label.toLowerCase()} services, now online.` : "Welcome to our website."}
          </p>
          <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <span style={btn(p, pt)}>{cta}</span>
            <span style={{ ...btn("transparent", p), border: `2px solid ${p}` }}>Learn more</span>
          </div>
        </div>
      )}
      {st.hero === "split" && (
        <div style={{ background: s, padding: `${mobile ? 36 : 64}px ${pad}px`, ...cols(mobile ? 1 : 2), alignItems: "center", gap: mobile ? 28 : 48 }}>
          <div>
            <span style={{ display: "inline-block", background: a, color: at, borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 700, marginBottom: 16 }}>
              {ind?.label ?? "Welcome"}
            </span>
            <h1 style={h1}>{slogan}</h1>
            <p style={{ marginTop: 16, color: "#475467", maxWidth: 480 }}>
              {ind ? `Trusted ${ind.label.toLowerCase()} services, now online.` : "Welcome to our website."}
            </p>
            <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <span style={btn(p, pt)}>{cta}</span>
              <span style={{ ...btn("transparent", p), border: `2px solid ${p}` }}>Learn more</span>
            </div>
          </div>
          <div style={{ position: "relative", height: mobile ? 200 : 300 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: r + 8, background: `linear-gradient(135deg, ${p}, ${a})` }} />
            <Sparkles size={mobile ? 56 : 84} color={pt} style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", opacity: 0.9 }} />
            <div style={{ position: "absolute", left: -12, bottom: 22, background: "#fff", borderRadius: Math.min(r, 16), padding: "10px 14px", boxShadow: "0 10px 30px rgba(0,0,0,.12)", display: "flex", gap: 6, alignItems: "center", fontSize: 13, fontWeight: 700 }}>
              <Star size={16} color={a} fill={a} /> Trusted by customers
            </div>
          </div>
        </div>
      )}

      {/* Booking search widget */}
      {ind?.kind === "booking" && (
        <div style={{ padding: `0 ${pad}px`, marginTop: -28, position: "relative" }}>
          <div style={{ background: "#fff", borderRadius: r + 4, boxShadow: "0 18px 50px rgba(16,24,40,.14)", padding: 18, ...cols(mobile ? 1 : tablet ? 2 : 5), alignItems: "end" }}>
            {searchFields(ind.id).map((f) => (
              <div key={f}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#667085", textTransform: "uppercase", letterSpacing: ".05em" }}>{f}</div>
                <div style={{ marginTop: 6, border: "1px solid #d0d5dd", borderRadius: Math.min(r, 12), padding: "11px 12px", color: "#98a2b3", fontSize: 14 }}>Select</div>
              </div>
            ))}
            <span style={{ ...btn(a, at), textAlign: "center", display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>
              <Search size={16} /> Search
            </span>
          </div>
        </div>
      )}

      {/* Main block */}
      <div style={{ padding: `${mobile ? 44 : 72}px ${pad}px` }}>
        <h2 style={{ fontFamily: font, fontWeight: st.weight, fontSize: mobile ? 24 : 32, textTransform: st.upper ? "uppercase" : "none", textAlign: st.hero === "center" ? "center" : "left" }}>
          {ind?.kind === "shop" ? "Featured products" : ind?.kind === "booking" ? "Popular choices" : "Our services"}
        </h2>
        <div style={{ ...cols(ind?.kind === "shop" ? (mobile ? 2 : tablet ? 3 : 4) : mobile ? 1 : 3), marginTop: 28 }}>
          {(ind?.kind === "shop" ? [0, 1, 2, 3, 4, 5, 6, 7].slice(0, mobile ? 4 : tablet ? 6 : 8) : services).map((item, i) =>
            ind?.kind === "shop" ? (
              <div key={i} style={{ border: "1px solid #eef0f3", borderRadius: r, overflow: "hidden" }}>
                <div style={{ height: mobile ? 96 : 130, background: i % 2 ? s : `linear-gradient(135deg, ${s}, ${a}33)` }} />
                <div style={{ padding: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{services[i % services.length]}</div>
                  <div style={{ color: "#667085", fontSize: 13 }}>$00.00</div>
                  <span style={{ ...btn(p, pt), padding: "7px 14px", fontSize: 12, marginTop: 8 }}>Add to cart</span>
                </div>
              </div>
            ) : (
              <div key={String(item)} style={{ border: "1px solid #eef0f3", borderRadius: r, padding: 22, background: "#fff", boxShadow: "0 6px 20px rgba(16,24,40,.05)" }}>
                <span style={{ width: 44, height: 44, borderRadius: Math.min(r, 14), background: s, color: p, display: "grid", placeItems: "center", fontWeight: 800, fontFamily: font }}>
                  {i + 1}
                </span>
                <div style={{ fontFamily: font, fontWeight: 700, fontSize: 18, marginTop: 14 }}>{String(item)}</div>
                <p style={{ color: "#667085", fontSize: 14, marginTop: 6 }}>Professional, reliable and tailored to what you need.</p>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Why choose us */}
      <div style={{ background: s, padding: `${mobile ? 40 : 64}px ${pad}px` }}>
        <h2 style={{ fontFamily: font, fontWeight: st.weight, fontSize: mobile ? 22 : 28, textTransform: st.upper ? "uppercase" : "none" }}>Why choose {name}</h2>
        <div style={{ ...cols(mobile ? 1 : 3), marginTop: 24 }}>
          {["Experienced and friendly team", "Fair, transparent pricing", "Quick response, great support"].map((t) => (
            <div key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontWeight: 600 }}>
              <span style={{ background: p, color: pt, borderRadius: 999, padding: 4, display: "grid", placeItems: "center", marginTop: 2 }}>
                <Check size={14} />
              </span>
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: p, color: pt, padding: `${mobile ? 36 : 56}px ${pad}px`, textAlign: "center" }}>
        <h2 style={{ fontFamily: font, fontWeight: st.weight, fontSize: mobile ? 22 : 30, textTransform: st.upper ? "uppercase" : "none" }}>Ready to get started?</h2>
        <div style={{ marginTop: 20 }}>
          <span style={btn(a, at)}>{cta}</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "#101828", color: "#cbd5e1", padding: `${mobile ? 28 : 40}px ${pad}px`, fontSize: 14, display: "flex", flexDirection: mobile ? "column" : "row", justifyContent: "space-between", gap: 16 }}>
        <div>
          <strong style={{ color: "#fff", fontFamily: font, fontSize: 18 }}>{name}</strong>
          <div style={{ marginTop: 6 }}>{domain}</div>
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Mail size={15} /> {data.business.email || "hello@yourbusiness.com"}
          </span>
          <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Phone size={15} /> {data.business.phone || "+00 000 000 0000"}
          </span>
        </div>
      </div>
    </div>
  );
}
