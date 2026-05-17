"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCurrentDhulHijjahDay } from "@/lib/utils/dhulHijjah";
import { calculatePoints } from "@/lib/data/amal";

function toBn(n: number): string {
  return n.toString().replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
}

function getDayOrdinal(day: number): string {
  const map: Record<number, string> = {
    1: "১ম", 2: "২য়", 3: "৩য়", 4: "৪র্থ", 5: "৫ম", 6: "৬ষ্ঠ",
    7: "৭ম", 8: "৮ম", 9: "৯ম", 10: "১০ম", 11: "১১তম", 12: "১২তম", 13: "১৩তম",
  };
  return map[day] ?? `${toBn(day)}তম`;
}

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "ড্যাশবোর্ড",
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
          fill={active ? "#0B3C26" : "none"} stroke={active ? "#0B3C26" : "#AEB6BF"} strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/insights",
    label: "ইনসাইট ও হাদিস",
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9C5 12.54 7.76 15.47 11.32 15.93V20H12.68V15.93C16.24 15.47 19 12.54 19 9C19 5.13 15.87 2 12 2Z"
          fill={active ? "#0B3C26" : "none"} stroke={active ? "#0B3C26" : "#AEB6BF"} strokeWidth="1.8"/>
        <line x1="10" y1="22" x2="14" y2="22" stroke={active ? "#0B3C26" : "#AEB6BF"} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/leaderboard",
    label: "লিডারবোর্ড",
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="12" width="4" height="9" rx="1" fill={active ? "#0B3C26" : "none"} stroke={active ? "#0B3C26" : "#AEB6BF"} strokeWidth="1.8"/>
        <rect x="10" y="7" width="4" height="14" rx="1" fill={active ? "#0B3C26" : "none"} stroke={active ? "#0B3C26" : "#AEB6BF"} strokeWidth="1.8"/>
        <rect x="17" y="3" width="4" height="18" rx="1" fill={active ? "#0B3C26" : "none"} stroke={active ? "#0B3C26" : "#AEB6BF"} strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "প্রোফাইল",
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" fill={active ? "#0B3C26" : "none"} stroke={active ? "#0B3C26" : "#AEB6BF"} strokeWidth="1.8"/>
        <path d="M4 20C4 16.69 7.58 14 12 14C16.42 14 20 16.69 20 20" stroke={active ? "#0B3C26" : "#AEB6BF"} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [currentDay, setCurrentDay] = useState<number | null>(null);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userInitial, setUserInitial] = useState("আ");
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    setCurrentDay(getCurrentDhulHijjahDay() ?? 1);

    createClient().auth.getUser().then(({ data }) => {
      const u = data.user;
      if (!u) return;
      const name = u.user_metadata?.full_name ?? u.user_metadata?.name ?? u.email?.split("@")[0] ?? "";
      setUserName(name);
      setUserAvatar(u.user_metadata?.avatar_url ?? null);
      if (name) setUserInitial(name.charAt(0).toUpperCase());
    });

    try {
      const all: Record<number, string[]> = JSON.parse(localStorage.getItem("amal_completed") ?? "{}");
      const pts = Object.entries(all).reduce((sum, [day, ids]) => sum + calculatePoints(ids, Number(day)), 0);
      setTotalPoints(pts);
    } catch { /* empty */ }
  }, []);

  const dayOrdinal = currentDay ? getDayOrdinal(currentDay) : null;

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-[#E6F4EA] flex-col z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#E6F4EA]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-[#0B3C26] flex items-center justify-center">
              <span className="text-white text-xs font-bold">আমল</span>
            </div>
            {currentDay && (
              <div className="absolute -top-1.5 -right-1.5 min-w-5 h-5 bg-red-500 rounded-full flex items-center justify-center px-1">
                <span className="text-white text-[9px] font-bold">{toBn(currentDay)}</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-[#0B3C26] font-bold text-base leading-tight">আমল</p>
            <p className="text-[#AEB6BF] text-[10px] uppercase tracking-wider font-medium">
              DHUL HIJJAH {currentDay ?? "10"}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item, idx) => {
          const active = idx === 0
            ? pathname === "/dashboard" || pathname.startsWith("/dashboard")
            : pathname.startsWith(item.href) && item.href !== "/dashboard";
          const isDashboard = idx === 0;

          return (
            <Link
              key={`${item.href}-${idx}`}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                active && isDashboard
                  ? "bg-[#E6F4EA] text-[#0B3C26]"
                  : active
                  ? "bg-[#E6F4EA] text-[#0B3C26]"
                  : "text-[#AEB6BF] hover:bg-[#FAFAF9] hover:text-[#1C2833]"
              }`}
            >
              <span className="shrink-0">{item.icon(active && isDashboard)}</span>
              <span className={`text-sm flex-1 ${active ? "font-semibold text-[#0B3C26]" : "font-medium"}`}>
                {item.label}
              </span>
              {isDashboard && dayOrdinal && (
                <span className="bg-[#0B3C26] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0">
                  {dayOrdinal} দিন
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      <div className="px-3 py-3 border-t border-[#E6F4EA]">
        <Link href="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FAFAF9] transition-colors group">
          <div className="w-9 h-9 rounded-full bg-[#0B3C26] flex items-center justify-center overflow-hidden shrink-0">
            {userAvatar ? (
              <Image src={userAvatar} alt="profile" width={36} height={36} className="w-full h-full object-cover"/>
            ) : (
              <span className="text-white text-sm font-bold">{userInitial}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#1C2833] text-sm font-semibold truncate">{userName || "ব্যবহারকারী"}</p>
            <p className="text-[#AEB6BF] text-[11px]">{toBn(totalPoints)} পয়েন্ট · #৫</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#AEB6BF] shrink-0">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </Link>
      </div>
    </aside>
  );
}
