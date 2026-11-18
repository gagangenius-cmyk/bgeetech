"use client";

import { ExternalLink, MapPin } from "lucide-react";
import { useState } from "react";

/**
 * Google Map, loaded only when the visitor asks for it. Until then no Google script, cookie or tracking request
 * is made (better privacy and a faster page). Uses the key-free embed, so there is no API key to manage.
 */
export function ContactMap({ label, query }: { label: string; query: string }) {
  const [loaded, setLoaded] = useState(false);
  const embed = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=11&output=embed`;
  const open = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-brand/5">
      <div className="relative aspect-[4/3] w-full bg-ink">
        {loaded ? (
          <iframe
            title={`Map showing ${label}`}
            src={embed}
            className="absolute inset-0 size-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero/page.webp" alt="" className="absolute inset-0 size-full object-cover opacity-80" loading="lazy" />
            <div className="absolute inset-0 bg-ink/45" />
            <div className="relative px-6 text-center text-white">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-amber-400 text-ink shadow-lg shadow-amber-500/30">
                <MapPin className="size-7" aria-hidden />
              </span>
              <p className="mt-4 font-display text-xl font-bold">{label}</p>
              <button
                type="button"
                onClick={() => setLoaded(true)}
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-strong px-6 text-sm font-semibold text-white shadow-lg shadow-brand/40 transition hover:-translate-y-0.5 active:scale-95"
              >
                Show map
              </button>
              <p className="mt-3 text-xs text-white/65">Loads Google Maps when you click.</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 px-5 py-3.5 text-sm">
        <span className="flex items-center gap-2 font-medium">
          <MapPin className="size-4 text-brand" aria-hidden /> {label}
        </span>
        <a href={open} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand hover:underline">
          Open in Google Maps <ExternalLink className="size-3.5" aria-hidden />
        </a>
      </div>
    </div>
  );
}
