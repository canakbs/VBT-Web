'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, GitMerge, CheckCircle, ExternalLink } from 'lucide-react';

interface PartnerNode {
  id: string;
  name: string;
  type: 'Institution' | 'Cloud Support' | 'Hardware/GPU' | 'Dev Ecosystem';
  collaboration: string;
  logoText: string;
  website: string;
  x: number;
  y: number;
}

const PARTNERS: PartnerNode[] = [
  {
    id: 'akdeniz_uni',
    name: 'Akdeniz Üniversitesi',
    type: 'Institution',
    collaboration: 'Academic Support, Hardware Resource Lab & Lecture Theaters Hosting.',
    logoText: 'A.U.',
    website: 'https://akdeniz.edu.tr',
    x: 25,
    y: 20,
  },
  {
    id: 'teknokent',
    name: 'Antalya Teknokent',
    type: 'Institution',
    collaboration: 'Internship matches, technical mentorships, and startup incubation support.',
    logoText: 'Teknokent',
    website: 'https://antalyateknokent.com.tr',
    x: 75,
    y: 20,
  },
  {
    id: 'nvidia',
    name: 'NVIDIA Inception Program',
    type: 'Hardware/GPU',
    collaboration: 'Developer kits, cloud computing credits, and Deep Learning Institute training access.',
    logoText: 'NVIDIA',
    website: 'https://nvidia.com',
    x: 18,
    y: 65,
  },
  {
    id: 'aws',
    name: 'AWS Cloud Services',
    type: 'Cloud Support',
    collaboration: 'S3 storage buckets, EC2 GPU container clusters for training deep learning models.',
    logoText: 'AWS',
    website: 'https://aws.amazon.com',
    x: 82,
    y: 65,
  },
  {
    id: 'microsoft',
    name: 'Microsoft Research',
    type: 'Dev Ecosystem',
    collaboration: 'Azure OpenAI credits and research grant sponsorships for medical informatics projects.',
    logoText: 'Microsoft',
    website: 'https://microsoft.com',
    x: 50,
    y: 82,
  },
];

export default function PartnersMap() {
  const [activePartner, setActivePartner] = useState<PartnerNode | null>(null);

  return (
    <section id="partners" className="relative py-24 bg-brand-bg/95 border-b border-brand-border">
      {/* Background patterns */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-start mb-16">
          <span className="font-mono text-xs text-brand-cyan tracking-widest uppercase mb-2">
            [ IMPACT LAYER: PARTNERS ]
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Ecosystem &amp; <br />
            <span className="bg-gradient-to-r from-brand-cyan to-brand-emerald bg-clip-text text-transparent">
              Academic Alliances
            </span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Information / Active Node Viewer Column */}
          <div className="w-full lg:w-5/12 order-2 lg:order-1">
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8">
              We collaborate closely with key academic departments, local technology parks, and global cloud infrastructure companies to give our student members direct access to elite hardware resources and career pipelines.
            </p>

            {/* Live Panel */}
            <div className="bg-brand-card border border-brand-border rounded p-6 min-h-[220px] flex flex-col justify-between relative overflow-hidden">
              {activePartner ? (
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-brand-border/40 mb-4">
                    <div>
                      <span className="font-mono text-[9px] text-brand-cyan uppercase tracking-wider">// {activePartner.type}</span>
                      <h4 className="text-white font-bold text-lg leading-tight mt-1">{activePartner.name}</h4>
                    </div>
                    <a
                      href={activePartner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-900 border border-brand-border rounded hover:bg-brand-cyan/10 text-brand-cyan hover:text-white transition-all duration-300"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                    {activePartner.collaboration}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 font-mono text-[10px] text-brand-emerald">
                    <CheckCircle size={12} />
                    <span>VERIFIED ALLIANCE</span>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center text-brand-muted py-8 border border-dashed border-brand-border/60 rounded">
                  <Globe className="w-8 h-8 mb-2 text-brand-muted/40 animate-pulse" />
                  <span className="font-mono text-xs uppercase">[ Hover nodes to query partnerships ]</span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive SVG Network Map Column */}
          <div className="w-full lg:w-7/12 order-1 lg:order-2 relative aspect-[4/3] border border-brand-border bg-brand-card/20 rounded-lg overflow-hidden backdrop-blur-sm">
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full select-none cursor-crosshair"
            >
              {/* Central Topluluk node */}
              <circle cx="50" cy="50" r="5" className="fill-brand-cyan/20 stroke-brand-cyan stroke-[0.5]" />
              <circle cx="50" cy="50" r="1.5" className="fill-white" />
              <text x="50" y="42" className="fill-brand-cyan font-mono text-[2.2px] font-bold text-center" textAnchor="middle">
                AVBT_HUB
              </text>

              {/* Draw network data streams */}
              {PARTNERS.map((partner) => {
                const isActive = activePartner?.id === partner.id;
                return (
                  <g key={partner.id} className="cursor-pointer" onMouseEnter={() => setActivePartner(partner)}>
                    {/* Connection line with animated dashes */}
                    <line
                      x1="50"
                      y1="50"
                      x2={partner.x}
                      y2={partner.y}
                      stroke={isActive ? '#00f5a0' : 'rgba(255,255,255,0.06)'}
                      strokeWidth={isActive ? 0.7 : 0.25}
                      strokeDasharray={isActive ? '2,2' : 'none'}
                      className="transition-all duration-300"
                    />

                    {/* Ring helper */}
                    {isActive && (
                      <circle
                        cx={partner.x}
                        cy={partner.y}
                        r={6.5}
                        className="fill-none stroke-brand-emerald/20"
                        strokeWidth={0.5}
                      />
                    )}

                    {/* Satellite node */}
                    <circle
                      cx={partner.x}
                      cy={partner.y}
                      r={4.5}
                      className={`transition-all duration-300 stroke-[0.4] ${
                        isActive ? 'fill-brand-emerald/20 stroke-brand-emerald' : 'fill-slate-900 stroke-brand-border hover:stroke-brand-cyan'
                      }`}
                    />

                    {/* Abbreviated logo initials */}
                    <text
                      x={partner.x}
                      y={partner.y + 0.8}
                      className="fill-white font-mono text-[2px] font-semibold"
                      textAnchor="middle"
                    >
                      {partner.logoText}
                    </text>

                    {/* Tooltip hint label */}
                    <text
                      x={partner.x}
                      y={partner.y - 6.5}
                      className={`fill-slate-300 font-mono text-[2px] pointer-events-none transition-all duration-300 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                      textAnchor="middle"
                    >
                      {partner.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Diagnostic system dashboard panel */}
            <div className="absolute top-3 left-3 font-mono text-[9px] text-brand-muted/70 pointer-events-none uppercase">
              NETWORK: Ecosystem_Link.conf <br />
              PING: 8ms // PORT: 443
            </div>
            <div className="absolute bottom-3 right-3 font-mono text-[8px] text-brand-cyan pointer-events-none uppercase">
              ● ACTIVE SYNERGY MAP
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
