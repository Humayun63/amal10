"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { onPromptReady, triggerInstall, isIOS, isInStandaloneMode } from "@/lib/pwa";

const DISMISS_KEY = "pwa_banner_dismissed_until";

export default function PWAInstallBanner() {
  const [show, setShow] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Already installed or dismissed recently
    if (isInStandaloneMode()) return;
    const until = localStorage.getItem(DISMISS_KEY);
    if (until && Date.now() < Number(until)) return;

    const ios = isIOS();
    setIsIOSDevice(ios);

    if (ios) {
      // Show iOS prompt after a short delay
      const t = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(t);
    }

    // Android / Chrome — wait for beforeinstallprompt
    const unsub = onPromptReady(() => setShow(true));
    return unsub;
  }, []);

  function dismiss() {
    // Suppress for 3 days
    localStorage.setItem(DISMISS_KEY, String(Date.now() + 3 * 24 * 60 * 60 * 1000));
    setShow(false);
    setShowIOSGuide(false);
  }

  async function handleInstall() {
    if (isIOSDevice) {
      setShowIOSGuide(true);
      return;
    }
    const accepted = await triggerInstall();
    if (accepted) setShow(false);
  }

  if (!show) return null;

  return (
    <>
      {/* Main banner */}
      <div className="fixed bottom-18 md:bottom-4 left-0 right-0 z-60 px-3 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <div className="bg-[#0B3C26] rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl border border-[#A3E4D7]/20 animate-in slide-in-from-bottom-4 duration-300">
            <Image
              src="/logo.png"
              alt="আমল"
              width={44}
              height={45}
              className="w-11 h-11 object-contain shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight">আমল অ্যাপ ইনস্টল করুন</p>
              <p className="text-[#A3E4D7] text-xs mt-0.5">হোম স্ক্রিনে যোগ করুন — দ্রুত অ্যাক্সেস পান</p>
            </div>
            <button
              onClick={handleInstall}
              className="shrink-0 bg-[#A3E4D7] text-[#0B3C26] font-bold text-xs px-4 py-2 rounded-xl active:scale-95 transition-transform whitespace-nowrap"
            >
              {isIOSDevice ? "কীভাবে?" : "ইনস্টল"}
            </button>
            <button
              onClick={dismiss}
              className="shrink-0 text-white/40 hover:text-white/70 transition-colors p-1"
              aria-label="বন্ধ"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* iOS step-by-step guide */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-70 flex items-end justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowIOSGuide(false)}/>
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-5 z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="আমল" width={36} height={37} className="w-9 h-9 object-contain"/>
                <p className="text-[#0B3C26] font-bold text-base">হোম স্ক্রিনে যোগ করুন</p>
              </div>
              <button onClick={() => setShowIOSGuide(false)} className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#1C2833" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { step: "১", icon: "⬆️", text: "নিচে Safari-এর শেয়ার বাটন ট্যাপ করুন" },
                { step: "২", icon: "➕", text: '"Add to Home Screen" বেছে নিন' },
                { step: "৩", icon: "✅", text: '"Add" বাটন ট্যাপ করুন — ব্যস!' },
              ].map(({ step, icon, text }) => (
                <div key={step} className="flex items-center gap-3 bg-[#FAFAF9] rounded-xl px-4 py-3 border border-[#E6F4EA]">
                  <span className="w-7 h-7 rounded-full bg-[#0B3C26] text-white text-xs font-bold flex items-center justify-center shrink-0">{step}</span>
                  <span className="text-lg shrink-0">{icon}</span>
                  <p className="text-[#1C2833] text-sm">{text}</p>
                </div>
              ))}
            </div>
            <button
              onClick={dismiss}
              className="w-full mt-4 py-3 bg-[#0B3C26] text-white font-bold rounded-xl text-sm active:scale-95 transition-transform"
            >
              বুঝেছি ✓
            </button>
          </div>
        </div>
      )}
    </>
  );
}
