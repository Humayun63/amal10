"use client";

import { useState } from "react";

const HADITHS = [
  {
    id: 1,
    text: "জিলহজের প্রথম দশ দিনের নেক আমল আল্লাহর কাছে সবচেয়ে প্রিয়। সাহাবারা জিজ্ঞেস করলেন: আল্লাহর পথে জিহাদও নয়? রাসূল ﷺ বললেন: না, যদি না কেউ তার জান ও মাল নিয়ে বেরোয় এবং কিছুই নিয়ে না ফেরে।",
    source: "সহিহ বুখারি: ৯৬৯",
    topic: "জিলহজের ফজিলত",
  },
  {
    id: 2,
    text: "আরাফার দিনের রোজা সম্পর্কে আশা রাখি যে আল্লাহ তায়ালা এর মাধ্যমে বিগত এক বছর এবং আগামী এক বছরের গুনাহ মাফ করে দেবেন।",
    source: "সহিহ মুসলিম: ১১৬২",
    topic: "আরাফার রোজার ফজিলত",
  },
  {
    id: 3,
    text: "এই দিনগুলোতে বেশি বেশি তাহলিল (লা ইলাহা ইল্লাল্লাহ), তাকবীর (আল্লাহু আকবার) এবং তাহমীদ (আলহামদুলিল্লাহ) পড়ো।",
    source: "মুসনাদে আহমদ: ৫৪৪৬",
    topic: "জিকিরের আমল",
  },
  {
    id: 4,
    text: "তাকবীরে তাশরীক: আল্লাহু আকবার, আল্লাহু আকবার, লা ইলাহা ইল্লাল্লাহু, ওয়াল্লাহু আকবার, আল্লাহু আকবার ওয়ালিল্লাহিল হামদ। এটি ৯ জিলহজ ফজর থেকে ১৩ জিলহজ আসর পর্যন্ত প্রতি ফরজ নামাজের পর পড়া ওয়াজিব।",
    source: "ফিকহের মাসায়েল",
    topic: "তাকবীরে তাশরীক",
  },
  {
    id: 5,
    text: "জামায়াতে নামাজ একাকী নামাজের চেয়ে সাতাশ গুণ বেশি সওয়াব।",
    source: "সহিহ বুখারি: ৬৪৫",
    topic: "জামায়াতের ফজিলত",
  },
  {
    id: 6,
    text: "যে ব্যক্তি বেশি বেশি ইস্তিগফার করে, আল্লাহ তার প্রতিটি সংকট থেকে বের হওয়ার পথ করে দেন, প্রতিটি দুশ্চিন্তা দূর করে দেন এবং তাকে অপ্রত্যাশিত স্থান থেকে রিজিক দেন।",
    source: "আবু দাউদ: ১৫১৮",
    topic: "ইস্তিগফারের ফজিলত",
  },
  {
    id: 7,
    text: "সদকা গুনাহ মিটিয়ে দেয় যেমন পানি আগুন নেভায়।",
    source: "তিরমিজি: ৬১৪",
    topic: "সদকার ফজিলত",
  },
];

const VIDEOS = [
  {
    id: "dQw4w9WgXcQ",
    title: "জিলহজ মাসের আমল ও ফজিলত",
    channel: "ইসলামিক স্কলার",
    views: "২.৫ লক্ষ",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "আরাফার দিনের গুরুত্ব ও আমল",
    channel: "কুরআন ও সুন্নাহ",
    views: "১.৮ লক্ষ",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "তাকবীরে তাশরীক — সঠিক পদ্ধতি",
    channel: "ফিকহ বিভাগ",
    views: "৯৮ হাজার",
  },
];

export default function InsightsPage() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [tab, setTab] = useState<"hadith" | "video">("hadith");

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Header */}
      <div className="bg-[#0B3C26] text-white px-4 pt-14 pb-6">
        <h1 className="text-[26px] font-bold mb-1">ফজিলত হাব</h1>
        <p className="text-[#A3E4D7] text-sm">হাদিস, আয়াত ও ইলম অর্জন করুন</p>
      </div>

      <div className="px-4 py-4 max-w-lg mx-auto">
        {/* Tabs */}
        <div className="flex bg-[#E6F4EA] rounded-xl p-1 mb-5">
          {(["hadith", "video"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t ? "bg-[#0B3C26] text-white shadow-sm" : "text-[#AEB6BF]"
              }`}
            >
              {t === "hadith" ? "📖 হাদিস সমূহ" : "🎬 ভিডিও"}
            </button>
          ))}
        </div>

        {tab === "hadith" ? (
          <div className="flex flex-col gap-4">
            {HADITHS.map((h) => (
              <div key={h.id} className="bg-white rounded-2xl p-5 border border-[#E6F4EA]">
                <span className="inline-block bg-[#E6F4EA] text-[#0B3C26] text-[10px] font-semibold px-2 py-0.5 rounded-full mb-3 uppercase tracking-wide">
                  {h.topic}
                </span>
                <div className="text-[#0B3C26] text-xl mb-2">❝</div>
                <p className="text-[#1C2833] text-sm leading-relaxed">
                  {h.text}
                </p>
                <p className="text-[#AEB6BF] text-xs mt-3 font-medium">{h.source}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {VIDEOS.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#E6F4EA]">
                {activeVideo === `${i}` ? (
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${v.id}?autoplay=1`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveVideo(`${i}`)}
                    className="w-full aspect-video bg-[#0B3C26] relative flex items-center justify-center"
                  >
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7L8 5z" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </button>
                )}
                <div className="p-4">
                  <p className="text-[#1C2833] font-semibold text-sm">{v.title}</p>
                  <p className="text-[#AEB6BF] text-xs mt-1">{v.channel} • {v.views} ভিউ</p>
                </div>
              </div>
            ))}
            <p className="text-center text-[#AEB6BF] text-xs pb-4">
              আরও ভিডিও শীঘ্রই আসছে...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
