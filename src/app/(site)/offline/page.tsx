import type { Metadata } from "next";
import { WifiOff } from "lucide-react";
import { RetryButton } from "@/components/pwa/retry-button";

export const metadata: Metadata = { title: "You are offline", robots: { index: false } };

export default function OfflinePage() {
  return (
    <div>
      <div aria-hidden className="h-16 bg-ink" />
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <WifiOff className="mx-auto size-14 text-accent" aria-hidden />
        <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight">You are offline</h1>
        <p className="mt-3 text-muted-foreground">Check your internet connection and try again. Pages you have not opened yet need a connection to load.</p>
        <div className="mt-8">
          <RetryButton />
        </div>
      </div>
    </div>
  );
}
