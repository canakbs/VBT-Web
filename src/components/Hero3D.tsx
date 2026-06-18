'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Terminal, ArrowDown } from 'lucide-react';

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
    rSquared: '0.000',
    mse: '0.00',
  });

  // Generate 45 initial data points along a general linear trend with noise
  const points = useMemoPoints();

  function useMemoPoints() {
    return useRef<Point2D[]>([]);
  }

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
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
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
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.1)';
      ctx.lineWidth = 1.5;
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
              // Gravitational pull toward mouse coordinate
              p.x += dx * force * 0.12;
              p.y += dy * force * 0.12;
            } else {
              // Return to initial coordinates
              p.x += (p.initX - p.x) * 0.05;
              p.y += (p.initY - p.y) * 0.05;
            }
          } else {
            // Decelerate back to clean layout
            p.x += (p.initX - p.x) * 0.05;
            p.y += (p.initY - p.y) * 0.05;
          }
        });

        // 2. Perform 2D Linear Regression (Least Squares Method): y = m*x + c
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        const n = pts.length;

        pts.forEach((p) => {
          sumX += p.x;
          sumY += p.y;
          sumXY += p.x * p.y;
          sumXX += p.x * p.x;
        });

        const meanX = sumX / n;
        const meanY = sumY / n;

        // Calculate slope (m) and intercept (c)
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
        const mse = ssRes / n;

        // Draw Residual lines (Actual to Regression Predictions)
        ctx.lineWidth = 1;
        pts.forEach((p) => {
          const predY = slope * p.x + intercept;
          const error = Math.abs(p.y - predY);
          const intensity = Math.min(1, error / 150);

          // Red lines for high error, green/cyan for small error
          ctx.strokeStyle = `rgba(${Math.floor(intensity * 255)}, ${Math.floor((1 - intensity) * 240 + 15)}, 255, 0.35)`;
          ctx.beginPath();
          ctx.setLineDash([2, 3]);
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, predY);
          ctx.stroke();
        });
        ctx.setLineDash([]); // Reset dash

        // Draw Regression line
        const startX = 0;
        const startY = intercept;
        const endX = canvas.width;
        const endY = slope * canvas.width + intercept;

        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow

        // Draw data points
        ctx.fillStyle = '#00f5a0';
        ctx.shadowColor = '#00f5a0';
        pts.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Update stats once per frame
        // Map pixel coordinates to dry mathematical space
        const mathSlope = -slope; // Invert for cartesian visual alignment
        const mathIntercept = canvas.height - intercept;
        setStats({
          equation: `y = ${mathSlope.toFixed(2)}x + ${mathIntercept.toFixed(0)}`,
          rSquared: Math.max(0, r2).toFixed(3),
          mse: (mse / 100).toFixed(2),
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
      className="relative h-screen w-full flex flex-col justify-between overflow-hidden bg-brand-bg border-b border-brand-border"
    >
      {/* 2D Canvas Layer */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
        className="absolute inset-0 w-full h-full cursor-crosshair bg-transparent"
      />

      {/* Header Overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-8 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brand-emerald animate-pulse" />
          <span className="font-mono text-xs tracking-widest text-brand-emerald uppercase">
            Model: Real-Time 2D Least-Squares Regression // Telemetry Active
          </span>
        </div>
        <a 
          href="/admin" 
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-1 bg-brand-card hover:bg-brand-cyan/10 border border-brand-border rounded font-mono text-xs text-brand-cyan transition-all duration-300"
        >
          <Terminal size={12} />
          <span>CMS Portal</span>
        </a>
      </div>

      {/* Hero Headline and Live Regression Console Overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between flex-grow gap-12 mt-16 md:mt-0 pointer-events-none">
        
        {/* Left Side: Copy */}
        <div className="max-w-xl text-left pointer-events-none">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-4 leading-none">
            AKDENİZ <br />
            <span className="bg-gradient-to-r from-brand-cyan to-brand-emerald bg-clip-text text-transparent">
              VERİ BİLİMİ
            </span>
          </h1>
          <p className="font-mono text-xs md:text-sm text-brand-muted tracking-wider uppercase mb-6">
            [ Mediterranean Data Science Community ]
          </p>
          <p className="text-base md:text-lg text-slate-300 mb-8 leading-relaxed">
            We are a university research movement mapping complex data to human understanding. Focus areas: Deep Learning, NLP, Computer Vision, MLOps, and fostering data intelligence.
          </p>

          <div className="flex flex-wrap gap-4 font-mono text-xs text-slate-400">
            <div className="px-3 py-2 bg-brand-card/50 border border-brand-border rounded backdrop-blur-sm">
              <span className="text-brand-cyan">LOC:</span> Akdeniz Univ. Antalya
            </div>
            <div className="px-3 py-2 bg-brand-card/50 border border-brand-border rounded backdrop-blur-sm">
              <span className="text-brand-emerald">DEPT:</span> AI, ML & MLOps
            </div>
          </div>
        </div>

        {/* Right Side: Floating Scientific Math Console */}
        <div className="w-full max-w-[320px] p-6 bg-brand-card/80 border border-brand-border rounded backdrop-blur-md font-mono text-xs text-slate-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-[8px] text-brand-muted select-none">
            REGRESSION_MONITOR_v1.0
          </div>
          
          <div className="space-y-4">
            <div className="text-brand-cyan font-bold uppercase tracking-wider pb-2 border-b border-brand-border/40">
              ■ Model Parameters
            </div>
            <div>
              <div className="text-[10px] text-brand-muted">LINEAR FIT EQUATION:</div>
              <div className="text-white text-sm font-semibold mt-0.5">{stats.equation}</div>
            </div>
            <div>
              <div className="text-[10px] text-brand-muted">DETERMINATION COEFFICIENT (R²):</div>
              <div className="text-brand-emerald text-sm font-semibold mt-0.5">{stats.rSquared}</div>
            </div>
            <div>
              <div className="text-[10px] text-brand-muted">MEAN SQUARED ERROR (MSE):</div>
              <div className="text-brand-blue text-sm font-semibold mt-0.5">{stats.mse}</div>
            </div>
            
            <div className="pt-2 border-t border-brand-border/40 text-[9px] text-brand-muted uppercase">
              Move cursor over graph area to drag points and optimize line fit.
            </div>
          </div>
        </div>

      </div>

      {/* Footer / Scroll hint */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-12 flex justify-between items-end pointer-events-none">
        <div className="hidden md:flex flex-col gap-1 font-mono text-[10px] text-slate-500">
          <div>SOLVER_TYPE: 2D Least-Squares Solver</div>
          <div>SIMULATION RUNTIME: {new Date().getFullYear()} // v2.8</div>
        </div>

        <a 
          href="#who-we-are" 
          className="pointer-events-auto group flex items-center gap-3 px-4 py-3 bg-brand-card border border-brand-border rounded-full hover:border-brand-cyan/50 hover:bg-brand-cyan/5 transition-all duration-300 font-mono text-xs text-brand-cyan"
        >
          <span>ENTER THE DATA PIPELINE</span>
          <ArrowDown size={14} className="group-hover:translate-y-1 transition-transform" />
        </a>
      </div>
    </section>
  );
}
