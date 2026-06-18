'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, Briefcase, Trophy, Globe, Play, RotateCcw, Award } from 'lucide-react';

interface ClusterNode {
  id: string;
  label: string;
  category: 'hub' | 'members' | 'workshops' | 'projects' | 'competitions';
  x: number; // current x
  y: number; // current y
  initialX: number; // initial clean layout coordinates
  initialY: number;
  details: {
    title: string;
    value: string;
    description: string;
  };
}

const INITIAL_NODES: ClusterNode[] = [
  // Hub
  {
    id: 'hub',
    label: 'Akdeniz Veri Bilimi',
    category: 'hub',
    x: 50, y: 50, initialX: 50, initialY: 50,
    details: {
      title: 'Mediterranean Data Science Hub',
      value: 'Simulation Center',
      description: 'The core network hub routing and clustering datasets into operational research divisions.',
    },
  },
  // Members
  {
    id: 'members_hub',
    label: 'Members & Network',
    category: 'members',
    x: 25, y: 30, initialX: 25, initialY: 30,
    details: {
      title: 'Community Network',
      value: '440+ Registered',
      description: 'An inclusive network of computer science, engineering, and mathematics students collaborating on intelligent tech.',
    },
  },
  {
    id: 'members_1',
    label: 'Mentors',
    category: 'members',
    x: 18, y: 22, initialX: 18, initialY: 22,
    details: {
      title: 'Technical Mentors',
      value: '12 Active Leads',
      description: 'Senior students and industry professionals guiding newcomers in PyTorch, Scikit-Learn, and engineering paths.',
    },
  },
  {
    id: 'members_2',
    label: 'Advisors',
    category: 'members',
    x: 32, y: 24, initialX: 32, initialY: 24,
    details: {
      title: 'Academic Advisors',
      value: '3 Faculty Professors',
      description: 'Department heads providing academic guidance, research review, and computing resources.',
    },
  },
  // Workshops
  {
    id: 'workshops_hub',
    label: 'Training Labs',
    category: 'workshops',
    x: 75, y: 30, initialX: 75, initialY: 30,
    details: {
      title: 'AI Workshops & Bootcamps',
      value: '400+ Hours Taught',
      description: 'Hands-on curriculum ranging from Python fundamentals to custom model deployment (MLOps).',
    },
  },
  {
    id: 'workshops_1',
    label: 'DL Bootcamp',
    category: 'workshops',
    x: 82, y: 22, initialX: 82, initialY: 22,
    details: {
      title: 'Deep Learning Bootcamp',
      value: 'Annual 6-Week Course',
      description: 'Comprehensive sessions covering CNNs, RNNs, Attention mechanisms, and training on cloud GPUs.',
    },
  },
  {
    id: 'workshops_2',
    label: 'Data Analytics',
    category: 'workshops',
    x: 68, y: 24, initialX: 68, initialY: 24,
    details: {
      title: 'Data Wrangling Labs',
      value: 'Introductory Series',
      description: 'Exploratory data analysis using Pandas, NumPy, and interactive data visualization practices.',
    },
  },
  // Projects
  {
    id: 'projects_hub',
    label: 'Active Projects',
    category: 'projects',
    x: 25, y: 70, initialX: 25, initialY: 70,
    details: {
      title: 'Research & Development',
      value: '8 Ongoing repos',
      description: 'Open-source scientific pipelines designed to solve regional agricultural and urban traffic constraints.',
    },
  },
  {
    id: 'projects_1',
    label: 'Drone Vision',
    category: 'projects',
    x: 18, y: 78, initialX: 18, initialY: 78,
    details: {
      title: 'Drone Vision Pipeline',
      value: 'Stage: Deployment',
      description: 'YOLO-based drone imaging classification systems running locally on Edge NVIDIA Jetson boards.',
    },
  },
  {
    id: 'projects_2',
    label: 'Traffic RL',
    category: 'projects',
    x: 32, y: 76, initialX: 32, initialY: 76,
    details: {
      title: 'Traffic Control RL',
      value: 'Stage: Development',
      description: 'Optimizing Antalya signal lights dynamically with reinforcement learning networks in SUMO.',
    },
  },
  // Competitions
  {
    id: 'competitions_hub',
    label: 'Competitions',
    category: 'competitions',
    x: 75, y: 70, initialX: 75, initialY: 70,
    details: {
      title: 'Competitions & Hackathons',
      value: '9 National Awards',
      description: 'Competing globally and nationally in machine learning benchmarks and hackathons.',
    },
  },
  {
    id: 'competitions_1',
    label: 'Teknofest AI',
    category: 'competitions',
    x: 82, y: 78, initialX: 82, initialY: 78,
    details: {
      title: 'Teknofest AI Contest',
      value: 'Top 3 Finalist',
      description: 'Competing in the Natural Language Processing and Agricultural Robotics tracks at Turkey\'s biggest technology fest.',
    },
  },
  {
    id: 'competitions_2',
    label: 'Kaggle Labs',
    category: 'competitions',
    x: 68, y: 76, initialX: 68, initialY: 76,
    details: {
      title: 'Kaggle Classrooms',
      value: 'Monthly Sprints',
      description: 'Internal hackathons pitting members against tabular, image, and text benchmarks in a live scoreboard.',
    },
  },
];

interface Centroid {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;
}

export default function WhoWeAreGraph() {
  const [nodes, setNodes] = useState<ClusterNode[]>(INITIAL_NODES);
  const [activeNode, setActiveNode] = useState<ClusterNode>(INITIAL_NODES[0]);
  const [centroids, setCentroids] = useState<Centroid[]>([
    { id: 'members', x: 30, y: 35, color: '#00f2fe', name: 'Members Centroid' },
    { id: 'workshops', x: 70, y: 35, color: '#00f5a0', name: 'Workshops Centroid' },
    { id: 'projects', x: 30, y: 65, color: '#3b82f6', name: 'Projects Centroid' },
    { id: 'competitions', x: 70, y: 65, color: '#fbbf24', name: 'Competitions Centroid' },
  ]);
  const [iteration, setIteration] = useState(0);
  const [clusteringActive, setClusteringActive] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hub': return <Globe className="text-white w-5 h-5" />;
      case 'members': return <Users className="text-brand-cyan w-5 h-5" />;
      case 'workshops': return <BookOpen className="text-brand-emerald w-5 h-5" />;
      case 'projects': return <Briefcase className="text-brand-blue w-5 h-5" />;
      case 'competitions': return <Trophy className="text-amber-400 w-5 h-5" />;
      default: return null;
    }
  };

  // Run a single K-Means step
  const runKMeansStep = () => {
    setClusteringActive(true);
    setIteration((prev) => prev + 1);

    // 1. Assignment Step: Assign nodes to nearest centroids
    const nodeAssignments = nodes.map((node) => {
      if (node.category === 'hub') return node; // Keep central hub fixed

      let minDistance = Infinity;
      let nearestCentroid = centroids[0];

      centroids.forEach((centroid) => {
        const dx = node.x - centroid.x;
        const dy = node.y - centroid.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDistance) {
          minDistance = dist;
          nearestCentroid = centroid;
        }
      });

      // Shift node coordinates slightly closer to its nearest centroid
      const pullForce = 0.45; // Speed of shifting
      const newX = node.x + (nearestCentroid.x - node.x) * pullForce;
      const newY = node.y + (nearestCentroid.y - node.y) * pullForce;

      return {
        ...node,
        x: newX,
        y: newY,
      };
    });

    setNodes(nodeAssignments);

    // 2. Update Step: Recompute centroids based on mean positions of assigned nodes
    const updatedCentroids = centroids.map((centroid) => {
      // Find all nodes in this category
      const assignedNodes = nodeAssignments.filter((n) => n.category === centroid.id);
      if (assignedNodes.length === 0) return centroid;

      const meanX = assignedNodes.reduce((sum, n) => sum + n.x, 0) / assignedNodes.length;
      const meanY = assignedNodes.reduce((sum, n) => sum + n.y, 0) / assignedNodes.length;

      return {
        ...centroid,
        x: meanX,
        y: meanY,
      };
    });

    setCentroids(updatedCentroids);
  };

  // Disperse datapoints randomly inside the boundaries to show K-means fitting
  const disperseNodes = () => {
    setIteration(0);
    setClusteringActive(true);
    
    // Randomize nodes coordinates, keeping central hub at (50, 50)
    setNodes((prevNodes) =>
      prevNodes.map((n) => {
        if (n.category === 'hub') return n;
        return {
          ...n,
          x: 15 + Math.random() * 70,
          y: 15 + Math.random() * 70,
        };
      })
    );

    // Scatter centroids randomly too
    setCentroids([
      { id: 'members', x: 20 + Math.random() * 20, y: 20 + Math.random() * 20, color: '#00f2fe', name: 'Members Centroid' },
      { id: 'workshops', x: 60 + Math.random() * 20, y: 20 + Math.random() * 20, color: '#00f5a0', name: 'Workshops Centroid' },
      { id: 'projects', x: 20 + Math.random() * 20, y: 60 + Math.random() * 20, color: '#3b82f6', name: 'Projects Centroid' },
      { id: 'competitions', x: 60 + Math.random() * 20, y: 60 + Math.random() * 20, color: '#fbbf24', name: 'Competitions Centroid' },
    ]);
  };

  // Reset to original structured clean layout
  const resetToCleanLayout = () => {
    setNodes(INITIAL_NODES);
    setCentroids([
      { id: 'members', x: 25, y: 30, color: '#00f2fe', name: 'Members Centroid' },
      { id: 'workshops', x: 75, y: 30, color: '#00f5a0', name: 'Workshops Centroid' },
      { id: 'projects', x: 25, y: 70, color: '#3b82f6', name: 'Projects Centroid' },
      { id: 'competitions', x: 75, y: 70, color: '#fbbf24', name: 'Competitions Centroid' },
    ]);
    setIteration(0);
    setClusteringActive(false);
  };

  // Calculate Mathematical Metrics: Inertia & Silhouette Approximation
  const metrics = useMemo(() => {
    // Inertia: Sum of squared distances to assigned centroid
    let inertia = 0;
    let totalDists = 0;
    let nodeCount = 0;

    nodes.forEach((n) => {
      if (n.category === 'hub') return;
      const centroid = centroids.find((c) => c.id === n.category);
      if (!centroid) return;

      const dx = n.x - centroid.x;
      const dy = n.y - centroid.y;
      const dSquared = dx * dx + dy * dy;
      inertia += dSquared;
      totalDists += Math.sqrt(dSquared);
      nodeCount++;
    });

    // Silhouette coefficient approximation
    // S = (b - a) / max(a, b) where a is mean intra-cluster dist, b is mean nearest-cluster dist
    const avgIntraDist = nodeCount ? totalDists / nodeCount : 0;
    const silhouette = Math.max(0.1, 1 - (avgIntraDist / 35)).toFixed(3); // Mock-scaled ratio

    return {
      inertia: inertia.toFixed(2),
      silhouette: iteration === 0 && !clusteringActive ? '0.000' : silhouette,
    };
  }, [nodes, centroids, iteration, clusteringActive]);

  // Calculate cluster diameters for glowing hulls
  const clusterRadii = useMemo(() => {
    const radii: Record<string, number> = { members: 5, workshops: 5, projects: 5, competitions: 5 };
    
    centroids.forEach((centroid) => {
      const assignedNodes = nodes.filter((n) => n.category === centroid.id);
      let maxDist = 4; // minimum radius

      assignedNodes.forEach((node) => {
        const dx = node.x - centroid.x;
        const dy = node.y - centroid.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > maxDist) maxDist = dist;
      });

      radii[centroid.id] = maxDist;
    });

    return radii;
  }, [nodes, centroids]);

  return (
    <section id="who-we-are" className="relative py-24 bg-brand-bg/95 border-b border-brand-border">
      {/* Background patterns */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Information Column */}
          <div className="w-full md:w-5/12 flex flex-col items-start">
            <span className="font-mono text-xs text-brand-cyan tracking-widest uppercase mb-2">
              [ DATA SCIENCE LAYER: K-MEANS SIMULATION ]
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Interactive <br />
              <span className="bg-gradient-to-r from-brand-cyan to-brand-emerald bg-clip-text text-transparent">
                Node Clustering
              </span>
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
              Instead of a static structure, our community network operates as a live **K-Means Clustering model**. Scatter the node embeddings and run iterations to watch nodes segment into their thematic cluster centroids.
            </p>

            {/* Interactive Clustering Controller */}
            <div className="w-full grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={runKMeansStep}
                className="flex items-center justify-center gap-1.5 p-3 bg-brand-emerald/10 hover:bg-brand-emerald/20 border border-brand-emerald/40 hover:border-brand-emerald text-brand-emerald font-mono text-xs rounded transition-all duration-300"
              >
                <Play size={12} />
                <span>RUN ITERATION</span>
              </button>
              <button
                onClick={disperseNodes}
                className="flex items-center justify-center gap-1.5 p-3 bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/40 hover:border-brand-cyan text-brand-cyan font-mono text-xs rounded transition-all duration-300"
              >
                <RotateCcw size={12} />
                <span>SCATTER DATA</span>
              </button>
              <button
                onClick={resetToCleanLayout}
                className="col-span-2 flex items-center justify-center gap-1.5 p-2 bg-slate-900 hover:bg-slate-800 border border-brand-border text-slate-400 hover:text-white font-mono text-xs rounded transition-all duration-300"
              >
                <span>RESET TO HUB STRUCT</span>
              </button>
            </div>

            {/* Metrics Dashboard Box */}
            <div className="w-full p-5 bg-brand-card border border-brand-border rounded relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-brand-cyan/5 to-transparent pointer-events-none" />
              
              <div className="grid grid-cols-3 gap-4 mb-4 border-b border-brand-border/40 pb-4 font-mono">
                <div>
                  <div className="text-[9px] text-brand-muted uppercase">ITERATION</div>
                  <div className="text-white text-lg font-bold">{iteration}</div>
                </div>
                <div>
                  <div className="text-[9px] text-brand-muted uppercase">INERTIA (J)</div>
                  <div className="text-brand-cyan text-lg font-bold">{metrics.inertia}</div>
                </div>
                <div>
                  <div className="text-[9px] text-brand-muted uppercase">SILHOUETTE (S)</div>
                  <div className="text-brand-emerald text-lg font-bold">{metrics.silhouette}</div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNode.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-1.5 bg-slate-800/80 border border-brand-border rounded">
                      {getCategoryIcon(activeNode.category)}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm leading-tight">{activeNode.details.title}</h4>
                      <span className="font-mono text-[10px] text-brand-emerald uppercase tracking-wider">{activeNode.details.value}</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {activeNode.details.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Interactive Graph Column */}
          <div className="w-full md:w-7/12 relative aspect-square max-w-[550px] md:max-w-none border border-brand-border bg-brand-card/25 rounded-lg overflow-hidden backdrop-blur-sm">
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full select-none cursor-crosshair"
            >
              {/* Cluster diameter glowing hulls */}
              {centroids.map((centroid) => {
                const radius = clusterRadii[centroid.id] || 5;
                return (
                  <circle
                    key={`hull-${centroid.id}`}
                    cx={centroid.x}
                    cy={centroid.y}
                    r={radius}
                    fill={`${centroid.color}03`}
                    stroke={centroid.color}
                    strokeWidth="0.12"
                    strokeDasharray="1,1"
                    className="transition-all duration-500"
                    style={{ filter: `drop-shadow(0 0 1px ${centroid.color})` }}
                  />
                );
              })}

              {/* Connections (Centroid to Assigned Node Paths) */}
              {nodes.map((node) => {
                if (node.category === 'hub') return null;
                const centroid = centroids.find((c) => c.id === node.category);
                if (!centroid) return null;

                return (
                  <line
                    key={`line-${node.id}`}
                    x1={centroid.x}
                    y1={centroid.y}
                    x2={node.x}
                    y2={node.y}
                    stroke={`${centroid.color}18`}
                    strokeWidth="0.2"
                    className="transition-all duration-500"
                  />
                );
              })}

              {/* Central AVBT hub connections when in clean layout */}
              {!clusteringActive && nodes.map((node) => {
                if (node.category === 'hub') return null;
                return (
                  <line
                    key={`clean-${node.id}`}
                    x1="50"
                    y1="50"
                    x2={node.x}
                    y2={node.y}
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="0.15"
                  />
                );
              })}

              {/* Draw Centroid Vectors */}
              {clusteringActive && centroids.map((centroid) => (
                <g key={`centroid-${centroid.id}`}>
                  {/* Centroid Anchor Target */}
                  <circle
                    cx={centroid.x}
                    cy={centroid.y}
                    r="2"
                    fill="none"
                    stroke={centroid.color}
                    strokeWidth="0.4"
                    className="transition-all duration-500"
                  />
                  {/* Centroid Cross hair */}
                  <line x1={centroid.x - 3} y1={centroid.y} x2={centroid.x + 3} y2={centroid.y} stroke={centroid.color} strokeWidth="0.15" className="transition-all duration-500" />
                  <line x1={centroid.x} y1={centroid.y - 3} x2={centroid.x} y2={centroid.y + 3} stroke={centroid.color} strokeWidth="0.15" className="transition-all duration-500" />
                  <text
                    x={centroid.x}
                    y={centroid.y - 4}
                    className="fill-white font-mono text-[1.8px] font-bold"
                    textAnchor="middle"
                  >
                    μ_{centroid.id.substring(0, 3).toUpperCase()}
                  </text>
                </g>
              ))}

              {/* Central Hub */}
              <g className="cursor-pointer" onClick={() => setActiveNode(nodes[0])}>
                <circle cx="50" cy="50" r="4.5" className="fill-brand-bg stroke-white stroke-[0.4]" />
                <circle cx="50" cy="50" r="1.5" className="fill-brand-cyan" />
              </g>

              {/* Nodes */}
              {nodes.map((node) => {
                if (node.category === 'hub') return null;
                const isActive = activeNode.id === node.id;
                
                let color = '#3b82f6';
                if (node.category === 'members') color = '#00f2fe';
                if (node.category === 'workshops') color = '#00f5a0';
                if (node.category === 'competitions') color = '#fbbf24';

                return (
                  <g 
                    key={node.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveNode(node)}
                    onClick={() => setActiveNode(node)}
                  >
                    {/* Ring highlight on active nodes */}
                    {isActive && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="3.8"
                        className="fill-none stroke-brand-cyan/20"
                        strokeWidth={0.5}
                      />
                    )}

                    {/* Node */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="1.8"
                      fill={color}
                      stroke="rgba(0,0,0,0.4)"
                      strokeWidth="0.3"
                      className="transition-all duration-500"
                    />

                    {/* Small text tags */}
                    {isActive && (
                      <text
                        x={node.x}
                        y={node.y - 3.2}
                        className="fill-white font-mono text-[2px] font-semibold"
                        textAnchor="middle"
                      >
                        {node.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Grid overlay controls decoration */}
            <div className="absolute top-3 left-3 font-mono text-[9px] text-brand-muted pointer-events-none uppercase">
              MODEL: K-Means Clustering <br />
              K: 4 clusters // SEED: Random
            </div>
            <div className="absolute bottom-3 right-3 font-mono text-[8px] text-brand-emerald pointer-events-none uppercase">
              ● Live Clustering Emulation
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
