'use client';

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ExternalLink, CheckCircle2, ArrowRight, Layers } from 'lucide-react';
import { MarkdownFile } from '@/lib/markdown';
import Link from 'next/link';

interface ProjectPipelineProps {
  projects: MarkdownFile[];
}

const COMPLETED_STAGES = ['deployment', 'yayınlama', 'completed', 'tamamlandı'];

export default function ProjectPipeline({ projects }: ProjectPipelineProps) {
  const [selectedProject, setSelectedProject] = useState<MarkdownFile | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Filter projects to show completed ones (Limit 3 for homepage stacked reveal)
  const completedProjects = projects
    .filter((p) => {
      const stage = (p.metadata.stage || '').toLowerCase();
      return COMPLETED_STAGES.includes(stage) || true; // Fallback to all projects if stage empty
    })
    .slice(0, 3);

  // Transformations for Card 2 reveal (Scroll progress 0.22 -> 0.48)
  const card2Y = useTransform(scrollYProgress, [0.18, 0.42], ['80px', '0px']);
  const card2Opacity = useTransform(scrollYProgress, [0.18, 0.42], [0, 1]);
  const card2Scale = useTransform(scrollYProgress, [0.18, 0.42], [0.94, 1]);

  // Transformations for Card 3 reveal (Scroll progress 0.48 -> 0.72)
  const card3Y = useTransform(scrollYProgress, [0.45, 0.68], ['80px', '0px']);
  const card3Opacity = useTransform(scrollYProgress, [0.45, 0.68], [0, 1]);
  const card3Scale = useTransform(scrollYProgress, [0.45, 0.68], [0.94, 1]);

  // Transformations for Final CTA Banner reveal (Scroll progress 0.72 -> 0.92)
  const ctaY = useTransform(scrollYProgress, [0.72, 0.90], ['50px', '0px']);
  const ctaOpacity = useTransform(scrollYProgress, [0.72, 0.90], [0, 1]);

  return (
    <section id="project-showcase" ref={sectionRef} className="relative bg-transparent border-b border-brand-border min-h-[250vh]">
      {/* Background patterns */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />

      {/* Sticky Viewport Container */}
      <div className="sticky top-16 md:top-20 min-h-[calc(100vh-5rem)] flex flex-col justify-between py-8 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
        {/* Section Header & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 sm:mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-cyan/10 border border-brand-cyan/30 rounded-full mb-2">
              <Layers size={13} className="text-brand-cyan" />
              <span className="text-xs font-mono text-brand-cyan font-medium">Açık Kaynak Üretim</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Tamamlanan <br />
              <span className="bg-gradient-to-r from-brand-cyan via-blue-400 to-brand-emerald bg-clip-text text-transparent">
                Projelerimiz
              </span>
            </h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed font-sans">
            Aşağı kaydırdıkça topluluğumuzun yayınlanmış projelerini sırayla keşfedebilirsiniz.
          </p>
        </div>

        {/* Stacked Cards Area */}
        <div className="relative w-full max-w-4xl mx-auto flex-1 min-h-[380px] sm:min-h-[420px] my-2">
          {completedProjects.length === 0 ? (
            <div className="p-12 border border-dashed border-brand-border rounded-2xl text-center bg-brand-card/30">
              <p className="text-slate-400 text-sm font-mono uppercase">[ Henüz tamamlanan proje bulunmuyor ]</p>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* CARD 1 (Fixed Base Project) */}
              {completedProjects[0] && (
                <div
                  onClick={() => setSelectedProject(completedProjects[0])}
                  className="absolute inset-0 w-full h-fit p-6 sm:p-8 bg-brand-card/90 border border-brand-border hover:border-brand-cyan/50 rounded-2xl shadow-2xl transition-all cursor-pointer group backdrop-blur-md overflow-hidden z-10"
                >
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#090d16] bg-brand-cyan px-2.5 py-0.5 rounded">
                        PROJE 01
                      </span>
                      <span className="font-mono text-xs text-brand-cyan uppercase tracking-wider px-2.5 py-0.5 bg-brand-cyan/10 border border-brand-cyan/30 rounded">
                        {completedProjects[0].metadata.category}
                      </span>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-mono text-brand-emerald">
                      <CheckCircle2 size={14} />
                      <span>Tamamlandı</span>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-brand-cyan transition-colors">
                    {completedProjects[0].metadata.title}
                  </h3>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
                    {completedProjects[0].metadata.summary}
                  </p>

                  {completedProjects[0].metadata.tags && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {completedProjects[0].metadata.tags.map((tag: string) => (
                        <span key={tag} className="px-2.5 py-1 bg-slate-900 border border-brand-border rounded text-xs font-mono text-slate-300">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t border-brand-border/40 flex items-center justify-between text-xs font-mono">
                    {completedProjects[0].metadata.github ? (
                      <a
                        href={completedProjects[0].metadata.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                      >
                        <ExternalLink size={14} />
                        <span>GitHub Deposu</span>
                      </a>
                    ) : (
                      <span className="text-slate-500">AKDENİZ AVBT</span>
                    )}
                    <span className="text-brand-cyan group-hover:translate-x-1 transition-transform font-bold flex items-center gap-1">
                      İncele <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              )}

              {/* CARD 2 (Reveals on Scroll Step 2) */}
              {completedProjects[1] && (
                <motion.div
                  style={{
                    y: card2Y,
                    opacity: card2Opacity,
                    scale: card2Scale,
                  }}
                  onClick={() => setSelectedProject(completedProjects[1])}
                  className="absolute inset-0 w-full h-fit p-6 sm:p-8 bg-[#111827]/95 border border-brand-cyan/40 hover:border-brand-cyan rounded-2xl shadow-2xl transition-all cursor-pointer group backdrop-blur-md overflow-hidden z-20"
                >
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#090d16] bg-brand-emerald px-2.5 py-0.5 rounded">
                        PROJE 02
                      </span>
                      <span className="font-mono text-xs text-brand-cyan uppercase tracking-wider px-2.5 py-0.5 bg-brand-cyan/10 border border-brand-cyan/30 rounded">
                        {completedProjects[1].metadata.category}
                      </span>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-mono text-brand-emerald">
                      <CheckCircle2 size={14} />
                      <span>Tamamlandı</span>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-brand-cyan transition-colors">
                    {completedProjects[1].metadata.title}
                  </h3>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
                    {completedProjects[1].metadata.summary}
                  </p>

                  {completedProjects[1].metadata.tags && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {completedProjects[1].metadata.tags.map((tag: string) => (
                        <span key={tag} className="px-2.5 py-1 bg-slate-900 border border-brand-border rounded text-xs font-mono text-slate-300">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t border-brand-border/40 flex items-center justify-between text-xs font-mono">
                    {completedProjects[1].metadata.github ? (
                      <a
                        href={completedProjects[1].metadata.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                      >
                        <ExternalLink size={14} />
                        <span>GitHub Deposu</span>
                      </a>
                    ) : (
                      <span className="text-slate-500">AKDENİZ AVBT</span>
                    )}
                    <span className="text-brand-cyan group-hover:translate-x-1 transition-transform font-bold flex items-center gap-1">
                      İncele <ArrowRight size={14} />
                    </span>
                  </div>
                </motion.div>
              )}

              {/* CARD 3 (Reveals on Scroll Step 3) */}
              {completedProjects[2] && (
                <motion.div
                  style={{
                    y: card3Y,
                    opacity: card3Opacity,
                    scale: card3Scale,
                  }}
                  onClick={() => setSelectedProject(completedProjects[2])}
                  className="absolute inset-0 w-full h-fit p-6 sm:p-8 bg-[#0f172a]/95 border border-brand-emerald/50 hover:border-brand-emerald rounded-2xl shadow-2xl transition-all cursor-pointer group backdrop-blur-md overflow-hidden z-30"
                >
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#090d16] bg-blue-400 px-2.5 py-0.5 rounded">
                        PROJE 03
                      </span>
                      <span className="font-mono text-xs text-brand-cyan uppercase tracking-wider px-2.5 py-0.5 bg-brand-cyan/10 border border-brand-cyan/30 rounded">
                        {completedProjects[2].metadata.category}
                      </span>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-mono text-brand-emerald">
                      <CheckCircle2 size={14} />
                      <span>Tamamlandı</span>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-brand-cyan transition-colors">
                    {completedProjects[2].metadata.title}
                  </h3>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
                    {completedProjects[2].metadata.summary}
                  </p>

                  {completedProjects[2].metadata.tags && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {completedProjects[2].metadata.tags.map((tag: string) => (
                        <span key={tag} className="px-2.5 py-1 bg-slate-900 border border-brand-border rounded text-xs font-mono text-slate-300">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t border-brand-border/40 flex items-center justify-between text-xs font-mono">
                    {completedProjects[2].metadata.github ? (
                      <a
                        href={completedProjects[2].metadata.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                      >
                        <ExternalLink size={14} />
                        <span>GitHub Deposu</span>
                      </a>
                    ) : (
                      <span className="text-slate-500">AKDENİZ AVBT</span>
                    )}
                    <span className="text-brand-cyan group-hover:translate-x-1 transition-transform font-bold flex items-center gap-1">
                      İncele <ArrowRight size={14} />
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Step 4: Final CTA Banner (Appears after 3rd project) */}
        <motion.div
          style={{ y: ctaY, opacity: ctaOpacity }}
          className="w-full max-w-4xl mx-auto mt-2 pt-2 relative z-40"
        >
          <div className="p-4 sm:p-5 bg-gradient-to-r from-brand-card via-slate-900 to-brand-card border border-brand-cyan/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="text-lg">🚀</span>
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

              <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-4">
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
