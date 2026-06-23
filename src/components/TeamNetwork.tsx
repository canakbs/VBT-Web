'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, ShieldAlert, Award, Briefcase } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'Yönetim' | 'Danışmanlar' | 'Takım Liderleri' | 'Mentörler';
  skills: string[];
  bio: string;
  linkedin?: string;
  x: number; // concentric coordinate maps
  y: number;
}

const TEAM_MEMBERS: TeamMember[] = [
  // Center/Advisor layer
  {
    id: 'adv_ahmet',
    name: 'Prof. Dr. Ahmet Yılmaz',
    role: 'Akademik Danışman',
    department: 'Danışmanlar',
    skills: ['Computer Science', 'Academic Research', 'Distributed Systems'],
    bio: 'Akdeniz Üniversitesi bilgisayar mühendisliği bölümünde profesör, topluluğa akademik yapay zeka araştırmaları konusunda danışmanlık yapıyor.',
    linkedin: 'https://linkedin.com',
    x: 50,
    y: 15,
  },
  // Board Layer
  {
    id: 'board_pres',
    name: 'Alperen Demir',
    role: 'Topluluk Başkanı',
    department: 'Yönetim',
    skills: ['Deep Learning', 'NLP', 'Mamba SSMs', 'PyTorch'],
    bio: 'Bilgisayar Mühendisliği öğrencisi. Organizasyonel büyümeyi yönetiyor ve NLP Araştırma laboratuvarına liderlik ediyor.',
    linkedin: 'https://linkedin.com',
    x: 50,
    y: 45,
  },
  {
    id: 'board_vpres',
    name: 'Begüm Kaya',
    role: 'Başkan Yardımcısı',
    department: 'Yönetim',
    skills: ['Data Wrangling', 'Scikit-Learn', 'Statistical Inference'],
    bio: 'Endüstri Mühendisliği öğrencisi. Eğitim müfredatlarını, etkinlik planlamasını ve sponsor ilişkilerini yönetiyor.',
    linkedin: 'https://linkedin.com',
    x: 35,
    y: 45,
  },

  // Department Leads Layer
  {
    id: 'lead_mlops',
    name: 'Caner Öztürk',
    role: 'MLOps Lideri',
    department: 'Takım Liderleri',
    skills: ['Docker', 'FastAPI', 'MLflow', 'Kubernetes'],
    bio: 'Dağıtım süreçlerini ve altyapıyı yöneterek model paketleme ve izleme işlemlerini sağlar.',
    linkedin: 'https://linkedin.com',
    x: 20,
    y: 70,
  },
  {
    id: 'lead_cv',
    name: 'Zeynep Aslan',
    role: 'Bilgisayarlı Görü Lideri',
    department: 'Takım Liderleri',
    skills: ['YOLOv8', 'OpenCV', 'TensorRT', 'C++'],
    bio: 'Ulusal yarışmalar için kamera otomasyon sistemlerini ve görüntü işleme projelerini koordine eder.',
    linkedin: 'https://linkedin.com',
    x: 40,
    y: 70,
  },
  {
    id: 'lead_edu',
    name: 'Mert Yılmaz',
    role: 'Eğitim Lideri',
    department: 'Takım Liderleri',
    skills: ['Python Foundations', 'Numpy/Pandas', 'Course Design'],
    bio: 'Bootcamp lojistiğini, müfredat hazırlığını ve temel veri analitiği mentorluk programlarını yönetir.',
    linkedin: 'https://linkedin.com',
    x: 60,
    y: 70,
  },
  {
    id: 'lead_ops',
    name: 'Selin Demir',
    role: 'Operasyon & Etkinlik Lideri',
    department: 'Takım Liderleri',
    skills: ['Communications', 'Event Management', 'Public Relations'],
    bio: 'Teknoloji buluşmaları düzenler, konuk konuşmacılarla koordinasyonu sağlar ve topluluk ilişkilerini geliştirir.',
    linkedin: 'https://linkedin.com',
    x: 80,
    y: 70,
  },

  // Mentors Layer
  {
    id: 'mentor_python',
    name: 'Burak Yıldız',
    role: 'Python Mentörü',
    department: 'Mentörler',
    skills: ['Python Syntax', 'Git Versioning', 'Object OOP'],
    bio: 'Başlangıç seviyesindeki öğrencilere kod sözdizimi hatalarını ayıklama ve git depoları oluşturma konusunda yardımcı olur.',
    linkedin: 'https://linkedin.com',
    x: 50,
    y: 90,
  },
  {
    id: 'mentor_dl',
    name: 'Kaan Kaya',
    role: 'Derin Öğrenme Mentörü',
    department: 'Mentörler',
    skills: ['Transformers', 'PyTorch CNNs', 'TensorBoard'],
    bio: 'İleri düzey öğrencilere eğitim döngüleri ve hiperparametre optimizasyon laboratuvarlarında rehberlik eder.',
    linkedin: 'https://linkedin.com',
    x: 70,
    y: 90,
  },
];

const TEAM_EDGES = [
  // Advisor to President
  { from: 'adv_ahmet', to: 'board_pres' },

  // Board connections
  { from: 'board_pres', to: 'board_vpres' },

  // Board to Leads
  { from: 'board_pres', to: 'lead_mlops' },
  { from: 'board_pres', to: 'lead_cv' },
  { from: 'board_pres', to: 'lead_edu' },
  { from: 'board_pres', to: 'lead_ops' },

  // Leads to Mentors
  { from: 'lead_edu', to: 'mentor_python' },
  { from: 'lead_cv', to: 'mentor_dl' },
];

export default function TeamNetwork() {
  const [selectedMember, setSelectedMember] = useState<TeamMember>(TEAM_MEMBERS[1]); // Default to President

  const getDepartmentBadge = (dept: string) => {
    switch (dept) {
      case 'Danışmanlar': return 'bg-purple-950 text-purple-400 border border-purple-900';
      case 'Yönetim': return 'bg-amber-950 text-amber-400 border border-amber-900';
      case 'Takım Liderleri': return 'bg-emerald-950 text-emerald-400 border border-emerald-900';
      case 'Mentörler': return 'bg-blue-950 text-blue-400 border border-blue-900';
      default: return 'bg-slate-900 text-slate-400 border border-brand-border';
    }
  };

  const getNodeBorderColor = (dept: string, isSelected: boolean) => {
    if (isSelected) return 'stroke-brand-cyan fill-brand-cyan/20';
    if (dept === 'Danışmanlar') return 'stroke-purple-400 fill-slate-900';
    if (dept === 'Yönetim') return 'stroke-amber-400 fill-slate-900';
    if (dept === 'Takım Liderleri') return 'stroke-emerald-400 fill-slate-900';
    return 'stroke-brand-blue fill-slate-900';
  };

  return (
    <section id="team" className="relative py-24 bg-transparent border-b border-brand-border">
      {/* Background patterns */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-start mb-16">
          <span className="font-mono text-xs text-brand-cyan tracking-widest uppercase mb-2">
            [ EKİBİMİZ ]
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Ekibimiz <br />
            <span className="bg-gradient-to-r from-brand-cyan to-brand-emerald bg-clip-text text-transparent">
              &amp; Organizasyon
            </span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* SVG Hierarchy Graph Panel */}
          <div className="w-full lg:w-7/12 relative aspect-[4/3] border border-brand-border bg-brand-card/20 rounded-lg overflow-hidden backdrop-blur-sm">
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full select-none cursor-crosshair"
            >
              {/* Draw Edges */}
              {TEAM_EDGES.map((edge, index) => {
                const fromMember = TEAM_MEMBERS.find(m => m.id === edge.from)!;
                const toMember = TEAM_MEMBERS.find(m => m.id === edge.to)!;
                const isEdgeActive = selectedMember.id === fromMember.id || selectedMember.id === toMember.id;

                return (
                  <line
                    key={index}
                    x1={fromMember.x}
                    y1={fromMember.y}
                    x2={toMember.x}
                    y2={toMember.y}
                    stroke={isEdgeActive ? '#00f2fe' : 'rgba(255, 255, 255, 0.08)'}
                    strokeWidth={isEdgeActive ? 0.7 : 0.35}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Draw Nodes */}
              {TEAM_MEMBERS.map((member) => {
                const isSelected = selectedMember.id === member.id;
                let r = 3.5;
                if (member.department === 'Danışmanlar') r = 4.5;
                else if (member.department === 'Yönetim') r = 4;

                return (
                  <g
                    key={member.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setSelectedMember(member)}
                    onClick={() => setSelectedMember(member)}
                  >
                    {/* Ring highlight on selection */}
                    {isSelected && (
                      <motion.circle
                        cx={member.x}
                        cy={member.y}
                        r={r + 2.5}
                        className="fill-none stroke-brand-cyan/25"
                        strokeWidth={0.6}
                        animate={{ r: [r + 1.5, r + 2.8, r + 1.5] }}
                        transition={{ repeat: Infinity, duration: 2.2 }}
                      />
                    )}

                    {/* Node sphere */}
                    <circle
                      cx={member.x}
                      cy={member.y}
                      r={r}
                      strokeWidth={0.5}
                      className={`transition-all duration-300 ${getNodeBorderColor(member.department, isSelected)}`}
                    />

                    {/* Central anchor node */}
                    <circle
                      cx={member.x}
                      cy={member.y}
                      r={1}
                      className={isSelected ? 'fill-brand-cyan' : 'fill-slate-600'}
                    />

                    {/* Node labels */}
                    <text
                      x={member.x}
                      y={member.y - r - 2}
                      className="fill-slate-300 font-mono text-[2px] font-semibold text-center pointer-events-none select-none"
                      textAnchor="middle"
                    >
                      {member.name.split(' ').slice(-1)[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Network diagnostic dashboard panel */}
            <div className="absolute top-3 left-3 font-mono text-[9px] text-brand-muted/70 pointer-events-none uppercase">
              NODE_TREE: Board_Org.cfg <br />
              MEMBERS: {TEAM_MEMBERS.length} UNITS
            </div>
            <div className="absolute bottom-3 right-3 font-mono text-[8px] text-brand-emerald pointer-events-none uppercase">
              ● İNTERAKTİF HİYERARŞİ HARİTASI
            </div>
          </div>

          {/* Member Profile Card Column */}
          <div className="w-full lg:w-5/12">
            <div className="bg-brand-card border border-brand-border rounded p-6 md:p-8 backdrop-blur-sm relative overflow-hidden min-h-[400px] flex flex-col justify-between">
              {/* Digital fingerprint corner decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-cyan/5 to-transparent pointer-events-none" />

              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedMember.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-brand-border/40 mb-6">
                      <div>
                        <span className={`font-mono text-[10px] px-2 py-0.5 rounded uppercase ${getDepartmentBadge(selectedMember.department)}`}>
                          {selectedMember.department}
                        </span>
                        <h3 className="text-xl md:text-2xl font-bold text-white mt-2 leading-tight">
                          {selectedMember.name}
                        </h3>
                        <div className="font-mono text-xs text-brand-cyan mt-1 flex items-center gap-1.5">
                          <UserCheck size={12} className="text-brand-cyan" />
                          <span>{selectedMember.role}</span>
                        </div>
                      </div>

                      {/* Socials */}
                      {selectedMember.linkedin && (
                        <a
                          href={selectedMember.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-slate-900 hover:bg-brand-cyan/20 border border-brand-border rounded-lg text-slate-400 hover:text-white transition-all duration-300"
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

                    {/* Skills index */}
                    <div>
                      <h4 className="font-mono text-xs text-brand-emerald tracking-wider uppercase mb-3 flex items-center gap-1.5">
                        <Award size={12} />
                        <span>■ İLGİ ALANLARI</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.skills.map((skill) => (
                          <span 
                            key={skill} 
                            className="px-2.5 py-1 bg-slate-900 border border-brand-border rounded font-mono text-[11px] text-slate-300 hover:text-brand-cyan hover:border-brand-cyan/35 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Console log footer */}
              <div className="mt-8 pt-4 border-t border-brand-border/30 flex justify-between font-mono text-[10px] text-brand-muted">
                <span>Topluluk Ekibi</span>
                <span>Akdeniz Veri Bilimi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
