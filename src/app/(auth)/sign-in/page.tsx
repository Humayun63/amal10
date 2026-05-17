"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchCommunityStats } from "@/lib/supabase/scores";
import Link from "next/link";

function toBn(n: number): string {
  return n.toString().replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
}

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    fetchCommunityStats().then((s) => setParticipantCount(s.totalParticipants));
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
    // On success, browser will redirect — keep loading=true
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col lg:flex-row">
      {/* ── Left / Top: Brand Panel ── */}
      <div className="relative lg:w-[45%] bg-[#0B3C26] flex flex-col items-center justify-center px-8 pt-16 pb-10 lg:min-h-screen overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full border border-white/10" />
        <div className="absolute top-1/3 right-8 w-3 h-3 rounded-full bg-[#A3E4D7]/40" />
        <div className="absolute bottom-1/4 left-12 w-2 h-2 rounded-full bg-[#A3E4D7]/40" />

        {/* Islamic crescent / moon icon */}
        <div className="relative mb-5 z-10">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M26 16a10 10 0 01-13.5 9.33A10 10 0 1016 6a10 10 0 0110 10z"
                fill="none"
                stroke="#A3E4D7"
                strokeWidth="1.5"
              />
              <circle cx="21" cy="10" r="1.5" fill="#A3E4D7" opacity="0.6" />
            </svg>
          </div>
        </div>

        {/* Greeting */}
        <h1 className="text-white text-3xl lg:text-4xl font-bold text-center z-10 tracking-wide">
          আসসালামু আলাইকুম
        </h1>
        <p className="text-[#A3E4D7] text-sm text-center mt-3 max-w-xs leading-relaxed z-10">
          চ্যালেঞ্জ শুরু করতে অ্যাকাউন্টে প্রবেশ করুন।
          <br />
          আপনার ডেটা শুধু আপনার ডিভাইসেই থাকবে।
        </p>

        {/* Arabic verse */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-5 max-w-xs w-full z-10 border border-white/10">
          <p
            className="text-white text-xl text-center leading-loose"
            dir="rtl"
            style={{ fontFamily: "serif" }}
          >
            وَأَذِّن فِي ٱلنَّاسِ بِٱلْحَجِّ
          </p>
          <p className="text-[#A3E4D7] text-xs text-center mt-2 leading-relaxed">
            &ldquo;মানুষের মধ্যে হজের ঘোষণা দাও।&rdquo;
            <br />— সূরা হজ ২২:২৭
          </p>
        </div>

        {/* Challenge badge */}
        <div className="mt-6 flex items-center gap-2 z-10">
          <div className="flex -space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full bg-white/20 border border-white/30"
              />
            ))}
          </div>
          <span className="text-[#A3E4D7] text-xs">
            {participantCount > 0 ? `${toBn(participantCount)}+ মুসলিম চ্যালেঞ্জে` : "চ্যালেঞ্জে যোগ দিন"}
          </span>
        </div>
      </div>

      {/* ── Right / Bottom: Auth Form ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-10 lg:px-16 xl:px-24 max-w-lg mx-auto w-full lg:max-w-none">
        {sent ? (
          /* ── Magic-link sent state ── */
          <div className="bg-[#E6F4EA] rounded-2xl p-8 text-center border border-[#A3E4D7]">
            <div className="text-4xl mb-4">📧</div>
            <h2 className="text-[#0B3C26] font-bold text-xl mb-2">
              ম্যাজিক লিংক পাঠানো হয়েছে!
            </h2>
            <p className="text-[#1C2833] text-sm leading-relaxed">
              <strong>{email}</strong> এ একটি লগইন লিংক পাঠানো হয়েছে।
              <br />
              ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।
            </p>
            <button
              onClick={() => { setSent(false); setShowEmailForm(true); }}
              className="mt-6 text-[#0B3C26] text-sm underline"
            >
              অন্য ইমেইল ব্যবহার করুন
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-sm mx-auto w-full lg:max-w-md">
            <div className="mb-2 lg:mb-6">
              <h2 className="text-[#0B3C26] text-2xl font-bold">স্বাগতম</h2>
              <p className="text-[#AEB6BF] text-sm mt-1">
                আপনার পছন্দের পদ্ধতিতে প্রবেশ করুন
              </p>
            </div>

            {/* Google button */}
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
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-[#E6F4EA]" />
              <span className="text-[#AEB6BF] text-xs">অথবা</span>
              <div className="flex-1 h-px bg-[#E6F4EA]" />
            </div>

            {/* Email section */}
            {showEmailForm ? (
              <form onSubmit={handleMagicLink} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="আপনার ইমেইল লিখুন"
                  required
                  autoFocus
                  className="w-full bg-white border border-[#E6F4EA] rounded-2xl px-4 py-3.5 text-[#1C2833] text-sm focus:outline-none focus:border-[#0B3C26] focus:ring-2 focus:ring-[#0B3C26]/10 transition-all"
                />
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-[#0B3C26] text-white py-3.5 rounded-2xl font-semibold hover:bg-[#0a3221] active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {loading ? "পাঠানো হচ্ছে..." : "ম্যাজিক লিংক পাঠান →"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="text-[#AEB6BF] text-xs text-center hover:text-[#0B3C26] transition-colors"
                >
                  ← ফিরে যান
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowEmailForm(true)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-[#FAFAF9] border-2 border-[#E6F4EA] rounded-2xl py-3.5 font-semibold text-[#0B3C26] hover:border-[#0B3C26]/30 hover:bg-[#E6F4EA]/40 active:scale-[0.98] transition-all duration-150 disabled:opacity-60"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
                </svg>
                ইমেইল দিয়ে চালিয়ে যান
              </button>
            )}

            

          </div>
        )}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
