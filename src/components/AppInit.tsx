"use client";

import { useEffect, useState } from "react";
import { initNotifications } from "@/lib/notifications";

function isInAppBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|FB_IAB|Instagram|Line\/|Twitter\/|Snapchat|TikTok|Pinterest|Lark\/|LarkLocale|BytedanceWebview|BytedanceMicroApp/.test(ua);
}

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

export default function AppInit() {
  const [showOpenBanner, setShowOpenBanner] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isInAppBrowser()) {
      setShowOpenBanner(true);
      return;
    }
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => {});
    }
    initNotifications();
  }, []);

  function copyLink() {
    const url = window.location.href;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } else {
      // Fallback for browsers without clipboard API
      const el = document.createElement("input");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  if (!showOpenBanner) return null;

  const ios = isIOS();

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
        padding: "32px 24px",
        fontFamily: "system-ui, sans-serif",
        color: "#fff",
        textAlign: "center",
        gap: "14px",
      }}
    >
      <img src="/logo.png" alt="logo" style={{ width: 68, height: 68, borderRadius: 16 }} />

      <p style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
        জিলহজ আমল চ্যালেঞ্জ
      </p>

      <p style={{ fontSize: 14, opacity: 0.8, margin: 0, lineHeight: 1.6 }}>
        এই অ্যাপটি সঠিকভাবে চালাতে{" "}
        <strong>{ios ? "Safari" : "Chrome"}</strong>-এ খুলতে হবে।
      </p>

      {/* Step-by-step instruction */}
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          borderRadius: 14,
          padding: "14px 18px",
          fontSize: 13,
          lineHeight: 1.8,
          textAlign: "left",
          width: "100%",
          maxWidth: 320,
        }}
      >
        {ios ? (
          <>
            <p style={{ margin: 0, fontWeight: 600 }}>iOS এ খোলার উপায়:</p>
            <p style={{ margin: "6px 0 0" }}>
              ১. নিচের <strong>লিঙ্ক কপি করুন</strong> বাটনে চাপুন<br />
              ২. <strong>Safari</strong> অ্যাপ খুলুন<br />
              ৩. Address bar-এ লিঙ্কটি paste করুন
            </p>
          </>
        ) : (
          <>
            <p style={{ margin: 0, fontWeight: 600 }}>Android এ খোলার উপায়:</p>
            <p style={{ margin: "6px 0 0" }}>
              ১. নিচের <strong>লিঙ্ক কপি করুন</strong> বাটনে চাপুন<br />
              ২. <strong>Chrome</strong> অ্যাপ খুলুন<br />
              ৩. Address bar-এ লিঙ্কটি paste করুন
            </p>
          </>
        )}
      </div>

      {/* Copy button */}
      <button
        onClick={copyLink}
        style={{
          marginTop: 4,
          background: copied ? "#A3E4D7" : "#fff",
          color: "#0B3C26",
          fontWeight: 700,
          fontSize: 15,
          padding: "13px 32px",
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          transition: "background 0.2s",
          width: "100%",
          maxWidth: 320,
        }}
      >
        {copied ? "✓ কপি হয়েছে!" : "লিঙ্ক কপি করুন"}
      </button>

      <p style={{ fontSize: 12, opacity: 0.5, margin: 0 }}>
        {typeof window !== "undefined" ? window.location.host : ""}
      </p>
    </div>
  );
}
