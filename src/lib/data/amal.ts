export type AmalCategory = "fard" | "sunnah" | "social";

export interface Amal {
  id: string;
  title: string;
  subtitle?: string;
  category: AmalCategory;
  points: number;
  days: number[];
  icon: string;
  hadith?: string;
  detail?: string;
  // Countable dhikr fields
  countable?: boolean;
  countTarget?: number;
  // Female-specific title (when prayer is done alone, not in jamah)
  femaleTitle?: string;
  // Optional amaal — excluded from completion % but still completable for bonus points
  optional?: boolean;
}

export const ALL_AMAL: Amal[] = [
  // ── ফরজ ও ওয়াজিব ────────────────────────────────────────────────────────
  {
    id: "fajr",
    title: "ফজর নামাজ জামায়াতে",
    femaleTitle: "ফজর নামাজ",
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
    femaleTitle: "যোহর নামাজ",
    category: "fard",
    points: 20,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "☀️",
    detail: "দিনের মধ্যভাগে আল্লাহর স্মরণে যোহরের নামাজ আদায় করুন।",
  },
  {
    id: "asr",
    title: "আসর নামাজ জামায়াতে",
    femaleTitle: "আসর নামাজ",
    category: "fard",
    points: 20,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "🌤️",
    hadith: "যে ব্যক্তি আসরের নামাজ ছেড়ে দিল, তার আমল বরবাদ হয়ে গেল। (বুখারি: ৫৫৩)",
    detail: "আসরের নামাজ বিশেষভাবে গুরুত্বপূর্ণ — এটি 'সালাতুল ওসতা' বা মধ্যবর্তী নামাজ।",
  },
  {
    id: "maghrib",
    title: "মাগরিব নামাজ জামায়াতে",
    femaleTitle: "মাগরিব নামাজ",
    category: "fard",
    points: 20,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "🌇",
    detail: "সূর্যাস্তের পর মাগরিবের নামাজ আদায় করুন।",
  },
  {
    id: "isha",
    title: "এশা নামাজ জামায়াতে",
    femaleTitle: "এশা নামাজ",
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
    hadith: "আল্লাহু আকবার, আল্লাহু আকবার, লা ইলাহা ইল্লাল্লাহ, ওয়াল্লাহু আকবার, আল্লাহু আকবার, ওয়ালিল্লাহিল হামদ।",
    detail: "৯ জিলহজ ফজর থেকে ১৩ জিলহজ আসর পর্যন্ত প্রতিটি ফরজ নামাজের পর তাকবীরে তাশরীক পড়া ওয়াজিব। মোট ২৩ ওয়াক্ত।",
  },

  // ── সুন্নাহ ও নফল নামাজ ──────────────────────────────────────────────────
  {
    id: "tahajjud",
    title: "তাহাজ্জুদ নামাজ",
    subtitle: "কমপক্ষে ২ রাকাত",
    category: "sunnah",
    points: 20,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "🌌",
    hadith: "রাতের নামাজ পড়ো, এটি তোমাদের আগের সৎ লোকদের অভ্যাস ছিল, তোমাদের রবের নৈকট্যের মাধ্যম, গুনাহ মোচনকারী এবং পাপ থেকে বিরত রাখে। (তিরমিজি: ৩৫৪৯)",
    detail: "রাতের শেষ তৃতীয়াংশে তাহাজ্জুদ পড়া অত্যন্ত ফজিলতের। আল্লাহ এই সময় বান্দার দোয়া কবুল করেন।",
  },
  {
    id: "chasht_namaz",
    title: "চাশতের নামাজ (দোহা)",
    subtitle: "কমপক্ষে ২ রাকাত",
    category: "sunnah",
    points: 10,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "🌞",
    hadith: "প্রতিদিন সকালে তোমাদের প্রতিটি জোড়া হাড়ের পক্ষ থেকে সদকা দেওয়া আবশ্যক। প্রতিটি তাসবীহ সদকা... এবং চাশতের দুই রাকাত এ সব কিছু পূরণ করে দেয়। (মুসলিম: ৭২০)",
    detail: "সূর্য উঠার ১৫-২০ মিনিট পর থেকে যোহরের আগ পর্যন্ত এই নামাজ পড়া যায়।",
  },
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
    hadith: "আরাফার দিনের রোজা সম্পর্কে আশা রাখি যে আল্লাহ তায়ালা এর মাধ্যমে বিগত এক বছর ও আগামী এক বছরের গুনাহ ক্ষমা করে দেবেন। (মুসলিম: ১১৬২)",
    detail: "আরাফার রোজা দুই বছরের গুনাহ মাফ করার কারণ। এটি ইসলামের সবচেয়ে ফজিলতপূর্ণ নফল রোজাগুলির একটি।",
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
  {
    id: "morning_dhikr",
    title: "সকালের আজকার",
    subtitle: "ফজরের পর",
    category: "sunnah",
    points: 10,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "📿",
    detail: "সকালে ঘুম থেকে উঠে বা ফজরের পর আজকার পড়ুন।",
  },
  {
    id: "evening_dhikr",
    title: "সন্ধ্যার আজকার",
    subtitle: "আসরের পর",
    category: "sunnah",
    points: 10,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "🌠",
    detail: "আসরের পর থেকে মাগরিব পর্যন্ত সন্ধ্যার আজকার পড়ুন।",
  },

  // ── কাউন্টেবল যিকর ──────────────────────────────────────────────────────
  {
    id: "tasbeeh",
    title: "তাসবীহ — সুবহানাল্লাহ",
    subtitle: "১০০ বার",
    category: "sunnah",
    points: 10,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "📿",
    countable: true,
    countTarget: 100,
    hadith: "প্রতি নামাজের পর ৩৩ বার সুবহানাল্লাহ, ৩৩ বার আলহামদুলিল্লাহ, ৩৩ বার আল্লাহু আকবার পড়া সুন্নত। (মুসলিম: ৫৯৭)",
    detail: "সুবহানাল্লাহ অর্থ: আল্লাহ পবিত্র। প্রতি নামাজের পর ও যেকোনো সময় পড়া যায়।",
  },
  {
    id: "tahlil",
    title: "তাহলিল — লা ইলাহা ইল্লাল্লাহ",
    subtitle: "১০০ বার",
    category: "sunnah",
    points: 10,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "☝️",
    countable: true,
    countTarget: 100,
    hadith: "লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারিকা লাহু... একশতবার বললে ১০টি গোলাম আজাদ করার সমান সওয়াব। (বুখারি: ৩২৯৩)",
    detail: "কালিমায়ে তাওহীদ — এটি সর্বশ্রেষ্ঠ যিকর। দিনে যত বেশি পারেন পড়ুন।",
  },
  {
    id: "takbeer_dhikr",
    title: "তাকবির — আল্লাহু আকবার",
    subtitle: "১০০ বার",
    category: "sunnah",
    points: 10,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "🌿",
    countable: true,
    countTarget: 100,
    hadith: "দুটি বাক্য আল্লাহর কাছে প্রিয়, জিহ্বায় সহজ, মিজানে ভারী: সুবহানাল্লাহি ওয়া বিহামদিহি, সুবহানাল্লাহিল আজিম। (বুখারি: ৬৬৮২)",
    detail: "আল্লাহু আকবার অর্থ: আল্লাহ সর্বমহান। নামাজের পর ও যেকোনো সময় পড়ুন।",
  },
  {
    id: "istighfar",
    title: "ইস্তিগফার — আস্তাগফিরুল্লাহ",
    subtitle: "১০০ বার",
    category: "sunnah",
    points: 10,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "🤲",
    countable: true,
    countTarget: 100,
    hadith: "যে ব্যক্তি বেশি বেশি ইস্তিগফার করে, আল্লাহ তার প্রতিটি সংকট থেকে উত্তরণের পথ করে দেন। (আবু দাউদ: ১৫১৮)",
    detail: "নবী ﷺ প্রতিদিন ১০০ বারেরও বেশি ইস্তিগফার পড়তেন। আমাদেরও এই অভ্যাস গড়া উচিত।",
  },
  {
    id: "durood",
    title: "দুরুদ শরীফ",
    subtitle: "১০ বার",
    category: "sunnah",
    points: 10,
    days: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    icon: "💚",
    countable: true,
    countTarget: 10,
    hadith: "যে আমার উপর একবার দুরুদ পাঠ করে, আল্লাহ তার উপর দশবার রহমত বর্ষণ করেন এবং তার দশটি গুনাহ মাফ হয়। (নাসাই: ১২৯৭)",
    detail: "দুরুদে ইবরাহিম পড়া সবচেয়ে উত্তম। প্রতিদিন কমপক্ষে ১০ বার পড়ুন।",
  },

  // ── ঈদুল আজহার বিশেষ আমল (দিন ১০) ──────────────────────────────────────
  {
    id: "eid_ghusl",
    title: "ঈদের গোসল ও পরিচ্ছন্নতা",
    subtitle: "ঈদের নামাজের আগে",
    category: "sunnah",
    points: 10,
    days: [10],
    icon: "🚿",
    hadith: "ঈদের দিন গোসল করা এবং সুগন্ধি লাগানো সুন্নত। (ইবনে মাজাহ)",
    detail: "ঈদের নামাজে যাওয়ার আগে গোসল করুন, পরিষ্কার ও সুন্দর পোশাক পরুন এবং সুগন্ধি ব্যবহার করুন।",
  },
  {
    id: "eid_prayer",
    title: "ঈদের নামাজ",
    subtitle: "ঈদগাহ বা মসজিদে",
    femaleTitle: "ঈদের নামাজ",
    category: "fard",
    points: 30,
    days: [10],
    icon: "🕌",
    hadith: "রাসূলুল্লাহ ﷺ ঈদের নামাজে নারী-পুরুষ সকলকে বের হতে আদেশ দিতেন। (বুখারি: ৯৭১)",
    detail: "ঈদুল আজহার নামাজ দুই রাকাত — এটি ওয়াজিব। নামাজের পূর্বে ইমামের খুতবা মনোযোগ দিয়ে শুনুন।",
  },
  {
    id: "qurbani",
    title: "কুরবানি",
    subtitle: "আল্লাহর সন্তুষ্টির জন্য",
    category: "sunnah",
    points: 30,
    optional: true,
    days: [10, 11, 12, 13],
    icon: "🐑",
    hadith: "হজরত যায়িদ বিন আরকাম রাদিয়াল্লাহু আনহু বলেন: সাহাবীরা জিজ্ঞেস করলেন এই কুরবানি কী? রাসূল ﷺ বললেন: তোমাদের পিতা ইবরাহিমের সুন্নত। (ইবনে মাজাহ: ৩১২৭)",
    detail: "কুরবানি একটি মহান ইবাদত। সামর্থ্যবান ব্যক্তির উপর ওয়াজিব। ঈদের নামাজের পর কুরবানি করুন।",
  },
  {
    id: "eid_path_change",
    title: "আলাদা পথে যাওয়া-আসা",
    subtitle: "ঈদগাহে যাওয়া ও আসার পথ ভিন্ন রাখুন",
    category: "sunnah",
    points: 10,
    days: [10],
    icon: "🛤️",
    hadith: "নবী ﷺ ঈদের দিন এক পথে যেতেন এবং ভিন্ন পথে ফিরতেন। (বুখারি: ৯৮৬)",
    detail: "ঈদগাহে যাওয়া এবং ফেরার পথ আলাদা রাখা সুন্নত।",
  },

  // ── আর্থিক ও সামাজিক ─────────────────────────────────────────────────────
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
