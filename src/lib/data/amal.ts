export type AmalCategory = "fard" | "sunnah" | "social";

export interface Amal {
  id: string;
  title: string;
  subtitle?: string;
  category: AmalCategory;
  points: number;
  days: number[];       // which dhul hijjah days this applies to (1-13)
  icon: string;
  hadith?: string;
  detail?: string;
}

export const ALL_AMAL: Amal[] = [
  // ফরজ ও ওয়াজিব
  {
    id: "fajr",
    title: "ফজর নামাজ জামায়াতে",
    category: "fard",
    points: 20,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "🌅",
    hadith: "জামায়াতে নামাজ একাকী নামাজের চেয়ে ২৭ গুণ বেশি সওয়াব। (বুখারি: ৬৪৫)",
    detail: "ফজর নামাজ ইসলামের সবচেয়ে মর্যাদাপূর্ণ ইবাদতগুলির একটি। জামায়াতে আদায় করলে সওয়াব ২৭ গুণ বৃদ্ধি পায়।",
  },
  {
    id: "zuhr",
    title: "যোহর নামাজ জামায়াতে",
    category: "fard",
    points: 20,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "☀️",
    detail: "দিনের মধ্যভাগে আল্লাহর স্মরণে যোহরের নামাজ আদায় করুন।",
  },
  {
    id: "asr",
    title: "আসর নামাজ জামায়াতে",
    category: "fard",
    points: 20,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "🌤️",
    hadith: "যে ব্যক্তি আসরের নামাজ ছেড়ে দিল, তার আমল বরবাদ হয়ে গেল। (বুখারি: ৫৫৩)",
    detail: "আসরের নামাজ বিশেষভাবে গুরুত্বপূর্ণ। এটি 'সালাতুল ওসতা' বা মধ্যবর্তী নামাজ।",
  },
  {
    id: "maghrib",
    title: "মাগরিব নামাজ জামায়াতে",
    category: "fard",
    points: 20,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "🌇",
    detail: "সূর্যাস্তের পর মাগরিবের নামাজ আদায় করুন।",
  },
  {
    id: "isha",
    title: "এশা নামাজ জামায়াতে",
    category: "fard",
    points: 20,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "🌙",
    detail: "রাতের নামাজ এশা জামায়াতে আদায় করুন।",
  },
  {
    id: "takbir_tashriq",
    title: "তাকবীরে তাশরীক",
    subtitle: "প্রতি ফরজ নামাজের পর",
    category: "fard",
    points: 20,
    days: [9,10,11,12,13],
    icon: "📣",
    hadith:
      "আল্লাহু আকবার, আল্লাহু আকবার, লা ইলাহা ইল্লাল্লাহ, ওয়াল্লাহু আকবার, আল্লাহু আকবার, ওয়ালিল্লাহিল হামদ।",
    detail:
      "৯ জিলহজ ফজর থেকে ১৩ জিলহজ আসর পর্যন্ত প্রতিটি ফরজ নামাজের পর তাকবীরে তাশরীক পড়া ওয়াজিব। মোট ২৩ ওয়াক্ত।",
  },
  // সুন্নাহ ও নফল
  {
    id: "fast",
    title: "নফল রোজা",
    category: "sunnah",
    points: 10,
    days: [1,2,3,4,5,6,7,8],
    icon: "🌙",
    detail: "জিলহজের ১ থেকে ৮ তারিখ পর্যন্ত নফল রোজা রাখুন।",
  },
  {
    id: "arafah_fast",
    title: "আরাফার রোজা",
    category: "sunnah",
    points: 30,
    days: [9],
    icon: "⭐",
    hadith:
      "আরাফার দিনের রোজা সম্পর্কে আশা রাখি যে আল্লাহ তায়ালা এর মাধ্যমে বিগত এক বছর ও আগামী এক বছরের গুনাহ ক্ষমা করে দেবেন। (মুসলিম: ১১৬২)",
    detail: "আরাফার রোজা দুই বছরের গুনাহ মাফ করার কারণ।",
  },
  {
    id: "morning_dhikr",
    title: "সকালের আজকার",
    subtitle: "সুবহানাল্লাহ, আলহামদুলিল্লাহ, আল্লাহু আকবার",
    category: "sunnah",
    points: 10,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "📿",
    detail: "সকালে ঘুম থেকে উঠে আজকার পড়ুন। এটি দিনের শুরুতে আল্লাহর স্মরণে থাকার অভ্যাস তৈরি করে।",
  },
  {
    id: "evening_dhikr",
    title: "সন্ধ্যার আজকার",
    subtitle: "ইস্তিগফার ও তাসবীহ",
    category: "sunnah",
    points: 10,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "🌠",
    detail: "সন্ধ্যার আজকার পড়ুন এবং আল্লাহর কাছে ক্ষমা প্রার্থনা করুন।",
  },
  {
    id: "istighfar",
    title: "ইস্তিগফার — ১০০ বার",
    subtitle: "আস্তাগফিরুল্লাহ",
    category: "sunnah",
    points: 10,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "🤲",
    hadith: "যে ব্যক্তি বেশি বেশি ইস্তিগফার করে, আল্লাহ তার প্রতিটি সংকট থেকে উত্তরণের পথ করে দেন। (আবু দাউদ: ১৫১৮)",
    detail: "দিনে কমপক্ষে ১০০ বার ইস্তিগফার পড়ুন।",
  },
  {
    id: "quran_recitation",
    title: "কুরআন তিলাওয়াত",
    subtitle: "কমপক্ষে ১ পৃষ্ঠা",
    category: "sunnah",
    points: 10,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "📖",
    hadith: "কুরআনের প্রতিটি অক্ষরের জন্য একটি নেকি, এবং প্রতিটি নেকি ১০ গুণ হয়ে যায়। (তিরমিজি: ২৯১০)",
    detail: "প্রতিদিন কমপক্ষে এক পৃষ্ঠা কুরআন তিলাওয়াত করুন।",
  },
  // সামাজিক ও আর্থিক
  {
    id: "sadaqah",
    title: "দান-সদকা",
    subtitle: "যেকোনো পরিমাণে",
    category: "social",
    points: 10,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "💝",
    hadith: "সদকা গুনাহ মিটিয়ে দেয় যেমন পানি আগুন নেভায়। (তিরমিজি: ৬১৪)",
    detail: "প্রতিদিন কাউকে না কাউকে সাহায্য করুন অথবা দান করুন।",
  },
  {
    id: "good_conduct",
    title: "মানুষের সাথে সদাচরণ",
    category: "social",
    points: 10,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "🤝",
    hadith: "মুসলিমদের মধ্যে সর্বোত্তম সেই ব্যক্তি যার হাত ও জিহ্বা থেকে অন্য মুসলিমরা নিরাপদ। (বুখারি: ১০)",
    detail: "আজ কারো সাথে সদয় ব্যবহার করুন, কাউকে সাহায্য করুন বা ক্ষমা করুন।",
  },
  {
    id: "ilm",
    title: "ইলম অর্জন",
    subtitle: "একটি হাদিস বা আয়াত শিখুন",
    category: "social",
    points: 10,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "📚",
    hadith: "ইলম অর্জন করা প্রতিটি মুসলিমের উপর ফরজ। (ইবনে মাজাহ: ২২৪)",
    detail: "প্রতিদিন অন্তত একটি নতুন ইসলামিক জ্ঞান অর্জন করুন।",
  },
];

export function getAmalForDay(day: number): Amal[] {
  return ALL_AMAL.filter((a) => a.days.includes(day));
}

export function calculatePoints(completedIds: string[], day: number): number {
  const dayAmal = getAmalForDay(day);
  return dayAmal
    .filter((a) => completedIds.includes(a.id))
    .reduce((sum, a) => sum + a.points, 0);
}

export function getMaxPoints(day: number): number {
  return getAmalForDay(day).reduce((sum, a) => sum + a.points, 0);
}

export const CATEGORY_LABELS: Record<AmalCategory, string> = {
  fard: "ফরজ ও ওয়াজিব",
  sunnah: "সুন্নাহ ও নফল",
  social: "আর্থিক ও সামাজিক",
};

export const CATEGORY_COLORS: Record<AmalCategory, string> = {
  fard: "bg-[#0B3C26] text-white",
  sunnah: "bg-[#A3E4D7] text-[#0B3C26]",
  social: "bg-[#E6F4EA] text-[#0B3C26]",
};
