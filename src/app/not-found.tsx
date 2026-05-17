import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center px-6 text-center">
      {/* Moon icon */}
      <div className="w-20 h-20 rounded-full bg-[#0B3C26] flex items-center justify-center mb-6">
        <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
          <path
            d="M26 16a10 10 0 01-13.5 9.33A10 10 0 1016 6a10 10 0 0110 10z"
            fill="none"
            stroke="#A3E4D7"
            strokeWidth="1.5"
          />
          <circle cx="21" cy="10" r="1.5" fill="#A3E4D7" opacity="0.6" />
        </svg>
      </div>

      {/* Arabic */}
      <p className="text-[#0B3C26] text-2xl font-serif mb-2" dir="rtl">
        إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ
      </p>

      {/* 404 */}
      <p className="text-[#AEB6BF] text-8xl font-bold tracking-tight leading-none mt-2 mb-4">
        ৪০৪
      </p>

      <h1 className="text-[#0B3C26] text-xl font-bold mb-2">পেজটি পাওয়া যায়নি</h1>
      <p className="text-[#AEB6BF] text-sm leading-relaxed max-w-xs mb-8">
        আপনি যে পেজটি খুঁজছেন তা সরানো হয়েছে বা আর বিদ্যমান নেই।
      </p>

      <Link
        href="/"
        className="bg-[#0B3C26] text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:bg-[#0a3221] active:scale-95 transition-all"
      >
        ← হোমে ফিরে যান
      </Link>
    </div>
  );
}
