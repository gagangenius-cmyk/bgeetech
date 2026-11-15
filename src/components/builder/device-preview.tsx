"use client";

import { Monitor, Smartphone, Tablet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DEVICE_WIDTH, SitePreview } from "@/components/builder/site-preview";
import { cleanDomain, type BuilderData, type Device } from "@/lib/builder/config";
import { cn } from "@/lib/utils";

const tabs: { id: Device; label: string; icon: typeof Monitor }[] = [
  { id: "desktop", label: "Desktop", icon: Monitor },
  { id: "tablet", label: "Tablet", icon: Tablet },
  { id: "mobile", label: "Mobile", icon: Smartphone },
];

const VIEW_HEIGHT: Record<Device, number> = { desktop: 440, tablet: 520, mobile: 540 };

/** Device-framed live preview with a Desktop / Tablet / Mobile switcher. */
export function DevicePreview({ data, className }: { data: BuilderData; className?: string }) {
  const [device, setDevice] = useState<Device>("desktop");
  const boxRef = useRef<HTMLDivElement>(null);
  const [boxW, setBoxW] = useState(640);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBoxW(Math.floor(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const W = DEVICE_WIDTH[device];
  const bezel = device === "desktop" ? 0 : device === "tablet" ? 14 : 12;
  const scale = Math.min(device === "mobile" ? 0.9 : 1, (boxW - bezel * 2 - 2) / W);
  const viewW = Math.round(W * scale);
  const domain = cleanDomain(data.business.domain) || "yourbusiness.com";

  const screen = (
    <div
      style={{ width: viewW, height: VIEW_HEIGHT[device] }}
      className="overflow-y-auto overflow-x-hidden bg-white [scrollbar-width:thin]"
      tabIndex={0}
      role="region"
      aria-label={`${device} preview of your website`}
    >
      <div style={{ width: W, zoom: scale }}>
        <SitePreview data={data} device={device} />
      </div>
    </div>
  );

  return (
    <div className={className}>
      <div role="tablist" aria-label="Preview device" className="mb-3 inline-flex rounded-full border border-border bg-card p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={device === t.id}
            onClick={() => setDevice(t.id)}
            className={cn(
              "inline-flex min-h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-colors",
              device === t.id ? "bg-brand-strong text-white" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <t.icon className="size-4" aria-hidden /> {t.label}
          </button>
        ))}
      </div>

      <div ref={boxRef} className="flex w-full justify-center">
        {device === "desktop" && (
          <div className="overflow-hidden rounded-xl border border-border bg-white shadow-2xl shadow-black/15" style={{ width: viewW + 2 }}>
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-3 py-2">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-amber-400" />
              <span className="size-2.5 rounded-full bg-green-400" />
              <span className="mx-auto max-w-[60%] flex-1 truncate rounded-md bg-white px-3 py-1 text-center text-[11px] text-slate-500">
                https://{domain}
              </span>
            </div>
            {screen}
          </div>
        )}
        {device === "tablet" && (
          <div className="rounded-[30px] bg-slate-900 shadow-2xl shadow-black/30" style={{ padding: bezel }}>
            <div className="overflow-hidden rounded-[18px]">{screen}</div>
          </div>
        )}
        {device === "mobile" && (
          <div className="relative rounded-[38px] bg-slate-900 shadow-2xl shadow-black/30" style={{ padding: bezel }}>
            <span aria-hidden className="absolute left-1/2 top-2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-slate-700" />
            <div className="overflow-hidden rounded-[28px]">{screen}</div>
          </div>
        )}
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">Preview only. Scroll inside the frame to see the full page.</p>
    </div>
  );
}
