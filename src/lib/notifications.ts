const NOTIF_TIMES_KEY = "notifTimes";
const NOTIF_TIMERS_KEY = "__notifTimerIds";

const MESSAGES = [
  { title: "আমল চ্যালেঞ্জ", body: "সকালের যিকর ও দোয়া শুরু করুন 🤲" },
  { title: "আমল চ্যালেঞ্জ", body: "আজকের আমল সম্পন্ন করুন — স্ট্রিক ধরে রাখুন 🔥" },
  { title: "আমল চ্যালেঞ্জ", body: "আজকের অগ্রগতি দেখুন ও রাতের যিকর করুন 🌙" },
];

function showNotification(index: number) {
  if (typeof window === "undefined") return;
  if (Notification.permission !== "granted") return;
  const msg = MESSAGES[index % MESSAGES.length];
  navigator.serviceWorker?.ready
    .then((reg) => {
      reg.showNotification(msg.title, {
        body: msg.body,
        icon: "/icon-192.png",
        badge: "/icon-72.png",
        tag: `amal-${index}`,
      });
    })
    .catch(() => {
      // SW not available — fall back to basic Notification API
      new Notification(msg.title, { body: msg.body, tag: `amal-${index}` });
    });
}

// Parse "HH:MM" into milliseconds until that time today (or tomorrow if passed)
function msUntil(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  const now = new Date();
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  return target.getTime() - now.getTime();
}

// Clear any previously scheduled timers
function clearScheduled() {
  const ids: number[] = JSON.parse(
    sessionStorage.getItem(NOTIF_TIMERS_KEY) ?? "[]"
  );
  ids.forEach((id) => clearTimeout(id));
  sessionStorage.removeItem(NOTIF_TIMERS_KEY);
}

export function scheduleAllNotifications(times: string[]) {
  if (typeof window === "undefined") return;
  clearScheduled();
  const ids: number[] = [];
  times.forEach((t, i) => {
    const delay = msUntil(t);
    const id = window.setTimeout(() => showNotification(i), delay) as unknown as number;
    ids.push(id);
  });
  sessionStorage.setItem(NOTIF_TIMERS_KEY, JSON.stringify(ids));
}

// Call this on app boot to re-schedule saved times
export function initNotifications() {
  if (typeof window === "undefined") return;
  if (Notification.permission !== "granted") return;
  const raw = localStorage.getItem(NOTIF_TIMES_KEY);
  if (!raw) return;
  try {
    const times: string[] = JSON.parse(raw);
    scheduleAllNotifications(times);
  } catch {
    // Corrupted storage — ignore
  }
}
