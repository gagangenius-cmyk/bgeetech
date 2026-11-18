"use client";

import { Download, Share } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

/** "Install app" button. Uses the native prompt where supported, and shows the Share steps on iOS Safari. */
export function InstallButton({ className }: { className?: string }) {
  const [evt, setEvt] = useState<InstallEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent) && !/crios|fxios/i.test(navigator.userAgent);
    const t = setTimeout(() => {
      setInstalled(standalone);
      setIos(isIos);
    }, 0);
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as InstallEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      clearTimeout(t);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || (!evt && !ios)) return null;

  return (
    <div className={className}>
      <button
        type="button"
        onClick={async () => {
          if (evt) {
            await evt.prompt();
            await evt.userChoice;
            setEvt(null);
          } else setHint((h) => !h);
        }}
        className={cn("inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-accent/50 bg-accent/10 px-4 text-sm font-semibold transition active:scale-[0.98]")}
      >
        <Download className="size-4 text-accent" aria-hidden /> Install the BGeetech app
      </button>
      {hint && (
        <p role="status" className="mt-2 flex items-start gap-2 rounded-xl bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
          <Share className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden /> Tap the Share button in Safari, then choose &ldquo;Add to Home Screen&rdquo;.
        </p>
      )}
    </div>
  );
}
