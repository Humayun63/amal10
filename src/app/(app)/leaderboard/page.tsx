"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { fetchLeaderboard, type LeaderboardEntry } from "@/lib/supabase/scores";
import { calculatePoints } from "@/lib/data/amal";
import { getCurrentDhulHijjahDay } from "@/lib/utils/dhulHijjah";

function toBn(n: number): string {
  return n.toString().replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
}

const PODIUM_COLORS = [
  { bg: "bg-amber-400", text: "text-amber-900", ring: "ring-amber-300", label: "🥇" },
  { bg: "bg-slate-300", text: "text-slate-700", ring: "ring-slate-200", label: "🥈" },
  { bg: "bg-amber-600", text: "text-amber-100", ring: "ring-amber-500", label: "🥉" },
];

function PodiumCard({
  entry,
  position,
  avatarUrl,
}: {
  entry: LeaderboardEntry;
  position: number;
  avatarUrl?: string | null;
}) {
  const color = PODIUM_COLORS[position];
  const heights = ["h-28", "h-20", "h-16"];
  const sizes = ["w-16 h-16 text-2xl", "w-14 h-14 text-xl", "w-12 h-12 text-lg"];

  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div
        className={`${sizes[position]} rounded-full ${color.bg} ${color.ring} ring-2 flex items-center justify-center font-bold ${color.text} relative overflow-hidden`}
      >
        {entry.isCurrentUser && avatarUrl ? (
          <Image src={avatarUrl} alt="profile" width={64} height={64} className="w-full h-full object-cover" />
        ) : (
          entry.avatarInitial
        )}
        <span className="absolute -bottom-1 -right-1 text-base leading-none">{color.label}</span>
      </div>
      <div className="text-center">
        <p className="text-[#1C2833] text-xs font-semibold leading-tight max-w-[72px] truncate">{entry.name}</p>
        <p className="text-[#0B3C26] text-xs font-bold">{toBn(entry.totalPoints)} pts</p>
        <p className="text-[#AEB6BF] text-[10px]">🔥 {toBn(entry.streakDays)}</p>
      </div>
      <div className={`${heights[position]} w-full ${color.bg} rounded-t-xl flex items-end justify-center pb-1`}>
        <span className="text-white font-bold text-sm opacity-70">#{toBn(entry.rank)}</span>
      </div>
    </div>
  );
}

function EntryRow({
  entry,
  avatarUrl,
  tab,
}: {
  entry: LeaderboardEntry;
  avatarUrl?: string | null;
  tab: "global" | "today";
}) {
  const isTop3 = entry.rank <= 3;
  const medals = ["🥇", "🥈", "🥉"];
  const pts = tab === "global" ? entry.totalPoints : entry.todayPoints;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all ${
        entry.isCurrentUser
          ? "bg-[#E6F4EA] border-[#A3E4D7]"
          : isTop3
          ? "bg-amber-50 border-amber-100"
          : "bg-white border-[#F0F4F2]"
      }`}
    >
      {/* Rank */}
      <div className="w-8 flex items-center justify-center shrink-0">
        {isTop3 ? (
          <span className="text-xl">{medals[entry.rank - 1]}</span>
        ) : (
          <span className="text-[#AEB6BF] text-sm font-bold">{toBn(entry.rank)}</span>
        )}
      </div>

      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden ${
          entry.isCurrentUser ? "bg-[#0B3C26] text-white" : "bg-[#E6F4EA] text-[#0B3C26]"
        }`}
      >
        {entry.isCurrentUser && avatarUrl ? (
          <Image src={avatarUrl} alt="profile" width={40} height={40} className="w-full h-full object-cover" />
        ) : (
          entry.avatarInitial
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${entry.isCurrentUser ? "text-[#0B3C26]" : "text-[#1C2833]"}`}>
          {entry.name}
          {entry.isCurrentUser && (
            <span className="text-xs font-normal text-[#A3E4D7] ml-1">(আপনি)</span>
          )}
        </p>
        <p className="text-[#AEB6BF] text-xs flex items-center gap-1 mt-0.5">
          🔥 {toBn(entry.streakDays)} দিন স্ট্রেইক
        </p>
      </div>

      {/* Points */}
      <div className="text-right shrink-0">
        <p className={`font-bold text-sm ${entry.isCurrentUser ? "text-[#0B3C26]" : "text-[#1C2833]"}`}>
          {toBn(pts)}
        </p>
        <p className="text-[#AEB6BF] text-[10px]">পয়েন্ট</p>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-[#F0F4F2] bg-white animate-pulse">
      <div className="w-8 h-5 bg-[#F0F4F2] rounded"/>
      <div className="w-10 h-10 rounded-full bg-[#F0F4F2]"/>
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-[#F0F4F2] rounded w-32"/>
        <div className="h-2.5 bg-[#F0F4F2] rounded w-20"/>
      </div>
      <div className="w-10 h-4 bg-[#F0F4F2] rounded"/>
    </div>
  );
}

export default function LeaderboardPage() {
  const [tab, setTab] = useState<"global" | "today">("global");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserAvatarUrl, setCurrentUserAvatarUrl] = useState<string | null>(null);
  const [totalParticipants, setTotalParticipants] = useState(0);

  // Get current user's local points/streak for the "my position" card
  const [myLocalPoints, setMyLocalPoints] = useState(0);
  const [myLocalStreak, setMyLocalStreak] = useState(0);

  useEffect(() => {
    // Load local stats
    try {
      const all: Record<number, string[]> = JSON.parse(localStorage.getItem("amal_completed") ?? "{}");
      const pts = Object.entries(all).reduce(
        (sum, [day, ids]) => sum + calculatePoints(ids, Number(day)),
        0
      );
      setMyLocalPoints(pts);
      setMyLocalStreak(Object.keys(all).length);
    } catch { /* empty */ }

    // Get auth user
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        const u = data.user;
        if (u) {
          setCurrentUserId(u.id);
          setCurrentUserAvatarUrl(u.user_metadata?.avatar_url ?? null);
        }
      });
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(false);
      try {
        const data = await fetchLeaderboard(tab, currentUserId);
        setEntries(data);
        setTotalParticipants(data.length);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tab, currentUserId]);

  const me = entries.find((e) => e.isCurrentUser);
  const myRank = me?.rank ?? null;
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Header */}
      <div className="bg-[#0B3C26] text-white px-4 pt-12 pb-6 md:pt-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">🏆</div>
            <div>
              <h1 className="text-[22px] font-bold leading-tight">লিডারবোর্ড</h1>
              <p className="text-[#A3E4D7] text-xs">গ্লোবাল র‍্যাংকিং ও পয়েন্ট</p>
            </div>
          </div>

          {/* My rank card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 border border-white/10">
            <div className="w-12 h-12 rounded-full bg-[#A3E4D7] flex items-center justify-center overflow-hidden shrink-0">
              {currentUserAvatarUrl ? (
                <Image
                  src={currentUserAvatarUrl}
                  alt="profile"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[#0B3C26] font-bold text-lg">⭐</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">আপনার অবস্থান</p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-[#A3E4D7] text-xs flex items-center gap-1">
                  ⭐ {toBn(myLocalPoints)} পয়েন্ট
                </span>
                <span className="text-[#A3E4D7] text-xs flex items-center gap-1">
                  🔥 {toBn(myLocalStreak)} দিন স্ট্রেইক
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              {myRank ? (
                <>
                  <p className="text-white text-3xl font-bold leading-none">#{toBn(myRank)}</p>
                  <p className="text-[#A3E4D7] text-xs mt-0.5">র‍্যাংক</p>
                </>
              ) : (
                <>
                  <p className="text-white/50 text-sm font-medium leading-tight">তালিকায়</p>
                  <p className="text-[#A3E4D7] text-xs">নেই এখনো</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 max-w-2xl mx-auto flex flex-col gap-4">
        {/* Tabs */}
        <div className="flex bg-[#E6F4EA] rounded-xl p-1">
          {(["global", "today"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                tab === t ? "bg-[#0B3C26] text-white shadow-sm" : "text-[#AEB6BF]"
              }`}
            >
              {t === "global" ? "🌍 সর্বকালীন" : "📅 আজকের"}
            </button>
          ))}
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 rounded-2xl border border-red-100 p-6 text-center">
            <p className="text-2xl mb-2">⚠️</p>
            <p className="text-[#1C2833] font-semibold text-sm">ডেটা লোড করতে সমস্যা হয়েছে</p>
            <p className="text-[#AEB6BF] text-xs mt-1">ইন্টারনেট সংযোগ চেক করুন অথবা পরে চেষ্টা করুন।</p>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && !error && (
          <>
            <div className="bg-white rounded-2xl p-5 border border-[#E6F4EA]">
              <div className="flex items-end gap-3">
                {[1,0,2].map(i => (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1 animate-pulse">
                    <div className={`rounded-full bg-[#F0F4F2] ${i===0?"w-16 h-16":"w-12 h-12"}`}/>
                    <div className="h-2.5 bg-[#F0F4F2] rounded w-14"/>
                    <div className={`w-full bg-[#F0F4F2] rounded-t-xl ${i===0?"h-28":i===1?"h-20":"h-16"}`}/>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {[0,1,2,3,4].map(i => <SkeletonRow key={i}/>)}
            </div>
          </>
        )}

        {/* Populated state */}
        {!loading && !error && entries.length > 0 && (
          <>
            {/* Podium — top 3 */}
            {top3.length === 3 && (
              <div className="bg-white rounded-2xl p-5 border border-[#E6F4EA]">
                <p className="text-[#AEB6BF] text-[10px] font-bold uppercase tracking-widest text-center mb-4">
                  শীর্ষ ৩ অংশগ্রহণকারী
                </p>
                <div className="flex items-end gap-3">
                  <PodiumCard entry={top3[1]} position={1} avatarUrl={top3[1].isCurrentUser ? currentUserAvatarUrl : null}/>
                  <PodiumCard entry={top3[0]} position={0} avatarUrl={top3[0].isCurrentUser ? currentUserAvatarUrl : null}/>
                  <PodiumCard entry={top3[2]} position={2} avatarUrl={top3[2].isCurrentUser ? currentUserAvatarUrl : null}/>
                </div>
              </div>
            )}

            {/* Rest of list */}
            {rest.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-[#AEB6BF] text-[10px] font-bold uppercase tracking-widest px-1">
                  বাকি র‍্যাংকিং
                </p>
                {rest.map((entry) => (
                  <EntryRow
                    key={entry.userId}
                    entry={entry}
                    avatarUrl={entry.isCurrentUser ? currentUserAvatarUrl : null}
                    tab={tab}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!loading && !error && entries.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#E6F4EA] p-10 text-center">
            <p className="text-4xl mb-3">🏆</p>
            <p className="text-[#1C2833] font-bold text-base">এখনো কেউ স্কোর করেনি</p>
            <p className="text-[#AEB6BF] text-sm mt-1 leading-relaxed">
              আমল সম্পন্ন করুন এবং প্রথম লিডারবোর্ডে আসুন!
            </p>
          </div>
        )}

        {/* Participants count */}
        {!loading && !error && totalParticipants > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-[#E6F4EA] text-center">
            <p className="text-[#0B3C26] font-bold text-lg">
              🔥 {toBn(totalParticipants)}+
            </p>
            <p className="text-[#AEB6BF] text-xs mt-1">
              মুসলিম এই চ্যালেঞ্জে অংশ নিয়েছেন
            </p>
          </div>
        )}

        <p className="text-center text-[#AEB6BF] text-xs pb-4">
          আমল সম্পন্ন করলে স্বয়ংক্রিয়ভাবে স্কোর আপডেট হবে
        </p>
      </div>
    </div>
  );
}
