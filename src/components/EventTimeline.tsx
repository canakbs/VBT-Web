'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Filter, Sparkles, Award, ArrowRight, Camera } from 'lucide-react';
import { MarkdownFile } from '@/lib/markdown';
import Link from 'next/link';

// Register GSAP ScrollTrigger client-side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface EventTimelineProps {
  events: MarkdownFile[];
  showMoreButton?: boolean;
}

export default function EventTimeline({ events, showMoreButton = false }: EventTimelineProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Tümü');
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Group and extract unique categories from actual events
  const categories = ['Tümü', ...Array.from(new Set(events.map(e => e.metadata.category || ''))).filter(Boolean)];

  const filteredEvents = activeCategory === 'Tümü'
    ? events
    : events.filter(e => e.metadata.category === activeCategory);

  // Trigger GSAP animations when elements enter view
  useEffect(() => {
    // If no events matched, skip
    if (filteredEvents.length === 0) return;

    // Refresh ScrollTrigger to catch layout heights
    ScrollTrigger.refresh();

    // GSAP ScrollTrigger for vertical progress line
    const timelineCtx = gsap.context(() => {
      // Animate vertical line height based on scroll
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: true,
          },
        }
      );

      // Animate card entries
      const cards = cardsRef.current?.children;
      if (cards) {
        Array.from(cards).forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 50, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 50%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      }
    }, containerRef);

    return () => timelineCtx.revert();
  }, [filteredEvents, activeCategory]);

  return (
    <section id="event-archive" ref={containerRef} className="relative py-24 bg-brand-bg border-b border-brand-border">
      {/* Grid backgrounds */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="flex flex-col items-start mb-6 md:mb-0">
            <span className="font-mono text-xs text-brand-cyan tracking-widest uppercase mb-2">
              [ ETKİNLİK ARŞİVİ ]
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Etkinliklerimiz &amp; <br />
              <span className="bg-gradient-to-r from-brand-cyan to-brand-emerald bg-clip-text text-transparent">
                Anılarımız
              </span>
            </h2>
          </div>

          {/* Filtering bar */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-brand-card/80 border border-brand-border rounded backdrop-blur-md">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  // Refresh scroll triggers shortly after state update
                  setTimeout(() => ScrollTrigger.refresh(), 100);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded font-mono text-xs transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-brand-cyan/20 border border-brand-cyan/50 text-white'
                    : 'border border-transparent text-brand-muted hover:text-white'
                }`}
              >
                {cat === 'Tümü' && <Filter size={12} />}
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Layout */}
        <div className="relative pl-6 md:pl-12 max-w-5xl mx-auto">
          {/* Vertical progress line */}
          <div className="absolute left-[3px] md:left-[7px] top-0 bottom-0 w-[2px] bg-slate-800 pointer-events-none" />
          
          {/* Glowing GSAP scaled line */}
          <div
            ref={lineRef}
            className="absolute left-[2px] md:left-[6px] top-0 bottom-0 w-[4px] bg-gradient-to-b from-brand-cyan via-brand-emerald to-brand-blue origin-top pointer-events-none scale-y-0"
            style={{ filter: 'drop-shadow(0 0 4px rgba(0, 242, 254, 0.4))' }}
          />

          {/* Timeline Cards Container */}
          <div ref={cardsRef} className="space-y-16">
            {filteredEvents.length === 0 ? (
              <div className="py-12 text-center text-brand-muted font-mono text-sm border border-dashed border-brand-border rounded">
                [ {activeCategory} kategorisi için kayıt bulunamadı ]
              </div>
            ) : (
              filteredEvents.map((event, index) => (
                <div key={event.slug} className="relative group">
                  {/* Timeline indicator node */}
                  <div className="absolute -left-[27px] md:-left-[53px] top-4 w-3.5 h-3.5 md:w-5 md:h-5 rounded-full bg-slate-900 border-2 border-brand-cyan group-hover:border-brand-emerald transition-colors duration-300 z-10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-brand-cyan group-hover:bg-brand-emerald transition-colors duration-300" />
                  </div>

                  {/* Scientific Data Card */}
                  <div className="bg-brand-card border border-brand-border hover:border-brand-cyan/30 rounded p-6 md:p-8 backdrop-blur-sm transition-all duration-300 relative overflow-hidden">
                    {/* Corner code accents */}
                    <div className="absolute top-0 right-0 p-3 font-mono text-[9px] text-brand-muted/40 select-none">
                      SYS_ID: 0{index + 1}
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                      {/* Event Photo */}
                      {event.metadata.image && (
                        <div className="w-full md:w-56 shrink-0 aspect-[4/3] bg-slate-900 border border-brand-border rounded overflow-hidden relative group-hover:border-brand-cyan/30 transition-colors">
                          <img
                            src={event.metadata.image}
                            alt={event.metadata.title || 'Etkinlik fotoğrafı'}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="w-full h-full flex flex-col items-center justify-center text-brand-muted font-mono text-xs"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2 opacity-40"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg><span>Foto yakında</span></div>';
                              }
                            }}
                          />
                        </div>
                      )}

                      <div className="flex-grow">
                        {/* Meta Tags */}
                        <div className="flex flex-wrap items-center gap-3 mb-4 font-mono text-xs">
                          <span className="flex items-center gap-1 text-brand-cyan">
                            <Calendar size={12} />
                            {event.metadata.date}
                          </span>
                          <span className="text-slate-600">//</span>
                          <span className="px-2 py-0.5 bg-slate-800/80 border border-brand-border rounded text-brand-emerald">
                            {event.metadata.category}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-brand-cyan transition-colors duration-300">
                          {event.metadata.title}
                        </h3>
                        <p className="text-slate-400 text-sm md:text-base mb-6 leading-relaxed">
                          {event.metadata.summary}
                        </p>

                        {/* Outputs / Indicators */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-brand-border/40 font-mono text-xs">
                          <div className="flex items-start gap-2.5">
                            <Sparkles className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                            <div>
                              <div className="text-slate-500 uppercase tracking-wider">Katılım &amp; Detaylar</div>
                              <div className="text-slate-300 mt-0.5">{event.metadata.stats || 'Bilgi yakında'}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <Award className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                            <div>
                              <div className="text-slate-500 uppercase tracking-wider">Kazanımlar</div>
                              <div className="text-slate-300 mt-0.5">{event.metadata.outcome || 'Bilgi yakında'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        {event.metadata.tags && (
                          <div className="flex flex-wrap gap-2 mt-6">
                            {event.metadata.tags.map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-brand-bg/60 border border-brand-border rounded text-[10px] font-mono text-brand-muted">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        </div>
                    </div>
                    </div>
                  </div>
              ))
            )}
          </div>

          {showMoreButton && (
            <div className="flex justify-center mt-16 relative z-20">
              <Link
                href="/events"
                className="flex items-center gap-2 px-6 py-3 bg-brand-card hover:bg-brand-cyan/15 border border-brand-border hover:border-brand-cyan/40 rounded font-mono text-xs text-brand-cyan hover:text-white transition-all duration-300 shadow-lg glow-cyan"
              >
                <span>DAHA FAZLA ETKİNLİK GÖSTER</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
