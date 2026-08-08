import type { Metadata } from "next";
import LearningRoadmap from "@/components/LearningRoadmap";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import NeuralBackground from "@/components/NeuralBackground";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Veri Bilimi Nedir? | Akdeniz Veri Bilimi Topluluğu",
  description:
    "Veri bilimi nedir, ne işe yarar ve sıfırdan nasıl öğrenilir? Akdeniz Veri Bilimi Topluluğu kapsamlı öğrenme yol haritası.",
  keywords: [
    "Veri Bilimi Nedir",
    "Veri Bilimi Nasıl Öğrenilir",
    "Data Science Yol Haritası",
    "Makine Öğrenmesi Rehberi",
    "Python Veri Analizi",
    "Veri Bilimcisi Nasıl Olunur",
    "MLOps ve Yapay Zeka Öğrenme Yol Haritası",
    "Akdeniz Veri Bilimi Öğrenme Rehberi",
  ],
  openGraph: {
    title: "Veri Bilimi Nedir? | Akdeniz Veri Bilimi Topluluğu",
    description: "Veri bilimi öğrenme yol haritası ve kapsamlı rehber.",
    url: "https://akdenizveribilimi.com/veri-bilimi-nedir",
    images: ["/logo.webp"],
  },
};

export default function VeriBilimiNedirPage() {
  return (
    <>
      <NeuralBackground />

      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        <SiteNav />

        <div className="flex-grow">
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

        <Footer />
      </div>
    </>
  );
}
