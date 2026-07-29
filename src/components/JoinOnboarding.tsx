'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowRight, ArrowLeft, Send, ExternalLink, Share2, CheckCircle2, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { sendApplicationAction } from '@/app/actions/sendApplication';

const INTERESTS = [
  'Machine Learning',
  'Deep Learning',
  'Computer Vision',
  'Natural Language Processing',
  'MLOps & Deployment',
  'Exploratory Data Analysis',
  'Academic Research',
  'Sosyal Medya',
  'Dijital Tasarım',
  'Organizasyon'
];
const LEVELS = [
  'İleri Seviye (Araştırma / Mühendislik)',
  'Orta Seviye (Proje geliştirdim)',
  'Başlangıç (Öğrenmeye hazırım)'
];
const DEPARTMENTS = [
  'İletişim & Sosyal Medya',
  'Etkinlik & Organizasyon',
  'Araştırma & Geliştirme (Ar-Ge)'
];

const SOCIAL_LINK = 'https://linktr.ee/akdenizveribilimi';

export default function JoinOnboarding() {
  const [step, setStep] = useState(1);

  // Form State
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [level, setLevel] = useState<string>(LEVELS[0]);
  const [department, setDepartment] = useState<string>(DEPARTMENTS[0]);
  const [goals, setGoals] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // Submission & Rate Limit State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailFormatValid = email === '' || emailRegex.test(email);
  const isEmailComplete = email !== '' && emailRegex.test(email);

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmitApplication = async () => {
    if (isSubmitting || isSubmitted) return;
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await sendApplicationAction({
        fullName,
        email,
        selectedInterests,
        level,
        department,
        goals,
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Başvuru gönderilirken bir sınırlama oluştu.');
        setIsSubmitting(false);
        return;
      }

      // Confetti celebration
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f2fe', '#00f5a0', '#3b82f6'],
      });

      setIsSubmitted(true);
      setStep(5);
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMsg('Bir bağlantı hatası oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    if (step === 4) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00f2fe', '#00f5a0', '#3b82f6'],
      });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <section id="join-us" className="relative pt-10 md:pt-12 pb-10 md:pb-12 bg-transparent border-b border-brand-border">
      {/* Background patterns */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Bize Katıl
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-lg mt-4 leading-relaxed">
            Topluluğumuza katılmak için aşağıdaki formu doldur. İlgi alanlarını ve hedeflerini belirleyerek sana en uygun ekibi bulalım.
          </p>
        </div>

        {/* Wizard Panel */}
        <div className="bg-brand-card border border-brand-border rounded-xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden min-h-[440px] flex flex-col justify-between">
          {/* Top Wizard Steps Bar */}
          <div className="flex justify-between items-center pb-4 border-b border-brand-border/40 font-mono text-[10px] text-brand-muted uppercase">
            <span>KAYIT FORMU</span>
            <span>ADIM 0{step} / 05</span>
          </div>

          {/* Form Content Steps */}
          <div className="py-8 flex-grow">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">1. Kişisel Bilgiler</h3>
                    <p className="text-xs md:text-sm text-brand-muted">Adını ve e-posta adresini gir.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="font-mono text-[10px] text-slate-400 uppercase mb-2">Ad Soyad</label>
                      <input
                        type="text"
                        placeholder="Örn: Alperen Demir"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="p-3 bg-slate-900 border border-brand-border rounded font-mono text-sm text-white focus:border-brand-cyan focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-mono text-[10px] text-slate-400 uppercase mb-2">E-posta Adresi</label>
                      <input
                        type="email"
                        placeholder="Örn: alperen@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`p-3 bg-slate-900 border rounded font-mono text-sm text-white focus:outline-none transition-colors ${
                          !isEmailFormatValid
                            ? 'border-red-500/80 focus:border-red-500'
                            : 'border-brand-border focus:border-brand-cyan'
                        }`}
                      />
                      {!isEmailFormatValid && (
                        <span className="text-[10px] text-red-400 mt-1.5 font-mono">
                          // Lütfen geçerli bir e-posta adresi girin.
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">2. İlgi Alanların</h3>
                    <p className="text-xs md:text-sm text-brand-muted">Hangi alanlara ilgi duyuyorsun? Seç.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {INTERESTS.map((interest) => {
                      const isSelected = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          onClick={() => handleInterestToggle(interest)}
                          className={`px-4 py-2 border rounded font-mono text-xs transition-all duration-300 ${
                            isSelected
                              ? 'bg-brand-cyan/20 border-brand-cyan text-white glow-cyan'
                              : 'bg-slate-900 border-brand-border text-brand-muted hover:text-white'
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">3. Seviye &amp; Departman</h3>
                    <p className="text-xs md:text-sm text-brand-muted">Teknik seviyeni ve ilgilendiğin departmanı seç.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label className="font-mono text-[10px] text-slate-400 uppercase mb-2">Teknik Seviye</label>
                      <div className="space-y-3">
                        {LEVELS.map((lvl) => (
                          <label
                            key={lvl}
                            className={`flex items-center gap-3 p-3 bg-slate-900 border border-brand-border hover:border-brand-cyan/40 rounded cursor-pointer transition-colors ${
                              level === lvl ? 'border-brand-cyan' : ''
                            }`}
                          >
                            <input
                              type="radio"
                              name="level"
                              value={lvl}
                              checked={level === lvl}
                              onChange={() => setLevel(lvl)}
                              className="accent-brand-cyan"
                            />
                            <span className="font-mono text-xs text-white">{lvl}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="font-mono text-[10px] text-slate-400 uppercase mb-2">İlgilendiğin Departman</label>
                      <div className="space-y-3">
                        {DEPARTMENTS.map((dept) => (
                          <label
                            key={dept}
                            className={`flex items-center gap-3 p-3 bg-slate-900 border border-brand-border hover:border-brand-cyan/40 rounded cursor-pointer transition-colors ${
                              department === dept ? 'border-brand-cyan' : ''
                            }`}
                          >
                            <input
                              type="radio"
                              name="dept"
                              value={dept}
                              checked={department === dept}
                              onChange={() => setDepartment(dept)}
                              className="accent-brand-cyan"
                            />
                            <span className="font-mono text-xs text-white">{dept}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">4. Hedeflerin</h3>
                    <p className="text-xs md:text-sm text-brand-muted">Toplulukta neler yapmak istiyorsun? Hedeflerini yaz.</p>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Örn: YOLO tabanlı nesne tespiti projesi yapmak istiyorum veya NLP alanında çalışmalara katılmak istiyorum."
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    className="w-full p-4 bg-slate-900 border border-brand-border rounded font-mono text-xs md:text-sm text-white focus:border-brand-cyan focus:outline-none transition-colors"
                  />
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-8 py-2"
                >
                  <div className="p-8 bg-brand-emerald/10 border border-brand-emerald/40 rounded-2xl flex flex-col items-center text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-16 h-16 rounded-full bg-brand-emerald/20 border border-brand-emerald flex items-center justify-center text-brand-emerald">
                      <CheckCircle2 size={36} />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        Başvurunuz Başarıyla İletildi!
                      </h3>
                      <p className="text-sm md:text-base text-slate-300 max-w-md mx-auto leading-relaxed">
                        Başvuru bilgileriniz topluluk ekibimize iletildi. En kısa sürede sizinle iletişime geçeceğiz.
                      </p>
                    </div>

                    <a
                      href={SOCIAL_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-brand-emerald text-[#090d16] font-bold rounded-xl text-sm hover:bg-brand-emerald/90 transition-all shadow-lg shadow-brand-emerald/25 hover:scale-105 active:scale-95"
                    >
                      <Share2 size={18} />
                      <span>Sosyal Ağlarımıza Katılın</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error Alert if Submission/Validation Fails */}
          {errorMsg && (
            <div className="mb-4 p-4 bg-red-950/40 border border-red-800/60 rounded-xl flex items-start gap-3 text-red-300 text-xs font-mono animate-in fade-in">
              <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-brand-border/40 flex justify-between items-center">
            {step > 1 && step < 5 ? (
              <button
                onClick={handleBack}
                disabled={isSubmitting}
                className={`flex items-center gap-1.5 px-4 py-2 border border-brand-border font-mono text-xs rounded transition-colors text-slate-400 hover:text-white cursor-pointer ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-500'
                }`}
              >
                <ArrowLeft size={12} />
                <span>GERİ</span>
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                onClick={step === 4 ? handleSubmitApplication : handleNext}
                disabled={isSubmitting || (step === 1 && (!fullName || !isEmailComplete))}
                className={`flex items-center gap-1.5 px-4 py-2 rounded font-mono text-xs transition-colors shrink-0 cursor-pointer ${
                  isSubmitting || (step === 1 && (!fullName || !isEmailComplete))
                    ? 'bg-slate-800 border border-brand-border text-brand-muted cursor-not-allowed'
                    : 'bg-brand-cyan hover:bg-brand-cyan/80 text-black font-semibold'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>GÖNDERİLİYOR...</span>
                  </>
                ) : (
                  <>
                    <span>{step === 4 ? 'BAŞVURUYU TAMAMLA' : 'DEVAM ET'}</span>
                    <ArrowRight size={12} />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  setStep(1);
                  setIsSubmitted(false);
                  setErrorMsg('');
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-brand-border rounded font-mono text-xs text-white transition-colors cursor-pointer"
              >
                YENİ BAŞVURU
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
