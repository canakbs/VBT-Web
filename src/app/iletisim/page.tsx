import ContactSection from "@/components/ContactSection";
import NeuralBackground from "@/components/NeuralBackground";
import SiteNav from "@/components/SiteNav";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim & İş Birliği | Akdeniz Veri Bilimi Topluluğu",
  description: "Akdeniz Veri Bilimi Topluluğu ile iletişime geçin — soru, öneri, konuşmacı ve sponsorluk iş birlikleri.",
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

        <footer className="bg-[#090d16] border-t border-brand-border py-8 px-6 text-center font-mono text-xs text-brand-muted">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <span>© 2026 Akdeniz Veri Bilimi Topluluğu</span>
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
