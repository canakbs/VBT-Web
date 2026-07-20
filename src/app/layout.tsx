import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollToTop from "@/components/ScrollToTop";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Akdeniz Veri Bilimi Topluluğu | Mediterranean Data Science Community",
  description: "Akdeniz Üniversitesi Veri Bilimi Topluluğu - Yapay Zeka, Makine Öğrenmesi, Veri Bilimi ve MLOps Araştırma Topluluğu.",
  icons: {
    icon: [
      { url: "/favicon.png?v=4", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico?v=4", sizes: "any" },
    ],
    shortcut: "/favicon.ico?v=4",
    apple: "/favicon.png?v=4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className="h-full antialiased dark"
    >
      <body className="min-h-full flex flex-col bg-brand-bg text-[#e2e8f0] selection:bg-brand-cyan/30 selection:text-white font-sans">
        <SmoothScroll>
          <div className="flex flex-col min-h-screen relative z-10 scanline">
            {children}
          </div>
          <ScrollToTop />
        </SmoothScroll>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
