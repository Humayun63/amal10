import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center px-6 text-center">
      <Image src="/logo.png" alt="আমল লোগো" width={96} height={98} className="w-24 h-24 object-contain mb-6 drop-shadow-md"/>

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
