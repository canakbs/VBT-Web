import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollToTop from "@/components/ScrollToTop";
import MaintenanceOverlay from "@/components/MaintenanceOverlay";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://akdenizveribilimi.com"),
  title: {
    default: "Akdeniz Veri Bilimi Topluluğu | Antalya Yapay Zekâ & Veri Bilimi",
    template: "%s | Akdeniz Veri Bilimi Topluluğu",
  },
  description:
    "Veri bilimi, yapay zekâ, makine öğrenmesi ve yazılım etrafında; birlikte üreten, birlikte öğrenen ve bilgisini topluma aktaran bağımsız öğrenci topluluğu.",
  keywords: [
    "Akdeniz Veri Bilimi Topluluğu",
    "Akdeniz Üniversitesi Veri Bilimi",
    "Akdeniz Veri Bilimi",
    "akdenizveribilimi",
    "Data Science Antalya",
    "Antalya Yapay Zeka",
    "Yapay Zeka Topluluğu",
    "Makine Öğrenmesi",
    "Derin Öğrenme",
    "Python Antalya",
    "AI Workshops",
    "Data Talk",
    "Veri Analizi",
    "Akdeniz Üniversitesi Öğrenci Toplulukları",
    "Veri Bilimi Eğitimi",
    "Açık Kaynak Veri Bilimi Projeleri",
    "LLM ve RAG Uygulamaları",
    "Antalya Teknoloji Etkinlikleri",
    "Veri Mühendisliği",
  ],
  authors: [{ name: "Akdeniz Veri Bilimi Topluluğu", url: "https://akdenizveribilimi.com" }],
  creator: "Akdeniz Veri Bilimi Topluluğu",
  publisher: "Akdeniz Veri Bilimi Topluluğu",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://akdenizveribilimi.com",
  },
  openGraph: {
    title: "Akdeniz Veri Bilimi Topluluğu",
    description:
      "Veri bilimi ve yapay zekâ etrafında; birlikte üreten, birlikte öğrenen ve bilgisini topluma aktaran bilim & teknoloji topluluğu.",
    url: "https://akdenizveribilimi.com",
    siteName: "Akdeniz Veri Bilimi Topluluğu",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/logo.webp",
        width: 1200,
        height: 630,
        alt: "Akdeniz Veri Bilimi Topluluğu Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Akdeniz Veri Bilimi Topluluğu",
    description:
      "Veri bilimi etrafında; birlikte üreten, birlikte öğrenen ve bilgisini topluma aktaran topluluk.",
    images: ["/logo.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon.png?v=4", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico?v=4", sizes: "any" },
    ],
    shortcut: "/favicon.ico?v=4",
    apple: "/favicon.png?v=4",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Akdeniz Veri Bilimi Topluluğu",
  alternateName: ["AVBT", "Akdeniz Data Science Community"],
  url: "https://akdenizveribilimi.com",
  logo: "https://akdenizveribilimi.com/logo.webp",
  description:
    "Veri bilimi, yapay zekâ ve makine öğrenmesi alanlarında çalışmalar yürüten Akdeniz Üniversitesi bünyesindeki teknoloji ve araştırma topluluğu.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Antalya",
    addressCountry: "TR",
  },
  sameAs: [
    "https://github.com/akdenizveribilimi",
    "https://linkedin.com/company/akdeniz-veri-bilimi-toplulugu",
    "https://instagram.com/akdenizveribilimi",
  ],
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
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body 
        className="min-h-full flex flex-col bg-brand-bg text-[#e2e8f0] selection:bg-brand-cyan/30 selection:text-white font-sans"
        suppressHydrationWarning
      >
        <MaintenanceOverlay>
          <SmoothScroll>
            <div className="flex flex-col min-h-screen relative z-10 scanline">
              {children}
            </div>
            <ScrollToTop />
          </SmoothScroll>
        </MaintenanceOverlay>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
