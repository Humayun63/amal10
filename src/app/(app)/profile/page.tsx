"use client";

import { useEffect, useState } from "react";
import { BADGES, getEarnedBadges, type BadgeConditionData } from "@/lib/data/badges";
import { calculatePoints, getAmalForDay } from "@/lib/data/amal";

const STORAGE_KEY = "amal_completed";

function loadCompleted(): Record<number, string[]> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export default function ProfilePage() {
  const [allCompleted, setAllCompleted] = useState<Record<number, string[]>>({});

  useEffect(() => {
    setAllCompleted(loadCompleted());
  }, []);

  const totalPoints = Object.entries(allCompleted).reduce((sum, [day, ids]) => {
    return sum + calculatePoints(ids, Number(day));
  }, 0);

  const streak = Object.keys(allCompleted).length;

  const daysCompleted = Object.entries(allCompleted).filter(([day, ids]) => {
    const dayAmal = getAmalForDay(Number(day));
    return ids.length === dayAmal.length && dayAmal.length > 0;
  }).length;

  const conditionData: BadgeConditionData = {
    totalPoints,
    streak,
    completedAmalIds: allCompleted,
    daysCompleted,
  };

  const earnedBadges = getEarnedBadges(conditionData);
  const earnedIds = new Set(earnedBadges.map((b) => b.id));

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Header */}
      <div className="bg-[#0B3C26] text-white px-4 pt-14 pb-8 text-center">
        <div className="w-20 h-20 rounded-full bg-[#A3E4D7] flex items-center justify-center text-4xl mx-auto mb-3">
          🧑
        </div>
        <h1 className="text-[20px] font-bold">মুসলিম ব্যবহারকারী</h1>
        <p className="text-[#A3E4D7] text-sm mt-1">জিলহজ আমল চ্যালেঞ্জ অংশগ্রহণকারী</p>
      </div>

      <div className="px-4 py-4 max-w-lg mx-auto flex flex-col gap-5">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "মোট পয়েন্ট", value: totalPoints.toString(), icon: "⭐" },
            { label: "স্ট্রেইক", value: `${streak} দিন`, icon: "🔥" },
            { label: "পারফেক্ট দিন", value: daysCompleted.toString(), icon: "🏆" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 border border-[#E6F4EA] text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <p className="text-[#0B3C26] font-bold text-base font-[var(--font-inter)]">{stat.value}</p>
              <p className="text-[#AEB6BF] text-[10px] leading-tight mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Streak history */}
        <div className="bg-white rounded-2xl p-5 border border-[#E6F4EA]">
          <h2 className="text-[20px] font-semibold text-[#0B3C26] mb-4">১০ দিনের ট্র্যাক</h2>
          <div className="flex gap-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((d) => {
              const comp = allCompleted[d] ?? [];
              const dayAmal = getAmalForDay(d);
              const ratio = dayAmal.length > 0 ? comp.length / dayAmal.length : 0;
              return (
                <div key={d} className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="relative w-full">
                    <div className="h-16 bg-[#E6F4EA] rounded-lg overflow-hidden">
                      <div
                        className="absolute bottom-0 w-full bg-[#0B3C26] rounded-lg transition-all"
                        style={{ height: `${ratio * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[9px] text-[#AEB6BF] font-[var(--font-inter)]">{d}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-2xl p-5 border border-[#E6F4EA]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-semibold text-[#0B3C26]">ব্যাজ সমূহ</h2>
            <span className="text-[#AEB6BF] text-xs">{earnedBadges.length}/{BADGES.length} অর্জিত</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map((badge) => {
              const earned = earnedIds.has(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`rounded-xl p-3 text-center border transition-all ${
                    earned
                      ? "bg-[#E6F4EA] border-[#A3E4D7]"
                      : "bg-[#FAFAF9] border-[#E6F4EA] opacity-50"
                  }`}
                >
                  <div className={`text-2xl mb-1 ${!earned ? "grayscale" : ""}`}>
                    {badge.icon}
                  </div>
                  <p className="text-[#0B3C26] text-[10px] font-semibold leading-tight">
                    {badge.title}
                  </p>
                  {earned && (
                    <p className="text-[#A3E4D7] text-[9px] mt-0.5">অর্জিত ✓</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Share */}
        <button className="w-full bg-[#0B3C26] text-white py-4 rounded-xl font-semibold active:scale-95 transition-transform flex items-center justify-center gap-2">
          <span>🔗</span> স্ট্রেইক শেয়ার করুন
        </button>

        <p className="text-center text-[#AEB6BF] text-xs pb-4">
          ডেটা আপনার ডিভাইসে সেভ আছে। লগইন করলে ক্লাউডে সিঙ্ক হবে।
        </p>
      </div>
    </div>
  );
}
