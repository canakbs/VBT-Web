'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowRight, ArrowLeft, Terminal, Copy, Check, Info } from 'lucide-react';

const INTERESTS = ['Machine Learning', 'Deep Learning', 'Computer Vision', 'Natural Language Processing', 'MLOps & Deployment', 'Exploratory Data Analysis', 'Academic Research'];
const LEVELS = ['Başlangıç (Öğrenmeye hazırım)', 'Orta Seviye (Proje geliştirdim)', 'İleri Seviye (Araştırma / Mühendislik)'];
const DEPARTMENTS = ['Araştırma & Geliştirme (Ar-Ge)', 'Eğitim & Workshop', 'İletişim & Sosyal Medya'];

export default function JoinOnboarding() {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);

  // Form State
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [level, setLevel] = useState<string>(LEVELS[0]);
  const [department, setDepartment] = useState<string>(DEPARTMENTS[0]);
  const [goals, setGoals] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    if (step === 4) {
      // Trigger confetti on onboarding summary page
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f2fe', '#00f5a0', '#3b82f6'],
      });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Generate markdown application summary
  const generateApplicationSummary = () => {
    return `---
APPLICANT_SHEET
---
İSİM: "${fullName || 'Anonim kullanıcı'}"
E-POSTA: "${email || 'Yok'}"
TARİH: "${new Date().toISOString().split('T')[0]}"

[İLGİ ALANLARI]
${selectedInterests.map((interest) => `- ${interest}`).join('\n') || '- Seçim yapılmadı'}

[TEKNİK SEVİYE]
- ${level}

[İSTENİLEN DEPARTMAN]
- ${department}

[PROJELER & AKADEMİK HEDEFLER]
"${goals || 'Henüz hedef belirtilmedi.'}"

---
EOF
---`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateApplicationSummary());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="join-us" className="relative py-24 bg-transparent border-b border-brand-border">
      {/* Background patterns */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="font-mono text-xs text-brand-cyan tracking-widest uppercase mb-2">
            [ BİZE KATIL ]
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Bize Katıl
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-lg mt-4 leading-relaxed">
            Topluluğumuza katılmak için aşağıdaki formu doldur. İlgi alanlarını ve hedeflerini belirleyerek sana en uygun ekibi bulalım.
          </p>
        </div>

        {/* Wizard Panel */}
        <div className="bg-brand-card border border-brand-border rounded p-6 md:p-8 backdrop-blur-sm relative overflow-hidden min-h-[460px] flex flex-col justify-between">
          {/* Top Wizard Steps Diagnostic bar */}
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
                        placeholder="e.g. Alperen Demir"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="p-3 bg-slate-900 border border-brand-border rounded font-mono text-sm text-white focus:border-brand-cyan focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-mono text-[10px] text-slate-400 uppercase mb-2">E-posta</label>
                      <input
                        type="email"
                        placeholder="e.g. alperen@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 bg-slate-900 border border-brand-border rounded font-mono text-sm text-white focus:border-brand-cyan focus:outline-none transition-colors"
                      />
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
                    placeholder="örn. YOLO tabanlı nesne tespiti projesi yapmak istiyorum veya NLP alanında çalışmalar yapmak istiyorum."
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
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3.5 pb-4 border-b border-brand-border/40">
                    <div className="w-8 h-8 rounded-full bg-brand-emerald/20 border border-brand-emerald flex items-center justify-center text-brand-emerald">
                      ✔
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-white">Kayıt Tamamlandı!</h3>
                      <p className="text-xs md:text-sm text-brand-muted">Başvuru özetin hazır. Kopyala ve bize e-posta ile gönder: info@avbt.org</p>
                    </div>
                  </div>

                  {/* Terminal Display */}
                  <div className="border border-brand-border bg-slate-950 rounded overflow-hidden">
                    <div className="px-4 py-2 bg-slate-900 border-b border-brand-border flex justify-between items-center">
                      <div className="flex items-center gap-2 font-mono text-[10px] text-brand-muted uppercase">
                        <Terminal size={10} />
                        <span>output_log.md</span>
                      </div>
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-1 font-mono text-[10px] text-brand-cyan hover:text-white transition-colors"
                      >
                        {copied ? <Check size={10} /> : <Copy size={10} />}
                        <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto text-[11px] md:text-xs font-mono text-slate-300 leading-relaxed max-h-[200px]">
                      <code>{generateApplicationSummary()}</code>
                    </pre>
                  </div>

                  <div className="p-3 bg-slate-900 border border-brand-border rounded-lg flex items-start gap-2.5">
                    <Info size={16} className="text-brand-cyan mt-0.5 shrink-0" />
                    <span className="text-brand-muted font-mono text-[10px] uppercase leading-relaxed">
                      Oluşturulan başvuru formunu info@avbt.org adresine veya topluluk yönetimine göndererek üyeliğinizi aktifleştirin.
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-brand-border/40 flex justify-between items-center">
            {step > 1 && step < 5 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2 border border-brand-border hover:border-slate-500 font-mono text-xs rounded transition-colors text-slate-400 hover:text-white"
              >
                <ArrowLeft size={12} />
                <span>GERİ</span>
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                onClick={handleNext}
                disabled={step === 1 && (!fullName || !email)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded font-mono text-xs transition-colors shrink-0 ${
                  step === 1 && (!fullName || !email)
                    ? 'bg-slate-800 border border-brand-border text-brand-muted cursor-not-allowed'
                    : 'bg-brand-cyan hover:bg-brand-cyan/80 text-black font-semibold'
                }`}
              >
                <span>{step === 4 ? 'BAŞVURUYU TAMAMLA' : 'DEVAM ET'}</span>
                <ArrowRight size={12} />
              </button>
            ) : (
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-brand-border rounded font-mono text-xs text-white transition-colors"
              >
                TEKRAR BAŞLA
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
