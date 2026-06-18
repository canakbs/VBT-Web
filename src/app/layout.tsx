import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Akdeniz Veri Bilimi Topluluğu | Mediterranean Data Science Community",
  description: "Akdeniz Üniversitesi Veri Bilimi Topluluğu - Yapay Zeka, Makine Öğrenmesi, Veri Bilimi ve MLOps Araştırma Topluluğu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-brand-bg text-brand-text selection:bg-brand-cyan/30 selection:text-white">
        <SmoothScroll>
          <div className="flex flex-col min-h-screen relative z-10 scanline">
            {children}
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}

