'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckSquare, Clock, Users, Award } from 'lucide-react';

interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: React.ReactNode;
  sparkline: number[];
  color: string;
}

const STATS: StatItem[] = [
  {
    id: 'members',
    label: 'Kayıtlı Üye',
    value: 440,
    suffix: '+',
    icon: <Users className="w-5 h-5 text-brand-cyan" />,
    sparkline: [20, 50, 90, 140, 220, 310, 440],
    color: '#00f2fe',
  },
  {
    id: 'workshops',
    label: 'Workshop & Eğitim Saati',
    value: 400,
    suffix: 'h',
    icon: <Clock className="w-5 h-5 text-brand-emerald" />,
    sparkline: [40, 80, 150, 220, 290, 350, 400],
    color: '#00f5a0',
  },
  {
    id: 'events',
    label: 'Düzenlenen Etkinlik',
    value: 24,
    suffix: '',
    icon: <Activity className="w-5 h-5 text-brand-cyan" />,
    sparkline: [2, 6, 9, 14, 18, 20, 24],
    color: '#00f2fe',
  },
  {
    id: 'projects',
    label: 'Aktif Proje',
    value: 8,
    suffix: ' repo',
    icon: <CheckSquare className="w-5 h-5 text-brand-blue" />,
    sparkline: [1, 2, 4, 4, 6, 7, 8],
    color: '#3b82f6',
  },
  {
    id: 'teams',
    label: 'Yarışma Ekibi',
    value: 15,
    suffix: ' takım',
    icon: <Award className="w-5 h-5 text-amber-400" />,
    sparkline: [2, 4, 6, 9, 11, 13, 15],
    color: '#fbbf24',
  },
];

// Helper: Least Squares Linear Regression
function calculateLinearRegression(yValues: number[]) {
  const n = yValues.length;
  const xValues = Array.from({ length: n }, (_, i) => i);
  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);

  // m = (n*sumXY - sumX*sumY) / (n*sumXX - sumX^2)
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  // c = (sumY - m*sumX) / n
  const intercept = (sumY - slope * sumX) / n;

  // Coefficient of determination (R^2)
  const meanY = sumY / n;
  const ssTot = yValues.reduce((sum, y) => sum + Math.pow(y - meanY, 2), 0);
  const ssRes = yValues.reduce((sum, y, i) => sum + Math.pow(y - (slope * i + intercept), 2), 0);
  const rSquared = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  return {
    slope,
    intercept,
    rSquared: rSquared.toFixed(3),
    equation: `y = ${slope.toFixed(1)}x + ${intercept.toFixed(1)}`,
  };
}

// Counting hook
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver;
    let startTimestamp: number | null = null;
    const duration = 1500;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    if (elementRef.current) {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      });
      observer.observe(elementRef.current);
    }

    return () => observer?.disconnect();
  }, [value]);

  return (
    <span ref={elementRef}>
      {count}
      {suffix}
    </span>
  );
}

export default function ImpactDashboard() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Pre-calculate regression metrics for all statistics
  const regressions = useMemo(() => {
    const data: Record<string, ReturnType<typeof calculateLinearRegression>> = {};
    STATS.forEach((stat) => {
      data[stat.id] = calculateLinearRegression(stat.sparkline);
    });
    return data;
  }, []);

  return (
    <section id="community-impact" className="relative py-24 bg-transparent border-b border-brand-border">
      {/* Grid pattern background */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-start mb-16">
          <span className="font-mono text-xs text-brand-cyan tracking-widest uppercase mb-2">
            [ TOPLULUK İSTATİSTİKLERİ ]
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Topluluğumuz <br />
            <span className="bg-gradient-to-r from-brand-cyan to-brand-emerald bg-clip-text text-transparent">
              Rakamlarla
            </span>
          </h2>
        </div>

        {/* Telemetry Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {STATS.map((stat) => {
            const isHovered = hoveredCard === stat.id;
            const reg = regressions[stat.id];

            // Map sparkline points to SVG coordinate space [0-100, 50-5]
            const pointsCount = stat.sparkline.length;
            const maxVal = stat.value;

            // Generate start/end points for linear fit coordinates
            const x1 = 0;
            const y1 = 50 - (reg.intercept / maxVal) * 40 - 5;
            const x2 = 100;
            const y2 = 50 - (((reg.slope * (pointsCount - 1)) + reg.intercept) / maxVal) * 40 - 5;

            return (
              <div
                key={stat.id}
                onMouseEnter={() => setHoveredCard(stat.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="bg-brand-card border border-brand-border hover:border-brand-cyan/25 rounded p-6 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden group transition-all duration-300"
              >
                {/* Card visual grids header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="p-2 bg-slate-900 border border-brand-border rounded">
                    {stat.icon}
                  </div>
                  <span className="font-mono text-[9px] text-brand-muted select-none uppercase">
                    METRIC_ID: {stat.id.toUpperCase()}
                  </span>
                </div>

                {/* Numerical Value */}
                <div className="mb-4">
                  <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </span>
                  <p className="text-slate-400 text-xs md:text-sm font-medium mt-1">
                    {stat.label}
                  </p>
                </div>

                {/* Sparkline Graphic with regression fit line overlay */}
                <div className="h-14 w-full mt-4 relative">
                  <svg className="w-full h-full" viewBox="0 0 100 50">
                    {/* Grid lines inside sparkline */}
                    <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                    <line x1="50" y1="0" x2="50" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

                    {/* Sparkline path */}
                    <motion.path
                      d={`M ${stat.sparkline
                        .map((val, i) => `${(i / (pointsCount - 1)) * 100},${50 - (val / maxVal) * 40 - 5}`)
                        .join(' L ')}`}
                      fill="none"
                      stroke={isHovered ? 'rgba(255,255,255,0.2)' : stat.color}
                      strokeWidth="1.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, ease: 'easeInOut' }}
                      className="transition-colors duration-300"
                    />

                    {/* Faint Area fill under sparkline */}
                    {!isHovered && (
                      <path
                        d={`M 0,50 L ${stat.sparkline
                          .map((val, i) => `${(i / (pointsCount - 1)) * 100},${50 - (val / maxVal) * 40 - 5}`)
                          .join(' L ')} L 100,50 Z`}
                        fill={`url(#glow-${stat.id})`}
                        className="opacity-10 pointer-events-none"
                      />
                    )}

                    {/* Linear Regression Line (Least Squares) overlay on hover */}
                    {isHovered && (
                      <motion.line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#00f2fe"
                        strokeWidth="1.2"
                        strokeDasharray="2,2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        style={{ filter: 'drop-shadow(0 0 2px #00f2fe)' }}
                      />
                    )}

                    <defs>
                      <linearGradient id={`glow-${stat.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={stat.color} />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Status Bar */}
                <div className="mt-4 pt-3 border-t border-brand-border/40 flex items-center justify-between font-mono text-[8.5px] min-h-[22px]">
                  {isHovered ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-brand-cyan flex justify-between w-full"
                    >
                      <span>Büyümeye devam 📈</span>
                      <span>TREND: ARTIYOR</span>
                    </motion.div>
                  ) : (
                    <div className="text-brand-muted flex justify-between w-full uppercase">
                      <span>DURUM: AKTİF</span>
                      <span>TREND: İYİ</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
