"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { BADGES, getEarnedBadges, type BadgeConditionData } from "@/lib/data/badges";
import { calculatePoints, getAmalForDay } from "@/lib/data/amal";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const STORAGE_KEY = "amal_completed";
const PROFILE_KEY = "user_profile";
const PHOTO_KEY = "profile_photo_base64";
const APP_URL = "https://github.com/Humayun63/amal10";

interface UserProfile {
  name: string;
  gender: "male" | "female" | null;
}

function toBn(n: number): string {
  return n.toString().replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
}

const BN_DAY_LABELS: Record<number, string> = {
  1:"১ জিলহজ",2:"২ জিলহজ",3:"৩ জিলহজ",4:"৪ জিলহজ",5:"৫ জিলহজ",
  6:"৬ জিলহজ",7:"৭ জিলহজ",8:"৮ জিলহজ",9:"৯ জিলহজ",10:"১০ জিলহজ",
  11:"১১ জিলহজ",12:"১২ জিলহজ",13:"১৩ জিলহজ",
};

function loadCompleted(): Record<number, string[]> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"); } catch { return {}; }
}
function loadProfile(): UserProfile {
  try {
    const raw = JSON.parse(localStorage.getItem(PROFILE_KEY) ?? "{}");
    return { name: raw.name ?? "", gender: raw.gender ?? null };
  } catch { return { name: "", gender: null }; }
}
function saveProfile(p: UserProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}
function loadPhoto() { return typeof window !== "undefined" ? (localStorage.getItem(PHOTO_KEY) ?? "") : ""; }
function savePhoto(b64: string) { localStorage.setItem(PHOTO_KEY, b64); }

// ── Geometric pattern ─────────────────────────────────────────────────────────
function GeometricPattern({ className = "" }: { className?: string }) {
  const lines = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30) * Math.PI / 180;
    return { x1: 150 + 140 * Math.cos(a), y1: 150 + 140 * Math.sin(a), x2: 150 - 140 * Math.cos(a), y2: 150 - 140 * Math.sin(a) };
  });
  return (
    <svg className={`absolute opacity-[0.08] pointer-events-none ${className}`} viewBox="0 0 300 300" fill="none">
      {[140, 110, 80, 50, 20].map(r => <circle key={r} cx="150" cy="150" r={r} stroke="currentColor" strokeWidth="0.8"/>)}
      {lines.map((l, i) => <line key={i} {...l} stroke="currentColor" strokeWidth="0.5"/>)}
    </svg>
  );
}

// ── Settings Sheet ────────────────────────────────────────────────────────────
function SettingsSheet({ user, profile, onClose, onSave, onPhotoSave }: {
  user: User | null;
  profile: UserProfile;
  onClose: () => void;
  onSave: (p: UserProfile) => void;
  onPhotoSave: (b64: string) => void;
}) {
  const [name, setName] = useState(profile.name || user?.user_metadata?.full_name || user?.user_metadata?.name || "");
  const [gender, setGender] = useState<"male" | "female" | null>(profile.gender);
  const [localPhoto, setLocalPhoto] = useState(() => loadPhoto());
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setLocalPhoto(b64);
      savePhoto(b64);
      onPhotoSave(b64);
    };
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setSaving(true);
    const updated: UserProfile = { name: name.trim(), gender };
    saveProfile(updated);
    if (user && name.trim()) {
      try {
        await createClient().auth.updateUser({ data: { full_name: name.trim(), gender } });
      } catch { /* non-critical */ }
    }
    onSave(updated);
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
      <div className="relative w-full md:max-w-md bg-white rounded-t-3xl md:rounded-2xl p-5 z-10 max-h-[90vh] overflow-y-auto">
        <div className="md:hidden w-10 h-1 bg-[#E6F4EA] rounded-full mx-auto mb-5"/>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0B3C26] font-bold text-lg">প্রোফাইল সেটিংস</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#1C2833" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Gender selector (first, so photo visibility updates correctly) */}
        <div className="mb-5">
          <label className="text-[#AEB6BF] text-xs font-bold uppercase tracking-widest block mb-2">আপনি কে?</label>
          <div className="flex gap-3">
            {([["male","পুরুষ","👨"],["female","মহিলা","👩"]] as const).map(([v, label, emoji]) => (
              <button
                key={v}
                onClick={() => setGender(v)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                  gender === v ? "border-[#0B3C26] bg-[#E6F4EA] text-[#0B3C26]" : "border-[#E6F4EA] bg-white text-[#AEB6BF]"
                }`}
              >
                <span>{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Photo upload — males only */}
        {gender !== "female" ? (
          <div className="mb-5">
            <label className="text-[#AEB6BF] text-xs font-bold uppercase tracking-widest block mb-2">প্রোফাইল ছবি</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#0B3C26] overflow-hidden flex items-center justify-center shrink-0">
                {localPhoto
                  ? <img src={localPhoto} alt="profile" className="w-full h-full object-cover"/>
                  : <span className="text-white text-2xl font-bold">{name.charAt(0).toUpperCase() || "আ"}</span>
                }
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#E6F4EA] text-[#0B3C26] px-4 py-2 rounded-xl text-sm font-semibold active:scale-95 transition-all"
                >
                  ছবি পরিবর্তন করুন
                </button>
                {localPhoto && (
                  <button
                    type="button"
                    onClick={() => { setLocalPhoto(""); savePhoto(""); onPhotoSave(""); }}
                    className="text-red-400 text-xs text-left px-1"
                  >
                    ছবি মুছুন
                  </button>
                )}
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange}/>
          </div>
        ) : (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 mb-5">
            <p className="text-rose-700 text-xs leading-relaxed">
              <span className="font-bold">বোনের জন্য পরামর্শ:</span> ইসলামী পর্দার বিধান অনুযায়ী ছবি আপলোড না করাই উত্তম। আপনার নামের প্রথম অক্ষর দিয়ে সুন্দর আবতার তৈরি হবে ইনশাআল্লাহ।
            </p>
          </div>
        )}

        {/* Name */}
        <div className="mb-5">
          <label className="text-[#AEB6BF] text-xs font-bold uppercase tracking-widest block mb-2">আপনার নাম</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="নাম লিখুন"
            className="w-full bg-[#FAFAF9] border border-[#E6F4EA] rounded-xl px-4 py-3 text-[#1C2833] text-sm outline-none focus:border-[#A3E4D7] transition-colors"
          />
        </div>

        {/* Sisters prayer note */}
        {gender === "female" && (
          <div className="bg-[#E6F4EA] border border-[#A3E4D7] rounded-xl p-3.5 mb-5">
            <p className="text-[#0B3C26] text-xs leading-relaxed">
              <span className="font-bold">নামাজের বিষয়ে:</span> মহিলাদের জন্য ঘরে নামাজ পড়া উত্তম। আমল তালিকায় আপনার জন্য উপযুক্তভাবে দেখানো হবে।
            </p>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3.5 bg-[#0B3C26] text-white font-bold rounded-xl active:scale-95 transition-all disabled:opacity-60"
        >
          {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
        </button>
      </div>
    </div>
  );
}

// ── Share Card Modal ──────────────────────────────────────────────────────────
function ShareCardModal({ displayName, streak, totalPoints, onClose }: {
  displayName: string;
  streak: number;
  totalPoints: number;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 800, H = 420;
    canvas.width = W;
    canvas.height = H;

    // Background
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#0B3C26");
    grad.addColorStop(1, "#145A3A");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Decorative circles (top-right)
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1;
    [220, 180, 140, 100, 60].forEach(r => {
      ctx.beginPath();
      ctx.arc(W - 80, 0, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Avatar circle
    ctx.fillStyle = "rgba(163,228,215,0.2)";
    ctx.beginPath();
    ctx.arc(110, 130, 55, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#A3E4D7";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(110, 130, 55, 0, Math.PI * 2);
    ctx.stroke();

    // Avatar letter
    ctx.fillStyle = "#A3E4D7";
    ctx.font = "bold 44px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(displayName.charAt(0).toUpperCase() || "আ", 110, 132);

    // Name
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 30px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(displayName || "মুসলিম", 190, 115);

    // Subtitle
    ctx.fillStyle = "#A3E4D7";
    ctx.font = "17px Arial, sans-serif";
    ctx.fillText("জিলহজ আমল চ্যালেঞ্জ ১৪৪৭", 190, 145);

    // Divider
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(60, 185, W - 120, 1);

    // Stat boxes
    function drawStat(x: number, label: string, value: string, color: string) {
      ctx.fillStyle = "rgba(255,255,255,0.07)";
      ctx.beginPath();
      const bx = x, by = 205, bw = 210, bh = 110, br = 14;
      ctx.moveTo(bx + br, by);
      ctx.lineTo(bx + bw - br, by);
      ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + br);
      ctx.lineTo(bx + bw, by + bh - br);
      ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - br, by + bh);
      ctx.lineTo(bx + br, by + bh);
      ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - br);
      ctx.lineTo(bx, by + br);
      ctx.quadraticCurveTo(bx, by, bx + br, by);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = color;
      ctx.font = "bold 38px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(value, bx + bw / 2, by + 68);

      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.font = "15px Arial, sans-serif";
      ctx.fillText(label, bx + bw / 2, by + 95);
    }

    drawStat(60, "স্ট্রেইক", `${streak} দিন 🔥`, "#F4A261");
    drawStat(290, "পয়েন্ট", `${totalPoints}`, "#A3E4D7");
    drawStat(520, "চ্যালেঞ্জ", "জিলহজ", "#E9D8A6");

    // CTA text
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "14px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("আপনিও যোগ দিন → " + APP_URL, W / 2, H - 22);

    // Crescent (simple)
    ctx.strokeStyle = "rgba(163,228,215,0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(740, 380, 22, 0.4, Math.PI * 1.7);
    ctx.stroke();

  }, [displayName, streak, totalPoints]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "amal-challenge-card.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  }

  const shareText = encodeURIComponent(
    `আমি জিলহজ আমল চ্যালেঞ্জে ${streak} দিন স্ট্রেইক ধরে রেখেছি! মোট ${totalPoints} পয়েন্ট অর্জন করেছি। আপনিও যোগ দিন! 🌙`
  );
  const shareUrl = encodeURIComponent(APP_URL);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}/>
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden z-10">
        <canvas ref={canvasRef} className="w-full" style={{ display: "block", aspectRatio: "800/420" }}/>

        <div className="p-5">
          <p className="text-[#0B3C26] font-bold text-base mb-4 text-center">আপনার চ্যালেঞ্জ শেয়ার করুন</p>

          <button
            onClick={handleDownload}
            className="w-full mb-3 bg-[#0B3C26] text-white py-3 rounded-xl font-semibold text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            ছবি ডাউনলোড করুন
          </button>

          
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [allCompleted, setAllCompleted] = useState<Record<number, string[]>>({});
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile>({ name: "", gender: null });
  const [photoB64, setPhotoB64] = useState("");
  const [mounted, setMounted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  useEffect(() => {
    setAllCompleted(loadCompleted());
    const savedProfile = loadProfile();
    setPhotoB64(loadPhoto());
    setMounted(true);

    createClient().auth.getUser().then(({ data }) => {
      const u = data.user;
      setUser(u);

      // Auto-detect gender from OAuth metadata if not yet set
      if (savedProfile.gender === null && u?.user_metadata?.gender) {
        const raw = u.user_metadata.gender as string;
        const detected: "male" | "female" | null =
          raw === "male" ? "male" : raw === "female" ? "female" : null;
        if (detected) {
          const updated = { ...savedProfile, gender: detected };
          saveProfile(updated);
          setProfile(updated);
          return;
        }
      }
      setProfile(savedProfile);
    });
  }, []);

  // Derived stats
  const totalPoints = Object.entries(allCompleted).reduce(
    (sum, [day, ids]) => sum + calculatePoints(ids, Number(day)), 0
  );
  const streak = Object.keys(allCompleted).length;
  const daysCompleted = Object.entries(allCompleted).filter(([day, ids]) => {
    const da = getAmalForDay(Number(day));
    return da.length > 0 && ids.length >= da.length;
  }).length;

  const conditionData: BadgeConditionData = { totalPoints, streak, completedAmalIds: allCompleted, daysCompleted };
  const earnedBadges = getEarnedBadges(conditionData);
  const earnedIds = new Set(earnedBadges.map(b => b.id));

  const displayName =
    profile.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "মুসলিম";

  const avatarLetter = displayName.charAt(0).toUpperCase();
  const showOAuthAvatar = !photoB64 && profile.gender !== "female" && !!user?.user_metadata?.avatar_url;

  const lastActivityDay = Object.keys(allCompleted).map(Number).sort((a, b) => b - a)[0] ?? null;

  async function handleSignOut() {
    await createClient().auth.signOut();
    window.location.href = "/";
  }

  if (!mounted) return <div className="min-h-screen bg-[#FAFAF9]"/>;

  return (
    <div className="min-h-screen bg-[#FAFAF9]">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="relative bg-[#E6F4EA] overflow-hidden pb-6">
        <GeometricPattern className="right-0 top-0 w-48 h-48 text-[#0B3C26]"/>

        <div className="flex items-center justify-between px-4 pt-12 md:pt-8 pb-2">
          <h1 className="text-[#0B3C26] text-xl font-bold">প্রোফাইল</h1>
          <button
            onClick={() => setShowSettings(true)}
            className="w-10 h-10 bg-white rounded-xl border border-[#E6F4EA] flex items-center justify-center shadow-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#1C2833" strokeWidth="1.8"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="#1C2833" strokeWidth="1.8"/>
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-center px-4 pt-4">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-[#0B3C26] border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
              {photoB64
                ? <img src={photoB64} alt="profile" className="w-full h-full object-cover"/>
                : showOAuthAvatar
                  ? <Image src={user!.user_metadata.avatar_url} alt="profile" width={96} height={96} className="w-full h-full object-cover"/>
                  : <span className="text-white text-3xl font-bold">{avatarLetter}</span>
              }
            </div>
            {streak >= 3 && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full border-2 border-white shadow flex items-center justify-center text-base">🔥</div>
            )}
          </div>

          <h2 className="text-[#0B3C26] text-2xl font-bold text-center">{displayName}</h2>
          <p className="text-[#0B3C26]/60 text-xs text-center mt-1">
            সদস্য · জিলহজ ১৪৪৭{profile.gender === "female" ? " · বোন" : ""}
          </p>
        </div>

        <div className="mx-4 mt-5 bg-white rounded-2xl border border-[#E6F4EA] shadow-sm overflow-hidden">
          <div className="flex divide-x divide-[#E6F4EA]">
            <div className="flex-1 py-4 text-center">
              <p className="text-[#0B3C26] font-bold text-xl">{toBn(totalPoints)}</p>
              <p className="text-[#AEB6BF] text-[11px] mt-0.5">মোট পয়েন্ট</p>
            </div>
            <div className="flex-1 py-4 text-center">
              <p className="text-orange-500 font-bold text-xl">{toBn(streak)} 🔥</p>
              <p className="text-[#AEB6BF] text-[11px] mt-0.5">স্ট্রেইক</p>
            </div>
            <div className="flex-1 py-4 text-center">
              <p className="text-purple-500 font-bold text-xl">{toBn(daysCompleted)}/১০</p>
              <p className="text-[#AEB6BF] text-[11px] mt-0.5">সম্পর্ন দিন</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 flex flex-col gap-5 max-w-2xl mx-auto">

        {/* ── STREAK CALENDAR ──────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[#1C2833] font-bold text-base">ধারা ক্যালেন্ডার</h2>
            {streak > 0 && (
              <span className="text-sm font-semibold text-orange-500">{toBn(streak)}-day streak 🔥</span>
            )}
          </div>
          <div className="bg-white rounded-2xl border border-[#E6F4EA] p-4">
            <div className="flex gap-1.5 mb-3">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(d => {
                const comp = allCompleted[d] ?? [];
                const da = getAmalForDay(d);
                const done = da.length > 0 && comp.length >= da.length;
                const partial = comp.length > 0 && comp.length < da.length;
                const isCurrent = d === (Object.keys(allCompleted).map(Number).sort((a,b) => b-a)[0] ?? 1);
                return (
                  <div key={d} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                      done ? "bg-[#0B3C26] text-white"
                        : partial ? "bg-[#A3E4D7] text-[#0B3C26]"
                        : isCurrent ? "bg-[#A3E4D7]/40 text-[#0B3C26] ring-2 ring-[#A3E4D7]"
                        : "bg-[#F5F5F5] text-[#AEB6BF]"
                    }`}>
                      {toBn(d)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#AEB6BF]">
                {lastActivityDay ? `সর্বশেষ আমল: ${BN_DAY_LABELS[lastActivityDay] ?? `${toBn(lastActivityDay)} জিলহজ`}` : "এখনো শুরু হয়নি"}
              </span>
              <span className="text-[#AEB6BF]">
                {streak > 0 && streak < 9 ? `আগামীকাল · ${BN_DAY_LABELS[streak + 1] ?? ""}` : ""}
              </span>
            </div>
          </div>
        </div>

        {/* ── BADGES ───────────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[#1C2833] font-bold text-base">ব্যাজ ও অর্জন</h2>
            <span className="text-[#AEB6BF] text-xs">{toBn(earnedBadges.length)}/{toBn(BADGES.length)} অর্জিত</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map(badge => {
              const earned = earnedIds.has(badge.id);
              const earningDay = earned && badge.getEarningDay ? badge.getEarningDay(allCompleted) : null;
              return (
                <div key={badge.id} className={`bg-white rounded-2xl p-3.5 flex flex-col items-center text-center border transition-all ${
                  earned ? "border-[#A3E4D7]" : "border-[#F0F4F2] opacity-50"
                }`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-2 ${
                    earned ? "border-2 border-[#A3E4D7] bg-[#F0FBF8]" : "bg-[#F5F5F5]"
                  }`}>
                    <span className={!earned ? "grayscale" : ""}>{badge.icon}</span>
                  </div>
                  <p className={`text-xs font-bold leading-tight ${earned ? "text-[#1C2833]" : "text-[#AEB6BF]"}`}>
                    {badge.title}
                  </p>
                  {earned && earningDay && (
                    <p className="text-[#A3E4D7] text-[10px] mt-0.5">{BN_DAY_LABELS[earningDay]}</p>
                  )}
                  {earned && !earningDay && (
                    <p className="text-[#A3E4D7] text-[10px] mt-0.5">অর্জিত ✓</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SHARE ────────────────────────────────────────────────────────── */}
        <div className="bg-[#E6F4EA] rounded-2xl p-4 border border-[#A3E4D7]">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl">🔗</span>
            <div>
              <p className="text-[#0B3C26] font-bold text-sm">আপনার অগ্রগতি শেয়ার করুন</p>
              <p className="text-[#0B3C26]/60 text-xs mt-0.5">শেয়ারযোগ্য ছবি কার্ড তৈরি করুন</p>
            </div>
          </div>
          <button
            onClick={() => setShowShareCard(true)}
            className="w-full py-3 rounded-xl font-semibold text-sm active:scale-95 transition-all bg-[#0B3C26] text-white"
          >
            🔥 স্ট্রেইক কার্ড তৈরি করুন
          </button>
        </div>

        {/* ── ACCOUNT ──────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#E6F4EA] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E6F4EA]">
            <h2 className="text-[#0B3C26] font-bold text-sm">অ্যাকাউন্ট</h2>
          </div>
          <div className="divide-y divide-[#E6F4EA]">
            <div className="px-5 py-3.5 flex items-center justify-between">
              <span className="text-[#1C2833] text-sm">ডেটা সিঙ্ক</span>
              <span className="text-[#AEB6BF] text-xs">{user ? "ক্লাউডে সিঙ্ক আছে ✓" : "লোকাল ডিভাইসে"}</span>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left active:bg-[#FAFAF9] transition-colors"
            >
              <span className="text-[#1C2833] text-sm">প্রোফাইল সম্পাদনা</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#AEB6BF" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <Link href="/notifications" className="px-5 py-3.5 flex items-center justify-between active:bg-[#FAFAF9] transition-colors">
              <span className="text-[#1C2833] text-sm">নোটিফিকেশন সেটিংস</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#AEB6BF" strokeWidth="2" strokeLinecap="round"/></svg>
            </Link>
            <div className="px-5 py-3.5 flex items-center justify-between">
              <span className="text-[#1C2833] text-sm">সংস্করণ</span>
              <span className="text-[#AEB6BF] text-xs">v1.0 · জিলহজ ১৪৪৭</span>
            </div>
            {user && (
              <button
                onClick={handleSignOut}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left active:bg-red-50 transition-colors"
              >
                <span className="text-red-500 text-sm font-medium">সাইন আউট</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-[#AEB6BF] text-xs pb-4">ডেটা আপনার ডিভাইসে সুরক্ষিত।</p>
      </div>

      {/* Settings sheet */}
      {showSettings && (
        <SettingsSheet
          user={user}
          profile={profile}
          onClose={() => setShowSettings(false)}
          onSave={p => setProfile(p)}
          onPhotoSave={b64 => setPhotoB64(b64)}
        />
      )}

      {/* Share card modal */}
      {showShareCard && (
        <ShareCardModal
          displayName={displayName}
          streak={streak}
          totalPoints={totalPoints}
          onClose={() => setShowShareCard(false)}
        />
      )}
    </div>
  );
}
