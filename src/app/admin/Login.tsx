'use client';

import React, { useState } from 'react';
import { ArrowLeft, Lock, ShieldAlert, Cpu, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { authenticate } from './actions';

export default function Login() {
  const [passwordInput, setPasswordInput] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptProgress, setDecryptProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isChecking || isDecrypting) return;
    setIsChecking(true);
    setErrorMsg('');

    try {
      const res = await authenticate(passwordInput);
      if (res.success) {
        setIsDecrypting(true);
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setDecryptProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              window.location.reload();
            }, 300);
          }
        }, 100);
      } else {
        setErrorMsg(res.error || 'GEÇERSİZ PAROLA');
        setIsChecking(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('SİSTEM HATASI: KİMLİK DOĞRULAMA BAŞARISIZ');
      setIsChecking(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Grids */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />
      
      {/* Glare effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-emerald/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="max-w-md w-[#400px] relative z-10">
        <div className="mb-6 flex justify-between items-center font-mono text-xs">
          <Link 
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-brand-border hover:border-slate-600 rounded text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={12} />
            <span>Ana Sayfaya Dön</span>
          </Link>
          <span className="text-slate-500 uppercase tracking-widest text-[9px]">// AVBT_YÖNETİCİ_GİRİŞİ</span>
        </div>

        <AnimatePresence>
          <motion.div
            key="auth-card"
            initial={{ opacity: 0, y: 20 }}
            animate={errorMsg ? { opacity: 1, y: 0, x: [-8, 8, -8, 8, 0] } : { opacity: 1, y: 0 }}
            transition={errorMsg ? { type: "spring", stiffness: 300, damping: 15 } : { duration: 0.5 }}
            className="bg-brand-card border border-brand-border rounded-xl p-8 relative overflow-hidden shadow-2xl backdrop-blur-md"
          >
            <div className="flex flex-col items-center text-center mb-8">
              <div className="p-3 bg-slate-900 border border-brand-border rounded-full mb-4 text-brand-cyan">
                {isDecrypting ? (
                  <RefreshCw className="w-8 h-8 animate-spin" />
                ) : (
                  <Lock className="w-8 h-8" />
                )}
              </div>
              <h2 className="text-white font-bold tracking-tight text-xl font-mono">
                Yönetici Paneli Girişi
              </h2>
              <p className="text-brand-muted text-xs font-mono mt-1 tracking-wider">
                Akdeniz Veri Bilimi Topluluğu
              </p>
            </div>

            <div className="bg-slate-950 border border-brand-border/60 rounded-lg p-4 mb-6 font-mono text-[10px] text-slate-400 space-y-1.5">
              <div className="flex justify-between">
                <span>[GİRİŞ DURUMU]</span>
                <span className="text-amber-400 font-bold">KİLİTLİ</span>
              </div>
              <div className="flex justify-between">
                <span>[VARSAYILAN PAROLA]</span>
                <span className="text-brand-cyan font-bold">avbt2026</span>
              </div>
              {errorMsg ? (
                <div className="text-red-400 mt-2 border-t border-red-950 pt-2 flex items-center gap-1.5 animate-pulse font-bold">
                  <ShieldAlert size={12} />
                  <span>{errorMsg}</span>
                </div>
              ) : isDecrypting ? (
                <div className="text-brand-emerald mt-2 border-t border-emerald-950 pt-2 font-bold">
                  OTURUM AÇILIYOR... %{decryptProgress}
                </div>
              ) : (
                <div className="text-brand-muted mt-2 border-t border-slate-900 pt-2">
                  Lütfen yönetici parolanızı girin.
                </div>
              )}
            </div>

            {isDecrypting ? (
              <div className="space-y-4">
                <div className="w-full bg-slate-900 border border-brand-border h-3 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="bg-gradient-to-r from-brand-cyan to-brand-emerald h-full rounded-full transition-all duration-100"
                    style={{ width: `${decryptProgress}%` }}
                  />
                </div>
                <div className="text-center font-mono text-[10px] text-slate-500 uppercase">
                  Yönetici Çalışma Alanı Yükleniyor...
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                <div className="flex flex-col">
                  <label className="text-slate-400 mb-2 uppercase tracking-wider font-semibold">Giriş Parolası</label>
                  <input
                    type="password"
                    placeholder="Parolanızı girin"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    disabled={isChecking}
                    className="p-3.5 bg-slate-900 border border-brand-border rounded-lg text-white focus:border-brand-cyan focus:outline-none transition-colors text-center tracking-widest font-sans"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={isChecking || !passwordInput}
                  className={`w-full flex items-center justify-center gap-2 p-3.5 rounded-lg font-mono font-bold transition-all duration-300 ${
                    isChecking || !passwordInput
                      ? 'bg-slate-900 border border-brand-border text-brand-muted cursor-not-allowed'
                      : 'bg-brand-cyan hover:bg-brand-cyan/90 text-[#090d16] cursor-pointer shadow-lg shadow-brand-cyan/20'
                  }`}
                >
                  {isChecking ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>DOĞRULANIYOR...</span>
                    </>
                  ) : (
                    <>
                      <Cpu size={14} />
                      <span>PANELE GİRİŞ YAP</span>
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-8 pt-4 border-t border-brand-border/40 text-center font-mono text-[9px] text-brand-muted uppercase">
              AVBT YÖNETİCİ KONTROL PANELİ // SADECE YETKİLİ ÜYELER
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
