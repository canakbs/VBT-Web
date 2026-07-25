'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Users, Code, Sparkles, Shield, Activity, Share2, Cpu } from 'lucide-react';
import { MarkdownFile } from '@/lib/markdown';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  skills: string[];
  bio: string;
  linkedin?: string;
  github?: string;
  connections?: string[];
  x?: number;
  y?: number;
}

export const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: 'alperen-demir',
    name: 'Alperen Demir',
    role: 'Topluluk Başkanı',
    department: 'Üst Yönetim',
    skills: ['Derin Öğrenme', 'NLP', 'PyTorch'],
    bio: 'Bilgisayar Mühendisliği öğrencisi. Topluluğun genel koordinasyonunu ve NLP çalışma grubunu yürütüyor.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'begum-kaya',
    name: 'Begüm Kaya',
    role: 'Başkan Yardımcısı',
    department: 'Üst Yönetim',
    skills: ['Veri Analizi', 'Scikit-Learn', 'İstatistik'],
    bio: 'Endüstri Mühendisliği öğrencisi. Eğitim programlarını ve etkinlik planlamasını koordine ediyor.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'prof-dr-ahmet-yilmaz',
    name: 'Prof. Dr. Ahmet Yılmaz',
    role: 'Akademik Danışman',
    department: 'Üst Yönetim',
    skills: ['Yapay Zekâ', 'Akademik Araştırma', 'Dağıtık Sistemler'],
    bio: 'Akdeniz Üniversitesi Bilgisayar Mühendisliği öğretim üyesi. Topluluğumuza akademik danışmanlık sağlıyor.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'caner-ozturk',
    name: 'Caner Öztürk',
    role: 'ARGE & MLOps Lideri',
    department: 'ARGE',
    skills: ['Docker', 'FastAPI', 'MLflow', 'Kubernetes'],
    bio: 'Model dağıtımı, araştırma geliştirme ve altyapı süreçlerinden sorumlu.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'zeynep-aslan',
    name: 'Zeynep Aslan',
    role: 'ARGE & Görü Lideri',
    department: 'ARGE',
    skills: ['YOLOv8', 'OpenCV', 'TensorRT'],
    bio: 'Görüntü işleme projelerini, AR-GE çalışmalarını ve yarışma ekiplerini koordine ediyor.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'selin-demir',
    name: 'Selin Demir',
    role: 'Etkinlik & Organizasyon Lideri',
    department: 'Etkinlik & Organizasyon',
    skills: ['Etkinlik Yönetimi', 'İletişim', 'Halkla İlişkiler'],
    bio: 'Topluluk etkinliklerini ve dış ilişkileri yönetiyor.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'mert-yilmaz',
    name: 'Mert Yılmaz',
    role: 'Sosyal Medya & İçerik Lideri',
    department: 'Sosyal Medya',
    skills: ['Sosyal Medya Yönetimi', 'İçerik Üretimi', 'Tasarım'],
    bio: 'Topluluğumuzun sosyal medya mecralarını ve içerik üretim süreçlerini yönetiyor.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
];

interface TeamNetworkProps {
  variant?: 'core' | 'full';
  teamFiles?: MarkdownFile[];
}

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.77a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z" />
    </svg>
  );
}

function getInitials(name: string) {
  const parts = name.replace(/Prof\.|Dr\.|Doç\./gi, '').trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function TeamNetwork({ teamFiles }: TeamNetworkProps) {
  // Parse team dynamic files if available
  const allMembers: TeamMember[] = teamFiles && teamFiles.length > 0
    ? teamFiles.map((file) => ({
        id: file.slug,
        name: file.metadata.title || file.slug,
        role: file.metadata.role || 'Ekip Üyesi',
        department: file.metadata.department || 'AR-GE & Yapay Zekâ',
        skills: Array.isArray(file.metadata.skills)
          ? file.metadata.skills
          : (file.metadata.skills ? String(file.metadata.skills).split(',').map((s) => s.trim()) : []),
        bio: file.metadata.summary || file.metadata.bio || file.content || '',
        linkedin: file.metadata.linkedin || '',
        github: file.metadata.github || '',
      }))
    : DEFAULT_MEMBERS;

  const [activeDepartment, setActiveDepartment] = useState<string>('Tümü');

  const DEPARTMENTS = ['Tümü', 'Üst Yönetim', 'AR-GE & Yapay Zekâ', 'Etkinlik & Organizasyon', 'Sosyal Medya & Tasarım', 'Mentör / Danışman'];

  const filteredMembers = activeDepartment === 'Tümü'
    ? allMembers
    : allMembers.filter((m) => {
        if (m.department === activeDepartment) return true;
        if (activeDepartment === 'AR-GE & Yapay Zekâ' && (m.department === 'ARGE' || m.department.includes('ARGE'))) return true;
        if (activeDepartment === 'Sosyal Medya & Tasarım' && (m.department === 'Sosyal Medya' || m.department.includes('Sosyal'))) return true;
        if (activeDepartment === 'Etkinlik & Organizasyon' && (m.department === 'Etkinlik' || m.department.includes('Etkinlik'))) return true;
        return false;
      });

  const getDepartmentBadgeStyle = (dept: string) => {
    if (dept.includes('Yönetim')) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    if (dept.includes('Etkinlik') || dept.includes('Organizasyon')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (dept.includes('Sosyal') || dept.includes('Tasarım')) return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    if (dept.includes('AR-GE') || dept.includes('ARGE')) return 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30';
    if (dept.includes('Mentör') || dept.includes('Danışman')) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <section id="team" className="relative py-24 bg-transparent border-b border-brand-border">
      {/* Background grid pattern */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Topluluk <br />
              <span className="bg-gradient-to-r from-brand-cyan to-brand-emerald bg-clip-text text-transparent">
                Ekibimiz
              </span>
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-lg mt-3 leading-relaxed">
              Akdeniz Veri Bilimi Topluluğu bünyesinde birlikte üreten, eğitim ve projeleri koordine eden ekibimiz.
            </p>
          </div>

          {/* Department Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {DEPARTMENTS.map((dept) => {
              const isActive = activeDepartment === dept;
              return (
                <button
                  key={dept}
                  onClick={() => setActiveDepartment(dept)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-brand-cyan text-[#090d16] font-bold shadow-lg shadow-brand-cyan/20 scale-105'
                      : 'bg-[#090d16]/80 text-slate-400 border border-brand-border hover:border-brand-cyan/40 hover:text-white backdrop-blur-md'
                  }`}
                >
                  <span>{dept}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#090d16]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Member Cards Grid (Compact Cards, No Profile Photos) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDepartment}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="p-5 bg-[#090d16]/90 border border-brand-border hover:border-brand-cyan/40 rounded-2xl backdrop-blur-xl shadow-xl transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
              >
                {/* Subtle Hover Glow Background */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/5 rounded-full blur-xl group-hover:bg-brand-cyan/10 transition-all pointer-events-none" />

                <div>
                  {/* Header Row: Initials Badge & Department Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {/* Initials Avatar Badge */}
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-cyan/20 via-brand-cyan/10 to-brand-emerald/20 border border-brand-cyan/30 text-white font-bold font-mono text-sm flex items-center justify-center shadow-md shadow-brand-cyan/10 shrink-0 group-hover:border-brand-cyan/60 transition-colors">
                      {getInitials(member.name)}
                    </div>

                    {/* Department Tag */}
                    <span className={`text-[10px] font-mono font-medium px-2.5 py-1 rounded-lg border ${getDepartmentBadgeStyle(member.department)}`}>
                      {member.department}
                    </span>
                  </div>

                  {/* Name & Role */}
                  <h3 className="text-base font-bold text-white tracking-tight group-hover:text-brand-cyan transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs text-brand-cyan font-mono mt-0.5 font-medium">
                    {member.role}
                  </p>

                  {/* Bio snippet */}
                  <p className="text-xs text-slate-300 leading-relaxed mt-2.5 line-clamp-2 font-sans">
                    {member.bio}
                  </p>

                  {/* Skill Badges */}
                  {member.skills && member.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {member.skills.slice(0, 3).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-brand-card/60 border border-brand-border/40 rounded text-[10px] font-mono text-slate-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Social Links: GitHub & LinkedIn */}
                <div className="mt-5 pt-3 border-t border-brand-border/40 flex items-center justify-between font-mono text-xs text-slate-400">
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-slate-300 hover:text-brand-cyan transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  )}

                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-slate-300 hover:text-blue-400 transition-colors"
                    >
                      <LinkedinIcon className="w-3.5 h-3.5" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
