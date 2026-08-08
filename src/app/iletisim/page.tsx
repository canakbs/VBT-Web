import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import NeuralBackground from "@/components/NeuralBackground";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "İletişim & İş Birliği | Akdeniz Veri Bilimi Topluluğu",
  description:
    "Akdeniz Veri Bilimi Topluluğu ile iletişime geçin — soru, öneri, konuşmacı daveti ve sponsorluk iş birlikleri.",
  keywords: [
    "Akdeniz Veri Bilimi İletişim",
    "Yapay Zeka Sponsorluk",
    "Teknoloji Topluluğu İletişim",
    "Antalya Yazılım Etkinlik İletişim",
    "Akdeniz Üniversitesi Topluluk İletişim",
  ],
  openGraph: {
    title: "İletişim & İş Birliği | Akdeniz Veri Bilimi Topluluğu",
    description: "Soru, öneri, konuşmacı ve sponsorluk iş birlikleri için bize ulaşın.",
    url: "https://akdenizveribilimi.com/iletisim",
    images: ["/logo.webp"],
  },
};

export default function ContactPage() {
  return (
    <>
      <NeuralBackground />

      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        <SiteNav />

        <div className="pt-24 pb-12 flex-grow">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-brand-muted hover:text-white transition-colors px-3 py-1.5 bg-brand-card/50 border border-brand-border rounded-lg"
            >
              <ArrowLeft size={14} />
              <span>Ana Sayfaya Dön</span>
            </Link>
            <span className="font-mono text-xs text-brand-cyan uppercase">
              İLETİŞİM &amp; İŞ BİRLİĞİ
            </span>
          </div>

          <ContactSection />
        </div>

        <Footer />
      </div>
    </>
  );
}
