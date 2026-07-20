'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, Loader2, MessageSquare, AlertTriangle } from 'lucide-react';
import { sendContactAction } from '@/app/actions/sendContact';

const CATEGORIES = [
  'Soru / Bilgi',
  'İş Birliği & Sponsorluk',
  'Etkinlik / Konuşmacı',
  'Diğer',
];

export default function ContactSection() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await sendContactAction({
        fullName,
        email,
        category,
        message,
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Mesajınız gönderilirken bir sınırlama oluştu.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Bir bağlantı hatası oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 bg-transparent border-b border-brand-border">
      {/* Background patterns */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="font-mono text-xs text-brand-cyan tracking-widest uppercase mb-2">
            [ İLETİŞİM &amp; İŞ BİRLİĞİ ]
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Bizimle İletişime Geçin
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-lg mt-4 leading-relaxed">
            Soru, öneri, konuşmacı talepleri ve sponsorluk iş birlikleri için mesajınızı iletebilirsiniz.
          </p>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-xl p-6 md:p-10 backdrop-blur-md relative overflow-hidden shadow-2xl">
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-brand-emerald/20 border border-brand-emerald flex items-center justify-center text-brand-emerald">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-bold text-white">Mesajınız Alındı!</h3>
              <p className="text-slate-300 text-sm max-w-md leading-relaxed">
                Mesajınız ekibimize iletildi. En kısa sürede e-posta adresiniz üzerinden sizinle iletişime geçeceğiz.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setMessage('');
                  setErrorMsg('');
                }}
                className="mt-4 px-6 py-2.5 bg-slate-900 border border-brand-border hover:border-slate-500 rounded-lg text-xs font-mono text-white transition-colors cursor-pointer"
              >
                Yeni Mesaj Gönder
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl flex items-start gap-3 text-red-300 text-xs font-mono">
                  <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="font-mono text-xs text-slate-300 uppercase mb-2 font-semibold">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Ayşe Yılmaz"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="p-3.5 bg-slate-900 border border-brand-border rounded-lg text-white font-sans text-sm focus:border-brand-cyan focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-mono text-xs text-slate-300 uppercase mb-2 font-semibold">
                    E-posta Adresi
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Örn: ayse@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-3.5 bg-slate-900 border border-brand-border rounded-lg text-white font-sans text-sm focus:border-brand-cyan focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="font-mono text-xs text-slate-300 uppercase mb-2 font-semibold">
                  Konu / Kategori
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`p-3 rounded-lg font-mono text-xs border transition-all cursor-pointer text-center ${
                        category === cat
                          ? 'bg-brand-cyan/20 border-brand-cyan text-white font-bold'
                          : 'bg-slate-900 border-brand-border text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="font-mono text-xs text-slate-300 uppercase mb-2 font-semibold">
                  Mesajınız
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Mesajınızı, sorunuzu veya iş birliği talebinizi detaylarıyla yazın..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="p-4 bg-slate-900 border border-brand-border rounded-lg text-white font-sans text-sm focus:border-brand-cyan focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !fullName || !email || !message}
                className={`w-full flex items-center justify-center gap-2.5 p-4 rounded-xl font-mono text-sm font-bold transition-all shadow-lg cursor-pointer ${
                  isSubmitting || !fullName || !email || !message
                    ? 'bg-slate-800 text-slate-500 border border-brand-border cursor-not-allowed'
                    : 'bg-brand-cyan hover:bg-brand-cyan/90 text-[#090d16] shadow-brand-cyan/20 hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Mesaj Gönderiliyor...</span>
                  </>
                ) : (
                  <>
                    <MessageSquare size={18} />
                    <span>Mesajı Gönder</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
