"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const PROFILE_KEY = "user_profile";

export default function OnboardPage() {
  const router = useRouter();
  const [step, setStep] = useState<"loading" | "setup">("loading");
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      const u = data.user;
      if (!u) { router.replace("/sign-in"); return; }

      // Skip onboarding if profile is already complete
      const metaName = (u.user_metadata?.full_name ?? u.user_metadata?.name ?? "").trim();
      const metaGender = u.user_metadata?.gender as string | undefined;
      let savedGender: string | null = null;
      try {
        savedGender = (JSON.parse(localStorage.getItem(PROFILE_KEY) ?? "{}") as { gender?: string }).gender ?? null;
      } catch { /* ignore */ }

      if (metaName && (metaGender || savedGender)) {
        router.replace("/push-permission");
        return;
      }

      // Pre-fill whatever we already know
      if (metaName) setName(metaName);
      const g = (metaGender ?? savedGender) as "male" | "female" | null;
      if (g === "male" || g === "female") setGender(g);
      setStep("setup");
    });
  }, [router]);

  async function handleSave() {
    if (!name.trim() || !gender) return;
    setSaving(true);
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: name.trim(), gender }));
    } catch { /* ignore */ }
    try {
      await createClient().auth.updateUser({ data: { full_name: name.trim(), gender } });
    } catch { /* non-critical */ }
    setSaving(false);
    router.push("/push-permission");
  }

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0B3C26]/20 border-t-[#0B3C26] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#0B3C26] flex items-center justify-center mx-auto mb-4 text-3xl">
            🌙
          </div>
          <h1 className="text-[#0B3C26] text-2xl font-bold">প্রোফাইল সেটআপ</h1>
          <p className="text-[#AEB6BF] text-sm mt-1 leading-relaxed">
            আমল তালিকা আপনার জন্য কাস্টমাইজ করতে<br />কয়েকটি তথ্য দিন
          </p>
        </div>

        {/* Gender */}
        <div className="mb-5">
          <label className="text-[#AEB6BF] text-xs font-bold uppercase tracking-widest block mb-2">
            আপনি কে?
          </label>
          <div className="flex gap-3">
            {([["male", "পুরুষ", "👨"], ["female", "মহিলা", "👩"]] as const).map(([v, label, emoji]) => (
              <button
                key={v}
                onClick={() => setGender(v)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                  gender === v
                    ? "border-[#0B3C26] bg-[#E6F4EA] text-[#0B3C26]"
                    : "border-[#E6F4EA] bg-white text-[#AEB6BF]"
                }`}
              >
                <span>{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="mb-5">
          <label className="text-[#AEB6BF] text-xs font-bold uppercase tracking-widest block mb-2">
            আপনার নাম
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="নাম লিখুন"
            className="w-full bg-white border border-[#E6F4EA] rounded-xl px-4 py-3 text-[#1C2833] text-sm outline-none focus:border-[#A3E4D7] transition-colors"
          />
        </div>

        {/* Female note */}
        {gender === "female" && (
          <div className="bg-[#E6F4EA] border border-[#A3E4D7] rounded-xl p-3.5 mb-5">
            <p className="text-[#0B3C26] text-xs leading-relaxed">
              <span className="font-bold">নামাজের বিষয়ে:</span> মহিলাদের জন্য ঘরে নামাজ পড়া উত্তম।
              আমল তালিকায় আপনার জন্য উপযুক্তভাবে দেখানো হবে।
            </p>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving || !name.trim() || !gender}
          className="w-full py-4 bg-[#0B3C26] text-white font-bold rounded-xl active:scale-95 transition-all disabled:opacity-50"
        >
          {saving ? "সংরক্ষণ হচ্ছে..." : "পরবর্তী →"}
        </button>

        <button
          onClick={() => router.push("/push-permission")}
          className="w-full py-2.5 mt-2 text-[#AEB6BF] text-sm hover:text-[#0B3C26] transition-colors"
        >
          এখন না, পরে করব
        </button>
      </div>
    </div>
  );
}
