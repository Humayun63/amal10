"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getAmalForDay,
  calculatePoints,
  getMaxPoints,
  CATEGORY_LABELS,
  type AmalCategory,
  type Amal,
} from "@/lib/data/amal";
import {
  getCurrentDhulHijjahDay,
  getDhulHijjahDateLabel,
  isTashriqDay,
  isArafahDay,
  isEidDay,
} from "@/lib/utils/dhulHijjah";
import BottomSheet from "@/components/ui/BottomSheet";
import Confetti from "@/components/ui/Confetti";

const STORAGE_KEY = "amal_completed";

function loadCompleted(): Record<number, string[]> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveCompleted(data: Record<number, string[]>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function AmalRow({
  amal,
  checked,
  onToggle,
  onDetail,
}: {
  amal: Amal;
  checked: boolean;
  onToggle: () => void;
  onDetail: () => void;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
        checked
          ? "bg-[#E6F4EA] border-[#A3E4D7]"
          : "bg-white border-[#E6F4EA]"
      }`}
    >
      {/* Checkbox — 44×44 tap target */}
      <button
        onClick={onToggle}
        className="flex-shrink-0 w-11 h-11 flex items-center justify-center"
        aria-label={checked ? "আনচেক করুন" : "সম্পন্ন করুন"}
      >
        <div
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
            checked
              ? "bg-[#0B3C26] border-[#0B3C26] animate-check-pop"
              : "border-[#AEB6BF]"
          }`}
        >
          {checked && (
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </button>

      {/* Content */}
      <button
        onClick={onDetail}
        className="flex-1 text-left min-w-0"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{amal.icon}</span>
          <p className={`text-sm font-semibold leading-tight ${checked ? "text-[#0B3C26] line-through opacity-70" : "text-[#1C2833]"}`}>
            {amal.title}
          </p>
        </div>
        {amal.subtitle && (
          <p className="text-xs text-[#AEB6BF] mt-0.5 ml-6">{amal.subtitle}</p>
        )}
      </button>

      {/* Points */}
      <div className="flex-shrink-0 flex flex-col items-end gap-1">
        <span className="text-xs font-bold text-[#0B3C26] font-[var(--font-inter)]">
          +{amal.points}
        </span>
        {amal.hadith && (
          <button onClick={onDetail} className="text-[#A3E4D7]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#A3E4D7" strokeWidth="2" />
              <path d="M12 16v-4M12 8h.01" stroke="#A3E4D7" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [day, setDay] = useState<number>(1);
  const [allCompleted, setAllCompleted] = useState<Record<number, string[]>>({});
  const [selectedAmal, setSelectedAmal] = useState<Amal | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [celebConfetti, setCelebConfetti] = useState(false);

  useEffect(() => {
    const current = getCurrentDhulHijjahDay();
    setDay(current ?? 1);
    setAllCompleted(loadCompleted());
  }, []);

  const completed = allCompleted[day] ?? [];
  const dayAmal = getAmalForDay(day);
  const points = calculatePoints(completed, day);
  const maxPoints = getMaxPoints(day);
  const progress = maxPoints > 0 ? Math.round((completed.length / dayAmal.length) * 100) : 0;
  const streak = Object.keys(allCompleted).length;

  const toggle = useCallback(
    (id: string) => {
      setAllCompleted((prev) => {
        const current = prev[day] ?? [];
        const next = current.includes(id)
          ? current.filter((x) => x !== id)
          : [...current, id];

        const updated = { ...prev, [day]: next };
        saveCompleted(updated);

        if (!current.includes(id)) {
          // Just checked
          setConfetti(true);
          setTimeout(() => setConfetti(false), 100);

          if (next.length === dayAmal.length) {
            setCelebConfetti(true);
            setTimeout(() => setCelebConfetti(false), 100);
          }
        }
        return updated;
      });
    },
    [day, dayAmal.length]
  );

  const categories: AmalCategory[] = ["fard", "sunnah", "social"];

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Confetti trigger={confetti} type="normal" />
      <Confetti trigger={celebConfetti} type="celebration" />

      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#E6F4EA] shadow-sm">
        <div className="px-4 pt-4 pb-3 max-w-lg mx-auto">
          {/* Day selector row */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] text-[#AEB6BF] uppercase tracking-wider">আজকের আমল</p>
              <h1 className="text-[20px] font-bold text-[#0B3C26]">{getDhulHijjahDateLabel(day)}</h1>
            </div>
            <div className="flex items-center gap-2">
              {/* Streak */}
              <div className="flex items-center gap-1 bg-[#E6F4EA] px-3 py-1.5 rounded-full">
                <span className="animate-pulse-fire">🔥</span>
                <span className="text-[#0B3C26] font-bold text-sm font-[var(--font-inter)]">{streak}</span>
              </div>
            </div>
          </div>

          {/* Special day banners */}
          {isArafahDay(day) && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3 text-xs text-amber-800 font-medium flex items-center gap-2">
              ⭐ আরাফার দিন — আরাফার রোজা রাখুন!
            </div>
          )}
          {isEidDay(day) && (
            <div className="bg-[#E6F4EA] border border-[#A3E4D7] rounded-xl px-3 py-2 mb-3 text-xs text-[#0B3C26] font-semibold flex items-center gap-2">
              🎉 ঈদ মুবারক! আজ রোজা নিষিদ্ধ।
            </div>
          )}
          {isTashriqDay(day) && !isArafahDay(day) && !isEidDay(day) && (
            <div className="bg-[#E6F4EA] border border-[#A3E4D7] rounded-xl px-3 py-2 mb-3 text-xs text-[#0B3C26] font-medium flex items-center gap-2">
              📣 আইয়ামে তাশরীক — প্রতি নামাজের পর তাকবীর পড়ুন
            </div>
          )}

          {/* Progress */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#AEB6BF]">{completed.length}/{dayAmal.length} আমল সম্পন্ন</span>
            <span className="text-[#0B3C26] font-bold font-[var(--font-inter)]">{points} পয়েন্ট</span>
          </div>
          <div className="h-2.5 bg-[#E6F4EA] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0B3C26] rounded-full progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && (
            <p className="text-center text-[#0B3C26] text-xs font-semibold mt-1.5">
              🎉 আলহামদুলিল্লাহ! আজকের সব আমল সম্পন্ন!
            </p>
          )}
        </div>

        {/* Day switcher */}
        <div className="px-4 pb-3 overflow-x-auto scrollbar-hidden">
          <div className="flex gap-2 max-w-lg mx-auto">
            {Array.from({ length: 13 }, (_, i) => i + 1).map((d) => {
              const comp = allCompleted[d] ?? [];
              const dayAmalCount = getAmalForDay(d).length;
              const done = comp.length === dayAmalCount && dayAmalCount > 0;
              return (
                <button
                  key={d}
                  onClick={() => setDay(d)}
                  className={`flex-shrink-0 w-9 h-9 rounded-full text-xs font-bold transition-all ${
                    d === day
                      ? "bg-[#0B3C26] text-white"
                      : done
                      ? "bg-[#A3E4D7] text-[#0B3C26]"
                      : "bg-[#E6F4EA] text-[#AEB6BF]"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Amal list */}
      <div className="px-4 py-4 flex flex-col gap-5 max-w-lg mx-auto">
        {categories.map((cat) => {
          const items = dayAmal.filter((a) => a.category === cat);
          if (!items.length) return null;
          return (
            <div key={cat}>
              <h2 className="text-[12px] font-semibold text-[#AEB6BF] uppercase tracking-wider mb-2 px-1">
                {CATEGORY_LABELS[cat]}
              </h2>
              <div className="flex flex-col gap-2">
                {items.map((amal) => (
                  <AmalRow
                    key={amal.id}
                    amal={amal}
                    checked={completed.includes(amal.id)}
                    onToggle={() => toggle(amal.id)}
                    onDetail={() => setSelectedAmal(amal)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail bottom sheet */}
      <BottomSheet
        isOpen={!!selectedAmal}
        onClose={() => setSelectedAmal(null)}
        title={selectedAmal ? `${selectedAmal.icon} ${selectedAmal.title}` : undefined}
      >
        {selectedAmal && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="bg-[#E6F4EA] text-[#0B3C26] text-xs font-semibold px-2 py-1 rounded-full">
                {CATEGORY_LABELS[selectedAmal.category]}
              </span>
              <span className="bg-[#0B3C26] text-white text-xs font-bold px-2 py-1 rounded-full font-[var(--font-inter)]">
                +{selectedAmal.points} পয়েন্ট
              </span>
            </div>

            {selectedAmal.detail && (
              <p className="text-[#1C2833] text-sm leading-relaxed">
                {selectedAmal.detail}
              </p>
            )}

            {selectedAmal.hadith && (
              <div className="bg-[#E6F4EA] rounded-xl p-4">
                <p className="text-[#0B3C26] text-xs font-semibold mb-2">হাদিস / দলিল</p>
                <p className="text-[#1C2833] text-sm leading-relaxed italic">
                  &ldquo;{selectedAmal.hadith}&rdquo;
                </p>
              </div>
            )}

            <button
              onClick={() => {
                toggle(selectedAmal.id);
                setSelectedAmal(null);
              }}
              className={`w-full py-4 rounded-xl font-semibold text-sm active:scale-95 transition-transform ${
                completed.includes(selectedAmal.id)
                  ? "bg-[#E6F4EA] text-[#0B3C26]"
                  : "bg-[#0B3C26] text-white"
              }`}
            >
              {completed.includes(selectedAmal.id) ? "✓ সম্পন্ন হয়েছে — আনডু করুন" : "এই আমল সম্পন্ন করেছি ✓"}
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
