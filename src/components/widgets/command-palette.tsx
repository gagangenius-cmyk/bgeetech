"use client";

import { useQuery } from "@tanstack/react-query";
import { Calculator, CalendarCheck, FileText, Home, Mail, MessageCircle, MonitorPlay, Search, Sparkles, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { openLeadPopup } from "@/components/widgets/lead-popup";
import { whatsappUrl } from "@/lib/chat-knowledge";
import { nav, services } from "@/lib/site";
import { cn } from "@/lib/utils";

export const OPEN_SEARCH_EVENT = "bgee:open-search";

type Item = { id: string; label: string; hint: string; icon: ReactNode; run: () => void; group: string };

export function CommandPalette() {
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [armed, setArmed] = useState(false); // fetch the index only after the palette is first opened
  type Entry = { label: string; href: string; hint?: string };
  const idx = useQuery({
    queryKey: ["search-index"],
    queryFn: async () => (await fetch("/api/search-index")).json() as Promise<{ posts: Entry[]; demos: Entry[] }>,
    enabled: armed,
    staleTime: 5 * 60_000,
  });

  const close = useCallback(() => (document.getElementById("site-palette") as HTMLDialogElement | null)?.close(), []);
  const go = useCallback(
    (href: string) => () => {
      close();
      router.push(href);
    },
    [close, router],
  );

  const items = useMemo<Item[]>(
    () => [
      { id: "book", group: "Actions", label: "Book a consultation", hint: "/book", icon: <CalendarCheck className="size-4" />, run: go("/book") },
      { id: "quote", group: "Actions", label: "Get a free quote", hint: "Opens form", icon: <Mail className="size-4" />, run: () => { close(); openLeadPopup(); } },
      { id: "builder", group: "Actions", label: "Build your website", hint: "/builder", icon: <Sparkles className="size-4" />, run: go("/builder") },
      { id: "estimate", group: "Actions", label: "Estimate your project cost", hint: "/estimate", icon: <Calculator className="size-4" />, run: go("/estimate") },
      { id: "wa", group: "Actions", label: "Chat on WhatsApp", hint: "Opens WhatsApp", icon: <MessageCircle className="size-4" />, run: () => { close(); window.open(whatsappUrl(), "_blank", "noopener,noreferrer"); } },
      { id: "home", group: "Pages", label: "Home", hint: "/", icon: <Home className="size-4" />, run: go("/") },
      ...nav.map((n) => ({ id: n.href, group: "Pages", label: n.label, hint: n.href, icon: <FileText className="size-4" />, run: go(n.href) })),
      ...services.map((s) => ({ id: s.slug, group: "Services", label: s.title, hint: `from $${s.from}`, icon: <Tag className="size-4" />, run: go(`/services/${s.slug}`) })),
      ...(idx.data?.demos ?? []).map((d) => ({ id: "d-" + d.href, group: "Demos", label: d.label, hint: d.hint ?? "", icon: <MonitorPlay className="size-4" />, run: go(d.href) })),
      ...(idx.data?.posts ?? []).map((p) => ({ id: "p-" + p.href, group: "Insights", label: p.label, hint: p.hint ?? "", icon: <FileText className="size-4" />, run: go(p.href) })),
    ],
    [go, close, idx.data],
  );

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items.slice(0, 9);
    const found = items.filter((i) => `${i.label} ${i.hint} ${i.group}`.toLowerCase().includes(t)).slice(0, 10);
    // Always offer the full results page, which also searches article text, features and more.
    return [
      ...found,
      { id: "search-all", group: "Search", label: `See all results for "${q.trim()}"`, hint: "/search", icon: <Search className="size-4" />, run: go(`/search?q=${encodeURIComponent(q.trim())}`) },
    ];
  }, [items, q, go]);

  const open = useCallback(() => {
    if (ref.current && !ref.current.open) {
      setQ("");
      setActive(0);
      setArmed(true);
      ref.current.showModal();
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (ref.current?.open) close();
        else open();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_SEARCH_EVENT, open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_SEARCH_EVENT, open);
    };
  }, [open, close]);

  return (
    <dialog
      ref={ref}
      id="site-palette"
      aria-label="Search"
      onClick={(e) => e.target === ref.current && close()}
      className="mx-auto mt-[12vh] w-[calc(100%-1.5rem)] max-w-xl rounded-2xl border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-ink/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 border-b border-border px-4">
        <Search className="size-5 text-muted-foreground" aria-hidden />
        <label htmlFor="palette-input" className="sr-only">
          Search pages, services and articles
        </label>
        <input
          id="palette-input"
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              results[active]?.run();
            }
          }}
          role="combobox"
          aria-expanded
          aria-controls="palette-list"
          aria-activedescendant={results[active] ? `pal-${results[active].id}` : undefined}
          placeholder="Search services, pages, articles..."
          autoComplete="off"
          className="min-h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
        <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground sm:block">Esc</kbd>
      </div>
      <ul id="palette-list" role="listbox" className="max-h-80 overflow-y-auto p-2">
        {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted-foreground">No results for &ldquo;{q}&rdquo;</li>}
        {results.map((r, i) => (
          <li key={r.id} id={`pal-${r.id}`} role="option" aria-selected={i === active}>
            <button
              type="button"
              onClick={r.run}
              onMouseEnter={() => setActive(i)}
              className={cn(
                "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm transition-colors",
                i === active ? "bg-brand/10 text-brand" : "hover:bg-muted",
              )}
            >
              <span aria-hidden className="grid size-8 place-items-center rounded-lg bg-muted">{r.icon}</span>
              <span className="flex-1 font-medium">{r.label}</span>
              <span className="text-xs text-muted-foreground">{r.group}</span>
            </button>
          </li>
        ))}
      </ul>
    </dialog>
  );
}
