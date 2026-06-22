'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, Briefcase, Trophy, Globe } from 'lucide-react';

interface ClusterNode {
  id: string;
  label: string;
  category: 'hub' | 'members' | 'workshops' | 'projects' | 'competitions';
  x: number;
  y: number;
  details: {
    title: string;
    value: string;
    description: string;
  };
}

const NODES: ClusterNode[] = [
  // Hub
  {
    id: 'hub',
    label: 'Akdeniz Veri Bilimi',
    category: 'hub',
    x: 50, y: 50,
    details: {
      title: 'Akdeniz Veri Bilimi Topluluğu',
      value: 'Merkez',
      description: 'Veri bilimi, yapay zekâ ve makine öğrenmesi alanlarında projeler geliştiren, etkinlikler düzenleyen öğrenci topluluğu.',
    },
  },
  // Members
  {
    id: 'members_hub',
    label: 'Üyeler & Ağ',
    category: 'members',
    x: 25, y: 30,
    details: {
      title: 'Topluluk Ağı',
      value: '440+ Kayıtlı Üye',
      description: 'Bilgisayar mühendisliği, endüstri mühendisliği ve matematik bölümlerinden öğrencilerin bir araya geldiği kapsayıcı bir ağ.',
    },
  },
  {
    id: 'members_1',
    label: 'Mentörler',
    category: 'members',
    x: 18, y: 22,
    details: {
      title: 'Teknik Mentörler',
      value: '12 Aktif Mentör',
      description: 'PyTorch, Scikit-Learn ve mühendislik yollarında yeni üyelere rehberlik eden deneyimli öğrenciler.',
    },
  },
  {
    id: 'members_2',
    label: 'Danışmanlar',
    category: 'members',
    x: 32, y: 24,
    details: {
      title: 'Akademik Danışmanlar',
      value: '3 Öğretim Üyesi',
      description: 'Akademik rehberlik, araştırma desteği ve bilişim kaynakları sağlayan bölüm hocaları.',
    },
  },
  // Workshops
  {
    id: 'workshops_hub',
    label: 'Eğitimler',
    category: 'workshops',
    x: 75, y: 30,
    details: {
      title: 'Workshop & Bootcamp',
      value: '400+ Saat Eğitim',
      description: 'Python temellerinden model deployment\'a kadar uzanan uygulamalı eğitim programları.',
    },
  },
  {
    id: 'workshops_1',
    label: 'DL Bootcamp',
    category: 'workshops',
    x: 82, y: 22,
    details: {
      title: 'Deep Learning Bootcamp',
      value: 'Yıllık 6 Haftalık Kurs',
      description: 'CNN, RNN, Attention mekanizmaları ve bulut GPU\'larda eğitimi kapsayan kapsamlı oturumlar.',
    },
  },
  {
    id: 'workshops_2',
    label: 'Veri Analizi',
    category: 'workshops',
    x: 68, y: 24,
    details: {
      title: 'Veri Analizi Atölyeleri',
      value: 'Giriş Serisi',
      description: 'Pandas, NumPy ve interaktif veri görselleştirme uygulamaları ile keşifsel veri analizi.',
    },
  },
  // Projects
  {
    id: 'projects_hub',
    label: 'Projeler',
    category: 'projects',
    x: 25, y: 70,
    details: {
      title: 'Projeler & Geliştirme',
      value: '8 Aktif Repo',
      description: 'Bölgesel tarım ve kentsel trafik sorunlarını çözmek için tasarlanmış açık kaynak projeler.',
    },
  },
  {
    id: 'projects_1',
    label: 'Drone Vision',
    category: 'projects',
    x: 18, y: 78,
    details: {
      title: 'Drone Görüntü İşleme',
      value: 'Aşama: Yayınlama',
      description: 'NVIDIA Jetson kartlarında çalışan YOLO tabanlı drone görüntüleme sınıflandırma sistemi.',
    },
  },
  {
    id: 'projects_2',
    label: 'Trafik RL',
    category: 'projects',
    x: 32, y: 76,
    details: {
      title: 'Trafik Kontrol RL',
      value: 'Aşama: Geliştirme',
      description: 'Antalya trafik ışıklarını pekiştirmeli öğrenme ile dinamik olarak optimize eden sistem.',
    },
  },
  // Competitions
  {
    id: 'competitions_hub',
    label: 'Yarışmalar',
    category: 'competitions',
    x: 75, y: 70,
    details: {
      title: 'Yarışmalar & Hackathon',
      value: '9 Ulusal Ödül',
      description: 'Makine öğrenmesi yarışmaları ve hackathon\'larda ulusal ve uluslararası düzeyde rekabet.',
    },
  },
  {
    id: 'competitions_1',
    label: 'Teknofest AI',
    category: 'competitions',
    x: 82, y: 78,
    details: {
      title: 'Teknofest YZ Yarışması',
      value: 'İlk 3 Finalisti',
      description: 'Türkiye\'nin en büyük teknoloji festivalinde NLP ve Tarımsal Robotik kategorilerinde yarışma.',
    },
  },
  {
    id: 'competitions_2',
    label: 'Kaggle',
    category: 'competitions',
    x: 68, y: 76,
    details: {
      title: 'Kaggle Çalışmaları',
      value: 'Aylık Sprint',
      description: 'Üyelerin tablo, görüntü ve metin veri setlerinde yarıştığı topluluk içi hackathon\'lar.',
    },
  },
];

// Connection edges between nodes
const EDGES = [
  // Hub to category hubs
  { from: 'hub', to: 'members_hub' },
  { from: 'hub', to: 'workshops_hub' },
  { from: 'hub', to: 'projects_hub' },
  { from: 'hub', to: 'competitions_hub' },
  // Category hubs to children
  { from: 'members_hub', to: 'members_1' },
  { from: 'members_hub', to: 'members_2' },
  { from: 'workshops_hub', to: 'workshops_1' },
  { from: 'workshops_hub', to: 'workshops_2' },
  { from: 'projects_hub', to: 'projects_1' },
  { from: 'projects_hub', to: 'projects_2' },
  { from: 'competitions_hub', to: 'competitions_1' },
  { from: 'competitions_hub', to: 'competitions_2' },
  // Cross connections
  { from: 'members_hub', to: 'workshops_hub' },
  { from: 'projects_hub', to: 'competitions_hub' },
];

export default function WhoWeAreGraph() {
  const [activeNode, setActiveNode] = useState<ClusterNode>(NODES[0]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hub': return <Globe className="text-white w-5 h-5" />;
      case 'members': return <Users className="text-brand-cyan w-5 h-5" />;
      case 'workshops': return <BookOpen className="text-brand-emerald w-5 h-5" />;
      case 'projects': return <Briefcase className="text-brand-blue w-5 h-5" />;
      case 'competitions': return <Trophy className="text-amber-400 w-5 h-5" />;
      default: return null;
    }
  };

  const getNodeColor = (category: string) => {
    switch (category) {
      case 'hub': return '#ffffff';
      case 'members': return '#00f2fe';
      case 'workshops': return '#00f5a0';
      case 'projects': return '#3b82f6';
      case 'competitions': return '#fbbf24';
      default: return '#64748b';
    }
  };

  // Generate animated pulse connections
  const pulseEdges = useMemo(() => {
    return EDGES.map((edge, index) => {
      const fromNode = NODES.find(n => n.id === edge.from)!;
      const toNode = NODES.find(n => n.id === edge.to)!;
      return {
        ...edge,
        fromNode,
        toNode,
        delay: index * 0.4,
        duration: 2 + (index % 3) * 0.5,
      };
    });
  }, []);

  return (
    <section id="who-we-are" className="relative py-24 bg-brand-bg/95 border-b border-brand-border">
      {/* Background patterns */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Information Column */}
          <div className="w-full md:w-5/12 flex flex-col items-start">
            <span className="font-mono text-xs text-brand-cyan tracking-widest uppercase mb-2">
              [ BİZ KİMİZ? ]
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Topluluğumuzu <br />
              <span className="bg-gradient-to-r from-brand-cyan to-brand-emerald bg-clip-text text-transparent">
                Keşfet
              </span>
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
              Akdeniz Veri Bilimi Topluluğu, farklı bölüm ve ilgi alanlarından öğrencileri bir araya getiriyor. Grafikteki düğümlere tıklayarak topluluğumuzun yapısını keşfedebilirsin.
            </p>

            {/* Info Panel */}
            <div className="w-full p-5 bg-brand-card border border-brand-border rounded relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-brand-cyan/5 to-transparent pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNode.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-1.5 bg-slate-800/80 border border-brand-border rounded">
                      {getCategoryIcon(activeNode.category)}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm leading-tight">{activeNode.details.title}</h4>
                      <span className="font-mono text-[10px] text-brand-emerald uppercase tracking-wider">{activeNode.details.value}</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {activeNode.details.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Interactive Neural Network Graph Column */}
          <div className="w-full md:w-7/12 relative aspect-square max-w-[550px] md:max-w-none border border-brand-border bg-brand-card/25 rounded-lg overflow-hidden backdrop-blur-sm">
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full select-none cursor-crosshair"
            >
              {/* Connection Lines with animated pulses */}
              {pulseEdges.map((edge, index) => {
                const isActive = activeNode.id === edge.from || activeNode.id === edge.to;
                const color = getNodeColor(edge.fromNode.category);
                
                return (
                  <g key={`edge-${index}`}>
                    {/* Static line */}
                    <line
                      x1={edge.fromNode.x}
                      y1={edge.fromNode.y}
                      x2={edge.toNode.x}
                      y2={edge.toNode.y}
                      stroke={isActive ? color : 'rgba(255, 255, 255, 0.06)'}
                      strokeWidth={isActive ? 0.6 : 0.25}
                      className="transition-all duration-300"
                    />
                    {/* Animated pulse traveling along edge */}
                    <motion.circle
                      r="0.6"
                      fill={color}
                      fillOpacity={0.7}
                      initial={{ 
                        cx: edge.fromNode.x, 
                        cy: edge.fromNode.y,
                        opacity: 0 
                      }}
                      animate={{ 
                        cx: [edge.fromNode.x, edge.toNode.x],
                        cy: [edge.fromNode.y, edge.toNode.y],
                        opacity: [0, 0.8, 0]
                      }}
                      transition={{
                        duration: edge.duration,
                        repeat: Infinity,
                        delay: edge.delay,
                        ease: 'linear',
                      }}
                    />
                  </g>
                );
              })}

              {/* Central Hub */}
              <g className="cursor-pointer" onClick={() => setActiveNode(NODES[0])}>
                {activeNode.id === 'hub' && (
                  <motion.circle
                    cx={50} cy={50} r={7}
                    className="fill-none stroke-brand-cyan/20"
                    strokeWidth={0.4}
                    animate={{ r: [6, 8, 6] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                  />
                )}
                <circle cx={50} cy={50} r={4.5} className="fill-brand-bg stroke-white" strokeWidth={0.5} />
                <circle cx={50} cy={50} r={1.8} className="fill-brand-cyan" />
                <text x={50} y={46} className="fill-white font-mono text-[2px] font-bold" textAnchor="middle">
                  AVBT
                </text>
              </g>

              {/* Data Nodes */}
              {NODES.map((node) => {
                if (node.category === 'hub') return null;
                const isActive = activeNode.id === node.id;
                const color = getNodeColor(node.category);
                const isHub = node.id.includes('_hub') || node.id.includes('_1') === false && node.id.includes('_2') === false;
                const r = isHub ? 2.5 : 1.8;

                return (
                  <g 
                    key={node.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveNode(node)}
                    onClick={() => setActiveNode(node)}
                  >
                    {/* Active highlight ring */}
                    {isActive && (
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r={r + 2}
                        className="fill-none"
                        stroke={color}
                        strokeOpacity={0.25}
                        strokeWidth={0.4}
                        animate={{ r: [r + 1.5, r + 3, r + 1.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    )}

                    {/* Node circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={r}
                      fill={color}
                      fillOpacity={isActive ? 0.3 : 0.15}
                      stroke={color}
                      strokeWidth={isActive ? 0.5 : 0.3}
                      className="transition-all duration-300"
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={0.7}
                      fill={color}
                    />

                    {/* Label on hover/active */}
                    {isActive && (
                      <text
                        x={node.x}
                        y={node.y - r - 1.5}
                        className="fill-white font-mono text-[2px] font-semibold"
                        textAnchor="middle"
                      >
                        {node.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Corner decorations */}
            <div className="absolute top-3 left-3 font-mono text-[9px] text-brand-muted/70 pointer-events-none uppercase">
              TOPLULUK: Ağ Haritası <br />
              DÜĞÜM: {NODES.length} BİRİM
            </div>
            <div className="absolute bottom-3 right-3 font-mono text-[8px] text-brand-emerald pointer-events-none uppercase">
              ● interaktif topluluk haritası
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
