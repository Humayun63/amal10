import { getAmalForDay } from "./amal";

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (data: BadgeConditionData) => boolean;
  getEarningDay?: (completedAmalIds: Record<number, string[]>) => number | null;
}

export interface BadgeConditionData {
  totalPoints: number;
  streak: number;
  completedAmalIds: Record<number, string[]>;
  daysCompleted: number;
}

export const BADGES: Badge[] = [
  {
    id: "first_step",
    title: "প্রথম পদক্ষেপ",
    description: "প্রথম আমল সম্পন্ন করেছেন",
    icon: "🌱",
    condition: ({ completedAmalIds }) => Object.values(completedAmalIds).some(ids => ids.length > 0),
    getEarningDay: (completedAmalIds) => {
      const days = Object.keys(completedAmalIds).map(Number).sort((a, b) => a - b);
      return days.find(d => completedAmalIds[d].length > 0) ?? null;
    },
  },
  {
    id: "dhikr_master",
    title: "যিকর মাস্টার",
    description: "কমপক্ষে ৩ দিন যিকর সম্পন্ন করেছেন",
    icon: "📿",
    condition: ({ completedAmalIds }) => {
      const dhikrIds = ["tasbeeh", "tahlil", "takbeer_dhikr", "istighfar", "durood", "morning_dhikr", "evening_dhikr"];
      const dhikrDays = Object.values(completedAmalIds).filter(ids =>
        ids.some(id => dhikrIds.includes(id))
      );
      return dhikrDays.length >= 3;
    },
    getEarningDay: (completedAmalIds) => {
      const dhikrIds = ["tasbeeh", "tahlil", "takbeer_dhikr", "istighfar", "durood", "morning_dhikr", "evening_dhikr"];
      let count = 0;
      const days = Object.keys(completedAmalIds).map(Number).sort((a, b) => a - b);
      for (const d of days) {
        if (completedAmalIds[d].some(id => dhikrIds.includes(id))) {
          count++;
          if (count >= 3) return d;
        }
      }
      return null;
    },
  },
  {
    id: "tahajjud_warrior",
    title: "তাহাজ্জুদী",
    description: "তাহাজ্জুদ নামাজ পড়েছেন",
    icon: "🌙",
    condition: ({ completedAmalIds }) =>
      Object.values(completedAmalIds).some(ids => ids.includes("tahajjud")),
    getEarningDay: (completedAmalIds) => {
      const days = Object.keys(completedAmalIds).map(Number).sort((a, b) => a - b);
      return days.find(d => completedAmalIds[d].includes("tahajjud")) ?? null;
    },
  },
  {
    id: "arafah_faster",
    title: "আরাফা রোজা পালনকারী",
    description: "আরাফার দিনের রোজা রেখেছেন",
    icon: "⭐",
    condition: ({ completedAmalIds }) =>
      completedAmalIds[9]?.includes("arafah_fast") ?? false,
    getEarningDay: () => 9,
  },
  {
    id: "takbir_squad",
    title: "তাকবীর স্কোয়াড",
    description: "আইয়ামে তাশরীকের ৫ দিন তাকবীর আদায় করেছেন",
    icon: "📣",
    condition: ({ completedAmalIds }) =>
      [9, 10, 11, 12, 13].every(day => completedAmalIds[day]?.includes("takbir_tashriq") ?? false),
    getEarningDay: () => 13,
  },
  {
    id: "perfect_day",
    title: "পারফেক্ট দিন",
    description: "একদিনে সকল আমল সম্পন্ন করেছেন",
    icon: "🏆",
    condition: ({ daysCompleted }) => daysCompleted >= 1,
    getEarningDay: (completedAmalIds) => {
      const days = Object.keys(completedAmalIds).map(Number).sort((a, b) => a - b);
      return days.find(d => {
        const dayAmal = getAmalForDay(d);
        return dayAmal.length > 0 && completedAmalIds[d].length >= dayAmal.length;
      }) ?? null;
    },
  },
  {
    id: "streak_3",
    title: "৩ দিনের সংকল্প",
    description: "টানা ৩ দিন আমল সম্পন্ন করেছেন",
    icon: "🔥",
    condition: ({ streak }) => streak >= 3,
    getEarningDay: (completedAmalIds) => {
      const days = Object.keys(completedAmalIds).map(Number).sort((a, b) => a - b);
      return days.length >= 3 ? days[2] : null;
    },
  },
  {
    id: "streak_7",
    title: "সপ্তাহের যোদ্ধা",
    description: "টানা ৭ দিন আমল সম্পন্ন করেছেন",
    icon: "⚡",
    condition: ({ streak }) => streak >= 7,
    getEarningDay: (completedAmalIds) => {
      const days = Object.keys(completedAmalIds).map(Number).sort((a, b) => a - b);
      return days.length >= 7 ? days[6] : null;
    },
  },
  {
    id: "perfect_10",
    title: "১০/১০ পারফেক্ট",
    description: "১০ দিনের চ্যালেঞ্জ সম্পন্ন করেছেন",
    icon: "💎",
    condition: ({ daysCompleted }) => daysCompleted >= 10,
    getEarningDay: () => 10,
  },
  {
    id: "point_500",
    title: "৫০০ পয়েন্ট ক্লাব",
    description: "মোট ৫০০ পয়েন্ট অর্জন করেছেন",
    icon: "🥇",
    condition: ({ totalPoints }) => totalPoints >= 500,
  },
  {
    id: "point_1000",
    title: "হাজার পয়েন্ট ব্রিগেড",
    description: "মোট ১০০০ পয়েন্ট অর্জন করেছেন",
    icon: "🌟",
    condition: ({ totalPoints }) => totalPoints >= 1000,
  },
];

export function getEarnedBadges(data: BadgeConditionData): Badge[] {
  return BADGES.filter((badge) => badge.condition(data));
}
