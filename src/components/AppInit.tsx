"use client";

import { useEffect, useState } from "react";
import { initNotifications } from "@/lib/notifications";

function isFacebookBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|FB_IAB|Instagram|Line\/|Twitter\/|Snapchat|TikTok|Pinterest/.test(ua);
}

export default function AppInit() {
  const [showOpenBanner, setShowOpenBanner] = useState(false);

  useEffect(() => {
    if (isFacebookBrowser()) {
      setShowOpenBanner(true);
      return;
    }
    // Register service worker only in real browsers
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => {/* SW registration failed silently */});
    }
    initNotifications();
  }, []);

  if (showOpenBanner) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#0B3C26",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "system-ui, sans-serif",
          color: "#fff",
          textAlign: "center",
          gap: "16px",
        }}
      >
        <img src="/logo.png" alt="logo" style={{ width: 72, height: 72, borderRadius: 16 }} />
        <p style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
          জিলহজ আমল চ্যালেঞ্জ
        </p>
        <p style={{ fontSize: 14, opacity: 0.85, margin: 0 }}>
          এই অ্যাপটি সঠিকভাবে চালাতে Safari বা Chrome-এ খুলুন।
        </p>
        <a
          href={window.location.href}
          target="_blank"
          rel="noreferrer"
          style={{
            marginTop: 8,
            background: "#fff",
            color: "#0B3C26",
            fontWeight: 700,
            fontSize: 15,
            padding: "12px 28px",
            borderRadius: 999,
            textDecoration: "none",
          }}
        >
          Safari / Chrome-এ খুলুন
        </a>
        <p style={{ fontSize: 12, opacity: 0.6, margin: 0 }}>
          Browser-এ লিঙ্কটি কপি করে পেস্ট করুন:{" "}
          <span style={{ opacity: 1 }}>{window.location.host}</span>
        </p>
      </div>
    );
  }

  return null;
}
