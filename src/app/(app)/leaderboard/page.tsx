"use client";

import { useState, useEffect } from "react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  streak: number;
  avatar: string;
  isCurrentUser?: boolean;
}

const MOCK_DATA: LeaderboardEntry[] = [
  { rank: 1, name: "আব্দুল্লাহ আল-মামুন", points: 1240, streak: 10, avatar: "আ" },
  { rank: 2, name: "ফাতেমা খানম", points: 1180, streak: 9, avatar: "ফা" },
  { rank: 3, name: "মুহাম্মদ রাহিম", points: 1120, streak: 10, avatar: "মু" },
  { rank: 4, name: "আপনি", points: 980, streak: 7, avatar: "⭐", isCurrentUser: true },
  { rank: 5, name: "নুসরাত জাহান", points: 940, streak: 8, avatar: "নু" },
  { rank: 6, name: "ইব্রাহিম হোসেন", points: 900, streak: 6, avatar: "ই" },
  { rank: 7, name: "মরিয়ম বেগম", points: 860, streak: 5, avatar: "ম" },
  { rank: 8, name: "তারিক আনোয়ার", points: 820, streak: 7, avatar: "তা" },
  { rank: 9, name: "সামিরা ইসলাম", points: 780, streak: 4, avatar: "সা" },
  { rank: 10, name: "ইউসুফ মিয়া", points: 740, streak: 6, avatar: "ইউ" },
];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-xl">🥇</span>;
  if (rank === 2) return <span className="text-xl">🥈</span>;
  if (rank === 3) return <span className="text-xl">🥉</span>;
  return (
    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#E6F4EA] text-[#0B3C26] text-xs font-bold font-[var(--font-inter)]">
      {rank}
    </span>
  );
}

export default function LeaderboardPage() {
  const [tab, setTab] = useState<"global" | "today">("global");

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Header */}
      <div className="bg-[#0B3C26] text-white px-4 pt-14 pb-6">
        <h1 className="text-[26px] font-bold mb-1">লিডারবোর্ড</h1>
        <p className="text-[#A3E4D7] text-sm">গ্লোবাল র‍্যাংকিং ও পয়েন্ট ট্র্যাকার</p>

        {/* My rank card */}
        <div className="mt-4 bg-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#A3E4D7] flex items-center justify-center text-2xl">⭐</div>
          <div className="flex-1">
            <p className="text-white font-semibold">আপনার অবস্থান</p>
            <p className="text-[#A3E4D7] text-xs">৯৮০ পয়েন্ট • ৭ দিনের স্ট্রেইক 🔥</p>
          </div>
          <div className="text-right">
            <p className="text-white text-2xl font-bold font-[var(--font-inter)]">#4</p>
            <p className="text-[#A3E4D7] text-xs">র‍্যাংক</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-4 max-w-lg mx-auto">
        <div className="flex bg-[#E6F4EA] rounded-xl p-1 mb-4">
          {(["global", "today"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t ? "bg-[#0B3C26] text-white shadow-sm" : "text-[#AEB6BF]"
              }`}
            >
              {t === "global" ? "সর্বকালীন" : "আজকের"}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex flex-col gap-2">
          {MOCK_DATA.map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                entry.isCurrentUser
                  ? "bg-[#E6F4EA] border-[#A3E4D7]"
                  : "bg-white border-[#E6F4EA]"
              }`}
            >
              <RankBadge rank={entry.rank} />
              <div className="w-10 h-10 rounded-full bg-[#E6F4EA] flex items-center justify-center text-xl flex-shrink-0">
                {entry.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${entry.isCurrentUser ? "text-[#0B3C26]" : "text-[#1C2833]"}`}>
                  {entry.name}
                </p>
                <p className="text-[#AEB6BF] text-xs flex items-center gap-1">
                  🔥 {entry.streak} দিন স্ট্রেইক
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[#0B3C26] font-bold text-sm font-[var(--font-inter)]">
                  {entry.points.toLocaleString("bn-BD")}
                </p>
                <p className="text-[#AEB6BF] text-xs">পয়েন্ট</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-[#AEB6BF] text-xs mt-6 pb-4">
          লাইভ ডেটা Supabase থেকে লোড হবে
        </p>
      </div>
    </div>
  );
}
