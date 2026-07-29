'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, CheckCircle2, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { MarkdownFile } from '@/lib/markdown';
import Link from 'next/link';
import { useLenis } from 'lenis/react';

interface ProjectPipelineProps {
  projects: MarkdownFile[];
}

const COMPLETED_STAGES = ['deployment', 'yayınlama', 'completed', 'tamamlandı'];

const FALLBACK_PROJECT_IMAGES = [
  '/images/hero/coding.png',
  '/images/hero/workshop.png',
  '/images/hero/hackathon.png',
];

export default function ProjectPipeline({ projects }: ProjectPipelineProps) {
  const [selectedProject, setSelectedProject] = useState<MarkdownFile | null>(null);

  const lenis = useLenis();

  useEffect(() => {
    if (selectedProject) {
      document.body.classList.add('overflow-hidden');
      lenis?.stop();
    } else {
      document.body.classList.remove('overflow-hidden');
      lenis?.start();
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
      lenis?.start();
    };
  }, [selectedProject, lenis]);

  // Filter projects to show completed ones (Limit 3 for homepage)
  const completedProjects = projects
    .filter((p) => {
      const stage = (p.metadata.stage || '').toLowerCase();
      return COMPLETED_STAGES.includes(stage) || true;
    })
    .slice(0, 3);

  const getProjectImage = (project: MarkdownFile, index: number) => {
    if (project.metadata.image && !project.metadata.image.includes('placeholder')) {
      return project.metadata.image;
    }
    return FALLBACK_PROJECT_IMAGES[index % FALLBACK_PROJECT_IMAGES.length];
  };  return (
    <section id="project-showcase" className="relative pt-20 md:pt-24 pb-20 bg-transparent border-b border-brand-border">
      {/* Background patterns */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="flex flex-col items-start">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Tamamlanan <br />
              <span className="bg-gradient-to-r from-brand-cyan via-blue-400 to-brand-emerald bg-clip-text text-transparent">
                Projelerimiz
              </span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md leading-relaxed font-sans">
            Topluluk üyelerimiz tarafından geliştirilen, gerçek hayattaki problemleri çözen açık kaynak veri bilimi ve yapay zekâ projeleri.
          </p>
        </div>

        {/* Project Cards List - Stacked vertically, revealing from below */}
        {completedProjects.length === 0 ? (
          <div className="p-12 border border-dashed border-brand-border rounded-2xl text-center bg-brand-card/30">
            <p className="text-slate-400 text-sm font-mono uppercase">[ Henüz tamamlanan proje bulunmuyor ]</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 md:gap-12">
            {completedProjects.map((project, idx) => {
              const imgUrl = getProjectImage(project, idx);
              const isFirst = idx === 0;

              return (
                <motion.div
                  key={project.slug}
                  initial={isFirst ? { opacity: 1, y: 0 } : { opacity: 0, y: 70 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  onClick={() => setSelectedProject(project)}
                  className="w-full flex flex-col md:flex-row bg-brand-card/80 border border-brand-border hover:border-brand-cyan/40 rounded-2xl shadow-xl hover:shadow-brand-cyan/10 transition-all duration-300 overflow-hidden cursor-pointer group backdrop-blur-sm p-4 sm:p-5 md:p-6 gap-6"
                >
                  {/* Left Side: Photo Area */}
                  <div className="w-full md:w-[350px] aspect-[16/10] md:aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-brand-border/60 relative shrink-0">
                    <img
                      src={imgUrl}
                      alt={project.metadata.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = FALLBACK_PROJECT_IMAGES[idx % FALLBACK_PROJECT_IMAGES.length];
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Badge on Image */}
                    <span className="absolute top-3 left-3 font-mono text-[10px] font-bold text-[#090d16] bg-brand-cyan px-2.5 py-0.5 rounded shadow-lg">
                      PROJE 0{idx + 1}
                    </span>
                  </div>

                  {/* Right Side: Details & Typography */}
                  <div className="flex-1 flex flex-col justify-between pt-2 md:pt-4">
                    <div>
                      {/* Card Header Info */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-xs text-brand-cyan tracking-wider px-2 py-0.5 bg-brand-cyan/10 border border-brand-cyan/20 rounded">
                          {project.metadata.category || 'Veri Bilimi'}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-mono text-brand-emerald">
                          <CheckCircle2 size={13} className="shrink-0" />
                          <span>Tamamlandı</span>
                        </span>
                      </div>

                      {/* Project Title */}
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-brand-cyan transition-colors">
                        {project.metadata.title}
                      </h3>

                      {/* Project Summary */}
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                        {project.metadata.summary}
                      </p>
                    </div>

                    {/* Footer Tech Tags & Details Trigger */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-brand-border/40 text-xs font-mono">
                      {project.metadata.tags && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.metadata.tags.slice(0, 4).map((tag: string) => (
                            <span key={tag} className="px-2 py-0.5 bg-slate-900 border border-brand-border rounded text-[10px] text-slate-400">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4 ml-auto">
                        {project.metadata.github && (
                          <a
                            href={project.metadata.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                          >
                            <ExternalLink size={14} />
                            <span>GitHub</span>
                          </a>
                        )}
                        <span className="text-brand-cyan group-hover:translate-x-1 transition-transform font-bold flex items-center gap-1.5">
                          Detay <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* View All / Redirect Banner (Emerging from below Card 3) */}
        {completedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full mt-12 sm:mt-16 relative z-10"
          >
            <div className="p-5 sm:p-6 bg-gradient-to-r from-brand-card via-slate-900 to-brand-card border border-brand-cyan/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div>
                  <h4 className="text-white font-bold text-sm sm:text-base">Tüm Proje Arşivini Keşfet</h4>
                  <p className="text-slate-400 text-xs font-mono">Geliştirilen diğer model ve uygulamaları inceleyin</p>
                </div>
              </div>

              <Link
                href="/projects"
                className="w-full sm:w-auto px-6 py-2.5 bg-brand-cyan hover:bg-brand-cyan/90 text-[#090d16] font-bold rounded-lg text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-cyan/20 hover:scale-105 active:scale-95"
              >
                <span>TÜMÜNÜ GÖRÜNTÜLE</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#090d16] border border-brand-border rounded-2xl overflow-hidden relative shadow-2xl"
            >
              <div className="px-6 py-4 bg-brand-card border-b border-brand-border flex justify-between items-center">
                <span className="font-mono text-xs text-white uppercase tracking-wider font-bold">
                  Proje Detayı
                </span>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="font-mono text-xs text-brand-muted hover:text-white transition-colors p-1"
                >
                  [ Kapat ]
                </button>
              </div>

              <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-4" data-lenis-prevent>
                <div className="flex flex-wrap items-center gap-2 mb-2 font-mono text-xs">
                  <span className="px-2.5 py-1 bg-brand-cyan/15 border border-brand-cyan/30 rounded text-brand-cyan font-bold">
                    {selectedProject.metadata.category}
                  </span>
                  <span className="px-2.5 py-1 bg-brand-emerald/15 border border-brand-emerald/30 rounded text-brand-emerald flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Yayınlandı
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  {selectedProject.metadata.title}
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed p-4 bg-brand-card/50 border border-brand-border rounded-xl">
                  {selectedProject.metadata.summary}
                </p>

                {selectedProject.metadata.stats && (
                  <div className="p-4 bg-slate-900 border border-brand-border rounded-xl font-mono text-xs">
                    <span className="text-slate-400 uppercase text-[10px] block mb-1">Model Performans Metrikleri:</span>
                    <span className="text-brand-cyan font-bold text-sm">{selectedProject.metadata.stats}</span>
                  </div>
                )}

                {selectedProject.metadata.tags && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {selectedProject.metadata.tags.map((tag: string) => (
                      <span key={tag} className="px-2.5 py-1 bg-brand-card border border-brand-border rounded text-xs font-mono text-slate-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {selectedProject.content && selectedProject.content.trim() && (
                  <div className="pt-4 border-t border-brand-border/60 text-slate-300 text-sm leading-relaxed space-y-2">
                    <div className="font-mono text-xs text-brand-cyan">// PROJE DOKÜMANTASYONU</div>
                    <div className="whitespace-pre-line opacity-90">{selectedProject.content}</div>
                  </div>
                )}
              </div>

              {selectedProject.metadata.github && (
                <div className="p-4 bg-brand-card border-t border-brand-border flex justify-end">
                  <a
                    href={selectedProject.metadata.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-cyan text-[#090d16] font-bold rounded-xl text-xs hover:bg-brand-cyan/90 transition-all shadow-md shadow-brand-cyan/20"
                  >
                    <ExternalLink size={14} />
                    <span>GitHub&apos;da İncele</span>
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
