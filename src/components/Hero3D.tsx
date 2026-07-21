'use client';

import React, { useRef, useEffect } from 'react';
import { Sparkles, ArrowRight, Users } from 'lucide-react';
import SiteNav from '@/components/SiteNav';

interface Point2D {
  x: number;
  y: number;
  initX: number;
  initY: number;
}

export default function Hero3D() {
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
      const noise = (Math.random() - 0.5) * (height * 0.2);
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

      {/* Hero Headline & Action Area — Placed above canvas in z-10 */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between flex-grow gap-8 pt-28 pb-16 pointer-events-none">
        
        {/* Left Side: Headline & Natural Turkish Copy */}
        <div className="max-w-2xl text-left pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-cyan/10 border border-brand-cyan/30 rounded-full mb-6">
            <div className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
            <span className="text-xs font-mono text-brand-cyan font-medium">
              Akdeniz Üniversitesi Veri Bilimi Topluluğu
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Veri bilimini <br />
            <span className="bg-gradient-to-r from-brand-cyan via-blue-400 to-brand-emerald bg-clip-text text-transparent">
              birlikte keşfediyoruz
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-xl">
            Yapay zekâ, makine öğrenmesi ve veri analitiği alanında çalıştaylar düzenliyor,
            açık kaynak projeler geliştiriyor ve deneyimlerimizi paylaşıyoruz. Merakın varsa aramıza katıl!
          </p>

          {/* Large Action Buttons */}
          <div className="pointer-events-auto flex flex-wrap items-center gap-4 mb-10">
            <a
              href="/#join-us"
              className="inline-flex items-center gap-2.5 px-8 py-4 text-base font-bold bg-brand-cyan text-[#090d16] rounded-xl hover:bg-brand-cyan/90 transition-all shadow-lg shadow-brand-cyan/25 hover:scale-105 active:scale-95"
            >
              <span>Bize Katıl</span>
              <ArrowRight size={18} />
            </a>
            <a
              href="/ekibimiz"
              className="inline-flex items-center gap-2.5 px-8 py-4 text-base font-semibold bg-brand-card/90 text-white border border-brand-border rounded-xl hover:border-brand-cyan/40 hover:bg-brand-card transition-all backdrop-blur-md hover:scale-105 active:scale-95"
            >
              <Users size={18} />
              <span>Ekibimiz</span>
            </a>
          </div>

          <div className="flex flex-wrap gap-6 text-xs font-mono text-brand-muted">
            <span className="flex items-center gap-1.5">📍 Antalya</span>
            <span className="flex items-center gap-1.5">👥 440+ üye</span>
            <span className="flex items-center gap-1.5">📅 24+ etkinlik</span>
          </div>
        </div>

        {/* Right Side: Community Slogan & Vision Card */}
        <div className="pointer-events-auto w-full max-w-[340px] p-6 bg-[#090d16]/90 border border-brand-border rounded-2xl backdrop-blur-xl text-slate-300 shadow-2xl shadow-black/50 relative overflow-hidden z-20 hover:border-brand-cyan/40 transition-all group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-full blur-2xl group-hover:bg-brand-cyan/10 transition-all pointer-events-none" />
          
          <div className="flex items-center justify-between pb-3 border-b border-brand-border/40 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-brand-cyan animate-pulse" />
              <span className="text-brand-cyan font-bold uppercase tracking-wider text-[11px] font-mono">
                Topluluk Mottomuz
              </span>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono font-medium text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/20 rounded-full">
              VBT
            </span>
          </div>

          <div className="space-y-4">
            <blockquote className="text-base font-semibold text-white italic leading-relaxed border-l-2 border-brand-cyan pl-3.5 my-2">
              “Verinin gücüyle öğreniyor, birlikte geliştirip geleceği şekillendiriyoruz.”
            </blockquote>

            <div className="grid grid-cols-1 gap-2 pt-2 text-xs font-mono">
              <div className="flex items-center gap-2.5 p-2.5 bg-brand-card/50 border border-brand-border/30 rounded-lg">
                <span className="text-brand-cyan font-bold">01.</span>
                <span className="text-slate-200">Merak Et & Analiz Et</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 bg-brand-card/50 border border-brand-border/30 rounded-lg">
                <span className="text-brand-emerald font-bold">02.</span>
                <span className="text-slate-200">Üret & Paylaş</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 bg-brand-card/50 border border-brand-border/30 rounded-lg">
                <span className="text-blue-400 font-bold">03.</span>
                <span className="text-slate-200">Birlikte Büyü</span>
              </div>
            </div>

            <p className="text-[11px] text-brand-muted leading-relaxed pt-1">
              💡 Akdeniz Üniversitesi Veri Bilimi Topluluğu olarak veriye ilgi duyan herkesi tek bir çatıda buluşturuyoruz.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
