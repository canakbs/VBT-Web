'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, ExternalLink, Send, CheckCircle2 } from 'lucide-react';

export default function MaintenanceOverlay({ children }: { children: React.ReactNode }) {
  const [isMaintenance, setIsMaintenance] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const isDev = process.env.NODE_ENV === 'development';
    
    // In local development or if secret preview param / localStorage is set, allow full site access
    if (isDev || params.get('preview') === 'true' || localStorage.getItem('vbt_preview') === 'true') {
      if (params.get('preview') === 'true') {
        localStorage.setItem('vbt_preview', 'true');
      }
      setIsMaintenance(false);
    } else {
      setIsMaintenance(true);
    }
  }, []);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userEmail) {
      setIsSubmitted(true);
    }
  };

  if (!mounted) return <>{children}</>;

  if (!isMaintenance) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen w-full bg-[#090d16] text-[#e2e8f0] flex flex-col justify-between relative overflow-hidden font-sans selection:bg-brand-cyan/30 selection:text-white">
      {/* Ambient Radial Background Spotlights */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(at 15% 20%, rgba(0, 242, 254, 0.15) 0px, transparent 50%),
            radial-gradient(at 85% 80%, rgba(0, 245, 160, 0.12) 0px, transparent 50%),
            radial-gradient(at 50% 50%, rgba(59, 130, 246, 0.1) 0px, transparent 50%)
          `
        }}
      />
      <div className="absolute inset-0 scientific-grid opacity-15 pointer-events-none" />

      {/* Top Header Logo Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.svg" 
            alt="Akdeniz Veri Bilimi Topluluğu" 
            className="w-10 h-10 rounded-full object-contain border border-brand-cyan/40 p-1 bg-slate-950 shadow-lg shadow-brand-cyan/10"
          />
          <span className="text-sm sm:text-base font-bold text-white tracking-wide font-mono">
            AKDENİZ VERİ BİLİMİ
          </span>
        </div>

        <span className="inline-flex items-center gap-2 px-3 py-1 bg-brand-emerald/10 border border-brand-emerald/30 rounded-full text-xs font-mono text-brand-emerald font-medium">
          <div className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
          Yenileniyoruz
        </span>
      </header>

      {/* Main Content Hero Card */}
      <main className="relative z-20 max-w-3xl mx-auto px-6 py-12 text-center flex flex-col items-center my-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-cyan/10 border border-brand-cyan/30 rounded-full mb-8">
          <Sparkles size={14} className="text-brand-cyan animate-pulse" />
          <span className="text-xs font-mono text-brand-cyan font-semibold uppercase tracking-wider">
            SİTEMİZ YAPIM AŞAMASINDADIR
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.15]">
          Geleceği veriyle şekillendirmek için <br />
          <span className="bg-gradient-to-r from-brand-cyan via-blue-400 to-brand-emerald bg-clip-text text-transparent">
            pek yakında yayındayız!
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 mb-10 leading-relaxed max-w-xl">
          Akdeniz Veri Bilimi Topluluğu web platformumuz, daha güçlü bir altyapı, yeni eğitim materyalleri ve interaktif projelerimizle çok yakında sizlerle buluşacak.
        </p>

        {/* Email Notification Card */}
        <div className="w-full max-w-md bg-[#111624]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl shadow-black/50 mb-10 relative overflow-hidden">
          {isSubmitted ? (
            <div className="py-4 flex flex-col items-center gap-2 text-brand-emerald font-mono text-sm">
              <CheckCircle2 size={32} />
              <span className="font-bold">Bildirim Talebiniz Alındı!</span>
              <span className="text-xs text-slate-400">Yayınlandığında e-posta ile haber vereceğiz.</span>
            </div>
          ) : (
            <form onSubmit={handleNotifySubmit} className="flex flex-col gap-3">
              <span className="text-xs font-mono text-slate-300 font-medium text-left">
                📢 Açılıştan ilk siz haberdar olun:
              </span>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="E-posta adresiniz..."
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="flex-grow px-4 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-cyan"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-cyan text-slate-950 font-bold rounded-xl text-xs hover:bg-brand-cyan/90 transition-all shadow-md shadow-brand-cyan/20 flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Haber Ver</span>
                  <Send size={12} />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Social Link */}
        <div className="flex items-center justify-center text-xs font-mono text-slate-300">
          <a
            href="https://linktr.ee/akdenizveribilimi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl hover:border-brand-cyan/40 hover:text-white transition-all backdrop-blur-md"
          >
            <span>Linktree / Sosyal Medya</span>
            <ExternalLink size={13} className="text-brand-cyan" />
          </a>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-white/5 flex justify-center items-center text-[11px] font-mono text-slate-500 relative z-20">
        <span>© 2026 Akdeniz Veri Bilimi Topluluğu</span>
      </footer>
    </div>
  );
}
