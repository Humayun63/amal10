"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getTimeUntilStart, isChallengeLive } from "@/lib/utils/dhulHijjah";
import { fetchCommunityStats, type CommunityStats } from "@/lib/supabase/scores";

function toBn(n: number): string {
  return n.toString().replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
}

function CountdownTimer() {
  const [time, setTime] = useState(getTimeUntilStart());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeUntilStart()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex gap-2 sm:gap-3">
      {[
        { label: "দিন", value: time.days },
        { label: "ঘণ্টা", value: time.hours },
        { label: "মিনিট", value: time.minutes },
        { label: "সেকেন্ড", value: time.seconds },
      ].map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
            <span className="text-white text-xl sm:text-2xl font-bold tabular-nums">
              {pad(value)}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-white/70 mt-1.5 font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="relative flex justify-center items-center">
      {/* Glow */}
      <div className="absolute inset-0 bg-[#A3E4D7]/20 blur-3xl rounded-full scale-75" />

      {/* Phone frame */}
      <div className="relative w-65 sm:w-70 lg:w-75 bg-[#0D1B2A] rounded-[40px] shadow-2xl border border-white/10 overflow-hidden">
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <span className="text-white/80 text-[11px] font-medium tabular-nums">৪:১৭</span>
          <div className="flex gap-1 items-center">
            <div className="flex gap-0.5">
              {[2, 3, 4, 5].map((h) => (
                <div key={h} className="w-0.5 bg-white/70 rounded-sm" style={{ height: h }} />
              ))}
            </div>
            <div className="w-4 h-2 border border-white/70 rounded-sm ml-1 relative">
              <div className="absolute left-0.5 top-0.5 bottom-0.5 w-2/3 bg-white/70 rounded-sm" />
            </div>
          </div>
        </div>

        {/* App header */}
        <div className="px-5 pb-3">
          <p className="text-white/50 text-[10px] font-medium tracking-widest uppercase">আমল · DHUL HIJJAH</p>
          <h3 className="text-white text-lg font-bold mt-0.5">আজকের আমল</h3>
        </div>

        {/* Dashboard card */}
        <div className="mx-4 bg-white/10 rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white/60 text-[10px]">আসসালামু আলাইকুম</p>
              <p className="text-white font-semibold text-sm">রাফি ভাই 🌙</p>
            </div>
            <div className="bg-[#A3E4D7]/20 px-2.5 py-1 rounded-full">
              <span className="text-[#A3E4D7] text-[10px] font-semibold">DAY ৭</span>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-1 flex justify-between">
            <span className="text-white/60 text-[10px]">প্রগতি</span>
            <span className="text-[#A3E4D7] text-[10px] font-bold">৬২%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
            <div className="h-full w-[62%] bg-linear-to-r from-[#A3E4D7] to-[#0B3C26] rounded-full" />
          </div>

          {/* Streak */}
          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2.5 mb-2">
            <span className="text-lg animate-pulse-fire">🔥</span>
            <div>
              <p className="text-white text-xs font-semibold">৬ দিনের স্ট্রিক</p>
              <p className="text-white/50 text-[9px]">keep going!</p>
            </div>
          </div>

          {/* Arafah reminder */}
          <div className="flex items-center gap-2 bg-[#A3E4D7]/10 rounded-xl p-2.5">
            <span className="text-base">☀️</span>
            <div>
              <p className="text-[#A3E4D7] text-xs font-semibold">আরাফাহ · কাল</p>
              <p className="text-white/50 text-[9px]">রোজার রিমাইন্ডার</p>
            </div>
          </div>
        </div>

        {/* Amal list preview */}
        <div className="mx-4 mt-3 mb-4 space-y-2">
          {[
            { done: true, label: "ফজর জামায়াতে আদায়", pts: "২০" },
            { done: true, label: "সকালের আজকার", pts: "১০" },
            { done: false, label: "যোহর জামায়াতে আদায়", pts: "২০" },
          ].map((amal) => (
            <div
              key={amal.label}
              className={`flex items-center gap-2.5 rounded-xl p-2.5 ${
                amal.done ? "bg-[#A3E4D7]/10" : "bg-white/5"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  amal.done ? "bg-[#A3E4D7]" : "border border-white/20"
                }`}
              >
                {amal.done && (
                  <svg className="w-3 h-3 text-[#0B3C26]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-[10px] flex-1 ${amal.done ? "text-white/70 line-through" : "text-white/90"}`}>
                {amal.label}
              </span>
              <span className="text-[#A3E4D7] text-[9px] font-bold">+{amal.pts}</span>
            </div>
          ))}
        </div>

        {/* Bottom nav */}
        <div className="border-t border-white/10 flex items-center justify-around px-4 py-3">
          {[
            { icon: "🏠", active: true },
            { icon: "🏆", active: false },
            { icon: "📖", active: false },
            { icon: "👤", active: false },
          ].map(({ icon, active }) => (
            <div key={icon} className={`flex flex-col items-center gap-0.5 ${active ? "opacity-100" : "opacity-40"}`}>
              <span className="text-sm">{icon}</span>
              {active && <div className="w-1 h-1 bg-[#A3E4D7] rounded-full" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const AVATARS = ["র", "স", "ম", "ন", "আ"];
const FEATURES = [
  { icon: "🕌", title: "১০ দিনের গাইড", desc: "প্রতিদিনের সুনির্দিষ্ট আমল" },
  { icon: "📿", title: "তাকবীর কাউন্টার", desc: "৯-১৩ জিলহজের জন্য" },
  { icon: "🔥", title: "স্ট্রিক ও ব্যাজ", desc: "প্রেরণা পাবেন প্রতিদিন" },
  { icon: "🤝", title: "বন্ধুদের সাথে", desc: "একসাথে এগিয়ে যান" },
];

export default function LandingPage() {
  const live = isChallengeLive();
  const [daysLeft, setDaysLeft] = useState(getTimeUntilStart().days);
  const [stats, setStats] = useState<CommunityStats | null>(null);

  useEffect(() => {
    const id = setInterval(() => setDaysLeft(getTimeUntilStart().days), 60000);
    fetchCommunityStats().then(setStats);
    return () => clearInterval(id);
  }, []);

  const participantCount = stats?.totalParticipants ?? 0;
  const participantLabel = participantCount > 0 ? `${toBn(participantCount)}+ জন যোগ দিয়েছেন` : "চ্যালেঞ্জ শুরু করুন";

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col">
      {/* ── Navbar (desktop only) ── */}
      <nav className="hidden lg:flex items-center justify-between px-8 xl:px-16 h-16 bg-[#0B3C26] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center overflow-hidden">
            <Image src="/logo.png" alt="আমল লোগো" width={32} height={33} className="w-8 h-8 object-contain"/>
          </div>
          <div className="leading-none">
            <p className="text-white font-bold text-base tracking-tight">আমল</p>
            <p className="text-[#A3E4D7] text-[10px] font-medium tracking-widest uppercase">DHUL HIJJAH 10</p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          {[
            { label: "ফিচার", href: "#features" },
            { label: "হাদিস হাব", href: "#hadith-hub" },
            { label: "সম্প্রদায়", href: "#community" },
            { label: "সাপোর্ট", href: "#support" },
          ].map(({ label, href }) => (
            <a key={label} href={href} className="text-white/70 hover:text-white text-sm font-medium transition-colors">
              {label}
            </a>
          ))}
        </div>
        <Link
          href="/sign-in"
          className="bg-[#A3E4D7] text-[#0B3C26] px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-white transition-colors"
        >
          চ্যালেঞ্জ শুরু করুন
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-[#0B3C26] relative overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.06]">
          <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <circle cx="600" cy="300" r="380" fill="none" stroke="white" strokeWidth="1.5" />
            <circle cx="600" cy="300" r="260" fill="none" stroke="white" strokeWidth="1" />
            <circle cx="600" cy="300" r="140" fill="none" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 xl:px-16 py-12 sm:py-16 lg:py-20 flex flex-col lg:flex-row lg:items-center lg:gap-16 xl:gap-24">
          {/* Left: text */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Badge pill */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-semibold mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-[#A3E4D7] rounded-full animate-pulse" />
              {live ? "চ্যালেঞ্জ চলছে!" : `${toBn(daysLeft)} দিন বাকি`}
              {participantCount > 0 && (
                <>
                  <span className="text-white/50">·</span>
                  <span className="text-[#A3E4D7]">{participantLabel}</span>
                </>
              )}
            </div>

            {/* Arabic verse */}
            <p className="text-[#A3E4D7] text-2xl sm:text-3xl font-light mb-4 tracking-wide" dir="rtl">
              وَلَيَالٍ عَشْرٍ
            </p>

            {/* Heading */}
            <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-5">
              জিলহজের
              <br />
              <span className="text-[#A3E4D7]">১০টি শ্রেষ্ঠ</span>
              <br />
              দিনে আমল করুন
            </h1>

            {/* Description */}
            <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              কুরআন ও সুন্নাহ অনুসারে সাজানো ব্যক্তিগত আমলের চ্যালেঞ্জ। প্রতিদিন এগিয়ে যান, আপনার ধারা বজায় রাখুন, এবং এই বরকতময় দিনগুলোর সর্বোচ্চ উপকার নিন।
            </p>

            {/* Countdown (if not live) */}
            {!live && (
              <div className="mb-8">
                <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-3">চ্যালেঞ্জ শুরু হতে বাকি</p>
                <CountdownTimer />
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-8">
              <Link
                href="/sign-in"
                className="bg-[#A3E4D7] text-[#0B3C26] text-center px-8 py-4 rounded-2xl font-bold text-base hover:bg-white active:scale-95 transition-all shadow-lg shadow-black/20"
              >
                ফ্রি চ্যালেঞ্জ শুরু করুন →
              </Link>
              <a
                href="#hadith-hub"
                className="bg-white/10 border border-white/20 text-white text-center px-8 py-4 rounded-2xl font-semibold text-base hover:bg-white/20 active:scale-95 transition-all backdrop-blur-sm"
              >
                ফজিলত হাব দেখুন
              </a>
            </div>

            {/* Social proof — avatars only (no fake rating) */}
            {participantCount > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {AVATARS.map((initial, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-linear-to-br from-[#A3E4D7] to-[#0B3C26] border-2 border-[#0B3C26] flex items-center justify-center"
                    >
                      <span className="text-white text-[11px] font-bold">{initial}</span>
                    </div>
                  ))}
                </div>
                <p className="text-white/70 text-sm">
                  <span className="text-white font-semibold">{toBn(participantCount)}+</span> জন এই চ্যালেঞ্জে
                </p>
              </div>
            )}
          </div>

          {/* Right: phone mockup (desktop) */}
          <div className="hidden lg:flex shrink-0 mt-12 lg:mt-0 justify-center">
            <PhoneMockup />
          </div>

          {/* Phone mockup (mobile, below hero text) */}
          <div className="lg:hidden mt-10 flex justify-center">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ── Social proof bar ── */}
      <div className="bg-[#E6F4EA] border-y border-[#0B3C26]/10 px-5 py-3.5 flex items-center justify-center gap-2.5">
        <span className="text-lg">🔥</span>
        <p className="text-[#0B3C26] text-sm font-semibold text-center">
          {participantCount > 0 ? (
            <>
              <span className="text-[#0B3C26] font-bold text-base">{toBn(participantCount)}+</span> মুসলিম এই চ্যালেঞ্জে অংশ নিচ্ছেন
            </>
          ) : (
            "প্রথম হোন — এই চ্যালেঞ্জে যোগ দিন!"
          )}
        </p>
      </div>

      {/* ── Features ── */}
      <section id="features" className="px-5 sm:px-8 xl:px-16 py-12 sm:py-16 max-w-7xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-[#0B3C26] text-2xl sm:text-3xl font-bold mb-2">কেন এই চ্যালেঞ্জ?</h2>
          <p className="text-[#AEB6BF] text-sm sm:text-base">ইসলামের সবচেয়ে মর্যাদাপূর্ণ দিনগুলো সর্বোচ্চভাবে কাজে লাগান</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.icon}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6F4EA] hover:border-[#0B3C26]/20 hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <p className="text-[#0B3C26] font-bold text-sm sm:text-base mb-1">{f.title}</p>
              <p className="text-[#AEB6BF] text-xs sm:text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Hadith Hub: Videos & Articles ── */}
      <section id="hadith-hub" className="px-5 sm:px-8 xl:px-16 py-12 sm:py-16 max-w-7xl mx-auto w-full">
        <div className="text-center mb-10">
          <p className="text-[#0B3C26]/50 text-xs font-semibold uppercase tracking-widest mb-2">ফজিলত হাব</p>
          <h2 className="text-[#0B3C26] text-2xl sm:text-3xl font-bold mb-2">জিলহজের ফজিলত জানুন</h2>
          <p className="text-[#AEB6BF] text-sm sm:text-base">বিশুদ্ধ হাদিস ও ইসলামিক স্কলারদের আলোচনা থেকে অনুপ্রাণিত হন</p>
        </div>

        {/* Videos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {[
            {
              id: "N-BY2MtizsQ",
              title: "জিলহজের ১০ দিনের আমল ও ফজিলত",
              channel: "ইসলামিক লেকচার",
            },
            {
              id: "UA0uJKUOQTw",
              title: "আইয়ামে তাশরীক ও তাকবীরে তাশরীক",
              channel: "ইসলামিক লেকচার",
            },
          ].map((video) => (
            <div key={video.id} className="bg-white rounded-2xl overflow-hidden border border-[#E6F4EA] hover:shadow-md transition-shadow">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <div className="px-4 py-3">
                <p className="text-[#0B3C26] font-semibold text-sm leading-snug">{video.title}</p>
                <p className="text-[#AEB6BF] text-xs mt-0.5">{video.channel}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Articles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              href: "https://www.alkawsar.com/bn/article/3011/",
              source: "আল-কাউসার",
              icon: "📖",
              title: "জিলহজের প্রথম দশ দিনের আমল ও ফজিলত",
              desc: "কুরআন ও সহীহ হাদিসের আলোকে জিলহজের দশ দিনের গুরুত্ব ও করণীয় আমলের বিস্তারিত আলোচনা।",
            },
            {
              href: "https://www.hadithbd.com/books/section/?book=20",
              source: "হাদিস বিডি",
              icon: "📿",
              title: "সিয়াম ও আমল — হাদিস সংকলন",
              desc: "জিলহজ ও আরাফার রোজা সম্পর্কিত বিশুদ্ধ হাদিসের বাংলা অনুবাদ ও ব্যাখ্যা।",
            },
          ].map((article) => (
            <a
              key={article.href}
              href={article.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-4 bg-white rounded-2xl p-5 border border-[#E6F4EA] hover:border-[#0B3C26]/30 hover:shadow-md transition-all group"
            >
              <div className="w-11 h-11 bg-[#E6F4EA] rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:bg-[#0B3C26]/10 transition-colors">
                {article.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-[#0B3C26]/40 uppercase tracking-wider mb-0.5">{article.source}</p>
                <p className="text-[#0B3C26] font-bold text-sm leading-snug mb-1">{article.title}</p>
                <p className="text-[#AEB6BF] text-xs leading-relaxed line-clamp-2">{article.desc}</p>
              </div>
              <div className="shrink-0 self-center text-[#AEB6BF] group-hover:text-[#0B3C26] transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Community ── */}
      <section id="community" className="bg-[#E6F4EA] px-5 sm:px-8 xl:px-16 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#0B3C26]/50 text-xs font-semibold uppercase tracking-widest mb-2">সম্প্রদায়</p>
            <h2 className="text-[#0B3C26] text-2xl sm:text-3xl font-bold mb-2">একা নন, সবাই মিলে করুন</h2>
            <p className="text-[#AEB6BF] text-sm sm:text-base">বিশ্বের মুসলিমদের সাথে একই লক্ষ্যে এগিয়ে যান</p>
          </div>

          {stats && stats.totalParticipants === 0 ? (
            /* Empty state */
            <div className="bg-white rounded-2xl border border-[#0B3C26]/10 p-12 text-center max-w-md mx-auto">
              <p className="text-4xl mb-4">🌱</p>
              <p className="text-[#0B3C26] font-bold text-lg mb-2">প্রথম হওয়ার সুযোগ!</p>
              <p className="text-[#AEB6BF] text-sm leading-relaxed mb-6">
                এখনো কেউ চ্যালেঞ্জ শুরু করেননি। আপনিই প্রথম পদক্ষেপ নিন এবং সম্প্রদায়ের ভিত্তি গড়ুন।
              </p>
              <Link
                href="/sign-in"
                className="inline-block bg-[#0B3C26] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#0a3221] transition-colors"
              >
                এখনই শুরু করুন →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Participants */}
              <div className="bg-white rounded-2xl p-6 border border-[#0B3C26]/10 text-center">
                <div className="text-3xl mb-3">🌍</div>
                <p className="text-[#0B3C26] text-3xl font-bold mb-1">
                  {stats ? `${toBn(stats.totalParticipants)}+` : "—"}
                </p>
                <p className="text-[#0B3C26] font-semibold text-sm mb-2">সক্রিয় অংশগ্রহণকারী</p>
                <p className="text-[#AEB6BF] text-xs leading-relaxed">
                  বিশ্বের বিভিন্ন প্রান্ত থেকে মুসলিমরা এই চ্যালেঞ্জে যোগ দিয়েছেন
                </p>
              </div>

              {/* Streak achievers */}
              <div className="bg-white rounded-2xl p-6 border border-[#0B3C26]/10 text-center">
                <div className="text-3xl mb-3">🔥</div>
                <p className="text-[#0B3C26] text-3xl font-bold mb-1">
                  {stats
                    ? stats.totalParticipants > 0
                      ? `${toBn(Math.round((stats.streakParticipants / stats.totalParticipants) * 100))}%`
                      : "০%"
                    : "—"}
                </p>
                <p className="text-[#0B3C26] font-semibold text-sm mb-2">ধারাবাহিক অংশগ্রহণকারী</p>
                <p className="text-[#AEB6BF] text-xs leading-relaxed">
                  ৩+ দিন ধরে নিয়মিত আমল চালিয়ে যাচ্ছেন
                </p>
              </div>

              {/* Avg points */}
              <div className="bg-white rounded-2xl p-6 border border-[#0B3C26]/10 text-center">
                <div className="text-3xl mb-3">🏆</div>
                <p className="text-[#0B3C26] text-3xl font-bold mb-1">
                  {stats ? `${toBn(stats.avgPoints)}` : "—"}
                </p>
                <p className="text-[#0B3C26] font-semibold text-sm mb-2">গড় পয়েন্ট</p>
                <p className="text-[#AEB6BF] text-xs leading-relaxed">
                  সকল অংশগ্রহণকারীর গড় মোট পয়েন্ট
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Support ── */}
      <section id="support" className="px-5 sm:px-8 xl:px-16 py-12 sm:py-16 max-w-7xl mx-auto w-full">
        <div className="text-center mb-10">
          <p className="text-[#0B3C26]/50 text-xs font-semibold uppercase tracking-widest mb-2">সাপোর্ট</p>
          <h2 className="text-[#0B3C26] text-2xl sm:text-3xl font-bold mb-2">কোনো প্রশ্ন আছে?</h2>
          <p className="text-[#AEB6BF] text-sm sm:text-base">আমরা সাহায্য করতে সর্বদা প্রস্তুত</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            { icon: "❓", q: "অ্যাপটি কি সম্পূর্ণ বিনামূল্যে?", a: "হ্যাঁ, জিলহজ আমল চ্যালেঞ্জ সম্পূর্ণ বিনামূল্যে ব্যবহার করা যাবে। কোনো পেমেন্ট বা সাবস্ক্রিপশন নেই।" },
            { icon: "🔔", q: "রিমাইন্ডার কীভাবে পাবো?", a: "সাইন আপের পর ব্রাউজার পুশ নোটিফিকেশন চালু করুন। প্রতিদিন সকাল ও রাতে রিমাইন্ডার পাবেন।" },
            { icon: "📱", q: "মোবাইলে কি ভালো কাজ করে?", a: "হ্যাঁ, অ্যাপটি মোবাইল-ফার্স্ট ডিজাইনে তৈরি। হোম স্ক্রিনে যুক্ত করলে নেটিভ অ্যাপের মতো অনুভব হবে।" },
          ].map((faq) => (
            <div key={faq.q} className="bg-white rounded-2xl p-5 border border-[#E6F4EA]">
              <div className="text-2xl mb-3">{faq.icon}</div>
              <p className="text-[#0B3C26] font-bold text-sm mb-2 leading-snug">{faq.q}</p>
              <p className="text-[#AEB6BF] text-xs leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* Contact buttons */}
        <div className="text-center mt-8">
          <p className="text-[#AEB6BF] text-sm mb-4">আরো প্রশ্ন থাকলে সরাসরি যোগাযোগ করুন</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://github.com/Humayun63/amal10/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1C2833] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-black transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub-এ ইস্যু তৈরি করুন
            </a>
            <a
              href="https://wa.me/8801907642670"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#20b558] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp-এ যোগাযোগ করুন
            </a>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-[#0B3C26] px-5 sm:px-8 py-12 sm:py-16 text-center mt-auto" id="cta">
        <p className="text-[#A3E4D7] text-sm font-medium uppercase tracking-widest mb-3">এখনই শুরু করুন</p>
        <h2 className="text-white text-2xl sm:text-3xl font-bold mb-4 max-w-md mx-auto leading-snug">
          এই বরকতময় দিনগুলো যেন নষ্ট না হয়
        </h2>
        <p className="text-white/60 text-sm sm:text-base mb-8 max-w-sm mx-auto">
          বিনামূল্যে যোগ দিন এবং জিলহজের প্রতিটি দিন ট্র্যাক করুন
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/sign-in"
            className="bg-[#A3E4D7] text-[#0B3C26] px-8 py-4 rounded-2xl font-bold text-base hover:bg-white active:scale-95 transition-all inline-block"
          >
            চ্যালেঞ্জে যোগ দিন →
          </Link>
          <Link
            href="/sign-in"
            className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-base hover:bg-white/20 active:scale-95 transition-all inline-block"
          >
            আমার অ্যাকাউন্ট আছে · লগ-ইন
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#06251A] px-5 py-6 text-center border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                <Image src="/logo.png" alt="আমল লোগো" width={28} height={29} className="w-7 h-7 object-contain"/>
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-sm leading-tight">আমল</p>
                <p className="text-[#A3E4D7] text-[10px] uppercase tracking-widest">DHUL HIJJAH 1447</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com/Humayun63/amal10/issues" target="_blank" rel="noopener noreferrer"
                className="text-white/50 hover:text-white text-xs transition-colors flex items-center gap-1">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </a>
              <a href="https://wa.me/8801907642670" target="_blank" rel="noopener noreferrer"
                className="text-white/50 hover:text-white text-xs transition-colors flex items-center gap-1">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
          <div className="h-px bg-white/10 mb-4"/>
          <p className="text-white/40 text-xs">
            © ২০২৬ আমল জিলহজ চ্যালেঞ্জ · সর্বস্বত্ব সংরক্ষিত · কুরআন ও সুন্নাহর আলোকে তৈরি
          </p>
        </div>
      </footer>
    </div>
  );
}
