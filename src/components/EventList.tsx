'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Filter, Sparkles, Award, ArrowRight } from 'lucide-react';
import { MarkdownFile } from '@/lib/markdown';
import { useLenis } from 'lenis/react';

interface EventListProps {
  events: MarkdownFile[];
}

const FALLBACK_HERO_IMAGES = [
  '/images/hero/workshop.png',
  '/images/hero/hackathon.png',
  '/images/hero/coding.png',
  '/images/hero/speakers.png',
  '/images/hero/community.png',
  '/images/hero/team.png',
];

export default function EventList({ events }: EventListProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Tümü');
  const [selectedEvent, setSelectedEvent] = useState<MarkdownFile | null>(null);

  const lenis = useLenis();

  useEffect(() => {
    if (selectedEvent) {
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
  }, [selectedEvent, lenis]);

  // Sort events from newest to oldest (date descending)
  const sortedEvents = React.useMemo(() => {
    return [...events].sort((a, b) => {
      const dateA = a.metadata.date ? new Date(a.metadata.date).getTime() : 0;
      const dateB = b.metadata.date ? new Date(b.metadata.date).getTime() : 0;
      if (dateA === 0 && dateB === 0) {
        return b.slug.localeCompare(a.slug);
      }
      return dateB - dateA;
    });
  }, [events]);

  // Handle ESC key for closing detail modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedEvent(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Categories
  const categories = [
    'Tümü',
    ...Array.from(new Set(sortedEvents.map((e) => e.metadata.category || ''))).filter(Boolean),
  ];

  const filteredEvents =
    activeCategory === 'Tümü'
      ? sortedEvents
      : sortedEvents.filter((e) => e.metadata.category === activeCategory);

  const getEventImage = (event: MarkdownFile, index: number) => {
    if (event.metadata.image && !event.metadata.image.includes('placeholder')) {
      return event.metadata.image;
    }
    return FALLBACK_HERO_IMAGES[index % FALLBACK_HERO_IMAGES.length];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header & Filter Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">
            Etkinlik{' '}
            <span className="bg-gradient-to-r from-brand-cyan to-brand-emerald bg-clip-text text-transparent">
              Arşivi
            </span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl">
            Topluluğumuz tarafından düzenlenen workshoplar, teknoloji konuşmaları, meetup&apos;lar ve hackathon&apos;ları kronolojik sırada inceleyebilirsiniz.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-brand-card/80 border border-brand-border rounded-lg sm:rounded-xl backdrop-blur-md self-start md:self-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1 sm:gap-1.5 px-1.5 py-1 sm:px-3 sm:py-1.5 rounded sm:rounded-lg font-mono text-[10px] sm:text-xs transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-brand-cyan/20 border border-brand-cyan/50 text-white shadow-sm shadow-brand-cyan/20'
                  : 'border border-transparent text-brand-muted hover:text-white'
              }`}
            >
              {cat === 'Tümü' && <Filter size={10} className="sm:w-3 sm:h-3" />}
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Events List (Vertical stack, newest to oldest) */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 border border-dashed border-brand-border rounded-2xl text-center bg-brand-card/30">
          <p className="text-slate-400 text-sm font-mono uppercase">
            [ {activeCategory} kategorisinde henüz etkinlik bulunmuyor ]
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 md:gap-8">
          {filteredEvents.map((event, idx) => {
            const imgUrl = getEventImage(event, idx);

            return (
              <motion.div
                key={event.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.3) }}
                onClick={() => setSelectedEvent(event)}
                className="w-full flex flex-col md:flex-row bg-brand-card/80 border border-brand-border hover:border-brand-cyan/40 rounded-2xl shadow-xl hover:shadow-brand-cyan/10 transition-all duration-300 overflow-hidden cursor-pointer group backdrop-blur-sm p-4 sm:p-5 md:p-6 gap-6"
              >
                {/* Left Side: Photo Area */}
                <div className="w-full md:w-[350px] aspect-[16/10] md:aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-brand-border/60 relative shrink-0">
                  <img
                    src={imgUrl}
                    alt={event.metadata.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = FALLBACK_HERO_IMAGES[idx % FALLBACK_HERO_IMAGES.length];
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                  {/* Date Badge on Image */}
                  <span className="absolute top-3 left-3 font-mono text-[10px] font-bold text-white bg-slate-950/85 border border-white/20 backdrop-blur-md px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1.5">
                    <Calendar size={11} className="text-brand-cyan" />
                    <span>{event.metadata.date}</span>
                  </span>
                </div>

                {/* Right Side: Details & Content */}
                <div className="flex-1 flex flex-col justify-between pt-1 md:pt-2">
                  <div>
                    {/* Category Badge & Date Row */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-xs text-brand-cyan tracking-wider px-2.5 py-0.5 bg-brand-cyan/10 border border-brand-cyan/20 rounded">
                        {event.metadata.category || 'Etkinlik'}
                      </span>
                      <span className="text-xs font-mono text-brand-muted hidden sm:flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{event.metadata.date}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-brand-cyan transition-colors leading-snug">
                      {event.metadata.title}
                    </h2>

                    {/* Summary */}
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                      {event.metadata.summary}
                    </p>

                    {/* Quick Stats or Outcome Badges */}
                    {(event.metadata.stats || event.metadata.outcome) && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.metadata.stats && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 border border-brand-border rounded-lg text-[11px] font-mono text-slate-300">
                            <Sparkles size={12} className="text-brand-cyan shrink-0" />
                            <span className="truncate max-w-xs">{event.metadata.stats}</span>
                          </div>
                        )}
                        {event.metadata.outcome && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 border border-brand-border rounded-lg text-[11px] font-mono text-slate-300">
                            <Award size={12} className="text-brand-emerald shrink-0" />
                            <span className="truncate max-w-xs">{event.metadata.outcome}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Tags & Action */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-brand-border/40 text-xs font-mono">
                    {event.metadata.tags && event.metadata.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {event.metadata.tags.slice(0, 4).map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-slate-900 border border-brand-border rounded text-[10px] text-slate-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-1.5 text-brand-cyan group-hover:translate-x-1 transition-transform font-bold ml-auto">
                      <span>Detayı Gör</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#090d16] border border-brand-border rounded-2xl overflow-hidden relative shadow-2xl"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-brand-card border-b border-brand-border flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-brand-cyan uppercase tracking-wider font-bold">
                    Etkinlik Detayı
                  </span>
                  <span className="text-xs font-mono text-brand-muted flex items-center gap-1">
                    <Calendar size={12} />
                    {selectedEvent.metadata.date}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="font-mono text-xs text-brand-muted hover:text-white transition-colors p-1"
                >
                  [ Kapat ]
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-5" data-lenis-prevent>
                {/* Banner Image */}
                <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-brand-border bg-slate-950 relative">
                  <img
                    src={getEventImage(selectedEvent, 0)}
                    alt={selectedEvent.metadata.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/hero/workshop.png';
                    }}
                  />
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-1 bg-brand-cyan/15 border border-brand-cyan/30 rounded text-brand-cyan font-bold">
                    {selectedEvent.metadata.category || 'Etkinlik'}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  {selectedEvent.metadata.title}
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed p-4 bg-brand-card/50 border border-brand-border rounded-xl">
                  {selectedEvent.metadata.summary}
                </p>

                {/* Stats & Outcomes in Modal */}
                {(selectedEvent.metadata.stats || selectedEvent.metadata.outcome) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-900 border border-brand-border rounded-xl font-mono text-xs">
                    {selectedEvent.metadata.stats && (
                      <div className="flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                        <div>
                          <div className="text-slate-500 uppercase tracking-wider text-[10px]">Katılım & Detaylar</div>
                          <div className="text-slate-200 mt-0.5">{selectedEvent.metadata.stats}</div>
                        </div>
                      </div>
                    )}
                    {selectedEvent.metadata.outcome && (
                      <div className="flex items-start gap-2.5">
                        <Award className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                        <div>
                          <div className="text-slate-500 uppercase tracking-wider text-[10px]">Kazanımlar</div>
                          <div className="text-slate-200 mt-0.5">{selectedEvent.metadata.outcome}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tags */}
                {selectedEvent.metadata.tags && selectedEvent.metadata.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedEvent.metadata.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-brand-card border border-brand-border rounded text-xs font-mono text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Event Content markdown text */}
                {selectedEvent.content && selectedEvent.content.trim() && (
                  <div className="pt-4 border-t border-brand-border/60 text-slate-300 text-sm leading-relaxed space-y-2">
                    <div className="font-mono text-xs text-brand-cyan">// ETKİNLİK İÇERİĞİ</div>
                    <div className="whitespace-pre-line opacity-90">{selectedEvent.content}</div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
