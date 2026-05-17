"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

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
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col">
      {/* Header */}
      <div className="bg-[#0B3C26] px-6 pt-14 pb-10 text-center">
        <div className="text-4xl mb-3">🕌</div>
        <h1 className="text-white text-[26px] font-bold">চ্যালেঞ্জে যোগ দিন</h1>
        <p className="text-[#A3E4D7] text-sm mt-2">
          আপনার নিয়ত করুন এবং শুরু করুন
        </p>
      </div>

      <div className="flex-1 px-6 py-8 max-w-lg mx-auto w-full">
        {sent ? (
          <div className="bg-[#E6F4EA] rounded-2xl p-8 text-center border border-[#A3E4D7]">
            <div className="text-4xl mb-4">📧</div>
            <h2 className="text-[#0B3C26] font-bold text-xl mb-2">ম্যাজিক লিংক পাঠানো হয়েছে!</h2>
            <p className="text-[#1C2833] text-sm leading-relaxed">
              <strong>{email}</strong> এ একটি লগইন লিংক পাঠানো হয়েছে। ইমেইল চেক করুন।
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-6 text-[#0B3C26] text-sm underline"
            >
              অন্য ইমেইল ব্যবহার করুন
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Niyyah box */}
            <div className="bg-[#E6F4EA] rounded-2xl p-5 border border-[#A3E4D7]">
              <p className="text-[#0B3C26] text-sm leading-relaxed text-center">
                <span className="font-semibold">নিয়ত:</span> আমি আল্লাহর সন্তুষ্টির জন্য জিলহজের এই মুবারক দিনগুলোতে আমল করার সংকল্প করছি।
              </p>
            </div>

            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-[#E6F4EA] rounded-xl py-4 font-medium text-[#1C2833] active:scale-95 transition-transform shadow-sm disabled:opacity-60"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google দিয়ে লগইন করুন
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#E6F4EA]" />
              <span className="text-[#AEB6BF] text-xs">অথবা</span>
              <div className="flex-1 h-px bg-[#E6F4EA]" />
            </div>

            {/* Magic link */}
            <form onSubmit={handleMagicLink} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="আপনার ইমেইল লিখুন"
                required
                className="w-full bg-white border border-[#E6F4EA] rounded-xl px-4 py-4 text-[#1C2833] text-sm focus:outline-none focus:border-[#0B3C26] transition-colors"
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-[#0B3C26] text-white py-4 rounded-xl font-semibold active:scale-95 transition-transform disabled:opacity-60"
              >
                {loading ? "পাঠানো হচ্ছে..." : "ম্যাজিক লিংক পাঠান →"}
              </button>
            </form>

            <Link
              href="/"
              className="text-center text-[#AEB6BF] text-xs underline"
            >
              ফিরে যান
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
