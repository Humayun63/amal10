export const DHUL_HIJJAH_START = new Date("2025-06-27T00:00:00+06:00");
export const CHALLENGE_END = new Date("2025-07-09T23:59:59+06:00");
export const TASHRIQ_END = new Date("2025-07-12T15:30:00+06:00");

export function getCurrentDhulHijjahDay(): number | null {
  const now = new Date();
  const diff = now.getTime() - DHUL_HIJJAH_START.getTime();
  const day = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  if (day < 1 || day > 13) return null;
  return day;
}

export function isChallengeLive(): boolean {
  const now = new Date();
  return now >= DHUL_HIJJAH_START && now <= CHALLENGE_END;
}

export function isTashriqDay(day: number): boolean {
  return day >= 9 && day <= 13;
}

export function isArafahDay(day: number): boolean {
  return day === 9;
}

export function isEidDay(day: number): boolean {
  return day === 10;
}

export function isFastingAllowed(day: number): boolean {
  return day >= 1 && day <= 9;
}

export function getTimeUntilStart(): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = new Date();
  const diff = Math.max(0, DHUL_HIJJAH_START.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

export function getDhulHijjahDateLabel(day: number): string {
  const labels: Record<number, string> = {
    1: "১ জিলহজ",
    2: "২ জিলহজ",
    3: "৩ জিলহজ",
    4: "৪ জিলহজ",
    5: "৫ জিলহজ",
    6: "৬ জিলহজ",
    7: "৭ জিলহজ",
    8: "৮ জিলহজ",
    9: "৯ জিলহজ — আরাফার দিন",
    10: "১০ জিলহজ — ঈদুল আজহা",
    11: "১১ জিলহজ",
    12: "১২ জিলহজ",
    13: "১৩ জিলহজ",
  };
  return labels[day] ?? `${day} জিলহজ`;
}
