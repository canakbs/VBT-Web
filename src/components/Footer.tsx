import React from 'react';
import Link from 'next/link';

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.77a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z" />
    </svg>
  );
}

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function MediumIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  );
}

function MailIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    url: 'https://instagram.com/akdenizveribilimi',
    icon: InstagramIcon,
    hoverColor: 'hover:text-[#E4405F] hover:border-[#E4405F]/40 hover:bg-[#E4405F]/10',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/company/akdenizveribilimi',
    icon: LinkedinIcon,
    hoverColor: 'hover:text-[#0A66C2] hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/10',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/akdenizveribilimi',
    icon: GithubIcon,
    hoverColor: 'hover:text-white hover:border-white/40 hover:bg-white/10',
  },
  {
    name: 'X (Twitter)',
    url: 'https://x.com/akdenizverib',
    icon: XIcon,
    hoverColor: 'hover:text-[#1DA1F2] hover:border-[#1DA1F2]/40 hover:bg-[#1DA1F2]/10',
  },
  {
    name: 'Medium',
    url: 'https://medium.com/@akdenizveribilimi',
    icon: MediumIcon,
    hoverColor: 'hover:text-[#00AB6C] hover:border-[#00AB6C]/40 hover:bg-[#00AB6C]/10',
  },
  {
    name: 'E-posta',
    url: 'mailto:akdenizveribilim@gmail.com',
    icon: MailIcon,
    hoverColor: 'hover:text-brand-emerald hover:border-brand-emerald/40 hover:bg-brand-emerald/10',
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#090d16] border-t border-brand-border py-12 px-6 relative z-10 font-mono text-xs text-brand-muted">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left: Logo & Community Info */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.svg"
            alt="Akdeniz Veri Bilimi Logo"
            className="w-10 h-10 rounded-full object-contain border border-brand-border bg-slate-950 p-1"
          />
          <div className="flex flex-col items-center md:items-start gap-0.5">
            <span className="text-white font-bold tracking-wider">AKDENİZ VERİ BİLİMİ</span>
            <span className="text-slate-400 text-[11px]">Akdeniz Veri Bilimi Topluluğu // 2026</span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex flex-wrap justify-center gap-5 text-[11px]">
          <Link href="/#event-archive" className="hover:text-brand-cyan transition-colors">Etkinlikler</Link>
          <Link href="/#project-showcase" className="hover:text-brand-cyan transition-colors">Projeler</Link>
          <Link href="/ekibimiz" className="hover:text-brand-cyan transition-colors">Ekibimiz</Link>
          <Link href="/veri-bilimi-nedir" className="hover:text-brand-cyan transition-colors">Veri Bilimi Nedir?</Link>
          <Link href="/iletisim" className="hover:text-brand-cyan transition-colors">İletişim</Link>
          <Link href="/#join-us" className="hover:text-brand-emerald transition-colors font-bold text-brand-emerald">BİZE KATIL</Link>
        </div>

        {/* Right: Social Media Icons Bar */}
        <div className="flex items-center gap-2">
          {SOCIAL_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                title={item.name}
                aria-label={item.name}
                className={`p-2.5 bg-slate-900/80 border border-brand-border rounded-xl text-slate-400 transition-all duration-300 backdrop-blur-md hover:scale-110 active:scale-95 shadow-md ${item.hoverColor}`}
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
      </div>

      {/* Bottom Copyright line */}
      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-brand-border/40 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-slate-500">
        <span>© 2026 Akdeniz Veri Bilimi Topluluğu. Tüm hakları saklıdır.</span>
        <span className="font-mono text-slate-600">Veri Bilimi &amp; Yapay Zekâ Topluluğu</span>
      </div>
    </footer>
  );
}
