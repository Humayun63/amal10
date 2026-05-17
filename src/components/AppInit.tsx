"use client";

import { useEffect } from "react";
import { initNotifications } from "@/lib/notifications";

export default function AppInit() {
  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => {/* SW registration failed silently */});
    }
    // Re-schedule saved notification times
    initNotifications();
  }, []);

  return null;
}
