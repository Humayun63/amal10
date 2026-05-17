"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { scheduleAllNotifications } from "@/lib/notifications";

const DEFAULT_TIMES = [
  { id: "fajr", label: "ফজরের পর", sublabel: "সকালের যিকর", time: "06:00", enabled: true },
  { id: "asr",  label: "আসরের পর",  sublabel: "দৈনিক আমল রিমাইন্ডার", time: "16:00", enabled: true },
  { id: "isha", label: "ইশার পর",   sublabel: "স্ট্রিক আপডেট", time: "21:00", enabled: true },
];

type NotifSlot = typeof DEFAULT_TIMES[number];

export default function PushPermissionPage() {
  const router = useRouter();
  const [requesting, setRequesting] = useState(false);
  const [slots, setSlots] = useState<NotifSlot[]>(DEFAULT_TIMES);
  // Hydration-safe: always start false, set in effect
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported("Notification" in window);
  }, []);

  const toggleSlot = (id: string) =>
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );

  const updateTime = (id: string, time: string) =>
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, time } : s))
    );

  const handleAllow = async () => {
    setRequesting(true);
    try {
      if (isSupported) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const enabled = slots.filter((s) => s.enabled).map((s) => s.time);
          localStorage.setItem("notifTimes", JSON.stringify(enabled));
          scheduleAllNotifications(enabled);
        }
      }
    } catch {
      // Browser doesn't support notifications — proceed anyway
    } finally {
      setRequesting(false);
      router.push("/dashboard");
    }
  };

  const handleSkip = () => router.push("/dashboard");

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col">
      {/* Skip */}
      <div className="flex justify-end px-5 pt-5">
        <button
          onClick={handleSkip}
          className="text-[#AEB6BF] text-sm hover:text-[#0B3C26] transition-colors px-3 py-1"
        >
          স্কিপ
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
        <div className="w-full max-w-sm lg:max-w-md">
          {/* Bell icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#0B3C26]/10 scale-125 blur-xl" />
              <div className="relative w-20 h-20 rounded-full bg-[#0B3C26] flex items-center justify-center shadow-xl">
                <BellIcon />
              </div>
              <span className="absolute top-1 right-1 w-5 h-5 bg-[#A3E4D7] rounded-full border-2 border-[#FAFAF9] flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#0B3C26]">৩</span>
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-[#0B3C26] text-[26px] font-bold text-center leading-snug">
            একটিও আমল
            <br />
            মিস করবেন না
          </h1>
          <p className="text-[#AEB6BF] text-sm text-center mt-2 leading-relaxed">
            নামাজের সময়, তাকবীর ও আজকের আমলের সৌম্য রিমাইন্ডার পান
          </p>

          {/* Notification time slots */}
          <div className="mt-6 flex flex-col gap-2">
            <p className="text-[#0B3C26] text-xs font-semibold px-1 mb-1">
              রিমাইন্ডার সময় বেছে নিন
            </p>
            {slots.map((slot) => (
              <div
                key={slot.id}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 border transition-all duration-200 ${
                  slot.enabled
                    ? "bg-white border-[#A3E4D7] shadow-sm"
                    : "bg-[#FAFAF9] border-[#E6F4EA]"
                }`}
              >
                {/* Toggle */}
                <button
                  onClick={() => toggleSlot(slot.id)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${
                    slot.enabled ? "bg-[#0B3C26]" : "bg-[#E6F4EA]"
                  }`}
                  aria-label={slot.enabled ? "বন্ধ করুন" : "চালু করুন"}
                >
                  <span
                    className={`absolute top-0.75 left-0.75 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-200 ${
                      slot.enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>

                {/* Labels */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold ${
                      slot.enabled ? "text-[#1C2833]" : "text-[#AEB6BF]"
                    }`}
                  >
                    {slot.label}
                  </p>
                  <p className="text-[#AEB6BF] text-xs">{slot.sublabel}</p>
                </div>

                {/* Time picker */}
                <input
                  type="time"
                  value={slot.time}
                  onChange={(e) => updateTime(slot.id, e.target.value)}
                  disabled={!slot.enabled}
                  className={`text-sm font-medium rounded-xl px-2 py-1 border transition-colors cursor-pointer ${
                    slot.enabled
                      ? "text-[#0B3C26] bg-[#E6F4EA] border-[#A3E4D7] focus:outline-none focus:border-[#0B3C26]"
                      : "text-[#AEB6BF] bg-[#F5F5F5] border-transparent"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Browser-style notification preview */}
          <div className="mt-5 bg-white rounded-2xl border border-[#E6F4EA] shadow-sm overflow-hidden">
            <div className="bg-[#F5F5F5] px-4 py-2 flex items-center gap-2 border-b border-[#E6F4EA]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#E6F4EA]" />
              <span className="text-[11px] text-[#AEB6BF]">প্রিভিউ</span>
            </div>
            <div className="px-4 py-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0B3C26] flex items-center justify-center shrink-0 text-white text-sm">
                  ☪
                </div>
                <div>
                  <p className="text-[#1C2833] text-xs font-semibold">আমল চ্যালেঞ্জ</p>
                  <p className="text-[#AEB6BF] text-[11px] mt-0.5">
                    ফজরের সময় হয়েছে · সকালের যিকর শুরু করুন 🤲
                  </p>
                </div>
              </div>
              {/* Fake permission prompt */}
              <div className="mt-3 pt-3 border-t border-[#E6F4EA]">
                <p className="text-[#1C2833] text-xs font-medium text-center">
                  &ldquo;আমল&rdquo; আপনাকে বিজ্ঞপ্তি পাঠাতে চাইছে
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSkip}
                    className="flex-1 py-2 rounded-xl border border-[#E6F4EA] text-[#AEB6BF] text-xs font-medium hover:bg-[#F5F5F5] transition-colors"
                  >
                    এখন না
                  </button>
                  <button
                    onClick={handleAllow}
                    disabled={requesting}
                    className="flex-1 py-2 rounded-xl bg-[#0B3C26] text-white text-xs font-medium hover:bg-[#0a3221] disabled:opacity-60 transition-colors"
                  >
                    {requesting ? "..." : "অনুমতি দিন"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main CTA */}
          <button
            onClick={handleAllow}
            disabled={requesting}
            className="mt-5 w-full bg-[#0B3C26] text-white py-4 rounded-2xl font-semibold text-base hover:bg-[#0a3221] active:scale-[0.98] transition-all duration-150 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {requesting && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {isSupported ? "অনুমতি দিন ও শুরু করুন" : "শুরু করুন"}
          </button>

          <button
            onClick={handleSkip}
            className="mt-3 w-full py-2 text-[#AEB6BF] text-sm hover:text-[#0B3C26] transition-colors"
          >
            এখন না, পরে করব
          </button>
        </div>
      </div>
    </div>
  );
}

function BellIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}
