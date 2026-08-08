import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import Footer from '@/components/Footer';
import { Home, Compass, AlertTriangle, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 - Sayfa Bulunamadı | Akdeniz Veri Bilimi Topluluğu',
  description: 'Aradığınız sayfa bulunamadı veya taşınmış olabilir.',
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-brand-bg text-slate-100 relative overflow-hidden selection:bg-brand-cyan/30 selection:text-white">
      {/* Background Neural Grid Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-cyan/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <SiteNav />

      <main className="relative z-10 flex-grow flex items-center justify-center px-4 sm:px-6 pt-32 pb-20">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono tracking-wide">
            <AlertTriangle size={14} />
            <span>HATA KODU: 404_PAGE_NOT_FOUND</span>
          </div>

          {/* Glitch 404 Headline */}
          <div className="space-y-3">
            <h1 className="text-7xl sm:text-9xl font-extrabold tracking-tighter font-mono text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-white to-brand-emerald">
              404
            </h1>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Aradığınız Veri Noktası Bulunamadı
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Ulaşmaya çalıştığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak erişilemez durumda olabilir.
            </p>
          </div>

          {/* Code snippet decoration */}
          <div className="max-w-md mx-auto p-4 bg-[#090d16]/90 border border-brand-border/80 rounded-xl text-left font-mono text-xs text-slate-300 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-1.5 border-b border-brand-border/40 pb-2 mb-2 text-slate-500 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
              <span className="ml-2">system_trace.log</span>
            </div>
            <p className="text-red-400">&gt; Status: 404 Not Found</p>
            <p className="text-slate-400">&gt; Target_URL: {`"${typeof window !== 'undefined' ? window.location.pathname : 'invalid_path'}"`}</p>
            <p className="text-brand-cyan">&gt; Recommendation: Return to main entrypoint or explore archives.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-cyan text-[#090d16] font-bold text-sm hover:bg-brand-cyan/90 transition-all shadow-lg shadow-brand-cyan/20 hover:scale-105 active:scale-95"
            >
              <Home size={16} />
              <span>Ana Sayfaya Dön</span>
            </Link>

            <Link
              href="/etkinlikler"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-card text-white border border-brand-border font-semibold text-sm hover:border-brand-cyan/40 hover:bg-brand-card/80 transition-all hover:scale-105 active:scale-95"
            >
              <Compass size={16} />
              <span>Etkinlik Arşivi</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
