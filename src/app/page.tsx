"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTimeUntilStart, isChallengeLive } from "@/lib/utils/dhulHijjah";

const HADITHS = [
  {
    text: "জিলহজের প্রথম দশ দিনের নেক আমল আল্লাহর কাছে সবচেয়ে প্রিয়।",
    source: "বুখারি: ৯৬৯",
  },
  {
    text: "আরাফার দিনের রোজা বিগত ও আগামী এক বছরের গুনাহ মুছে দেয়।",
    source: "মুসলিম: ১১৬২",
  },
  {
    text: "এই দিনগুলোতে বেশি বেশি তাহলিল, তাকবীর ও তাহমীদ পড়ো।",
    source: "আহমদ: ৫৪৪৬",
  },
];

function CountdownTimer() {
  const [time, setTime] = useState(getTimeUntilStart());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeUntilStart()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex gap-3 justify-center">
      {[
        { label: "দিন", value: time.days },
        { label: "ঘণ্টা", value: time.hours },
        { label: "মিনিট", value: time.minutes },
        { label: "সেকেন্ড", value: time.seconds },
      ].map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="w-16 h-16 bg-[#0B3C26] rounded-xl flex items-center justify-center">
            <span className="text-white text-2xl font-bold font-[var(--font-inter)]">
              {pad(value)}
            </span>
          </div>
          <span className="text-[10px] text-[#0B3C26] mt-1 font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [hadithIndex, setHadithIndex] = useState(0);
  const live = isChallengeLive();

  useEffect(() => {
    const id = setInterval(
      () => setHadithIndex((i) => (i + 1) % HADITHS.length),
      5000
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col">
      {/* Hero */}
      <div className="bg-[#0B3C26] text-white px-6 pt-16 pb-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 300" className="w-full h-full">
            <circle cx="200" cy="150" r="180" fill="none" stroke="white" strokeWidth="1" />
            <circle cx="200" cy="150" r="120" fill="none" stroke="white" strokeWidth="0.5" />
            <circle cx="200" cy="150" r="60" fill="none" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="relative z-10">
          <div className="text-4xl mb-3">🕌</div>
          <h1 className="text-[26px] font-bold leading-tight mb-2">
            জিলহজ আমল চ্যালেঞ্জ
          </h1>
          <p className="text-[#A3E4D7] text-sm font-medium">
            Dhul Hijjah 10-Day Amal Tracker
          </p>
          <p className="text-white/80 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
            ইসলামের সবচেয়ে মর্যাদাপূর্ণ ১০ দিনে আমল ট্র্যাক করুন
          </p>
        </div>
      </div>

      {/* Live counter */}
      <div className="bg-[#E6F4EA] px-6 py-4 flex items-center justify-center gap-2">
        <span className="text-lg">🔥</span>
        <p className="text-[#0B3C26] text-sm font-semibold">
          <span className="text-[#0B3C26] font-bold text-base">৫,২৪০</span> জন মুসলিম অলরেডি চ্যালেঞ্জে যুক্ত হয়েছেন!
        </p>
      </div>

      <div className="flex-1 px-6 py-8 flex flex-col gap-6 max-w-lg mx-auto w-full">
        {/* Countdown or live badge */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E6F4EA] text-center">
          {live ? (
            <>
              <div className="inline-flex items-center gap-2 bg-[#E6F4EA] text-[#0B3C26] px-3 py-1 rounded-full text-xs font-semibold mb-3">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                চ্যালেঞ্জ চলছে!
              </div>
              <p className="text-[#1C2833] text-sm">এখনই যোগ দিন এবং আমল শুরু করুন</p>
            </>
          ) : (
            <>
              <p className="text-[#1C2833] font-semibold mb-4 text-sm">
                চ্যালেঞ্জ শুরু হতে বাকি
              </p>
              <CountdownTimer />
            </>
          )}
        </div>

        {/* Rotating hadith */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E6F4EA]">
          <div className="text-[#0B3C26] text-2xl mb-3">❝</div>
          <p className="text-[#1C2833] text-base leading-relaxed font-medium">
            {HADITHS[hadithIndex].text}
          </p>
          <p className="text-[#AEB6BF] text-xs mt-3">{HADITHS[hadithIndex].source}</p>
          <div className="flex gap-1 mt-4">
            {HADITHS.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === hadithIndex ? "w-6 bg-[#0B3C26]" : "w-2 bg-[#E6F4EA]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "✅", title: "ডেইলি চেকলিস্ট", desc: "১৫+ আমল ট্র্যাক করুন" },
            { icon: "🔥", title: "স্ট্রেইক কাউন্টার", desc: "টানা দিনের ধারা রাখুন" },
            { icon: "🏆", title: "লিডারবোর্ড", desc: "গ্লোবাল র‍্যাংকিং দেখুন" },
            { icon: "🏅", title: "ব্যাজ সিস্টেম", desc: "মাইলস্টোন আনলক করুন" },
          ].map((f) => (
            <div key={f.icon} className="bg-white rounded-xl p-4 border border-[#E6F4EA]">
              <div className="text-2xl mb-2">{f.icon}</div>
              <p className="text-[#0B3C26] font-semibold text-sm">{f.title}</p>
              <p className="text-[#AEB6BF] text-xs mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3 pb-8">
          <Link
            href="/sign-in"
            className="block w-full bg-[#0B3C26] text-white text-center py-4 rounded-xl font-semibold text-base active:scale-95 transition-transform"
          >
            চ্যালেঞ্জে যোগ দিন →
          </Link>
          <Link
            href="/dashboard"
            className="block w-full bg-[#E6F4EA] text-[#0B3C26] text-center py-3 rounded-xl font-medium text-sm active:scale-95 transition-transform"
          >
            লগইন ছাড়া দেখুন
          </Link>
        </div>
      </div>
    </div>
  );
}
