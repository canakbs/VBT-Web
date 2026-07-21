'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';

const NAV_LINKS = [
  { href: '/#event-archive', label: 'Etkinlikler' },
  { href: '/#project-showcase', label: 'Projeler' },
  { href: '/ekibimiz', label: 'Ekibimiz' },
  { href: '/veri-bilimi-nedir', label: 'Veri Bilimi Nedir?' },
  { href: '/#contact', label: 'İletişim' },
];

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#090d16]/90 backdrop-blur-md border-b border-brand-border shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img 
            src="/logo.svg" 
            alt="Akdeniz Veri Bilimi Topluluğu" 
            className="w-8 h-8 rounded-full object-contain border border-brand-cyan/40 group-hover:scale-110 transition-transform"
          />
          <span className="text-sm font-bold text-white tracking-wide">
            Akdeniz Veri Bilimi Topluluğu
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3.5 py-2 text-xs font-mono text-brand-muted hover:text-white hover:bg-brand-card/50 transition-all rounded-lg"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#join-us"
            className="ml-3 px-4 py-2 text-xs font-semibold bg-brand-cyan text-[#090d16] rounded-lg hover:bg-brand-cyan/90 transition-all flex items-center gap-1.5 shadow-sm shadow-brand-cyan/20"
          >
            <span>Bize Katıl</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-brand-muted hover:text-white transition-colors"
          aria-label={mobileOpen ? 'Menüyü kapat' : 'Menüyü aç'}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#090d16]/95 backdrop-blur-xl border-b border-brand-border">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm text-brand-muted hover:text-white hover:bg-brand-card rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#join-us"
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-4 py-3 text-sm font-semibold text-center bg-brand-cyan text-[#090d16] rounded-lg"
            >
              Bize Katıl
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
