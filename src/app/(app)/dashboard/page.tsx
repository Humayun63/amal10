"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getAmalForDay, calculatePoints, type Amal,
} from "@/lib/data/amal";
import {
  getCurrentDhulHijjahDay, getDhulHijjahDateLabel, isTashriqDay,
  isArafahDay, isEidDay, DHUL_HIJJAH_START,
} from "@/lib/utils/dhulHijjah";
import BottomSheet from "@/components/ui/BottomSheet";
import Confetti from "@/components/ui/Confetti";
import { createClient } from "@/lib/supabase/client";
import { syncUserScore } from "@/lib/supabase/scores";

const STORAGE_KEY = "amal_completed";
const TASHRIQ_KEY = "tashriq_count";
const PROFILE_KEY = "user_profile";
const PHOTO_KEY = "profile_photo_base64";

// ── Helpers ──────────────────────────────────────────────────────────────────
function toBn(n: number): string {
  return n.toString().replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
}
function getDayOrdinal(day: number): string {
  const m: Record<number, string> = {
    1:"১ম",2:"২য়",3:"৩য়",4:"৪র্থ",5:"৫ম",6:"৬ষ্ঠ",
    7:"৭ম",8:"৮ম",9:"৯ম",10:"১০ম",11:"১১তম",12:"১২তম",13:"১৩তম",
  };
  return m[day] ?? `${toBn(day)}তম`;
}
function getDayCalDate(dhDay: number): Date {
  const d = new Date(DHUL_HIJJAH_START.getTime());
  d.setDate(d.getDate() + (dhDay - 1));
  return d;
}
const BN_WEEKDAYS = ["রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার","শুক্রবার","শনিবার"];
const BN_MONTHS = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
function formatBnDate(date: Date): string {
  return `${BN_WEEKDAYS[date.getDay()]} · ${toBn(date.getDate())} ${BN_MONTHS[date.getMonth()]} ${toBn(date.getFullYear())}`;
}
function getShortDayLabel(day: number): string {
  const bn=["১","২","৩","৪","৫","৬","৭","৮","৯","১০","১১","১২","১৩"];
  return `${bn[day-1]??toBn(day)} জিলহজ`;
}

// ── Static data ───────────────────────────────────────────────────────────────
const HADITHS = [
  {
    arabic: "مَا مِنْ أَيَّامٍ الْعَمَلُ الصَّالِحُ فِيهَا أَحَبُّ إِلَى اللَّهِ مِنْ هَذِهِ الْأَيَّامِ",
    text: "এই দশ দিনের মতো আল্লাহর কাছে অন্য কোনো দিনে নেক আমল এত প্রিয় নয়।",
    source: "সহিহ বুখারি · ৯৬৯",
  },
  {
    arabic: "صِيَامُ يَوْمِ عَرَفَةَ أَحْتَسِبُ عَلَى اللَّهِ أَنْ يُكَفِّرَ السَّنَةَ الَّتِي قَبْلَهُ وَالَّتِي بَعْدَهُ",
    text: "আরাফার দিনের রোজা বিগত এক বছর ও আগামী এক বছরের গুনাহ মাফ করে দেবে।",
    source: "সহিহ মুসলিম · ১১৬২",
  },
  {
    arabic: "أَكْثِرُوا فِيهِنَّ مِنَ التَّهْلِيلِ وَالتَّكْبِيرِ وَالتَّحْمِيدِ",
    text: "এই দিনগুলোতে বেশি বেশি তাহলিল, তাকবীর ও তাহমীদ পড়ো।",
    source: "মুসনাদে আহমদ · ৫৪৪৬",
  },
];

// Display category groups
const VCAT = [
  { key:"fard",    label:"ফরজ আমল",    icon:"🕌", iconBg:"bg-emerald-100", bar:"#0B3C26", ids: null as string[]|null },
  { key:"dhikr",   label:"যিকর ও দোয়া", icon:"📿", iconBg:"bg-orange-100",  bar:"#F97316", ids:["morning_dhikr","evening_dhikr","istighfar","tasbeeh","tahlil","takbeer_dhikr","durood"] },
  { key:"nafl",    label:"নফল আমল",    icon:"✨", iconBg:"bg-purple-100",  bar:"#A855F7", ids:["fast","arafah_fast","quran_recitation","tahajjud","chasht_namaz"] },
  { key:"social",  label:"সদকা",       icon:"🤝", iconBg:"bg-teal-100",    bar:"#0891B2", ids: null as string[]|null },
];

// ── localStorage helpers ──────────────────────────────────────────────────────
function loadCompleted(): Record<number,string[]> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)??"{}"); } catch { return {}; }
}
function saveCompleted(d: Record<number,string[]>) { localStorage.setItem(STORAGE_KEY,JSON.stringify(d)); }
function loadTashriq(): Record<number,number> {
  try { return JSON.parse(localStorage.getItem(TASHRIQ_KEY)??"{}"); } catch { return {}; }
}
function saveTashriq(d: Record<number,number>) { localStorage.setItem(TASHRIQ_KEY,JSON.stringify(d)); }
function loadGender(): "male"|"female"|null {
  try { return (JSON.parse(localStorage.getItem(PROFILE_KEY)??"{}") as {gender?:string}).gender as "male"|"female" ?? null; } catch { return null; }
}
function loadPhoto(): string { return localStorage.getItem(PHOTO_KEY) ?? ""; }
function computeTotalPoints(all: Record<number,string[]>): number {
  return Object.entries(all).reduce((sum,[day,ids])=>sum+calculatePoints(ids,Number(day)),0);
}

// Convert "HH:MM" 24h string to "H:MM AM/PM"
function to12h(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function GeometricPattern() {
  const lines = Array.from({length:12},(_,i)=>{
    const a=(i*30)*Math.PI/180;
    return {x1:150+140*Math.cos(a),y1:150+140*Math.sin(a),x2:150-140*Math.cos(a),y2:150-140*Math.sin(a)};
  });
  return (
    <svg className="absolute right-0 top-0 h-full w-auto opacity-[0.07] pointer-events-none" viewBox="0 0 300 300" fill="none">
      <circle cx="150" cy="150" r="140" stroke="white" strokeWidth="0.8"/>
      <circle cx="150" cy="150" r="110" stroke="white" strokeWidth="0.8"/>
      <circle cx="150" cy="150" r="80"  stroke="white" strokeWidth="0.8"/>
      <circle cx="150" cy="150" r="50"  stroke="white" strokeWidth="0.8"/>
      <circle cx="150" cy="150" r="20"  stroke="white" strokeWidth="0.8"/>
      {lines.map((l,i)=><line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="white" strokeWidth="0.5"/>)}
    </svg>
  );
}

function RingProgress({pct,size=110}:{pct:number;size?:number}) {
  const r=size*0.38,circ=2*Math.PI*r,offset=circ*(1-Math.min(pct,100)/100),half=size/2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={half} cy={half} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={size*0.07}/>
      <circle cx={half} cy={half} r={r} fill="none" stroke="#A3E4D7" strokeWidth={size*0.07}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${half} ${half})`}
        style={{transition:"stroke-dashoffset 0.8s ease"}}
      />
      <text x={half} y={half-4} textAnchor="middle" fill="white" fontSize={size*0.2} fontWeight="bold" fontFamily="Inter,sans-serif">{pct}%</text>
      <text x={half} y={half+size*0.14} textAnchor="middle" fill="rgba(163,228,215,0.85)" fontSize={size*0.1} fontFamily="Hind Siliguri,sans-serif">সম্পন্ন</text>
    </svg>
  );
}

function TashriqCounter({day}:{day:number}) {
  const [counts,setCounts]=useState<Record<number,number>>({});
  useEffect(()=>{setCounts(loadTashriq());},[]);
  const count=counts[day]??0;
  function increment(){setCounts(p=>{const n={...p,[day]:(p[day]??0)+1};saveTashriq(n);return n;});}
  function reset(){setCounts(p=>{const n={...p,[day]:0};saveTashriq(n);return n;});}
  return (
    <div className="bg-white rounded-2xl border border-[#E6F4EA] p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[#AEB6BF] text-[10px] font-bold uppercase tracking-widest">তাকবীরে তাশরিক</p>
          <p className="text-[#0B3C26] font-semibold text-xs mt-0.5">৯ – ১৩ জিলহজ</p>
        </div>
        <p className="text-[#1C2833] text-xl font-serif leading-none" dir="rtl">الله أكبر</p>
      </div>
      <div className="bg-[#FAFAF9] rounded-xl px-4 py-3 mb-3 flex items-center justify-between">
        <div>
          <p className="text-[#0B3C26] text-3xl font-bold leading-none">{toBn(count)}</p>
          <p className="text-[#AEB6BF] text-[10px] mt-1">আজকের গণনা</p>
        </div>
        <p className="text-[#AEB6BF] text-xs">মোট ২৩ ওয়াক্ত</p>
      </div>
      <div className="flex gap-2">
        <button onClick={reset} className="flex-1 py-2.5 rounded-xl border border-[#E6F4EA] text-[#AEB6BF] text-xs font-medium active:scale-95 transition-transform">− রিসেট</button>
        <button onClick={increment} className="flex-2 py-2.5 rounded-xl bg-[#0B3C26] text-white text-xs font-bold active:scale-95 transition-transform">+ গণনা যোগ করুন</button>
      </div>
    </div>
  );
}

// Suhur / Iftar times widget (days 1-9 only — fasting days)
function SuhurIftarWidget() {
  const [times,setTimes]=useState<{suhur:string;iftar:string}|null>(null);
  useEffect(()=>{
    const today=new Date();
    const dateStr=`${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`;
    fetch(`https://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh&method=1&date=${dateStr}`)
      .then(r=>r.json())
      .then(d=>{
        if(d.code===200) setTimes({suhur:d.data.timings.Fajr,iftar:d.data.timings.Maghrib});
      })
      .catch(()=>{});
  },[]);
  if(!times) return (
    <div className="bg-white rounded-2xl border border-[#E6F4EA] p-4 animate-pulse">
      <div className="h-3 bg-[#F0F4F2] rounded w-28 mb-3"/>
      <div className="flex gap-3">
        <div className="flex-1 h-20 bg-[#F0F4F2] rounded-xl"/>
        <div className="flex-1 h-20 bg-[#F0F4F2] rounded-xl"/>
      </div>
    </div>
  );
  return (
    <div className="bg-white rounded-2xl border border-[#E6F4EA] p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[#AEB6BF] text-[10px] font-bold uppercase tracking-widest">সেহরি ও ইফতার</p>
        <p className="text-[#AEB6BF] text-[10px]">ঢাকা</p>
      </div>
      <div className="flex gap-3">
        <div className="flex-1 bg-[#FAFAF9] rounded-xl p-3 text-center border border-[#E6F4EA]">
          <p className="text-xl mb-1">🌙</p>
          <p className="text-[#1C2833] font-bold text-sm tabular-nums">{to12h(times.suhur)}</p>
          <p className="text-[#AEB6BF] text-[10px] mt-0.5">সেহরির শেষ</p>
        </div>
        <div className="flex-1 bg-[#FAFAF9] rounded-xl p-3 text-center border border-[#E6F4EA]">
          <p className="text-xl mb-1">🌇</p>
          <p className="text-[#1C2833] font-bold text-sm tabular-nums">{to12h(times.iftar)}</p>
          <p className="text-[#AEB6BF] text-[10px] mt-0.5">ইফতারের সময়</p>
        </div>
      </div>
    </div>
  );
}

// Regular amal row (checkbox style)
function AmalRow({amal, checked, onToggle, onDetail, gender}: {
  amal:Amal; checked:boolean; onToggle:()=>void; onDetail:()=>void; gender:"male"|"female"|null;
}) {
  const badge={fard:"ফরজ",sunnah:"নফল",social:"সদকা"};
  const color={fard:"bg-emerald-100 text-[#0B3C26]",sunnah:"bg-purple-100 text-purple-700",social:"bg-teal-100 text-teal-700"};
  const title = gender==="female" && amal.femaleTitle ? amal.femaleTitle : amal.title;
  const isOptional = amal.optional === true;
  return (
    <div className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-200 ${checked?"bg-[#E6F4EA] border-[#A3E4D7]":"bg-white border-[#F0F4F2] active:border-[#A3E4D7]"}`}>
      <button onClick={onToggle} className="shrink-0 w-8 h-8 flex items-center justify-center">
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${checked?"bg-[#0B3C26] border-[#0B3C26]":"border-[#D0D8D4]"}`}>
          {checked&&<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </div>
      </button>
      <button onClick={onDetail} className="flex-1 text-left min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-sm leading-none">{amal.icon}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color[amal.category]}`}>{badge[amal.category]}</span>
          {isOptional&&<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">ঐচ্ছিক</span>}
        </div>
        <p className={`text-sm font-semibold leading-tight ${checked?"text-[#0B3C26]/50 line-through":"text-[#1C2833]"}`}>{title}</p>
        {amal.subtitle&&<p className="text-[11px] text-[#AEB6BF] mt-0.5 leading-tight">{amal.subtitle}</p>}
      </button>
      <div className="shrink-0 flex items-center gap-2">
        <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${checked?"bg-[#0B3C26] text-white":"bg-[#E6F4EA] text-[#0B3C26]"}`}>+{toBn(amal.points)}</span>
        <button onClick={onDetail} className="w-7 h-7 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#AEB6BF]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>
    </div>
  );
}

// Countable dhikr row — done/undone toggle
function DhikrRow({amal, checked, onToggle, onDetail}: {
  amal:Amal; checked:boolean; onToggle:()=>void; onDetail:()=>void;
}) {
  return (
    <div className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-200 ${checked?"bg-[#E6F4EA] border-[#A3E4D7]":"bg-white border-[#F0F4F2] active:border-[#A3E4D7]"}`}>
      <button onClick={onToggle} className="shrink-0 w-8 h-8 flex items-center justify-center">
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${checked?"bg-[#0B3C26] border-[#0B3C26]":"border-[#D0D8D4]"}`}>
          {checked&&<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </div>
      </button>
      <button onClick={onDetail} className="flex-1 text-left min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-sm leading-none">{amal.icon}</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">যিকর</span>
        </div>
        <p className={`text-sm font-semibold leading-tight ${checked?"text-[#0B3C26]/50 line-through":"text-[#1C2833]"}`}>{amal.title}</p>
        {amal.subtitle&&<p className="text-[11px] text-[#AEB6BF] mt-0.5 leading-tight">{amal.subtitle}</p>}
      </button>
      <div className="shrink-0 flex items-center gap-2">
        <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${checked?"bg-[#0B3C26] text-white":"bg-[#E6F4EA] text-[#0B3C26]"}`}>+{toBn(amal.points)}</span>
        <button onClick={onDetail} className="w-7 h-7 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#AEB6BF]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>
    </div>
  );
}

function AmalDetail({amal,onClose}:{amal:Amal;onClose:()=>void}) {
  return (
    <BottomSheet isOpen onClose={onClose}>
      <div className="hidden md:flex justify-end mb-2">
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#1C2833" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>
      <div className="md:hidden flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{amal.icon}</span>
          <h2 className="text-[#0B3C26] font-bold text-lg leading-tight">{amal.title}</h2>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-[#F5F5F5] flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#1C2833" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>
      <div className="hidden md:flex items-center gap-2 mb-4">
        <span className="text-2xl">{amal.icon}</span>
        <h2 className="text-[#0B3C26] font-bold text-xl">{amal.title}</h2>
      </div>
      <div className="mb-4">
        <span className="bg-[#E6F4EA] text-[#0B3C26] text-sm font-bold px-3 py-1 rounded-full">+{toBn(amal.points)} পয়েন্ট</span>
        {amal.countable && (
          <span className="ml-2 bg-orange-100 text-orange-700 text-sm font-bold px-3 py-1 rounded-full">
            লক্ষ্য: {toBn(amal.countTarget??0)} বার
          </span>
        )}
      </div>
      {amal.detail && (
        <div className="mb-5">
          <p className="text-[#AEB6BF] text-[10px] font-bold uppercase tracking-widest mb-2">বিস্তারিত</p>
          <p className="text-[#1C2833] text-sm leading-relaxed">{amal.detail}</p>
        </div>
      )}
      {amal.hadith && (
        <div className="bg-[#0B3C26] rounded-2xl p-4">
          <p className="text-[#A3E4D7] text-[10px] font-bold uppercase tracking-widest mb-3">হাদিস / দলিল</p>
          <p className="text-white/90 text-sm leading-relaxed">{amal.hadith}</p>
        </div>
      )}
    </BottomSheet>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [day,setDay]=useState(1);
  const [allCompleted,setAllCompleted]=useState<Record<number,string[]>>({});
  const [selectedAmal,setSelectedAmal]=useState<Amal|null>(null);
  const [confetti,setConfetti]=useState(false);
  const [celebConfetti,setCelebConfetti]=useState(false);
  const [mounted,setMounted]=useState(false);
  const [filter,setFilter]=useState<"all"|"remaining"|"done">("all");
  const [userName,setUserName]=useState("");
  const [userAvatar,setUserAvatar]=useState<string|null>(null);
  const [userInitial,setUserInitial]=useState("আ");
  const [gender,setGender]=useState<"male"|"female"|null>(null);
  const [userId,setUserId]=useState<string|null>(null);
  const [showDay10Celebration,setShowDay10Celebration]=useState(false);
  const [profileIncomplete,setProfileIncomplete]=useState(false);

  useEffect(()=>{
    setDay(getCurrentDhulHijjahDay()??1);
    setAllCompleted(loadCompleted());
setGender(loadGender());
    setMounted(true);
    createClient().auth.getUser().then(({data})=>{
      const u=data.user; if(!u) return;
      const name=u.user_metadata?.full_name??u.user_metadata?.name??u.email?.split("@")[0]??"";
      setUserId(u.id);
      setUserName(name);
      const localPhoto=loadPhoto();
      const savedGender=loadGender();
      setUserAvatar(localPhoto||(savedGender!=="female"?u.user_metadata?.avatar_url??null:null));
      if(name) setUserInitial(name.charAt(0).toUpperCase());
      // Profile is incomplete if no explicit name or no gender set
      const explicitName=(u.user_metadata?.full_name??u.user_metadata?.name??"").trim();
      setProfileIncomplete(!explicitName||!savedGender);
    });
  },[]);

  // Sync score to Supabase whenever amls are completed
  useEffect(()=>{
    if(!userId||!mounted) return;
    const totalPts=computeTotalPoints(allCompleted);
    const todayPts=calculatePoints(allCompleted[day]??[],day);
    const streakDays=Object.keys(allCompleted).length;
    const initial=userName?userName.charAt(0).toUpperCase():"আ";
    syncUserScore({
      userId,
      displayName:userName||"ব্যবহারকারী",
      avatarInitial:initial,
      totalPoints:totalPts,
      todayPoints:todayPts,
      streakDays,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[allCompleted,userId]);

  const completed=allCompleted[day]??[];
  const dayAmal=getAmalForDay(day);
  const mandatoryAmal=dayAmal.filter(a=>!a.optional);
  const points=calculatePoints(completed,day);
  const mandatoryCompleted=completed.filter(id=>mandatoryAmal.some(a=>a.id===id));
  const pct=mandatoryAmal.length>0?Math.round(mandatoryCompleted.length/mandatoryAmal.length*100):0;
  const streak=Object.keys(allCompleted).length;
  const hadith=HADITHS[day%HADITHS.length];
  const dayDate=getDayCalDate(day);
  const dayOrdinal=getDayOrdinal(day);
  const nextSpecialDay=day===8?9:day===9?10:null;

  const toggle=useCallback((id:string)=>{
    setAllCompleted(prev=>{
      const cur=prev[day]??[];
      const next=cur.includes(id)?cur.filter(x=>x!==id):[...cur,id];
      const updated={...prev,[day]:next};
      saveCompleted(updated);
      if(!cur.includes(id)){
        setConfetti(true);
        setTimeout(()=>setConfetti(false),100);
        const mandatory=getAmalForDay(day).filter(a=>!a.optional);
        if(mandatory.length>0&&next.filter(i=>mandatory.some(a=>a.id===i)).length===mandatory.length){
          setCelebConfetti(true);
          setTimeout(()=>setCelebConfetti(false),100);
          if(day===10) setTimeout(()=>setShowDay10Celebration(true),800);
        }
      }
      return updated;
    });
  },[day]);


  const vcatInfo=VCAT.map(vc=>{
    const items=vc.ids
      ?dayAmal.filter(a=>vc.ids!.includes(a.id))
      :vc.key==="fard"
        ?dayAmal.filter(a=>a.category==="fard")
        :dayAmal.filter(a=>a.category==="social");
    const done=items.filter(a=>completed.includes(a.id)).length;
    const p=items.length>0?Math.round(done/items.length*100):0;
    return {...vc,items,done,p};
  }).filter(vc=>vc.items.length>0);

  const isDay10Complete=day===10&&mandatoryAmal.length>0&&mandatoryCompleted.length>=mandatoryAmal.length;

  const filteredAmal=dayAmal.filter(a=>{
    if(filter==="remaining") return !completed.includes(a.id);
    if(filter==="done") return completed.includes(a.id);
    return true;
  });

  if(!mounted) return <div className="min-h-screen bg-[#FAFAF9]"/>;

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Confetti trigger={confetti} type="normal"/>
      <Confetti trigger={celebConfetti} type="celebration"/>

      {/* ── DAY 10 COMPLETION CELEBRATION ────────────────────────────────── */}
      {showDay10Celebration&&(
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 px-4" onClick={()=>setShowDay10Celebration(false)}>
          <div className="relative bg-[#0B3C26] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl" onClick={e=>e.stopPropagation()}>
            <GeometricPattern/>
            <div className="relative z-10">
              <div className="text-6xl mb-4">🏆</div>
              <p className="text-[#A3E4D7] text-xs font-bold uppercase tracking-widest mb-2">আলহামদুলিল্লাহ!</p>
              <h2 className="text-white text-2xl font-bold mb-3 leading-tight">১০ দিনের চ্যালেঞ্জ সম্পন্ন!</h2>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                এই বরকতময় জিলহজের দিনগুলোতে আপনি আল্লাহর সন্তুষ্টির জন্য প্রচেষ্টা করেছেন।
                আল্লাহ কবুল করুন।
              </p>
              <div className="bg-white/10 rounded-2xl p-4 mb-5">
                <div className="flex justify-center gap-8">
                  <div className="text-center">
                    <p className="text-white font-bold text-2xl">{toBn(Object.values(allCompleted).reduce((s,ids)=>s+ids.length,0))}</p>
                    <p className="text-[#A3E4D7] text-xs mt-0.5">মোট আমল</p>
                  </div>
                  <div className="w-px bg-white/20"/>
                  <div className="text-center">
                    <p className="text-white font-bold text-2xl">{toBn(Object.entries(allCompleted).reduce((s,[d,ids])=>s+calculatePoints(ids,Number(d)),0))}</p>
                    <p className="text-[#A3E4D7] text-xs mt-0.5">মোট পয়েন্ট</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Link href="/profile"
                  className="block w-full py-3 bg-[#A3E4D7] text-[#0B3C26] font-bold rounded-xl text-sm active:scale-95 transition-transform"
                  onClick={()=>setShowDay10Celebration(false)}>
                  ব্যাজ ও অগ্রগতি দেখুন →
                </Link>
                <button onClick={()=>setShowDay10Celebration(false)}
                  className="w-full py-2.5 text-white/60 text-sm">বন্ধ করুন</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── DESKTOP TOP BAR ─────────────────────────────────────────────── */}
      <div className="hidden md:flex items-center gap-4 px-6 py-3 bg-white border-b border-[#E6F4EA] sticky top-0 z-30">
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-[#AEB6BF]">হোম</span>
          <span className="text-[#AEB6BF] text-xs">›</span>
          <span className="text-[#0B3C26] font-semibold">ড্যাশবোর্ড</span>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <Link href="/notifications" className="relative w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F5F5F5] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="#1C2833" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"/>
          </Link>
          <div className="flex items-center gap-2 bg-[#E6F4EA] rounded-xl px-3 py-1.5">
            <span className="w-2 h-2 bg-[#0B3C26] rounded-full"/>
            <span className="text-[#0B3C26] text-xs font-semibold">
              {dayOrdinal} দিন · {toBn(dayDate.getDate())} {BN_MONTHS[dayDate.getMonth()]} {toBn(dayDate.getFullYear())}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* ── MOBILE HEADER ─────────────────────────────────────────────── */}
        <div className="md:hidden px-4 pt-12 pb-4 flex items-end justify-between">
          <div>
            <p className="text-[#AEB6BF] text-xs font-medium">আসসালামু আলাইকুম</p>
            <h1 className="text-[#0B3C26] text-2xl font-bold leading-tight">
              {userName?`${userName} 🌙`:"আজকের আমল 🌙"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/notifications" className="relative w-10 h-10 bg-white rounded-xl border border-[#E6F4EA] flex items-center justify-center shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="#1C2833" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"/>
            </Link>
            <Link href="/profile" className="w-10 h-10 bg-[#0B3C26] rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
              {userAvatar
                ?<Image src={userAvatar} alt="profile" width={40} height={40} className="w-full h-full object-cover"/>
                :<span className="text-white font-bold text-sm">{userInitial}</span>
              }
            </Link>
          </div>
        </div>

        {/* ── DESKTOP GREETING ──────────────────────────────────────────── */}
        <div className="hidden md:block px-6 pt-5 pb-1">
          <h1 className="text-[#1C2833] text-xl font-bold">
            আসসালামু আলাইকুম, {userName?`${userName}${gender==="female"?" আপু":" ভাই"}`:"স্বাগতম"} 🌙
          </h1>
        </div>

        <div className="flex gap-5 px-4 md:px-6 pb-8">

          {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4 pt-4">

            {/* HERO CARD */}
            <div className="relative bg-[#0B3C26] rounded-2xl overflow-hidden">
              <GeometricPattern/>

              {/* Mobile */}
              <div className="md:hidden p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[#A3E4D7] text-xs font-medium mb-1.5">DAY {toBn(day)} · {getShortDayLabel(day)}</p>
                    <h2 className="text-white text-[22px] font-bold leading-tight">আজকের আমল</h2>
                    <p className="text-[#A3E4D7]/70 text-xs mt-1">{formatBnDate(dayDate)}</p>
                  </div>
                  <RingProgress pct={pct} size={90}/>
                </div>
                <div className="flex gap-1 mt-4 mb-3">
                  {Array.from({length:10},(_,i)=>{
                    const d=i+1,c=allCompleted[d]??[],da=getAmalForDay(d);
                    const done=da.length>0&&c.length===da.length;
                    return <button key={d} onClick={()=>setDay(d)} className={`h-1.5 rounded-full transition-all flex-1 ${d===day?"bg-white scale-y-125":done?"bg-[#A3E4D7]":c.length>0?"bg-[#A3E4D7]/50":"bg-white/20"}`}/>;
                  })}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[#A3E4D7] text-xs">{toBn(completed.length)}টি আমল সম্পন্ন · {toBn(dayAmal.length-completed.length)}টি বাকি</p>
                  <p className="text-white font-bold text-xs">+{toBn(points)} pts</p>
                </div>
              </div>

              {/* Desktop */}
              <div className="hidden md:flex items-center gap-8 p-7">
                <RingProgress pct={pct} size={140}/>
                <div className="flex-1 min-w-0">
                  <p className="text-[#A3E4D7] text-[11px] font-bold uppercase tracking-widest mb-2">DAY {toBn(day)} · {getShortDayLabel(day)} ১৪৪৭</p>
                  <h2 className="text-white text-[28px] font-bold leading-tight mb-2">আজকের আমল চ্যালেঞ্জ</h2>
                  <p className="text-[#A3E4D7]/75 text-sm mb-4 leading-relaxed">
                    এই দশ দিনের প্রতি দিন মূল্যবান। {toBn(completed.length)}টি আমল সম্পন্ন · আর {toBn(dayAmal.length-completed.length)}টি বাকি — চলুন আজকের অবশিষ্ট আমল পূর্ণ করি।
                  </p>
                  <div className="flex gap-1.5 mb-4">
                    {Array.from({length:10},(_,i)=>{
                      const d=i+1,c=allCompleted[d]??[],da=getAmalForDay(d);
                      const done=da.length>0&&c.length===da.length;
                      return <button key={d} onClick={()=>setDay(d)} className={`h-1.5 rounded-full transition-all flex-1 ${d===day?"bg-white":done?"bg-[#A3E4D7]":c.length>0?"bg-[#A3E4D7]/50":"bg-white/20"}`}/>;
                    })}
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-white font-bold text-sm">+{toBn(points)} pts</p>
                      <p className="text-[#A3E4D7]/70 text-[10px] mt-0.5">আজ</p>
                    </div>
                    <div className="w-px h-8 bg-white/20"/>
                    <div>
                      <p className="text-white font-bold text-sm">{toBn(streak)} দিন</p>
                      <p className="text-[#A3E4D7]/70 text-[10px] mt-0.5">স্ট্রিক 🔥</p>
                    </div>
                    {nextSpecialDay&&<>
                      <div className="w-px h-8 bg-white/20"/>
                      <div>
                        <p className="text-white font-bold text-sm">আগামীকাল</p>
                        <p className="text-[#A3E4D7]/70 text-[10px] mt-0.5">{nextSpecialDay===9?"আরাফাহ ✨":"ঈদুল আজহা 🎉"}</p>
                      </div>
                    </>}
                  </div>
                </div>
              </div>

              {isArafahDay(day)&&<div className="mx-5 mb-4 bg-amber-500/20 border border-amber-400/30 rounded-xl px-3 py-2 text-xs text-amber-200 font-semibold">⭐ আরাফার দিন — আজকের রোজা দুই বছরের গুনাহ মাফ করে!</div>}
              {isEidDay(day)&&<div className="mx-5 mb-4 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-semibold">🎉 ঈদুল আজহা মুবারক! আজ রোজা রাখা নিষিদ্ধ।</div>}
            </div>

            {/* ── DAY 8 ARAFAH REMINDER ──────────────────────────────────── */}
            {day===8&&(
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl shrink-0">☀️</div>
                <div className="flex-1">
                  <p className="text-amber-800 font-bold text-sm">আগামীকাল আরাফার রোজা!</p>
                  <p className="text-amber-700 text-xs mt-0.5 leading-relaxed">৯ জিলহজ — আরাফার রোজা রাখলে বিগত ও আগামী এক বছরের গুনাহ মাফ হয়। আজ রাতেই নিয়ত করুন।</p>
                </div>
                <Link href="/notifications" className="shrink-0 bg-amber-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl">রিমাইন্ডার</Link>
              </div>
            )}

            {/* ── DAY 9: EID TOMORROW REMINDER ──────────────────────────── */}
            {day===9&&(
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl shrink-0">🎉</div>
                <div className="flex-1">
                  <p className="text-emerald-800 font-bold text-sm">আগামীকাল ঈদুল আজহা!</p>
                  <p className="text-emerald-700 text-xs mt-0.5 leading-relaxed">গোসল করুন, উত্তম পোশাক পরুন, ঈদগাহে যান এবং কুরবানি করুন। আজ রাতেই প্রস্তুতি নিন।</p>
                  <a href="https://www.youtube.com/watch?v=QJoHl4RJADk" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-emerald-700 text-xs font-semibold hover:text-emerald-900 transition-colors">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.38.55A3.02 3.02 0 00.5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 002.12 2.14C4.48 20.5 12 20.5 12 20.5s7.52 0 9.38-.55a3.02 3.02 0 002.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>
                    ঈদের আমল সম্পর্কে ভিডিও দেখুন ↗
                  </a>
                </div>
              </div>
            )}

            {/* ── PROFILE INCOMPLETE NOTICE ──────────────────────────────── */}
            {profileIncomplete&&(
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl shrink-0">👤</div>
                <div className="flex-1">
                  <p className="text-amber-800 font-bold text-sm">প্রোফাইল অসম্পূর্ণ</p>
                  <p className="text-amber-700 text-xs mt-0.5 leading-relaxed">নাম ও লিঙ্গ সেট করুন — আমল তালিকা আপনার জন্য কাস্টমাইজ হবে।</p>
                </div>
                <Link href="/profile" className="shrink-0 bg-amber-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap">সেটআপ করুন</Link>
              </div>
            )}

            {/* ── SUHUR/IFTAR — mobile, fasting days 1-9 ────────────────── */}
            {day<=9&&<div className="md:hidden"><SuhurIftarWidget/></div>}

            {/* QUICK STAT CARDS — mobile only */}
            <div className="md:hidden grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl border border-[#E6F4EA] p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl shrink-0">🔥</div>
                <div>
                  <p className="text-[#AEB6BF] text-[10px]">স্ট্রিক</p>
                  <p className="text-[#1C2833] font-bold text-base">{toBn(streak)} দিন</p>
                </div>
              </div>
              {nextSpecialDay?(
                <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl shrink-0">☀️</div>
                  <div>
                    <p className="text-amber-800 font-bold text-xs leading-tight">{nextSpecialDay===9?"আরাফার রোজা":"ঈদুল আজহা"}</p>
                    <p className="text-amber-600 text-[10px] mt-0.5">আগামীকাল · {toBn(nextSpecialDay)} জিলহজ</p>
                  </div>
                </div>
              ):isTashriqDay(day)?(
                <div className="bg-[#E6F4EA] rounded-2xl border border-[#A3E4D7] p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#A3E4D7] flex items-center justify-center text-xl shrink-0">📣</div>
                  <div>
                    <p className="text-[#0B3C26] font-bold text-xs">তাকবীরে তাশরিক</p>
                    <p className="text-[#0B3C26]/60 text-[10px] mt-0.5">আইয়ামে তাশরীক</p>
                  </div>
                </div>
              ):(
                <div className="bg-white rounded-2xl border border-[#E6F4EA] p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F4EA] flex items-center justify-center text-xl shrink-0">⭐</div>
                  <div>
                    <p className="text-[#AEB6BF] text-[10px]">মোট পয়েন্ট</p>
                    <p className="text-[#1C2833] font-bold text-base">{toBn(points)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* TASHRIQ COUNTER — mobile only */}
            {isTashriqDay(day)&&<div className="md:hidden"><TashriqCounter day={day}/></div>}

            {/* CATEGORY CARDS */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[#1C2833] font-bold text-base">আজকের ক্যাটাগরি</h2>
                <span className="text-[#AEB6BF] text-xs">সব দেখুন</span>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {vcatInfo.map(vc=>{
                  const done100=vc.p===100;
                  return (
                    <div key={vc.key} className="bg-white rounded-2xl border border-[#E6F4EA] p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-11 h-11 ${vc.iconBg} rounded-xl flex items-center justify-center text-xl`}>{vc.icon}</div>
                        <span className={`text-xs font-bold ${done100?"text-[#0B3C26]":"text-[#AEB6BF]"}`}>{done100?"✓":`${toBn(vc.p)}%`}</span>
                      </div>
                      <p className="text-[#1C2833] font-bold text-sm leading-tight mb-1">{vc.label}</p>
                      <p className="text-[#AEB6BF] text-[11px] mb-2.5">{done100?"সম্পন্ন":`${toBn(vc.done)}/${toBn(vc.items.length)} সম্পন্ন`}</p>
                      <div className="h-1.5 bg-[#F0F4F2] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{width:`${vc.p}%`,backgroundColor:vc.bar}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AMAL LIST */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[#1C2833] font-bold text-base">আজকের আমল তালিকা</h2>
                <div className="flex bg-[#F0F4F2] rounded-xl p-0.5">
                  {(["all","remaining","done"] as const).map((v,i)=>(
                    <button key={v} onClick={()=>setFilter(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter===v?"bg-white text-[#0B3C26] shadow-sm":"text-[#AEB6BF]"}`}>
                      {["সব","বাকি","সম্পন্ন"][i]}
                    </button>
                  ))}
                </div>
              </div>

              {filteredAmal.length===0?(
                <div className="bg-white rounded-2xl border border-[#E6F4EA] p-8 text-center">
                  <p className="text-3xl mb-2">{filter==="done"?"📿":"🎉"}</p>
                  <p className="text-[#1C2833] font-semibold text-sm">{filter==="done"?"এখনো কোনো আমল সম্পন্ন হয়নি":"সব আমল সম্পন্ন! আলহামদুলিল্লাহ"}</p>
                </div>
              ):(
                <div className="flex flex-col gap-2">
                  {filteredAmal.map(amal=>(
                    amal.countable
                      ?<DhikrRow key={amal.id} amal={amal}
                          checked={completed.includes(amal.id)}
                          onToggle={()=>toggle(amal.id)}
                          onDetail={()=>setSelectedAmal(amal)}
                        />
                      :<AmalRow key={amal.id} amal={amal}
                          checked={completed.includes(amal.id)}
                          onToggle={()=>toggle(amal.id)}
                          onDetail={()=>setSelectedAmal(amal)}
                          gender={gender}
                        />
                  ))}
                </div>
              )}
            </div>

            {/* HADITH — mobile only */}
            <div className="md:hidden bg-[#0B3C26] rounded-2xl p-5 mb-2">
              <p className="text-[#A3E4D7] text-[10px] font-bold uppercase tracking-widest mb-3">আজকের হাদিস</p>
              <p className="text-white/80 text-sm text-right leading-loose mb-3 font-serif" dir="rtl">{hadith.arabic}</p>
              <div className="h-px bg-white/10 mb-3"/>
              <p className="text-[#A3E4D7] text-sm leading-relaxed italic mb-2">&ldquo;{hadith.text}&rdquo;</p>
              <p className="text-white/40 text-xs">{hadith.source}</p>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR — desktop only ─────────────────────────────── */}
          <div className="hidden md:flex flex-col gap-4 w-72 shrink-0 pt-4">
            <div className="bg-[#0B3C26] rounded-2xl p-5">
              <p className="text-[#A3E4D7] text-[10px] font-bold uppercase tracking-widest mb-3">আজকের হাদিস</p>
              <p className="text-white/80 text-sm text-right leading-loose mb-3 font-serif" dir="rtl">{hadith.arabic}</p>
              <div className="h-px bg-white/10 mb-3"/>
              <p className="text-[#A3E4D7] text-sm leading-relaxed italic mb-2">&ldquo;{hadith.text}&rdquo;</p>
              <p className="text-white/40 text-xs">{hadith.source}</p>
            </div>

            {isTashriqDay(day)&&<TashriqCounter day={day}/>}

            {/* Suhur / Iftar — desktop sidebar, fasting days only */}
            {day<=9&&<SuhurIftarWidget/>}

            {/* Day 9 Eid reminder — desktop sidebar */}
            {day===9&&(
              <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-4">
                <p className="text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-2">আগামীকালের প্রস্তুতি</p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-xl shrink-0">🎉</div>
                  <div>
                    <p className="text-emerald-800 font-bold text-sm">ঈদুল আজহা</p>
                    <p className="text-emerald-600 text-xs mt-0.5">আগামীকাল · ১০ জিলহজ</p>
                  </div>
                </div>
                <a href="https://www.youtube.com/watch?v=QJoHl4RJADk  " target="_blank" rel="noopener noreferrer"
                  className="block w-full py-2.5 bg-emerald-700 text-white text-xs font-bold rounded-xl text-center active:scale-95 transition-transform">
                  ঈদের আমল ভিডিও ↗
                </a>
              </div>
            )}

            {/* My score only — no fake entries */}
            <div className="bg-white rounded-2xl border border-[#E6F4EA] p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#0B3C26] font-bold text-sm">আমার স্কোর</p>
                <Link href="/leaderboard" className="text-[#0B3C26] text-xs font-semibold">লিডারবোর্ড →</Link>
              </div>
              <div className="flex items-center gap-3 bg-[#E6F4EA] rounded-xl px-3 py-2.5">
                <div className="w-9 h-9 rounded-full bg-[#0B3C26] flex items-center justify-center overflow-hidden shrink-0">
                  {userAvatar
                    ?<Image src={userAvatar} alt="me" width={36} height={36} className="w-full h-full object-cover"/>
                    :<span className="text-white text-sm font-bold">{userInitial}</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#0B3C26] text-sm font-bold truncate">{userName||"ব্যবহারকারী"}</p>
                  <p className="text-[#AEB6BF] text-[10px]">{toBn(streak)} দিন স্ট্রিক</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[#0B3C26] font-bold text-base">{toBn(points)}</p>
                  <p className="text-[#AEB6BF] text-[10px]">পয়েন্ট</p>
                </div>
              </div>
            </div>

            {/* Day 8 reminder in sidebar */}
            {day===8&&(
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
                <p className="text-amber-600 text-[10px] font-bold uppercase tracking-widest mb-2">আগামীকালের প্রস্তুতি</p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-xl shrink-0">☀️</div>
                  <div>
                    <p className="text-amber-800 font-bold text-sm">আরাফার রোজা</p>
                    <p className="text-amber-600 text-xs mt-0.5">আগামীকাল · ৯ জিলহজ</p>
                  </div>
                </div>
                <Link href="/notifications" className="block w-full py-2.5 bg-amber-700 text-white text-xs font-bold rounded-xl text-center active:scale-95 transition-transform">
                  রিমাইন্ডার সেট করুন
                </Link>
              </div>
            )}

            {nextSpecialDay&&nextSpecialDay!==9&&(
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
                <p className="text-amber-600 text-[10px] font-bold uppercase tracking-widest mb-3">বিশেষ আমল</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl shrink-0">🎉</div>
                  <div>
                    <p className="text-amber-800 font-bold text-sm">ঈদুল আজহা</p>
                    <p className="text-amber-600 text-xs mt-0.5">আগামীকাল · {toBn(nextSpecialDay)} জিলহজ</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedAmal&&<AmalDetail amal={selectedAmal} onClose={()=>setSelectedAmal(null)}/>}
    </div>
  );
}
