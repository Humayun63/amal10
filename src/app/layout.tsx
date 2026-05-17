import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "জিলহজ আমল চ্যালেঞ্জ | Dhul Hijjah 10-Day Amal Tracker",
  description:
    "জিলহজ মাসের ১০ দিনের আমল ট্র্যাক করুন। গ্যামিফাইড চ্যালেঞ্জে যোগ দিন এবং আইয়ামে তাশরীকের তাকবীর আদায় করুন।",
  keywords: ["জিলহজ", "আমল", "ইসলাম", "তাকবীর", "dhul hijjah", "amal tracker"],
  openGraph: {
    title: "জিলহজ আমল চ্যালেঞ্জ",
    description: "জিলহজ মাসের ১০ দিনের আমল ট্র্যাকার ও গ্যামিফাইড চ্যালেঞ্জ",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B3C26",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${inter.variable} ${hindSiliguri.variable} h-full`}
    >
      <body className="min-h-full bg-[#FAFAF9] text-[#1C2833] antialiased">
        {children}
      </body>
    </html>
  );
}
