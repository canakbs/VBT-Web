'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, Lightbulb, GraduationCap, Cpu, Layers, ExternalLink } from 'lucide-react';
import { MarkdownFile } from '@/lib/markdown';

interface ProjectPipelineProps {
  projects: MarkdownFile[];
}

const STAGES = [
  { name: 'Idea', label: 'Fikir Aşaması', icon: <Lightbulb className="w-4 h-4 text-amber-400" /> },
  { name: 'Research', label: 'Araştırma', icon: <GraduationCap className="w-4 h-4 text-brand-cyan" /> },
  { name: 'Development', label: 'Geliştirme', icon: <Cpu className="w-4 h-4 text-brand-emerald" /> },
  { name: 'Deployment', label: 'Yayınlama', icon: <Layers className="w-4 h-4 text-brand-blue" /> },
];

export default function ProjectPipeline({ projects }: ProjectPipelineProps) {
  const [selectedProject, setSelectedProject] = useState<MarkdownFile | null>(null);

  // Group projects by their frontmatter stage
  const getProjectsByStage = (stageName: string) => {
    return projects.filter(
      (p) => (p.metadata.stage || '').toLowerCase() === stageName.toLowerCase()
    );
  };

  return (
    <section id="project-showcase" className="relative py-24 bg-brand-bg border-b border-brand-border">
      {/* Background patterns */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-start mb-16">
          <span className="font-mono text-xs text-brand-cyan tracking-widest uppercase mb-2">
            [ PROJELERİMİZ ]
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Projelerimiz <br />
            <span className="bg-gradient-to-r from-brand-cyan to-brand-emerald bg-clip-text text-transparent">
              &amp; Çalışmalarımız
            </span>
          </h2>
        </div>

        {/* Pipeline Columns Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {STAGES.map((stage, colIndex) => {
            const stageProjects = getProjectsByStage(stage.name);

            return (
              <div key={stage.name} className="flex flex-col bg-brand-card/40 border border-brand-border rounded overflow-hidden backdrop-blur-sm">
                {/* Column Header */}
                <div className="p-4 border-b border-brand-border bg-slate-900/50 flex items-center justify-between font-mono">
                  <div className="flex items-center gap-2">
                    {stage.icon}
                    <span className="text-xs text-white uppercase tracking-wider">{stage.name}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded text-brand-muted">
                    {stageProjects.length} UNIT
                  </span>
                </div>
                <div className="px-3 py-1 bg-slate-950/40 border-b border-brand-border/40 font-mono text-[9px] text-brand-muted uppercase">
                  STAGE: {stage.label}
                </div>

                {/* Column Cards Container */}
                <div className="p-3 flex-grow flex flex-col gap-4 min-h-[300px]">
                  {stageProjects.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center border border-dashed border-brand-border/60 rounded p-6 text-center">
                      <span className="font-mono text-[10px] text-brand-muted uppercase">
                        [ Kuyruk Boş ]
                      </span>
                    </div>
                  ) : (
                    stageProjects.map((project) => (
                      <div
                        key={project.slug}
                        onClick={() => setSelectedProject(project)}
                        className="p-4 bg-brand-card border border-brand-border hover:border-brand-cyan/40 rounded transition-all duration-300 cursor-pointer relative group flex flex-col justify-between"
                      >
                        {/* Glowing node accent */}
                        <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />

                        <div>
                          {/* Category Tag */}
                          <span className="font-mono text-[9px] text-brand-cyan uppercase tracking-wider">
                            // {project.metadata.category}
                          </span>
                          <h4 className="text-white font-semibold text-sm md:text-base mt-1.5 group-hover:text-brand-cyan transition-colors">
                            {project.metadata.title}
                          </h4>
                          <p className="text-slate-400 text-xs mt-2 leading-relaxed line-clamp-3">
                            {project.metadata.summary}
                          </p>
                        </div>

                        {/* Card Footer with GitHub link */}
                        <div className="mt-4 pt-3 border-t border-brand-border/40 flex items-center justify-between font-mono text-[9px] text-brand-muted">
                          {project.metadata.github ? (
                            <a
                              href={project.metadata.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                            >
                              <ExternalLink size={12} />
                              <span>GitHub</span>
                            </a>
                          ) : (
                            <span>AKTİF</span>
                          )}
                          <span className="text-brand-cyan group-hover:translate-x-1 transition-transform flex items-center gap-1">
                            DETAY <Play size={8} />
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Visual Arrow connector */}
                {colIndex < 3 && (
                  <div className="hidden lg:flex absolute right-[-14px] top-1/2 transform -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-slate-900 border border-brand-border items-center justify-center text-brand-cyan pointer-events-none">
                    <ArrowRight size={14} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Project Detail Modal Overlay */}
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
                className="w-full max-w-2xl bg-brand-card border border-brand-border rounded-lg overflow-hidden relative"
              >
                {/* Header dashboard accent */}
                <div className="px-6 py-4 bg-slate-900 border-b border-brand-border flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-cyan" />
                    <span className="font-mono text-xs text-white uppercase tracking-wider">
                      Proje Detayı
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="font-mono text-xs text-brand-muted hover:text-white transition-colors"
                  >
                    [ ESC ]
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto font-sans">
                  <div className="flex flex-wrap items-center gap-3 mb-4 font-mono text-xs">
                    <span className="px-2 py-0.5 bg-slate-800 border border-brand-border rounded text-brand-cyan">
                      {selectedProject.metadata.category}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-800 border border-brand-border rounded text-brand-emerald">
                      Stage: {selectedProject.metadata.stage}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    {selectedProject.metadata.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6 bg-slate-950 p-4 border border-brand-border rounded font-mono">
                    {selectedProject.metadata.summary}
                  </p>

                  {/* Description */}
                  <div className="prose prose-invert max-w-none text-slate-400 text-xs md:text-sm space-y-4">
                    <h4 className="text-white font-semibold text-sm uppercase tracking-wider font-mono">
                      ■ PROJE HAKKINDA
                    </h4>
                    <p>
                      Bu projenin detayları ve teknik altyapısı hakkında daha fazla bilgi için GitHub repository&apos;sini inceleyebilirsiniz.
                    </p>
                  </div>

                  {/* Tags */}
                  {selectedProject.metadata.tags && (
                    <div className="flex flex-wrap gap-2 mt-6">
                      {selectedProject.metadata.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-brand-bg/60 border border-brand-border rounded text-[10px] font-mono text-slate-300">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer action buttons */}
                <div className="p-4 bg-slate-900 border-t border-brand-border flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2 border border-brand-border rounded font-mono text-xs text-slate-300 hover:text-white transition-colors"
                  >
                    Kapat
                  </button>
                  {selectedProject.metadata.github && (
                    <a
                      href={selectedProject.metadata.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 bg-brand-cyan/25 border border-brand-cyan/50 rounded font-mono text-xs text-white hover:bg-brand-cyan/40 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                      <span>Repository</span>
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
