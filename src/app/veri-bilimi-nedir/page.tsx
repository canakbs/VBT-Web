import LearningRoadmap from "@/components/LearningRoadmap";
import NeuralBackground from "@/components/NeuralBackground";
import SiteNav from "@/components/SiteNav";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Veri Bilimi Nedir? | Akdeniz Veri Bilimi Topluluğu",
  description: "Veri bilimi nedir, ne işe yarar ve nasıl öğrenilir? Akdeniz Veri Bilimi Topluluğu öğrenme yol haritası.",
};

export default function VeriBilimiNedirPage() {
  return (
    <>
      <NeuralBackground />

      <div className="relative z-10">
        <SiteNav />

        {/* Introduction Section: What is Data Science? */}
        <section className="pt-28 pb-16 md:pt-36 md:pb-20 border-b border-brand-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-brand-muted hover:text-white transition-colors mb-8 px-3 py-1.5 bg-brand-card/50 border border-brand-border rounded-lg"
            >
              <ArrowLeft size={14} />
              <span>Ana Sayfaya Dön</span>
            </Link>

            <span className="font-mono text-xs text-brand-cyan uppercase tracking-widest block mb-3">
              [ BİLGİ KILAVUZU ]
            </span>

            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-8 leading-tight">
              Veri Bilimi Nedir? <br />
              <span className="bg-gradient-to-r from-brand-cyan via-blue-400 to-brand-emerald bg-clip-text text-transparent">
                Disiplinlerarası Bir Keşif Yolculuğu
              </span>
            </h1>

            <div className="space-y-6 text-slate-300 text-base md:text-lg leading-relaxed bg-brand-card/30 p-6 md:p-8 border border-brand-border rounded-2xl backdrop-blur-md">
              <p>
                <strong className="text-white">Veri Bilimi</strong>; matematik, istatistik, yazılım mühendisliği ve alan bilgisini bir araya getirerek karmaşık ve büyük verilerden anlamlı içgörüler, tahmin modelleri ve çözümler elde eden disiplinlerarası bir alandır.
              </p>
              <p>
                Günlük hayatta kullandığımız sesli asistanlar, sağlık sektöründe hastalık teşhisi koyan yapay zekâ algoritmaları, otonom araçlar ve e-ticaret öneri sistemleri tamamen veri biliminin sunduğu matematiksel modeller ve makine öğrenmesi yaklaşımları sayesinde çalışmaktadır.
              </p>
              <p>
                Veri bilimi öğrenmeye başlamak için üst düzey matematik profesörü olmanız gerekmez. Merak, düzenli çalışma ve temel programlama mantığı harika bir başlangıç için yeterlidir.
              </p>
              <p className="text-sm font-mono text-brand-cyan pt-2 border-t border-brand-border/40">
                Aşağıdaki etkileşimli yol haritamızı inceleyerek Python temellerinden MLOps dağıtım süreçlerine kadar adım adım nasıl ilerleyebileceğinizi keşfedebilirsiniz.
              </p>
            </div>
          </div>
        </section>

        {/* Embedded Interactive Learning Roadmap */}
        <LearningRoadmap />
      </div>

      <footer className="bg-[#090d16] border-t border-brand-border py-10 px-4 sm:px-6 relative z-10 font-mono text-xs text-brand-muted">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span>© 2025 Akdeniz Veri Bilimi Topluluğu</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <a href="/#join-us" className="hover:text-brand-cyan transition-colors font-bold">Bize Katıl</a>
          </div>
        </div>
      </footer>
    </>
  );
}
