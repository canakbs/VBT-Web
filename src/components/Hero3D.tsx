'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Users } from 'lucide-react';
import SiteNav from '@/components/SiteNav';

interface Point2D {
  x: number;
  y: number;
  initX: number;
  initY: number;
}

interface HeroFrame {
  id: string;
  name?: string;
  src: string;
  caption: string;
}

interface Hero3DProps {
  frames?: HeroFrame[];
}

export default function Hero3D({ frames = [] }: Hero3DProps) {
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  // Generate 42 initial data points along a general linear trend with noise
  const points = useRef<Point2D[]>([]);

  // Initialize points on first load relative to canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const list: Point2D[] = [];

    for (let i = 0; i < 42; i++) {
      // General positive linear trend: y = 0.5 * x + noise below header area (min Y = 120)
      const x = 60 + Math.random() * (width - 120);
      const targetY = height / 2 + (x - width / 2) * 0.35;
      const noiseRange = width < 768 ? height * 0.82 : height * 0.2;
      const noise = (Math.random() - 0.5) * noiseRange;
      const y = Math.max(120, Math.min(height - 60, targetY + noise));

      list.push({
        x,
        y,
        initX: x,
        initY: y,
      });
    }
    points.current = list;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Clip canvas drawing so canvas NEVER renders over the top header bar (top 85px)
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 85, canvas.width, canvas.height - 85);
      ctx.clip();

      // Draw Grid Background
      const gridSize = 40;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.012)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 85);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 85; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Axes lines (Soft background contrast)
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.04)';
      ctx.lineWidth = 1;
      // Y Axis
      ctx.beginPath();
      ctx.moveTo(50, 85);
      ctx.lineTo(50, canvas.height);
      ctx.stroke();
      // X Axis
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 50);
      ctx.lineTo(canvas.width, canvas.height - 50);
      ctx.stroke();

      const pts = points.current;

      // 1. Shift data coordinates based on mouse attraction
      if (pts.length > 0) {
        pts.forEach((p) => {
          if (mouseRef.current.active) {
            const dx = mouseRef.current.x - p.x;
            const dy = mouseRef.current.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Attraction radius
            if (dist < 180) {
              const force = (180 - dist) / 180;
              p.x += dx * force * 0.12;
              p.y += dy * force * 0.12;
            } else {
              p.x += (p.initX - p.x) * 0.05;
              p.y += (p.initY - p.y) * 0.05;
            }
          } else {
            p.x += (p.initX - p.x) * 0.05;
            p.y += (p.initY - p.y) * 0.05;
          }
          // Clamp Y below header
          if (p.y < 100) p.y = 100;
        });

        // 2. Perform 2D Linear Regression (Least Squares Method): y = m*x + c
        let sumX = 0, sumY = 0, sumXX = 0;
        const n = pts.length;

        pts.forEach((p) => {
          sumX += p.x;
          sumY += p.y;
          sumXX += p.x * p.x;
        });

        const meanX = sumX / n;
        const meanY = sumY / n;

        let num = 0;
        let den = 0;
        pts.forEach((p) => {
          num += (p.x - meanX) * (p.y - meanY);
          const diffX = p.x - meanX;
          den += diffX * diffX;
        });

        const slope = den === 0 ? 0 : num / den;
        const intercept = meanY - slope * meanX;

        // R^2 calculation
        let ssTot = 0;
        let ssRes = 0;
        pts.forEach((p) => {
          const predY = slope * p.x + intercept;
          ssTot += Math.pow(p.y - meanY, 2);
          ssRes += Math.pow(p.y - predY, 2);
        });

        const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

        // Draw Residual lines (Ultra subtle background opacity)
        ctx.lineWidth = 0.8;
        pts.forEach((p) => {
          const predY = slope * p.x + intercept;
          const error = Math.abs(p.y - predY);
          const intensity = Math.min(1, error / 150);

          ctx.strokeStyle = `rgba(${Math.floor(intensity * 255)}, ${Math.floor((1 - intensity) * 200 + 20)}, 255, 0.08)`;
          ctx.beginPath();
          ctx.setLineDash([2, 3]);
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, predY);
          ctx.stroke();
        });
        ctx.setLineDash([]);

        // Draw Regression line (Softened low opacity 18%, 1.2px, zero glow)
        const startX = 0;
        const startY = intercept;
        const endX = canvas.width;
        const endY = slope * canvas.width + intercept;

        ctx.strokeStyle = 'rgba(0, 242, 254, 0.22)';
        ctx.lineWidth = 1.3;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw data points (Softened green dots, 25% opacity)
        ctx.fillStyle = 'rgba(0, 245, 160, 0.35)';
        pts.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.8, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      ctx.restore();
      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect && e.touches.length > 0) {
      mouseRef.current = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
        active: true,
      };
    }
  };

  const basePhotos = [
    {
      id: 'workshop',
      defaultSrc: '/images/hero/workshop.png',
      defaultCaption: 'Çalıştaylar #2025',
      position: 'top-[33%] lg:top-[12%] left-[1.5%] xl:left-[3.5%]',
      size: 'w-18 sm:w-20 md:w-28 lg:w-44 xl:w-52',
      baseRotate: '-rotate-6',
      hoverRotate: 'hover:-rotate-1',
      zIndex: 'z-10',
    },
    {
      id: 'hackathon',
      defaultSrc: '/images/hero/hackathon.png',
      defaultCaption: 'Med Hackathon',
      position: 'top-[52%] lg:top-[36%] left-[0.5%] xl:left-[2%]',
      size: 'w-22 sm:w-24 md:w-32 lg:w-52 xl:w-60',
      baseRotate: 'rotate-4',
      hoverRotate: 'hover:rotate-0',
      zIndex: 'z-12',
    },
    {
      id: 'community',
      defaultSrc: '/images/hero/community.png',
      defaultCaption: 'Topluluk Ekibi',
      position: 'bottom-[20%] lg:bottom-[8%] left-[2%] xl:left-[4%]',
      size: 'w-16 sm:w-18 md:w-24 lg:w-40 xl:w-48',
      baseRotate: '-rotate-4',
      hoverRotate: 'hover:-rotate-1',
      zIndex: 'z-10',
    },
    {
      id: 'speakers',
      defaultSrc: '/images/hero/speakers.png',
      defaultCaption: 'Yapay Zekâ Semineri',
      position: 'top-[34%] lg:top-[13%] right-[1.5%] xl:right-[3.5%]',
      size: 'w-18 sm:w-20 md:w-28 lg:w-44 xl:w-52',
      baseRotate: 'rotate-5',
      hoverRotate: 'hover:rotate-1',
      zIndex: 'z-10',
    },
    {
      id: 'coding',
      defaultSrc: '/images/hero/coding.png',
      defaultCaption: 'Model Eğitimi',
      position: 'top-[53%] lg:top-[37%] right-[0.5%] xl:right-[2%]',
      size: 'w-22 sm:w-24 md:w-32 lg:w-52 xl:w-60',
      baseRotate: '-rotate-5',
      hoverRotate: 'hover:-rotate-1',
      zIndex: 'z-12',
    },
    {
      id: 'team',
      defaultSrc: '/images/hero/team.png',
      defaultCaption: 'Birlikte Öğreniyoruz',
      position: 'bottom-[21%] lg:bottom-[9%] right-[2%] xl:right-[4%]',
      size: 'w-16 sm:w-18 md:w-24 lg:w-40 xl:w-48',
      baseRotate: 'rotate-3',
      hoverRotate: 'hover:rotate-0',
      zIndex: 'z-10',
    },
  ];

  const polaroidPhotos = basePhotos.map((p) => {
    const matchedFrame = (frames || []).find((f) => f.id === p.id);
    return {
      id: p.id,
      src: matchedFrame?.src || p.defaultSrc,
      alt: matchedFrame?.caption || p.defaultCaption,
      caption: matchedFrame?.caption || p.defaultCaption,
      position: p.position,
      size: p.size,
      baseRotate: p.baseRotate,
      hoverRotate: p.hoverRotate,
      zIndex: p.zIndex,
    };
  });

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-transparent border-b border-brand-border"
    >
      {/* Navigation Bar Header — Highest Z-Index (z-50) */}
      <SiteNav />

      {/* 2D Canvas Interactive Physics Layer — Placed strictly in background z-0 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none bg-transparent z-0"
      />

      {/* Side Margins Polaroid Photos (Absolute Positioned, Scattered) */}
      {polaroidPhotos.map((photo) => {
        const isActive = activePhotoId === photo.id;
        return (
          <div
            key={photo.id}
            onClick={() => setActivePhotoId(isActive ? null : photo.id)}
            className={`absolute ${photo.position} ${photo.size} ${photo.zIndex} 
              block pointer-events-auto group cursor-pointer
              transition-all duration-300 ease-out
              p-1 pb-3 sm:p-2 sm:pb-6 bg-slate-100/95 border border-white/80 rounded-md
              ${isActive 
                ? 'rotate-0 scale-110 z-30 shadow-2xl shadow-brand-cyan/40 border-brand-cyan/40' 
                : `${photo.baseRotate} ${photo.hoverRotate} hover:scale-105 hover:-translate-y-2 hover:z-30 shadow-xl shadow-black/80 hover:shadow-2xl hover:shadow-brand-cyan/30`
              }`}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-slate-900 border border-slate-300/40">
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="mt-2 text-center">
              <span className="block text-[6px] sm:text-[9px] md:text-[11px] font-mono font-bold text-slate-800 tracking-tight truncate">
                {photo.caption}
              </span>
            </div>
          </div>
        );
      })}

      {/* Hero Headline & Action Area — Centered vertically & horizontally, max-width ~45-50% */}
      <div className="relative z-20 w-full flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-24 pb-12 pointer-events-none">
        <div className="w-[76vw] sm:w-full max-w-xl lg:max-w-[48%] min-w-0 mx-auto flex flex-col items-center pointer-events-auto space-y-6 sm:space-y-4">
          



          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]">
            Veri bilimini <br />
            <span className="bg-gradient-to-r from-brand-cyan via-blue-400 to-brand-emerald bg-clip-text text-transparent">
              birlikte keşfediyoruz
            </span>
          </h1>

          {/* Community Vision Quote & Compact Stat Metrics Widget */}
          <div className="w-full max-w-md mt-1 p-2 sm:p-4 bg-[#090d16]/90 border border-brand-border/80 rounded-xl backdrop-blur-xl text-slate-300 shadow-xl shadow-black/50 relative overflow-hidden group hover:border-brand-cyan/40 transition-all">
            <div className="absolute top-0 right-0 w-28 h-28 bg-brand-cyan/5 rounded-full blur-2xl group-hover:bg-brand-cyan/10 transition-all pointer-events-none" />

            <div className="space-y-3">
              <blockquote className="text-[11.5px] sm:text-xs md:text-sm font-semibold text-white italic leading-relaxed border-l-2 border-brand-cyan pl-2.5 sm:pl-3 my-0.5 text-left">
                “Veri bilimi etrafında; birlikte üreten, birlikte öğrenen ve bilgisini topluma aktaran bir topluluk inşa ediyoruz.”
              </blockquote>

              {/* Stat Cards */}
              <div className="grid grid-cols-3 gap-1 sm:gap-2 pt-1">
                <div className="p-1.5 sm:p-2.5 bg-brand-card/50 border border-brand-border/40 rounded-lg text-center flex flex-col justify-center">
                  <div className="text-sm sm:text-lg font-extrabold text-white tracking-tight font-mono">
                    <StatCounter value={370} suffix="+" />
                  </div>
                  <div className="text-[9.5px] sm:text-[10px] text-brand-muted mt-0.5 leading-tight font-sans font-medium">
                    Kayıtlı Üye
                  </div>
                </div>

                <div className="p-1.5 sm:p-2.5 bg-brand-card/50 border border-brand-border/40 rounded-lg text-center flex flex-col justify-center">
                  <div className="text-sm sm:text-lg font-extrabold text-brand-cyan tracking-tight font-mono">
                    <StatCounter value={30} suffix="+" />
                  </div>
                  <div className="text-[9.5px] sm:text-[10px] text-brand-muted mt-0.5 leading-tight font-sans font-medium">
                    Etkinlik
                  </div>
                </div>

                <div className="p-1.5 sm:p-2.5 bg-brand-card/50 border border-brand-border/40 rounded-lg text-center flex flex-col justify-center">
                  <div className="text-sm sm:text-lg font-extrabold text-brand-emerald tracking-tight font-mono">
                    <StatCounter value={7} suffix="" />
                  </div>
                  <div className="text-[9.5px] sm:text-[10px] text-brand-muted mt-0.5 leading-tight font-sans font-medium">
                    Aktif Proje
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons (at the very bottom) */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
            <a
              href="/#join-us"
              className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-6 sm:py-3 text-[11px] sm:text-sm font-bold bg-brand-cyan text-[#090d16] rounded-xl hover:bg-brand-cyan/90 transition-all shadow-lg shadow-brand-cyan/25 hover:scale-105 active:scale-95"
            >
              <span>Bize Katıl</span>
              <ArrowRight size={14} className="sm:w-4 sm:h-4" />
            </a>
            <a
              href="/ekibimiz"
              className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-6 sm:py-3 text-[11px] sm:text-sm font-semibold bg-brand-card/90 text-white border border-brand-border rounded-xl hover:border-brand-cyan/40 hover:bg-brand-card transition-all backdrop-blur-md hover:scale-105 active:scale-95"
            >
              <Users size={14} className="sm:w-4 sm:h-4" />
              <span>Ekibimiz</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value]);

  return (
    <span suppressHydrationWarning>
      {count}
      {suffix}
    </span>
  );
}
