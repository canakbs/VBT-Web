'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lock, ShieldAlert, Cpu, RefreshCw, Mail, KeyRound, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { requestAdminOtp, verifyAdminOtp, resendAdminOtp } from './actions';

export default function Login() {
  const [step, setStep] = useState<'password' | 'otp'>('password');
  const [passwordInput, setPasswordInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptProgress, setDecryptProgress] = useState(0);
  const [maskedEmail, setMaskedEmail] = useState('akdenizveri07@gmail.com');
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [resendCooldown, setResendCooldown] = useState(0);

  // Timer interval for OTP expiration countdown & resend cooldown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp') {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isChecking || isDecrypting) return;
    setIsChecking(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      const res = await requestAdminOtp(passwordInput);
      if (res.success && res.requireOtp) {
        if (res.maskedEmail) setMaskedEmail(res.maskedEmail);
        setStep('otp');
        setCountdown(300);
        setResendCooldown(45);
        setInfoMsg(`Doğrulama kodu ${res.maskedEmail || 'akdenizveri07@gmail.com'} adresine gönderildi.`);
        setIsChecking(false);
      } else {
        setErrorMsg(res.error || 'GEÇERSİZ ERİŞİM PAROLASI');
        setIsChecking(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('SİSTEM HATASI: KİMLİK DOĞRULAMA BAŞARISIZ');
      setIsChecking(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isChecking || isDecrypting || !otpInput) return;
    setIsChecking(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      const res = await verifyAdminOtp(otpInput);
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
        setErrorMsg(res.error || 'GEÇERSİZ DOĞRULAMA KODU');
        setIsChecking(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('SİSTEM HATASI: KOD DOĞRULANAMADI');
      setIsChecking(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isChecking) return;
    setIsChecking(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      const res = await resendAdminOtp();
      if (res.success) {
        setCountdown(300);
        setResendCooldown(45);
        setInfoMsg('Yeni doğrulama kodu e-postanıza tekrar gönderildi.');
      } else {
        setErrorMsg(res.error || 'KOD GÖNDERİLEMEDİ');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('KOD GÖNDERME HATASI');
    } finally {
      setIsChecking(false);
    }
  };

  const handleBackToPassword = () => {
    setStep('password');
    setOtpInput('');
    setErrorMsg('');
    setInfoMsg('');
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <main className="min-h-screen bg-brand-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Grids */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />
      
      {/* Glare effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-emerald/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="max-w-md w-full sm:w-[440px] relative z-10">
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

        <AnimatePresence mode="wait">
          <motion.div
            key={step + (errorMsg ? '-error' : '')}
            initial={{ opacity: 0, y: 15 }}
            animate={errorMsg ? { opacity: 1, y: 0, x: [-8, 8, -8, 8, 0] } : { opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={errorMsg ? { type: "spring", stiffness: 300, damping: 15 } : { duration: 0.3 }}
            className="bg-brand-card border border-brand-border rounded-xl p-8 relative overflow-hidden shadow-2xl backdrop-blur-md"
          >
            <div className="flex flex-col items-center text-center mb-6">
              <div className="p-3 bg-slate-900 border border-brand-border rounded-full mb-4 text-brand-cyan shadow-inner">
                {isDecrypting ? (
                  <RefreshCw className="w-8 h-8 animate-spin text-brand-emerald" />
                ) : step === 'otp' ? (
                  <Mail className="w-8 h-8 text-brand-cyan animate-bounce" />
                ) : (
                  <Lock className="w-8 h-8" />
                )}
              </div>
              <h2 className="text-white font-bold tracking-tight text-xl font-mono">
                {step === 'otp' ? 'E-Posta Doğrulaması' : 'Yönetici Paneli Girişi'}
              </h2>
              <p className="text-brand-muted text-xs font-mono mt-1 tracking-wider">
                Akdeniz Veri Bilimi Topluluğu
              </p>
            </div>

            <div className="bg-slate-950 border border-brand-border/60 rounded-lg p-4 mb-6 font-mono text-[10px] text-slate-400 space-y-1.5">
              <div className="flex justify-between items-center">
                <span>[GİRİŞ AŞAMASI]</span>
                <span className={`font-bold px-2 py-0.5 rounded ${step === 'otp' ? 'bg-cyan-950/80 text-brand-cyan border border-brand-cyan/30' : 'text-amber-400 bg-amber-950/40'}`}>
                  {step === 'otp' ? '2-ADIMLI DOĞRULAMA' : 'PAROLA KONTROLÜ'}
                </span>
              </div>

              {errorMsg ? (
                <div className="text-red-400 mt-2 border-t border-red-950 pt-2 flex items-center gap-1.5 font-bold">
                  <ShieldAlert size={12} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              ) : infoMsg ? (
                <div className="text-brand-emerald mt-2 border-t border-emerald-950 pt-2 flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="shrink-0 text-brand-emerald" />
                  <span>{infoMsg}</span>
                </div>
              ) : isDecrypting ? (
                <div className="text-brand-emerald mt-2 border-t border-emerald-950 pt-2 font-bold">
                  OTURUM AÇILIYOR... %{decryptProgress}
                </div>
              ) : (
                <div className="text-brand-muted mt-2 border-t border-slate-900 pt-2">
                  {step === 'otp' 
                    ? `Kod gönderildi: ${maskedEmail}`
                    : 'Lütfen yönetici parolanızı girin.'
                  }
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
                <div className="text-center font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                  Yönetici Çalışma Alanı Yükleniyor...
                </div>
              </div>
            ) : step === 'password' ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4 font-mono text-xs">
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
                      <span>DOĞRULANIYOR & KOD GÖNDERİLİYOR...</span>
                    </>
                  ) : (
                    <>
                      <Cpu size={14} />
                      <span>PAROLAYI DOĞRULA VE KOD İSTE</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4 font-mono text-xs">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-slate-400 uppercase tracking-wider font-semibold">6 Haneli Doğrulama Kodu</label>
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                      <Clock size={10} />
                      {formatTimer(countdown)}
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    disabled={isChecking}
                    className="p-3.5 bg-slate-900 border border-brand-cyan/50 rounded-lg text-brand-emerald focus:border-brand-emerald focus:outline-none transition-colors text-center tracking-[0.5em] font-mono text-xl font-bold"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={isChecking || otpInput.length < 6 || countdown === 0}
                  className={`w-full flex items-center justify-center gap-2 p-3.5 rounded-lg font-mono font-bold transition-all duration-300 ${
                    isChecking || otpInput.length < 6 || countdown === 0
                      ? 'bg-slate-900 border border-brand-border text-brand-muted cursor-not-allowed'
                      : 'bg-gradient-to-r from-brand-cyan to-brand-emerald text-[#090d16] hover:opacity-90 cursor-pointer shadow-lg shadow-brand-cyan/20'
                  }`}
                >
                  {isChecking ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>KOD KONTROL EDİLİYOR...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound size={14} />
                      <span>GİRİŞİ TAMAMLA</span>
                    </>
                  )}
                </button>

                <div className="pt-2 flex justify-between items-center text-[10px]">
                  <button
                    type="button"
                    onClick={handleBackToPassword}
                    className="text-slate-400 hover:text-white underline transition-colors"
                  >
                    ← Parola Adımına Dön
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || isChecking}
                    className={`transition-colors ${
                      resendCooldown > 0 || isChecking
                        ? 'text-slate-600 cursor-not-allowed'
                        : 'text-brand-cyan hover:underline'
                    }`}
                  >
                    {resendCooldown > 0 ? `Tekrar Gönder (${resendCooldown}s)` : 'Tekrar Kod Gönder'}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 pt-4 border-t border-brand-border/40 text-center font-mono text-[9px] text-brand-muted uppercase">
              AVBT YÖNETİCİ KONTROL PANELİ // 2FA GÜVENLİ GİRİŞ
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
