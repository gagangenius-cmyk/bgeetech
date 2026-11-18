"use client";

import { useEffect } from "react";

/** Registers the offline service worker in production only (it would get in the way of dev hot reload). */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      /* installability is a nice-to-have: ignore registration failures */
    });
  }, []);
  return null;
}
