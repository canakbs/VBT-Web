'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Award, ArrowRight, Network, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';
import { MarkdownFile } from '@/lib/markdown';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  skills: string[];
  bio: string;
  linkedin?: string;
  connections: string[];
  x: number;
  y: number;
}

export const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: 'prof-dr-ahmet-yilmaz',
    name: 'Prof. Dr. Ahmet Yılmaz',
    role: 'Akademik Danışman',
    department: 'Danışmanlar',
    skills: ['Yapay Zekâ', 'Akademik Araştırma', 'Dağıtık Sistemler'],
    bio: 'Akdeniz Üniversitesi Bilgisayar Mühendisliği öğretim üyesi. Topluluğumuza akademik danışmanlık sağlıyor.',
    linkedin: 'https://linkedin.com',
    connections: ['Alperen Demir', 'Zeynep Aslan'],
    x: 30,
    y: 30,
  },
  {
    id: 'alperen-demir',
    name: 'Alperen Demir',
    role: 'Topluluk Başkanı',
    department: 'Yönetim',
    skills: ['Derin Öğrenme', 'NLP', 'PyTorch'],
    bio: 'Bilgisayar Mühendisliği öğrencisi. Topluluğun genel koordinasyonunu ve NLP çalışma grubunu yürütüyor.',
    linkedin: 'https://linkedin.com',
    connections: ['Caner Öztürk', 'Begüm Kaya'],
    x: 70,
    y: 30,
  },
  {
    id: 'begum-kaya',
    name: 'Begüm Kaya',
    role: 'Başkan Yardımcısı',
    department: 'Yönetim',
    skills: ['Veri Analizi', 'Scikit-Learn', 'İstatistik'],
    bio: 'Endüstri Mühendisliği öğrencisi. Eğitim programlarını ve etkinlik planlamasını koordine ediyor.',
    linkedin: 'https://linkedin.com',
    connections: ['Mert Yılmaz', 'Selin Demir'],
    x: 25,
    y: 65,
  },
  {
    id: 'caner-ozturk',
    name: 'Caner Öztürk',
    role: 'MLOps Lideri',
    department: 'Takım Liderleri',
    skills: ['Docker', 'FastAPI', 'MLflow', 'Kubernetes'],
    bio: 'Model dağıtımı ve altyapı süreçlerinden sorumlu.',
    linkedin: 'https://linkedin.com',
    connections: ['Zeynep Aslan', 'Mert Yılmaz'],
    x: 50,
    y: 50,
  },
  {
    id: 'zeynep-aslan',
    name: 'Zeynep Aslan',
    role: 'Bilgisayarlı Görü Lideri',
    department: 'Takım Liderleri',
    skills: ['YOLOv8', 'OpenCV', 'TensorRT'],
    bio: 'Görüntü işleme projelerini ve yarışma ekiplerini koordine ediyor.',
    linkedin: 'https://linkedin.com',
    connections: ['Prof. Dr. Ahmet Yılmaz', 'Caner Öztürk'],
    x: 75,
    y: 65,
  },
  {
    id: 'mert-yilmaz',
    name: 'Mert Yılmaz',
    role: 'Eğitim Lideri',
    department: 'Takım Liderleri',
    skills: ['Python', 'NumPy/Pandas', 'Müfredat Tasarımı'],
    bio: 'Bootcamp ve mentorluk programlarının içeriğini hazırlıyor.',
    linkedin: 'https://linkedin.com',
    connections: ['Begüm Kaya', 'Caner Öztürk'],
    x: 40,
    y: 82,
  },
  {
    id: 'selin-demir',
    name: 'Selin Demir',
    role: 'Operasyon & Etkinlik Lideri',
    department: 'Takım Liderleri',
    skills: ['Etkinlik Yönetimi', 'İletişim', 'Halkla İlişkiler'],
    bio: 'Topluluk etkinliklerini ve dış ilişkileri yönetiyor.',
    linkedin: 'https://linkedin.com',
    connections: ['Begüm Kaya'],
    x: 80,
    y: 82,
  },
];

interface TeamNetworkProps {
  variant?: 'core' | 'full';
  teamFiles?: MarkdownFile[];
}

export default function TeamNetwork({ variant = 'core', teamFiles }: TeamNetworkProps) {
  // Parse all team dynamic files if available
  const allMembers: TeamMember[] = teamFiles && teamFiles.length > 0
    ? teamFiles.map((file, idx) => ({
        id: file.slug,
        name: file.metadata.title || file.slug,
        role: file.metadata.role || 'Ekip Üyesi',
        department: file.metadata.department || 'Takım Liderleri',
        skills: Array.isArray(file.metadata.skills)
          ? file.metadata.skills
          : (file.metadata.skills ? String(file.metadata.skills).split(',').map((s) => s.trim()) : []),
        bio: file.metadata.bio || file.content || '',
        linkedin: file.metadata.linkedin || '',
        connections: Array.isArray(file.metadata.connections)
          ? file.metadata.connections
          : (file.metadata.connections ? String(file.metadata.connections).split(',').map((s) => s.trim()) : []),
        x: file.metadata.x ? Number(file.metadata.x) : (20 + (idx * 15) % 65),
        y: file.metadata.y ? Number(file.metadata.y) : (30 + (idx * 18) % 55),
      }))
    : DEFAULT_MEMBERS;

  // Show all members on both core (homepage) and full views for a rich interactive network!
  const members = allMembers;

  const [selectedMember, setSelectedMember] = useState<TeamMember>(members[0] || DEFAULT_MEMBERS[0]);
  const [filterDepartment, setFilterDepartment] = useState<string>('Hepsi');

  // Extract unique departments for dynamic filtering
  const availableDepartments = ['Hepsi', ...Array.from(new Set(allMembers.map((m) => m.department)))];

  const filteredMembers = filterDepartment === 'Hepsi'
    ? members
    : members.filter((m) => m.department === filterDepartment);

  const getDepartmentBadge = (dept: string) => {
    switch (dept) {
      case 'Danışmanlar': return 'bg-purple-950/60 text-purple-400 border border-purple-900/60';
      case 'Yönetim': return 'bg-amber-950/60 text-amber-400 border border-amber-900/60';
      case 'Takım Liderleri': return 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/60';
      case 'Mentörler': return 'bg-blue-950/60 text-blue-400 border border-blue-900/60';
      default: return 'bg-slate-900 text-slate-300 border border-brand-border';
    }
  };

  // Build dynamic peer connection lines
  const peerLines: { x1: number; y1: number; x2: number; y2: number; isActive: boolean }[] = [];
  filteredMembers.forEach((m1) => {
    m1.connections.forEach((targetNameOrId) => {
      const m2 = filteredMembers.find(
        (target) => target.id === targetNameOrId || target.name.toLowerCase() === targetNameOrId.toLowerCase()
      );
      if (m2 && m1.id !== m2.id) {
        const isActive = selectedMember.id === m1.id || selectedMember.id === m2.id;
        peerLines.push({
          x1: m1.x,
          y1: m1.y,
          x2: m2.x,
          y2: m2.y,
          isActive,
        });
      }
    });
  });

  return (
    <section id="team" className="relative py-24 bg-transparent border-b border-brand-border">
      {/* Background patterns */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="font-mono text-xs text-brand-cyan tracking-widest uppercase mb-2 block">
              [ EKİBİMİZ ]
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              {variant === 'core' ? (
                <>
                  Ekip &amp; Çalışma <br />
                  <span className="bg-gradient-to-r from-brand-cyan to-brand-emerald bg-clip-text text-transparent">
                    Ağımız
                  </span>
                </>
              ) : (
                <>
                  Topluluğumuzun <br />
                  <span className="bg-gradient-to-r from-brand-cyan to-brand-emerald bg-clip-text text-transparent">
                    Tüm Ekibi
                  </span>
                </>
              )}
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-lg mt-3 leading-relaxed">
              Herkesin birbiriyle eşit düzeyde iş birliği yaptığı interaktif veri bilimi ekibimiz. Detaylar için bir kişiye tıklayın.
            </p>
          </div>

          {/* Department Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {availableDepartments.map((dept) => (
              <button
                key={dept}
                onClick={() => setFilterDepartment(dept)}
                className={`px-3.5 py-1.5 rounded font-mono text-xs transition-colors cursor-pointer ${
                  filterDepartment === dept
                    ? 'bg-brand-cyan text-[#090d16] font-bold'
                    : 'bg-slate-900 border border-brand-border text-slate-400 hover:text-white'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-stretch">
          {/* Interactive Peer Constellation Network Panel */}
          <div className="w-full lg:w-7/12 relative aspect-[4/3] border border-brand-border bg-brand-card/20 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl flex flex-col justify-between p-4 min-h-[380px]">
            
            {/* Top diagnostic bar */}
            <div className="flex justify-between items-center font-mono text-[10px] text-brand-muted uppercase z-10">
              <div className="flex items-center gap-2">
                <Network className="w-3.5 h-3.5 text-brand-cyan" />
                <span>VERİ BİLİMİ AĞI — {filteredMembers.length} ÜYE</span>
              </div>
              <span className="text-brand-emerald flex items-center gap-1">
                <Sparkles size={10} /> İŞ BİRLİĞİ DÜĞÜMLERİ
              </span>
            </div>

            {/* Interactive SVG Network Mesh */}
            <div className="absolute inset-0 top-8 bottom-8">
              <svg viewBox="0 0 100 100" className="w-full h-full select-none cursor-crosshair">
                {/* Draw Peer Connection Lines */}
                {peerLines.map((line, idx) => (
                  <line
                    key={idx}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke={line.isActive ? '#00f2fe' : 'rgba(255, 255, 255, 0.12)'}
                    strokeWidth={line.isActive ? 0.8 : 0.4}
                    strokeDasharray={line.isActive ? 'none' : '1.5 1.5'}
                    className="transition-all duration-300"
                  />
                ))}

                {/* Draw Member Interactive Nodes */}
                {filteredMembers.map((member) => {
                  const isSelected = selectedMember.id === member.id;
                  const r = isSelected ? 4.8 : 4.0;

                  return (
                    <g
                      key={member.id}
                      className="cursor-pointer group"
                      onClick={() => setSelectedMember(member)}
                      onMouseEnter={() => setSelectedMember(member)}
                    >
                      {/* Outer glow ring on hover/select */}
                      {isSelected && (
                        <motion.circle
                          cx={member.x}
                          cy={member.y}
                          r={r + 3}
                          className="fill-none stroke-brand-cyan/40"
                          strokeWidth={0.5}
                          animate={{ r: [r + 2, r + 3.5, r + 2] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        cx={member.x}
                        cy={member.y}
                        r={r}
                        className={`transition-all duration-300 ${
                          isSelected
                            ? 'fill-brand-cyan/25 stroke-brand-cyan'
                            : 'fill-slate-900 stroke-slate-600 hover:stroke-brand-cyan'
                        }`}
                        strokeWidth={0.6}
                      />

                      {/* Center Point */}
                      <circle
                        cx={member.x}
                        cy={member.y}
                        r={1.2}
                        className={isSelected ? 'fill-brand-cyan' : 'fill-slate-400'}
                      />

                      {/* Member Label */}
                      <text
                        x={member.x}
                        y={member.y + r + 4}
                        className={`font-mono text-[2.8px] font-semibold text-center pointer-events-none ${
                          isSelected ? 'fill-brand-cyan' : 'fill-slate-300'
                        }`}
                        textAnchor="middle"
                      >
                        {member.name.split(' ').slice(-1)[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Bottom Help Text */}
            <div className="font-mono text-[9px] text-slate-500 uppercase z-10 flex justify-between">
              <span>EŞİT DÜĞÜMLER HARİTASI</span>
              <span className="text-brand-cyan">● İNCELEMEK İÇİN KİŞİYE TIKLAYIN</span>
            </div>
          </div>

          {/* Detailed Profile Card */}
          <div className="w-full lg:w-5/12 flex flex-col">
            <div className="bg-brand-card border border-brand-border rounded-xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden flex-grow flex flex-col justify-between shadow-xl min-h-[380px]">
              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedMember.id}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-brand-border/40 mb-6">
                      <div>
                        <span className={`font-mono text-[10px] px-2.5 py-0.5 rounded uppercase ${getDepartmentBadge(selectedMember.department)}`}>
                          {selectedMember.department}
                        </span>
                        <h3 className="text-xl md:text-2xl font-bold text-white mt-2 leading-tight">
                          {selectedMember.name}
                        </h3>
                        <div className="font-mono text-xs text-brand-cyan mt-1 flex items-center gap-1.5">
                          <UserCheck size={13} className="text-brand-cyan" />
                          <span>{selectedMember.role}</span>
                        </div>
                      </div>

                      {/* LinkedIn */}
                      {selectedMember.linkedin && (
                        <a
                          href={selectedMember.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-slate-900 hover:bg-brand-cyan/20 border border-brand-border rounded-lg text-slate-400 hover:text-white transition-all"
                          title="LinkedIn Profili"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                          </svg>
                        </a>
                      )}
                    </div>

                    {/* Bio */}
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                      {selectedMember.bio}
                    </p>

                    {/* Skills */}
                    <div>
                      <h4 className="font-mono text-xs text-brand-emerald tracking-wider uppercase mb-3 flex items-center gap-1.5 font-bold">
                        <Award size={13} />
                        <span>UZMANLIK VE İLGİ ALANLARI</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-slate-900 border border-brand-border rounded-md font-mono text-xs text-slate-300 hover:border-brand-cyan/50 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Link to full team page if core variant */}
              {variant === 'core' && (
                <div className="mt-8 pt-4 border-t border-brand-border/30 flex justify-between items-center">
                  <span className="font-mono text-[10px] text-slate-400 uppercase flex items-center gap-1">
                    <Users size={12} className="text-brand-cyan" />
                    <span>TOPLULUK KADROSU</span>
                  </span>
                  <Link
                    href="/ekibimiz"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-brand-cyan hover:text-white transition-colors"
                  >
                    <span>Tüm Ekibi İncele</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
