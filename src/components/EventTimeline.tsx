'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Filter, Sparkles, Award, ArrowRight, X, ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react';
import { MarkdownFile } from '@/lib/markdown';
import Link from 'next/link';
import { useLenis } from 'lenis/react';

interface EventTimelineProps {
  events: MarkdownFile[];
  showMoreButton?: boolean;
}

const FALLBACK_HERO_IMAGES = [
  '/images/hero/workshop.png',
  '/images/hero/hackathon.png',
  '/images/hero/coding.png',
  '/images/hero/speakers.png',
  '/images/hero/community.png',
  '/images/hero/team.png',
];

const POLAROID_PRESETS = [
  { rotate: '-rotate-4', hoverRotate: 'group-hover:rotate-0', width: 'w-56 sm:w-64 md:w-72', padding: 'p-2.5 pb-7 sm:p-3 sm:pb-8' },
  { rotate: 'rotate-5', hoverRotate: 'group-hover:rotate-1', width: 'w-60 sm:w-68 md:w-76', padding: 'p-3 pb-8 sm:p-3.5 sm:pb-9' },
  { rotate: '-rotate-3', hoverRotate: 'group-hover:-rotate-1', width: 'w-52 sm:w-60 md:w-68', padding: 'p-2 pb-6 sm:p-2.5 sm:pb-7' },
  { rotate: 'rotate-4', hoverRotate: 'group-hover:rotate-0', width: 'w-56 sm:w-64 md:w-72', padding: 'p-2.5 pb-7 sm:p-3 sm:pb-8' },
  { rotate: '-rotate-5', hoverRotate: 'group-hover:-rotate-1', width: 'w-60 sm:w-68 md:w-76', padding: 'p-3 pb-8 sm:p-3.5 sm:pb-9' },
  { rotate: 'rotate-3', hoverRotate: 'group-hover:rotate-0', width: 'w-54 sm:w-62 md:w-70', padding: 'p-2 pb-6.5 sm:p-2.5 sm:pb-7.5' },
];

export default function EventTimeline({ events, showMoreButton = false }: EventTimelineProps) {
  // Sort events chronologically (oldest to newest) for a natural timeline flow
  const sortedEvents = React.useMemo(() => {
    return [...events].sort((a, b) => {
      const dateA = a.metadata.date ? new Date(a.metadata.date).getTime() : 0;
      const dateB = b.metadata.date ? new Date(b.metadata.date).getTime() : 0;
      if (dateA === 0 && dateB === 0) {
        return a.slug.localeCompare(b.slug);
      }
      return dateA - dateB;
    });
  }, [events]);

  const [activeCategory, setActiveCategory] = useState<string>('Tümü');
  const [selectedEvent, setSelectedEvent] = useState<MarkdownFile | null>(null);
  const [isHovered, setIsHovered] = useState(false);

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

  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const currentOffsetXRef = useRef(0);
  const startOffsetXRef = useRef(0);
  const hasMovedRef = useRef(false);
  const singleWidthRef = useRef(0);

  const setHoverState = (hovered: boolean) => {
    isHoveredRef.current = hovered;
    setIsHovered(hovered);
  };

  // Categories
  const categories = ['Tümü', ...Array.from(new Set(sortedEvents.map(e => e.metadata.category || ''))).filter(Boolean)];

  const filteredEvents = activeCategory === 'Tümü'
    ? sortedEvents
    : sortedEvents.filter(e => e.metadata.category === activeCategory);

  // Duplicate list to create a seamless infinite strip
  const repeatCount = filteredEvents.length > 0 ? Math.max(4, Math.ceil(12 / filteredEvents.length)) : 0;
  const displayList = Array.from({ length: repeatCount }).flatMap(() => filteredEvents);

  // Recalculate single set width
  const updateWidth = () => {
    if (stripRef.current && repeatCount > 0) {
      const totalW = stripRef.current.scrollWidth;
      singleWidthRef.current = totalW / repeatCount;
    }
  };

  useEffect(() => {
    updateWidth();
    // Reset offset when filter changes
    currentOffsetXRef.current = 0;
    if (stripRef.current) {
      stripRef.current.style.transform = `translate3d(0px, 0, 0)`;
    }
    const timer = setTimeout(updateWidth, 150);
    window.addEventListener('resize', updateWidth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateWidth);
    };
  }, [filteredEvents.length, activeCategory]);

  // Main continuous marquee animation loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!isHoveredRef.current && !isDraggingRef.current && singleWidthRef.current > 0) {
        const speed = window.innerWidth < 640 ? 24 : 38; // px per second
        currentOffsetXRef.current -= speed * dt;

        const singleW = singleWidthRef.current;
        if (currentOffsetXRef.current <= -singleW) {
          currentOffsetXRef.current += singleW;
        }
      }

      if (stripRef.current) {
        stripRef.current.style.transform = `translate3d(${currentOffsetXRef.current}px, 0, 0)`;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Handle ESC key for closing detail modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedEvent(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Manual arrow navigation buttons
  const handleArrowScroll = (direction: 'left' | 'right') => {
    const step = window.innerWidth < 640 ? 240 : 340;
    const singleW = singleWidthRef.current;
    let nextOffset = currentOffsetXRef.current + (direction === 'left' ? step : -step);

    if (singleW > 0) {
      while (nextOffset > 0) nextOffset -= singleW;
      while (nextOffset < -singleW) nextOffset += singleW;
    }

    currentOffsetXRef.current = nextOffset;
    if (stripRef.current) {
      stripRef.current.style.transform = `translate3d(${nextOffset}px, 0, 0)`;
    }
  };

  // Drag interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startOffsetXRef.current = currentOffsetXRef.current;
    hasMovedRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) > 5) {
      hasMovedRef.current = true;
    }
    let nextOffset = startOffsetXRef.current + dx;
    const singleW = singleWidthRef.current;
    if (singleW > 0) {
      while (nextOffset > 0) nextOffset -= singleW;
      while (nextOffset < -singleW) nextOffset += singleW;
    }
    currentOffsetXRef.current = nextOffset;
    if (stripRef.current) {
      stripRef.current.style.transform = `translate3d(${nextOffset}px, 0, 0)`;
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      startXRef.current = e.touches[0].clientX;
      startOffsetXRef.current = currentOffsetXRef.current;
      hasMovedRef.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - startXRef.current;
    if (Math.abs(dx) > 5) {
      hasMovedRef.current = true;
    }
    let nextOffset = startOffsetXRef.current + dx;
    const singleW = singleWidthRef.current;
    if (singleW > 0) {
      while (nextOffset > 0) nextOffset -= singleW;
      while (nextOffset < -singleW) nextOffset += singleW;
    }
    currentOffsetXRef.current = nextOffset;
    if (stripRef.current) {
      stripRef.current.style.transform = `translate3d(${nextOffset}px, 0, 0)`;
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const getEventImage = (event: MarkdownFile, index: number) => {
    if (event.metadata.image && !event.metadata.image.includes('placeholder')) {
      return event.metadata.image;
    }
    return FALLBACK_HERO_IMAGES[index % FALLBACK_HERO_IMAGES.length];
  };

  return (
    <section id="event-archive" ref={containerRef} className="relative pt-0 pb-20 sm:py-20 bg-transparent border-b border-brand-border overflow-hidden select-none">
      {/* Background visual grid */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-3 sm:mb-8 relative z-10">
        {/* Header Title & Filtering Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col items-start">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]">
              Etkinliklerimiz &amp; <br />
              <span className="bg-gradient-to-r from-brand-cyan to-brand-emerald bg-clip-text text-transparent">
                Anılarımız
              </span>
            </h2>
          </div>

          {/* Filtering bar & Navigation Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-brand-card/80 border border-brand-border rounded-lg backdrop-blur-md">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1 sm:gap-1.5 px-1.5 py-1 sm:px-3 sm:py-1.5 rounded font-mono text-[10px] sm:text-xs transition-all duration-300 ${
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
        </div>
      </div>

      {/* Interactive Floating Strip Container with Hover-Activated Navigation Arrows */}
      <div
        className="w-full relative py-1 sm:py-4"
        onMouseEnter={() => setHoverState(true)}
        onMouseLeave={() => { setHoverState(false); handleMouseUp(); }}
      >
        <div
          className="w-full relative py-6 sm:py-16 overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {filteredEvents.length === 0 ? (
            <div className="py-16 text-center text-brand-muted font-mono text-sm border border-dashed border-brand-border rounded-xl max-w-xl mx-auto">
              [ {activeCategory} kategorisinde henüz etkinlik bulunmuyor ]
            </div>
          ) : (
            <div
              ref={stripRef}
              className="flex items-center gap-6 sm:gap-8 px-4 w-max will-change-transform"
              style={{ transform: 'translate3d(0px, 0, 0)' }}
            >
              {displayList.map((event, idx) => {
                const preset = POLAROID_PRESETS[idx % POLAROID_PRESETS.length];
                const imgSrc = getEventImage(event, idx);

                return (
                  <div
                    key={`${event.slug}-${idx}`}
                    onClick={(e) => {
                      if (hasMovedRef.current) {
                        e.preventDefault();
                        return;
                      }
                      setSelectedEvent(event);
                    }}
                    className={`group relative flex-shrink-0 cursor-pointer ${preset.width} ${preset.rotate} ${preset.hoverRotate} ${preset.padding}
                      bg-slate-100/95 border border-white/80 rounded-md
                      shadow-xl shadow-black/80 hover:shadow-2xl hover:shadow-brand-cyan/35
                      transition-all duration-300 ease-out
                      hover:scale-105 sm:hover:scale-108 hover:-translate-y-2 hover:z-30`}
                  >
                    {/* Event Polaroid Photo Frame */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-slate-900 border border-slate-300/40">
                      <img
                        src={imgSrc}
                        alt={event.metadata.title || 'Etkinlik görseli'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const fallback = FALLBACK_HERO_IMAGES[idx % FALLBACK_HERO_IMAGES.length];
                          if (!target.src.endsWith(fallback)) {
                            target.src = fallback;
                          }
                        }}
                      />
                      {event.metadata.category && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-slate-950/85 backdrop-blur-sm border border-white/20 text-[9px] font-mono text-brand-emerald rounded shadow">
                          {event.metadata.category}
                        </span>
                      )}
                    </div>

                    {/* Card Bottom Typography */}
                    <div className="mt-2.5 text-center px-1">
                      <h3 className="block text-xs sm:text-sm font-mono font-bold text-slate-800 tracking-tight truncate group-hover:text-black transition-colors">
                        {event.metadata.title}
                      </h3>
                      <div className="mt-1 flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-mono text-slate-500">
                        <Calendar size={11} className="text-slate-400 shrink-0" />
                        <span>{event.metadata.date}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Manual Scroll Arrows — Fades in ONLY when hover/paused */}
        {filteredEvents.length > 0 && (
          <div className={`flex items-center justify-center gap-3 mt-1 mb-2 relative z-20 transition-all duration-300 ease-out ${
            isHovered ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'
          }`}>
            <button
              onClick={() => handleArrowScroll('left')}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-card/95 hover:bg-brand-cyan/20 border border-brand-cyan/40 hover:border-brand-cyan text-white rounded-lg font-mono text-xs transition-all duration-300 shadow-xl shadow-black/80 backdrop-blur-md hover:scale-105 active:scale-95 group"
              title="Geriye Kaydır"
            >
              <ChevronLeft size={16} className="text-brand-cyan group-hover:-translate-x-0.5 transition-transform" />
              <span>Geri</span>
            </button>

            <button
              onClick={() => handleArrowScroll('right')}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-card/95 hover:bg-brand-cyan/20 border border-brand-cyan/40 hover:border-brand-cyan text-white rounded-lg font-mono text-xs transition-all duration-300 shadow-xl shadow-black/80 backdrop-blur-md hover:scale-105 active:scale-95 group"
              title="İleriye Kaydır"
            >
              <span>İleri</span>
              <ChevronRight size={16} className="text-brand-cyan group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* Show More Button (if on home page or configured) */}
      {showMoreButton && (
        <div className="flex justify-center mt-4 relative z-20">
          <Link
            href="/events"
            className="flex items-center gap-2 px-6 py-3 bg-brand-card hover:bg-brand-cyan/15 border border-brand-border hover:border-brand-cyan/40 rounded-xl font-mono text-xs text-brand-cyan hover:text-white transition-all duration-300 shadow-lg glow-cyan"
          >
            <span>TÜM ETKİNLİK ARŞİVİNİ GÖRÜNTÜLE</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 select-text"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-slate-900 border border-brand-border rounded-xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-brand-border">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-brand-cyan/10 border border-brand-cyan/30 rounded text-xs font-mono text-brand-cyan font-medium">
                  {selectedEvent.metadata.category || 'Etkinlik'}
                </span>
                <span className="text-xs font-mono text-brand-muted flex items-center gap-1">
                  <Calendar size={12} />
                  {selectedEvent.metadata.date}
                </span>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Event Large Banner Image */}
            <div className="w-full aspect-[16/9] rounded-lg overflow-hidden border border-brand-border bg-slate-950 relative">
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

            {/* Event Title & Summary */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                {selectedEvent.metadata.title}
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {selectedEvent.metadata.summary}
              </p>
            </div>

            {/* Stats & Outcome */}
            {(selectedEvent.metadata.stats || selectedEvent.metadata.outcome) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-brand-card/80 border border-brand-border rounded-lg font-mono text-xs">
                {selectedEvent.metadata.stats && (
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                    <div>
                      <div className="text-slate-500 uppercase tracking-wider">Katılım &amp; Detaylar</div>
                      <div className="text-slate-200 mt-0.5">{selectedEvent.metadata.stats}</div>
                    </div>
                  </div>
                )}
                {selectedEvent.metadata.outcome && (
                  <div className="flex items-start gap-2.5">
                    <Award className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                    <div>
                      <div className="text-slate-500 uppercase tracking-wider">Kazanımlar</div>
                      <div className="text-slate-200 mt-0.5">{selectedEvent.metadata.outcome}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {selectedEvent.metadata.tags && selectedEvent.metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedEvent.metadata.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 bg-slate-800/80 border border-brand-border rounded text-xs font-mono text-brand-muted">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Event Content Text if available */}
            {selectedEvent.content && selectedEvent.content.trim() && (
              <div className="pt-4 border-t border-brand-border/60 text-slate-300 text-sm leading-relaxed space-y-2">
                <div className="font-mono text-xs text-brand-cyan mb-2">// ETKİNLİK İÇERİĞİ</div>
                <div className="whitespace-pre-line opacity-90">{selectedEvent.content}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

