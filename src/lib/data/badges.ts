export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (data: BadgeConditionData) => boolean;
}

export interface BadgeConditionData {
  totalPoints: number;
  streak: number;
  completedAmalIds: Record<number, string[]>; // day -> completed ids
  daysCompleted: number;
}

export const BADGES: Badge[] = [
  {
    id: "first_step",
    title: "প্রথম পদক্ষেপ",
    description: "প্রথম আমল সম্পন্ন করেছেন",
    icon: "🌱",
    condition: ({ totalPoints }) => totalPoints >= 10,
  },
  {
    id: "arafah_faster",
    title: "আরাফা রোজা পালনকারী",
    description: "আরাফার দিনের রোজা রেখেছেন",
    icon: "⭐",
    condition: ({ completedAmalIds }) =>
      completedAmalIds[9]?.includes("arafah_fast") ?? false,
  },
  {
    id: "takbir_squad",
    title: "তাকবীর স্কোয়াড",
    description: "আইয়ামে তাশরীকের ৫ দিন তাকবীর আদায় করেছেন",
    icon: "📣",
    condition: ({ completedAmalIds }) =>
      [9, 10, 11, 12, 13].every(
        (day) => completedAmalIds[day]?.includes("takbir_tashriq") ?? false
      ),
  },
  {
    id: "perfect_day",
    title: "পারফেক্ট দিন",
    description: "একদিনে সকল আমল সম্পন্ন করেছেন",
    icon: "🏆",
    condition: ({ completedAmalIds }) =>
      Object.keys(completedAmalIds).length > 0,
  },
  {
    id: "streak_3",
    title: "৩ দিনের সংকল্প",
    description: "টানা ৩ দিন আমল সম্পন্ন করেছেন",
    icon: "🔥",
    condition: ({ streak }) => streak >= 3,
  },
  {
    id: "streak_7",
    title: "সপ্তাহের যোদ্ধা",
    description: "টানা ৭ দিন আমল সম্পন্ন করেছেন",
    icon: "⚡",
    condition: ({ streak }) => streak >= 7,
  },
  {
    id: "perfect_10",
    title: "১০/১০ পারফেক্ট",
    description: "১০ দিনের চ্যালেঞ্জ সম্পন্ন করেছেন",
    icon: "💎",
    condition: ({ daysCompleted }) => daysCompleted >= 10,
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
