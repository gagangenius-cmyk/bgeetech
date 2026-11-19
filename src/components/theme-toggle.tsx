"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const KEY = "bgee_theme";
const EVENT = "bgee:theme";

type Theme = "light" | "dark";

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener(EVENT, cb);
  mq.addEventListener("change", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    mq.removeEventListener("change", cb);
  };
};

function current(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Light or dark, remembered on this device. Starts from the visitor's system setting. */
export function ThemeToggle({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  const theme = useSyncExternalStore(subscribe, current, () => "light" as Theme);
  const next: Theme = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem(KEY, next);
        } catch {
          /* storage unavailable: choice lasts for this visit */
        }
        window.dispatchEvent(new Event(EVENT));
      }}
      aria-label={`Switch to ${next} mode`}
      className={cn("grid size-11 place-items-center rounded-full border transition hover:scale-105 active:scale-95", onDark ? "border-white/25 bg-white/10 text-white" : "border-border bg-card text-foreground", className)}
    >
      {theme === "dark" ? <Sun className="size-[18px]" aria-hidden /> : <Moon className="size-[18px]" aria-hidden />}
    </button>
  );
}
