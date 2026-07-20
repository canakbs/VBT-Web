'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Terminal, ArrowRight, Users } from 'lucide-react';
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

  // Live regression statistics state for UI display
  const [stats, setStats] = useState({
    equation: 'y = 0.00x + 0.00',
    pointCount: '42',
    fit: '0.00',
  });

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
      // General positive linear trend: y = 0.5 * x + noise
      const x = 50 + Math.random() * (width - 100);
      const targetY = height / 2 + (x - width / 2) * 0.45;
      const noise = (Math.random() - 0.5) * (height * 0.25);
      const y = Math.max(50, Math.min(height - 50, targetY + noise));

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

      // Draw Grid Background
      const gridSize = 40;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Axes lines
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.06)';
      ctx.lineWidth = 1;
      // Y Axis
      ctx.beginPath();
      ctx.moveTo(50, 0);
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

        // Draw Residual lines (Soft subtle opacity)
        ctx.lineWidth = 1;
        pts.forEach((p) => {
          const predY = slope * p.x + intercept;
          const error = Math.abs(p.y - predY);
          const intensity = Math.min(1, error / 150);

          ctx.strokeStyle = `rgba(${Math.floor(intensity * 255)}, ${Math.floor((1 - intensity) * 200 + 20)}, 255, 0.15)`;
          ctx.beginPath();
          ctx.setLineDash([2, 3]);
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, predY);
          ctx.stroke();
        });
        ctx.setLineDash([]);

        // Draw Regression line (Softened brightness & subtle glow)
        const startX = 0;
        const startY = intercept;
        const endX = canvas.width;
        const endY = slope * canvas.width + intercept;

        ctx.strokeStyle = 'rgba(0, 242, 254, 0.45)';
        ctx.lineWidth = 1.8;
        ctx.shadowColor = 'rgba(0, 242, 254, 0.3)';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw data points (Softened green dots)
        ctx.fillStyle = 'rgba(0, 245, 160, 0.6)';
        pts.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
          ctx.fill();
        });

        const mathSlope = -slope;
        const mathIntercept = canvas.height - intercept;
        setStats({
          equation: `y = ${mathSlope.toFixed(2)}x + ${mathIntercept.toFixed(0)}`,
          pointCount: String(pts.length),
          fit: Math.max(0, r2).toFixed(3),
        });
      }

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
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

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
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
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-transparent border-b border-brand-border"
    >
      {/* 2D Canvas Interactive Physics Layer — Placed in background z-0 */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
        className="absolute inset-0 w-full h-full cursor-crosshair bg-transparent z-0"
      />

      {/* Navigation Bar Header */}
      <SiteNav />

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

        {/* Right Side: Interactive Linear Regression Mathematical Console */}
        <div className="pointer-events-auto w-full max-w-[320px] p-6 bg-[#090d16]/90 border border-brand-border rounded-2xl backdrop-blur-xl font-mono text-xs text-slate-300 shadow-2xl shadow-black/50 relative overflow-hidden z-20">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border/40 mb-4">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-brand-cyan" />
              <span className="text-brand-cyan font-bold uppercase tracking-wider text-[11px]">
                Regresyon Simülatörü
              </span>
            </div>
            <span className="text-[9px] text-brand-muted">CANLI ANALİZ</span>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="text-[10px] text-brand-muted uppercase">DENKLEM METRİĞİ</div>
              <div className="text-white text-xs font-mono font-semibold mt-1 p-2 bg-brand-card/60 border border-brand-border/40 rounded">
                {stats.equation}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-brand-card/40 border border-brand-border/30 rounded">
                <div className="text-[9px] text-brand-muted">VERİ NOKTASI</div>
                <div className="text-brand-emerald text-sm font-bold mt-0.5">{stats.pointCount}</div>
              </div>
              <div className="p-2 bg-brand-card/40 border border-brand-border/30 rounded">
                <div className="text-[9px] text-brand-muted">UYUM (R²)</div>
                <div className="text-brand-cyan text-sm font-bold mt-0.5">{stats.fit}</div>
              </div>
            </div>

            <p className="text-[10px] text-brand-muted leading-relaxed pt-1">
              💡 Fareyi grafik üzerinde gezdirerek veri noktalarını çekip canlı regresyon çizgisini değiştirebilirsiniz.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
