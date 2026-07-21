'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { MarkdownFile } from '@/lib/markdown';

interface ProjectPipelineProps {
  projects: MarkdownFile[];
}

const COMPLETED_STAGES = ['deployment', 'yayınlama', 'completed', 'tamamlandı'];

export default function ProjectPipeline({ projects }: ProjectPipelineProps) {
  const [selectedProject, setSelectedProject] = useState<MarkdownFile | null>(null);

  // Filter projects to only show completed ones
  const completedProjects = projects.filter((p) => {
    const stage = (p.metadata.stage || '').toLowerCase();
    return COMPLETED_STAGES.includes(stage);
  });

  return (
    <section id="project-showcase" className="relative pt-20 md:pt-24 pb-10 md:pb-12 bg-transparent border-b border-brand-border">
      {/* Background patterns */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-start mb-16">
          <span className="font-mono text-xs text-brand-cyan tracking-widest uppercase mb-2">
            [ PROJELERİMİZ ]
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Tamamlanan <br />
            <span className="bg-gradient-to-r from-brand-cyan to-brand-emerald bg-clip-text text-transparent">
              Projelerimiz
            </span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-lg mt-3 leading-relaxed">
            Topluluk üyelerimiz tarafından başarıyla tamamlanmış ve yayına alınmış açık kaynak projeler.
          </p>
        </div>

        {completedProjects.length === 0 ? (
          <div className="p-12 border border-dashed border-brand-border rounded-xl text-center bg-brand-card/30">
            <p className="text-slate-400 text-sm font-mono uppercase">Henüz tamamlanan proje bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedProjects.map((project) => (
              <div
                key={project.slug}
                onClick={() => setSelectedProject(project)}
                className="p-6 bg-brand-card/70 border border-brand-border hover:border-brand-cyan/40 rounded-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group backdrop-blur-sm relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[10px] text-brand-cyan uppercase tracking-wider px-2 py-0.5 bg-brand-cyan/10 border border-brand-cyan/20 rounded">
                      {project.metadata.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-brand-emerald">
                      <CheckCircle2 size={12} />
                      <span>Tamamlandı</span>
                    </span>
                  </div>

                  <h3 className="text-white font-bold text-lg md:text-xl group-hover:text-brand-cyan transition-colors">
                    {project.metadata.title}
                  </h3>

                  <p className="text-slate-300 text-xs md:text-sm mt-3 leading-relaxed line-clamp-3">
                    {project.metadata.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-brand-border/40 flex items-center justify-between text-xs font-mono text-brand-muted">
                  {project.metadata.github ? (
                    <a
                      href={project.metadata.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                    >
                      <ExternalLink size={13} />
                      <span>GitHub</span>
                    </a>
                  ) : (
                    <span>AKDENİZ AVBT</span>
                  )}
                  <span className="text-brand-cyan group-hover:translate-x-1 transition-transform font-bold">
                    Detay →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl bg-[#090d16] border border-brand-border rounded-xl overflow-hidden relative shadow-2xl"
              >
                <div className="px-6 py-4 bg-brand-card border-b border-brand-border flex justify-between items-center">
                  <span className="font-mono text-xs text-white uppercase tracking-wider font-bold">
                    Proje Detayı
                  </span>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="font-mono text-xs text-brand-muted hover:text-white transition-colors"
                  >
                    [ Kapat ]
                  </button>
                </div>

                <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto">
                  <div className="flex flex-wrap items-center gap-2 mb-4 font-mono text-xs">
                    <span className="px-2.5 py-1 bg-brand-cyan/15 border border-brand-cyan/30 rounded text-brand-cyan">
                      {selectedProject.metadata.category}
                    </span>
                    <span className="px-2.5 py-1 bg-brand-emerald/15 border border-brand-emerald/30 rounded text-brand-emerald flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Yayınlandı
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    {selectedProject.metadata.title}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6 p-4 bg-brand-card/50 border border-brand-border rounded-lg">
                    {selectedProject.metadata.summary}
                  </p>

                  {selectedProject.metadata.tags && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {selectedProject.metadata.tags.map((tag: string) => (
                        <span key={tag} className="px-2.5 py-1 bg-brand-card border border-brand-border rounded text-xs font-mono text-slate-300">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {selectedProject.metadata.github && (
                  <div className="p-4 bg-brand-card border-t border-brand-border flex justify-end">
                    <a
                      href={selectedProject.metadata.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-brand-cyan text-[#090d16] font-bold rounded-lg text-xs hover:bg-brand-cyan/90 transition-all shadow-md shadow-brand-cyan/20"
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
      </div>
    </section>
  );
}
