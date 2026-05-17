"use client";

import { useState } from "react";

const DAILY_AYAH = {
  arabic: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ",
  translation: "আমি জিন ও মানুষকে শুধু আমার ইবাদতের জন্যই সৃষ্টি করেছি।",
  source: "সূরা আয-যারিয়াত, আয়াত ৫৬",
};

const HADITHS = [
  {
    id: 1,
    arabic: "مَا مِنْ أَيَّامٍ الْعَمَلُ الصَّالِحُ فِيهِنَّ أَحَبُّ إِلَى اللَّهِ",
    text: "জিলহজের প্রথম দশ দিনের নেক আমল আল্লাহর কাছে সবচেয়ে প্রিয়। সাহাবারা জিজ্ঞেস করলেন: আল্লাহর পথে জিহাদও নয়? রাসূল ﷺ বললেন: না, যদি না কেউ তার জান ও মাল নিয়ে বেরোয় এবং কিছুই নিয়ে না ফেরে।",
    source: "সহিহ বুখারি",
    ref: "হাদিস: ৯৬৯",
    topic: "জিলহজের ফজিলত",
    icon: "🌙",
  },
  {
    id: 2,
    arabic: "صِيَامُ يَوْمِ عَرَفَةَ أَحْتَسِبُ عَلَى اللَّهِ",
    text: "আরাফার দিনের রোজা সম্পর্কে আশা রাখি যে আল্লাহ তায়ালা এর মাধ্যমে বিগত এক বছর এবং আগামী এক বছরের গুনাহ মাফ করে দেবেন।",
    source: "সহিহ মুসলিম",
    ref: "হাদিস: ১১৬২",
    topic: "আরাফার রোজার ফজিলত",
    icon: "⭐",
  },
  {
    id: 3,
    arabic: "أَكْثِرُوا فِيهِنَّ مِنَ التَّهْلِيلِ وَالتَّكْبِيرِ وَالتَّحْمِيدِ",
    text: "এই দিনগুলোতে বেশি বেশি তাহলিল (লা ইলাহা ইল্লাল্লাহ), তাকবীর (আল্লাহু আকবার) এবং তাহমীদ (আলহামদুলিল্লাহ) পড়ো।",
    source: "মুসনাদে আহমদ",
    ref: "হাদিস: ৫৪৪৬",
    topic: "জিকিরের আমল",
    icon: "📿",
  },
  {
    id: 4,
    arabic: "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ",
    text: "তাকবীরে তাশরীক: আল্লাহু আকবার, আল্লাহু আকবার, লা ইলাহা ইল্লাল্লাহু, ওয়াল্লাহু আকবার, আল্লাহু আকবার ওয়ালিল্লাহিল হামদ। ৯ জিলহজ ফজর থেকে ১৩ জিলহজ আসর পর্যন্ত প্রতি ফরজ নামাজের পর পড়া ওয়াজিব।",
    source: "ফিকহের মাসায়েল",
    ref: "ওয়াজিব আমল",
    topic: "তাকবীরে তাশরীক",
    icon: "📣",
  },
  {
    id: 5,
    arabic: "صَلَاةُ الْجَمَاعَةِ تَفْضُلُ صَلَاةَ الْفَذِّ بِسَبْعٍ وَعِشْرِينَ دَرَجَةً",
    text: "জামায়াতে নামাজ একাকী নামাজের চেয়ে সাতাশ গুণ বেশি সওয়াব।",
    source: "সহিহ বুখারি",
    ref: "হাদিস: ৬৪৫",
    topic: "জামায়াতের ফজিলত",
    icon: "🕌",
  },
  {
    id: 6,
    arabic: "مَنْ أَكْثَرَ مِنَ الاسْتِغْفَارِ جَعَلَ اللَّهُ لَهُ مِنْ كُلِّ هَمٍّ فَرَجًا",
    text: "যে ব্যক্তি বেশি বেশি ইস্তিগফার করে, আল্লাহ তার প্রতিটি সংকট থেকে বের হওয়ার পথ করে দেন, প্রতিটি দুশ্চিন্তা দূর করে দেন এবং তাকে অপ্রত্যাশিত স্থান থেকে রিজিক দেন।",
    source: "আবু দাউদ",
    ref: "হাদিস: ১৫১৮",
    topic: "ইস্তিগফারের ফজিলত",
    icon: "🤲",
  },
  {
    id: 7,
    arabic: "الصَّدَقَةُ تُطْفِئُ الْخَطِيئَةَ كَمَا يُطْفِئُ الْمَاءُ النَّارَ",
    text: "সদকা গুনাহ মিটিয়ে দেয় যেমন পানি আগুন নেভায়।",
    source: "তিরমিজি",
    ref: "হাদিস: ৬১৪",
    topic: "সদকার ফজিলত",
    icon: "💚",
  },
];

const VIDEOS = [
  { ytId: "UA0uJKUOQTw", title: "জিলহজ্জ মাসের প্রথম ১০ দিনের আমল" },
  { ytId: "N-BY2MtizsQ", title: "জিলহজের ১০ দিনের আমল ও ফজিলত" },
  { ytId: "S8UtCuHF-bU", title: "জিলহজের ফজিলত — বিস্তারিত আলোচনা" },
  { ytId: "g1pt5d3qGqo", title: "জিলহজ্জ মাসের প্রথম ১০ দিনের আমল " },
  { ytId: "DZ4LTOEjnXU", title: "আরাফার দিনের রোজা সম্পর্কে ভুল ধারণা" },
  { ytId: "QJoHl4RJADk", title: "ঈদুল আজহার সহজ ৯টি সুন্নত এবং ৪টি কাজ ভূলেও করবেন না!" },
  { ytId: "DNqVO63AsnI", title: "Eid Al Adha Taqbeer " },
];

const TOPICS = ["সব", "জিলহজ", "আরাফা", "তাকবীর", "জামায়াত", "ইস্তিগফার", "সদকা"];

export default function InsightsPage() {
  const [tab, setTab] = useState<"hadith" | "video">("hadith");
  const [activeTopic, setActiveTopic] = useState("সব");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredHadiths = activeTopic === "সব"
    ? HADITHS
    : HADITHS.filter((h) => h.topic.includes(activeTopic.slice(0, 4)));

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Header */}
      <div className="bg-[#0B3C26] text-white px-4 pt-12 pb-6 md:pt-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">💡</div>
            <div>
              <h1 className="text-[22px] font-bold leading-tight">ফজিলত হাব</h1>
              <p className="text-[#A3E4D7] text-xs">হাদিস, আয়াত ও ইলম অর্জন করুন</p>
            </div>
          </div>

          {/* Daily Ayah Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <p className="text-[#A3E4D7] text-[10px] font-bold uppercase tracking-widest mb-2">আজকের আয়াত</p>
            <p className="text-white text-right text-base leading-loose font-serif mb-2" dir="rtl">
              {DAILY_AYAH.arabic}
            </p>
            <p className="text-[#E6F4EA] text-xs leading-relaxed mb-1">
              &ldquo;{DAILY_AYAH.translation}&rdquo;
            </p>
            <p className="text-[#A3E4D7] text-[10px]">{DAILY_AYAH.source}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 max-w-2xl mx-auto flex flex-col gap-4">
        {/* Tabs */}
        <div className="flex bg-[#E6F4EA] rounded-xl p-1">
          {(["hadith", "video"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                tab === t ? "bg-[#0B3C26] text-white shadow-sm" : "text-[#AEB6BF]"
              }`}
            >
              {t === "hadith" ? "📖 হাদিস সমূহ" : "🎬 ভিডিও লেকচার"}
            </button>
          ))}
        </div>

        {tab === "hadith" ? (
          <>
            {/* Topic filter */}
            <div className="overflow-x-auto scrollbar-hidden -mx-4 px-4">
              <div className="flex gap-2 w-max">
                {TOPICS.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setActiveTopic(topic)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      activeTopic === topic
                        ? "bg-[#0B3C26] text-white"
                        : "bg-white text-[#AEB6BF] border border-[#E6F4EA]"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Hadith cards */}
            <div className="flex flex-col gap-3">
              {filteredHadiths.map((h) => {
                const isExpanded = expandedId === h.id;
                return (
                  <div key={h.id} className="bg-white rounded-2xl border border-[#E6F4EA] overflow-hidden">
                    {/* Topic badge row */}
                    <div className="px-5 pt-4 flex items-center gap-2">
                      <span className="text-xl">{h.icon}</span>
                      <span className="inline-block bg-[#E6F4EA] text-[#0B3C26] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                        {h.topic}
                      </span>
                      <span className="ml-auto text-[#AEB6BF] text-[10px]">{h.ref}</span>
                    </div>

                    {/* Arabic text */}
                    <div className="px-5 pt-3 pb-2">
                      <p
                        className="text-[#0B3C26] text-right text-sm leading-loose cursor-pointer"
                        dir="rtl"
                        onClick={() => setExpandedId(isExpanded ? null : h.id)}
                      >
                        {h.arabic}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="mx-5 h-px bg-[#E6F4EA]" />

                    {/* Translation */}
                    <div className="px-5 py-3">
                      <p className={`text-[#1C2833] text-sm leading-relaxed ${isExpanded ? "" : "line-clamp-3"}`}>
                        {h.text}
                      </p>
                      {h.text.length > 120 && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : h.id)}
                          className="text-[#0B3C26] text-xs font-semibold mt-1"
                        >
                          {isExpanded ? "কম দেখুন ↑" : "আরও পড়ুন ↓"}
                        </button>
                      )}
                    </div>

                    {/* Source */}
                    <div className="px-5 pb-4 flex items-center justify-between">
                      <p className="text-[#AEB6BF] text-xs font-medium">{h.source}</p>
                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({ text: `"${h.text}" — ${h.source}, ${h.ref}` });
                          }
                        }}
                        className="text-[#AEB6BF] text-xs flex items-center gap-1 hover:text-[#0B3C26] transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/>
                        </svg>
                        শেয়ার
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-4">
            {VIDEOS.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#E6F4EA]">
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${v.ytId}?rel=0&modestbranding=1`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
                <div className="px-4 py-3">
                  <p className="text-[#0B3C26] font-semibold text-sm leading-snug">{v.title}</p>
                </div>
              </div>
            ))}

            <div className="bg-[#E6F4EA] rounded-2xl p-4 text-center">
              <p className="text-[#0B3C26] font-semibold text-sm mb-1">আরও ভিডিও শীঘ্রই আসছে</p>
              <p className="text-[#AEB6BF] text-xs">নোটিফিকেশন চালু রাখুন নতুন কনটেন্টের জন্য</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
