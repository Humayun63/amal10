"use client";

import { useState, useEffect } from "react";
import {
  scheduleAllNotifications,
  initNotifications,
} from "@/lib/notifications";

const STORAGE_KEY_TIMES = "notifTimes";
const STORAGE_KEY_TASHRIQ = "notifTashriq";
const STORAGE_KEY_ENABLED = "notifEnabled";

const DEFAULT_TIMES = ["07:00", "15:30", "20:00"];

const NOTIFICATION_TYPES = [
  {
    id: "morning",
    title: "সকালের অনুপ্রেরণা",
    description: "ফজরের পর আমলের জন্য উৎসাহব্যঞ্জক বার্তা",
    icon: "🌅",
    defaultTime: "07:00",
  },
  {
    id: "afternoon",
    title: "আসরের রিমাইন্ডার",
    description: "আসরের পর তাকবীরে তাশরীকের তাগিদ",
    icon: "⭐",
    defaultTime: "15:30",
  },
  {
    id: "night",
    title: "রাতের আপডেট",
    description: "দৈনিক আমল সম্পন্ন করার শেষ সুযোগ",
    icon: "🌙",
    defaultTime: "20:00",
  },
];

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-all duration-200 ${
        checked ? "bg-[#0B3C26]" : "bg-[#E6F4EA]"
      }`}
      aria-checked={checked}
      role="switch"
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function NotificationsPage() {
  const [permission, setPermission] = useState<NotificationPermission | "loading">("loading");
  const [enabled, setEnabled] = useState(false);
  const [times, setTimes] = useState(DEFAULT_TIMES);
  const [tashriqAlert, setTashriqAlert] = useState(true);
  const [toggleStates, setToggleStates] = useState([true, true, true]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPermission(Notification.permission);

    const storedEnabled = localStorage.getItem(STORAGE_KEY_ENABLED);
    if (storedEnabled) setEnabled(storedEnabled === "true");

    const storedTimes = localStorage.getItem(STORAGE_KEY_TIMES);
    if (storedTimes) {
      try {
        setTimes(JSON.parse(storedTimes));
      } catch { /* ignore */ }
    }

    const storedTashriq = localStorage.getItem(STORAGE_KEY_TASHRIQ);
    setTashriqAlert(storedTashriq !== "false");

    initNotifications();
  }, []);

  async function requestPermission() {
    if (typeof window === "undefined") return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      setEnabled(true);
      localStorage.setItem(STORAGE_KEY_ENABLED, "true");
      scheduleAllNotifications(times);
    }
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_KEY_TIMES, JSON.stringify(times));
    localStorage.setItem(STORAGE_KEY_TASHRIQ, String(tashriqAlert));
    localStorage.setItem(STORAGE_KEY_ENABLED, String(enabled));

    if (enabled && permission === "granted") {
      scheduleAllNotifications(times);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function updateTime(index: number, value: string) {
    setTimes((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function toggleNotification(index: number) {
    setToggleStates((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }

  const isGranted = permission === "granted";
  const isDenied = permission === "denied";

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Header */}
      <div className="bg-[#0B3C26] text-white px-4 pt-12 pb-8 md:pt-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
              🔔
            </div>
            <div>
              <h1 className="text-[22px] font-bold">নোটিফিকেশন</h1>
              <p className="text-[#A3E4D7] text-xs">আমলের রিমাইন্ডার সেটআপ করুন</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 max-w-2xl mx-auto flex flex-col gap-4">

        {/* Permission Card */}
        {!isGranted && !isDenied && (
          <div className="bg-white rounded-2xl p-5 border border-[#E6F4EA] shadow-sm">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🔔</div>
              <div className="flex-1">
                <h2 className="text-[#0B3C26] font-semibold text-base mb-1">
                  নোটিফিকেশন চালু করুন
                </h2>
                <p className="text-[#AEB6BF] text-sm leading-relaxed mb-4">
                  প্রতিদিনের আমলের কথা মনে করিয়ে দিতে পুশ নোটিফিকেশন চালু করুন। দিনে ৩ বার রিমাইন্ডার পাবেন।
                </p>
                <button
                  onClick={requestPermission}
                  className="bg-[#0B3C26] text-white px-5 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-transform"
                >
                  অনুমতি দিন
                </button>
              </div>
            </div>
          </div>
        )}

        {isDenied && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-amber-800 font-semibold text-sm mb-1">নোটিফিকেশন ব্লক করা আছে</p>
                <p className="text-amber-700 text-xs leading-relaxed">
                  ব্রাউজার সেটিংস থেকে এই সাইটের নোটিফিকেশন অনুমতি দিন, তারপর পেজ রিফ্রেশ করুন।
                </p>
              </div>
            </div>
          </div>
        )}

        {isGranted && (
          <div className="bg-[#E6F4EA] rounded-2xl p-5 border border-[#A3E4D7]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="text-[#0B3C26] font-semibold text-sm">নোটিফিকেশন চালু আছে</p>
                  <p className="text-[#0B3C26] text-xs opacity-70">রিমাইন্ডার সক্রিয়</p>
                </div>
              </div>
              <Toggle checked={enabled} onChange={(v) => setEnabled(v)} />
            </div>
          </div>
        )}

        {/* Reminder Times */}
        <div className="bg-white rounded-2xl border border-[#E6F4EA] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E6F4EA]">
            <h2 className="text-[#0B3C26] font-semibold text-base">দৈনিক রিমাইন্ডার</h2>
            <p className="text-[#AEB6BF] text-xs mt-0.5">প্রতিদিন কখন নোটিফিকেশন পাবেন</p>
          </div>
          <div className="divide-y divide-[#E6F4EA]">
            {NOTIFICATION_TYPES.map((notif, i) => (
              <div key={notif.id} className="px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#E6F4EA] flex items-center justify-center text-xl flex-shrink-0">
                  {notif.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#1C2833] font-medium text-sm">{notif.title}</p>
                  <p className="text-[#AEB6BF] text-xs mt-0.5 truncate">{notif.description}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <input
                    type="time"
                    value={times[i] ?? notif.defaultTime}
                    onChange={(e) => updateTime(i, e.target.value)}
                    className="text-[#0B3C26] text-sm font-semibold bg-[#E6F4EA] rounded-lg px-2 py-1 border-none outline-none cursor-pointer"
                    disabled={!isGranted || !enabled || !toggleStates[i]}
                  />
                  <Toggle checked={toggleStates[i]} onChange={() => toggleNotification(i)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tashriq Special Alert */}
        <div className="bg-white rounded-2xl border border-[#E6F4EA] overflow-hidden">
          <div className="px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#E6F4EA] flex items-center justify-center text-xl flex-shrink-0">
              📣
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#1C2833] font-semibold text-sm">তাকবীরে তাশরীক অ্যালার্ট</p>
              <p className="text-[#AEB6BF] text-xs mt-0.5 leading-tight">
                ৯–১৩ জিলহজ প্রতি ফরজ নামাজের পর তাকবীর পড়তে মনে করিয়ে দেবে
              </p>
            </div>
            <Toggle checked={tashriqAlert} onChange={setTashriqAlert} />
          </div>
        </div>

        {/* What to Expect */}
        <div className="bg-white rounded-2xl p-5 border border-[#E6F4EA]">
          <h2 className="text-[#0B3C26] font-semibold text-base mb-3">কী ধরনের নোটিফিকেশন পাবেন</h2>
          <div className="flex flex-col gap-3">
            {[
              {
                icon: "🌅",
                title: "সকালের বার্তা",
                desc: "ফজরের পর আজকের আমলের তালিকা ও অনুপ্রেরণামূলক হাদিস",
              },
              {
                icon: "⭐",
                title: "দুপুরের রিমাইন্ডার",
                desc: "আসরের পর তাকবীরে তাশরীক ও বাকি আমলের তাগিদ",
              },
              {
                icon: "🌙",
                title: "রাতের সারসংক্ষেপ",
                desc: "দিনের আমলের অগ্রগতি ও আগামীকালের প্রস্তুতি",
              },
              {
                icon: "📣",
                title: "তাশরীক স্পেশাল",
                desc: "৯–১৩ জিলহজ প্রতি ফরজ নামাজের পর বিশেষ তাকবীর অ্যালার্ট",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-[#1C2833] text-sm font-medium">{item.title}</p>
                  <p className="text-[#AEB6BF] text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={saveSettings}
          disabled={!isGranted}
          className={`w-full py-4 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
            isGranted
              ? saved
                ? "bg-[#A3E4D7] text-[#0B3C26]"
                : "bg-[#0B3C26] text-white"
              : "bg-[#E6F4EA] text-[#AEB6BF] cursor-not-allowed"
          }`}
        >
          {saved ? "✓ সেটিংস সেভ হয়েছে" : "সেটিংস সেভ করুন"}
        </button>

        <p className="text-center text-[#AEB6BF] text-xs pb-4">
          নোটিফিকেশন শুধুমাত্র আপনার ডিভাইসে কাজ করে। কোনো সার্ভারে ডেটা পাঠানো হয় না।
        </p>
      </div>
    </div>
  );
}
