"use client";

import dynamic from "next/dynamic";

// Client-only: the wizard restores saved progress from localStorage, so it must not be server-rendered.
const Wizard = dynamic(() => import("@/components/builder/wizard"), {
  ssr: false,
  loading: () => <div className="mx-auto h-96 max-w-4xl animate-pulse rounded-3xl bg-muted" aria-label="Loading builder" />,
});

export function BuilderClient() {
  return <Wizard />;
}
