"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "হোম",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
          fill={active ? "#0B3C26" : "none"}
          stroke={active ? "#0B3C26" : "#AEB6BF"}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/leaderboard",
    label: "লিডারবোর্ড",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="12" width="4" height="9" rx="1" fill={active ? "#0B3C26" : "none"} stroke={active ? "#0B3C26" : "#AEB6BF"} strokeWidth="1.8" />
        <rect x="10" y="7" width="4" height="14" rx="1" fill={active ? "#0B3C26" : "none"} stroke={active ? "#0B3C26" : "#AEB6BF"} strokeWidth="1.8" />
        <rect x="17" y="3" width="4" height="18" rx="1" fill={active ? "#0B3C26" : "none"} stroke={active ? "#0B3C26" : "#AEB6BF"} strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    href: "/insights",
    label: "ইনসাইট",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C8.13 2 5 5.13 5 9C5 12.54 7.76 15.47 11.32 15.93V20H12.68V15.93C16.24 15.47 19 12.54 19 9C19 5.13 15.87 2 12 2Z"
          fill={active ? "#0B3C26" : "none"}
          stroke={active ? "#0B3C26" : "#AEB6BF"}
          strokeWidth="1.8"
        />
        <line x1="10" y1="22" x2="14" y2="22" stroke={active ? "#0B3C26" : "#AEB6BF"} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "প্রোফাইল",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" fill={active ? "#0B3C26" : "none"} stroke={active ? "#0B3C26" : "#AEB6BF"} strokeWidth="1.8" />
        <path d="M4 20C4 16.69 7.58 14 12 14C16.42 14 20 16.69 20 20" stroke={active ? "#0B3C26" : "#AEB6BF"} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-[#E6F4EA] safe-bottom">
      <div className="flex items-center justify-around px-2 pt-2 pb-safe max-w-lg mx-auto" style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}>
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 flex-1 py-1 tab-transition"
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all ${active ? "bg-[#E6F4EA]" : ""}`}>
                {item.icon(active)}
              </div>
              <span className={`text-[10px] font-medium transition-colors leading-tight ${active ? "text-[#0B3C26]" : "text-[#AEB6BF]"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
