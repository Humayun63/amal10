"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchCommunityStats } from "@/lib/supabase/scores";
import Link from "next/link";
import Image from "next/image";
import { onPromptReady, triggerInstall, isIOS, isInStandaloneMode } from "@/lib/pwa";

function toBn(n: number): string {
  return n.toString().replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
}

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [authMode, setAuthMode] = useState<"magic" | "password">("magic");
  const [isSignUp, setIsSignUp] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [canInstall, setCanInstall] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    fetchCommunityStats().then((s) => setParticipantCount(s.totalParticipants));
    if (isInStandaloneMode()) return;
    const ios = isIOS();
    setIsIOSDevice(ios);
    if (ios) { setCanInstall(true); return; }
    const unsub = onPromptReady(() => setCanInstall(true));
    return unsub;
  }, []);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  };

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) { setError(error.message); setLoading(false); }
      else setSent(true);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); }
      // On success Supabase auth state change triggers redirect
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col lg:flex-row">

      {/* ── Left / Brand Panel ── */}
      <div className="relative lg:w-[45%] bg-[#0B3C26] flex flex-col items-center justify-center px-8 pt-16 pb-10 lg:min-h-screen overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full border border-white/10" />
        <div className="absolute top-1/3 right-8 w-3 h-3 rounded-full bg-[#A3E4D7]/40" />
        <div className="absolute bottom-1/4 left-12 w-2 h-2 rounded-full bg-[#A3E4D7]/40" />

        <div className="relative mb-5 z-10">
          <Image src="/logo.png" alt="আমল লোগো" width={80} height={82} className="w-20 h-20 object-contain drop-shadow-lg"/>
        </div>

        <h1 className="text-white text-3xl lg:text-4xl font-bold text-center z-10 tracking-wide">
          আসসালামু আলাইকুম
        </h1>
        <p className="text-[#A3E4D7] text-sm text-center mt-3 max-w-xs leading-relaxed z-10">
          চ্যালেঞ্জ শুরু করতে অ্যাকাউন্টে প্রবেশ করুন।
          <br />
          আপনার ডেটা শুধু আপনার ডিভাইসেই থাকবে।
        </p>

        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-5 max-w-xs w-full z-10 border border-white/10">
          <p className="text-white text-xl text-center leading-loose" dir="rtl" style={{ fontFamily: "serif" }}>
            وَأَذِّن فِي ٱلنَّاسِ بِٱلْحَجِّ
          </p>
          <p className="text-[#A3E4D7] text-xs text-center mt-2 leading-relaxed">
            &ldquo;মানুষের মধ্যে হজের ঘোষণা দাও।&rdquo;
            <br />— সূরা হজ ২২:২৭
          </p>
        </div>

        <div className="mt-6 flex items-center gap-2 z-10">
          <div className="flex -space-x-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-7 h-7 rounded-full bg-white/20 border border-white/30"/>
            ))}
          </div>
          <span className="text-[#A3E4D7] text-xs">
            {participantCount > 0 ? `${toBn(participantCount)}+ মুসলিম চ্যালেঞ্জে` : "চ্যালেঞ্জে যোগ দিন"}
          </span>
        </div>

        {canInstall && (
          <div className="mt-5 z-10 w-full max-w-xs">
            <button
              onClick={async () => {
                if (isIOSDevice) { setShowIOSGuide(true); return; }
                await triggerInstall();
              }}
              className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl px-4 py-3 transition-colors active:scale-95"
            >
              <Image src="/logo.png" alt="আমল" width={36} height={37} className="w-9 h-9 object-contain shrink-0"/>
              <div className="flex-1 text-left">
                <p className="text-white font-semibold text-sm">অ্যাপ ইনস্টল করুন</p>
                <p className="text-[#A3E4D7] text-xs mt-0.5">হোম স্ক্রিনে যোগ করুন</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#A3E4D7] shrink-0">
                <path d="M12 3v13M5 13l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}

        {showIOSGuide && (
          <div className="fixed inset-0 z-70 flex items-end justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowIOSGuide(false)}/>
            <div className="relative w-full max-w-sm bg-white rounded-3xl p-5 z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Image src="/logo.png" alt="আমল" width={36} height={37} className="w-9 h-9 object-contain"/>
                  <p className="text-[#0B3C26] font-bold text-base">হোম স্ক্রিনে যোগ করুন</p>
                </div>
                <button onClick={() => setShowIOSGuide(false)} className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#1C2833" strokeWidth="2" strokeLinecap="round"/></svg>
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {([
                  ["১", "⬆️", "নিচে Safari-এর শেয়ার বাটন ট্যাপ করুন"],
                  ["২", "➕", '"Add to Home Screen" বেছে নিন'],
                  ["৩", "✅", '"Add" বাটন ট্যাপ করুন — ব্যস!'],
                ] as const).map(([step, icon, text]) => (
                  <div key={step} className="flex items-center gap-3 bg-[#FAFAF9] rounded-xl px-4 py-3 border border-[#E6F4EA]">
                    <span className="w-7 h-7 rounded-full bg-[#0B3C26] text-white text-xs font-bold flex items-center justify-center shrink-0">{step}</span>
                    <span className="text-lg shrink-0">{icon}</span>
                    <p className="text-[#1C2833] text-sm">{text}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowIOSGuide(false)} className="w-full mt-4 py-3 bg-[#0B3C26] text-white font-bold rounded-xl text-sm active:scale-95 transition-transform">
                বুঝেছি ✓
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Right / Auth Form ── */}
      <main className="flex-1 flex flex-col justify-center px-6 py-10 lg:px-16 xl:px-24">
        {sent ? (
          <div className="bg-[#E6F4EA] rounded-2xl p-8 text-center border border-[#A3E4D7] max-w-sm mx-auto w-full lg:max-w-md">
            <div className="text-4xl mb-4">📧</div>
            <h2 className="text-[#0B3C26] font-bold text-xl mb-2">
              {isSignUp ? "ভেরিফিকেশন ইমেইল পাঠানো হয়েছে!" : "ম্যাজিক লিংক পাঠানো হয়েছে!"}
            </h2>
            <p className="text-[#1C2833] text-sm leading-relaxed">
              <strong>{email}</strong> এ একটি {isSignUp ? "কনফার্মেশন" : "লগইন"} লিংক পাঠানো হয়েছে।
              <br />
              ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।
            </p>
            <button
              onClick={() => { setSent(false); setEmail(""); setPassword(""); }}
              className="mt-6 text-[#0B3C26] text-sm underline"
            >
              অন্য ইমেইল ব্যবহার করুন
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-sm mx-auto w-full lg:max-w-md">
            <div className="mb-2 lg:mb-4">
              <h2 className="text-[#0B3C26] text-2xl font-bold">স্বাগতম</h2>
              <p className="text-[#6B7280] text-sm mt-1">আপনার পছন্দের পদ্ধতিতে প্রবেশ করুন</p>
            </div>

            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-[#E6F4EA] rounded-2xl py-3.5 font-semibold text-[#1C2833] shadow-sm hover:shadow-md hover:border-[#A3E4D7] active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-[#0B3C26]/30 border-t-[#0B3C26] rounded-full animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              <span>Google দিয়ে চালিয়ে যান</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#E6F4EA]" />
              <span className="text-[#9CA3AF] text-xs">অথবা ইমেইল দিয়ে</span>
              <div className="flex-1 h-px bg-[#E6F4EA]" />
            </div>

            {/* Auth mode tabs — always visible */}
            <div className="flex bg-[#F0F4F2] rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => { setAuthMode("magic"); setError(""); setPassword(""); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${authMode === "magic" ? "bg-white text-[#0B3C26] shadow-sm" : "text-[#9CA3AF] hover:text-[#6B7280]"}`}
              >
                ✉️ ম্যাজিক লিংক
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode("password"); setError(""); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${authMode === "password" ? "bg-white text-[#0B3C26] shadow-sm" : "text-[#9CA3AF] hover:text-[#6B7280]"}`}
              >
                🔒 পাসওয়ার্ড
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={authMode === "magic" ? handleMagicLink : handlePasswordAuth}
              className="flex flex-col gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="আপনার ইমেইল লিখুন"
                required
                className="w-full bg-white border border-[#E6F4EA] rounded-2xl px-4 py-3.5 text-[#1C2833] text-sm focus:outline-none focus:border-[#0B3C26] focus:ring-2 focus:ring-[#0B3C26]/10 transition-all"
              />

              {authMode === "password" && (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignUp ? "পাসওয়ার্ড দিন (কমপক্ষে ৬ অক্ষর)" : "পাসওয়ার্ড দিন"}
                  required
                  minLength={6}
                  className="w-full bg-white border border-[#E6F4EA] rounded-2xl px-4 py-3.5 text-[#1C2833] text-sm focus:outline-none focus:border-[#0B3C26] focus:ring-2 focus:ring-[#0B3C26]/10 transition-all"
                />
              )}

              {error && (
                <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !email || (authMode === "password" && !password)}
                className="w-full bg-[#0B3C26] text-white py-3.5 rounded-2xl font-semibold hover:bg-[#0a3221] active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {loading
                  ? "অনুগ্রহ করে অপেক্ষা করুন..."
                  : authMode === "magic"
                  ? "ম্যাজিক লিংক পাঠান →"
                  : isSignUp
                  ? "অ্যাকাউন্ট তৈরি করুন →"
                  : "লগইন করুন →"}
              </button>

              {authMode === "password" && (
                <button
                  type="button"
                  onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
                  className="text-[#0B3C26] text-sm text-center font-medium hover:underline transition-colors"
                >
                  {isSignUp
                    ? "আগে থেকে অ্যাকাউন্ট আছে? লগইন করুন"
                    : "নতুন? অ্যাকাউন্ট তৈরি করুন"}
                </button>
              )}

              {authMode === "magic" && (
                <p className="text-[#9CA3AF] text-xs text-center">
                  ইমেইলে একটি লিংক পাঠানো হবে — পাসওয়ার্ড লাগবে না।
                </p>
              )}
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
