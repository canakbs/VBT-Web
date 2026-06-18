'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Database, Code, Cpu, Eye, MessageSquare, Server, Terminal, ExternalLink } from 'lucide-react';

interface RoadmapNode {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  concepts: string[];
  tools: string[];
  challenge: string;
}

const ROADMAP_STEPS: RoadmapNode[] = [
  {
    id: 'python',
    title: 'Python Foundations',
    subtitle: 'Syntactic Foundations & OOP',
    icon: <Code className="w-5 h-5 text-brand-cyan" />,
    difficulty: 'Beginner',
    concepts: ['Control Flow & Data Structures', 'Object-Oriented Programming (OOP)', 'List Comprehensions & Lambda functions', 'File I/O and JSON parsing'],
    tools: ['Python 3.x', 'VS Code', 'Jupyter Notebooks', 'Git'],
    challenge: 'Build a command-line scientific calculator and publish the repo on GitHub.',
  },
  {
    id: 'data_analysis',
    title: 'Scientific Data Analysis',
    subtitle: 'Wrangling, Math & Exploration',
    icon: <Database className="w-5 h-5 text-brand-cyan" />,
    difficulty: 'Beginner',
    concepts: ['Exploratory Data Analysis (EDA)', 'Matrix algebra (Linear Algebra)', 'Descriptive & Inferential Statistics', 'Handling Missing Values & Outliers'],
    tools: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
    challenge: 'Analyze an open-source housing dataset, clean anomalies, and plot correlation matrices.',
  },
  {
    id: 'machine_learning',
    title: 'Classical Machine Learning',
    subtitle: 'Supervised & Unsupervised Models',
    icon: <Cpu className="w-5 h-5 text-brand-emerald" />,
    difficulty: 'Intermediate',
    concepts: ['Regression & Classification models', 'Decision Trees & Random Forests', 'Clustering (K-Means, DBSCAN)', 'Model Validation (K-Fold, ROC-AUC)'],
    tools: ['Scikit-Learn', 'SciPy', 'XGBoost', 'Joblib'],
    challenge: 'Train an ensemble model to classify customer churn, achieving >85% F1-score.',
  },
  {
    id: 'deep_learning',
    title: 'Deep Learning Laboratory',
    subtitle: 'Artificial Neural Networks',
    icon: <Terminal className="w-5 h-5 text-brand-emerald" />,
    difficulty: 'Intermediate',
    concepts: ['Feedforward Networks & Backprop', 'Loss Functions & Gradient Optimizers', 'Convolutional Networks (CNNs)', 'Recurrent Networks (LSTMs)'],
    tools: ['PyTorch', 'TensorFlow', 'CUDA', 'TensorBoard'],
    challenge: 'Build a custom PyTorch CNN to classify hand gestures from webcam inputs.',
  },
  {
    id: 'computer_vision',
    title: 'Computer Vision (CV)',
    subtitle: 'Spatial Intelligence & Detection',
    icon: <Eye className="w-5 h-5 text-brand-blue" />,
    difficulty: 'Advanced',
    concepts: ['Image Segmentation (U-Net)', 'Real-time Object Detection (YOLO)', 'Transfer Learning (ResNet)', 'Feature Extraction & OpenCV operations'],
    tools: ['OpenCV', 'Ultralytics YOLO', 'Hugging Face', 'Albumentations'],
    challenge: 'Develop a crop disease detection pipeline running on video streams.',
  },
  {
    id: 'nlp',
    title: 'Natural Language Processing',
    subtitle: 'Sequence Modeling & Language Agents',
    icon: <MessageSquare className="w-5 h-5 text-brand-blue" />,
    difficulty: 'Advanced',
    concepts: ['Tokenization & TF-IDF vectorizers', 'Word Embeddings (Word2Vec, GloVe)', 'Self-Attention & Transformers', 'Fine-tuning LLMs (QLoRA)'],
    tools: ['NLTK', 'Spacy', 'Hugging Face Transformers', 'LangChain'],
    challenge: 'Fine-tune a lightweight LLM using custom medical text for virtual patient triage.',
  },
  {
    id: 'mlops',
    title: 'MLOps & Deployment',
    subtitle: 'Production Pipelines & Monitoring',
    icon: <Server className="w-5 h-5 text-purple-400" />,
    difficulty: 'Expert',
    concepts: ['Model Serialization & Dockerization', 'API construction (FastAPI/Flask)', 'Continuous Integration for ML (CD/CD)', 'Model drift tracking & Logging'],
    tools: ['Docker', 'FastAPI', 'MLflow', 'DVC (Data Version Control)'],
    challenge: 'Deploy a classification API in a Docker container, integrated with MLflow metrics.',
  },
];

// 1. Python flowchart helper
function PythonVisualizer() {
  return (
    <svg viewBox="0 0 100 55" className="w-full h-full">
      {/* Grid paths */}
      <line x1="20" y1="27" x2="80" y2="27" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      
      {/* Node boxes */}
      <g>
        <rect x="5" y="18" width="18" height="18" rx="2" fill="#0b0e1a" stroke="#00f2fe" strokeWidth="0.5" />
        <text x="14" y="29" fill="white" textAnchor="middle" className="text-[2.2px] font-semibold font-mono">INPUT_DATA</text>
      </g>
      <g>
        <rect x="30" y="18" width="18" height="18" rx="2" fill="#0b0e1a" stroke="#00f5a0" strokeWidth="0.5" />
        <text x="39" y="29" fill="white" textAnchor="middle" className="text-[2.2px] font-semibold font-mono">PARSER()</text>
      </g>
      <g>
        <rect x="55" y="18" width="18" height="18" rx="2" fill="#0b0e1a" stroke="#3b82f6" strokeWidth="0.5" />
        <text x="64" y="29" fill="white" textAnchor="middle" className="text-[2.2px] font-semibold font-mono">COMPILER</text>
      </g>
      <g>
        <rect x="80" y="18" width="15" height="18" rx="2" fill="#0b0e1a" stroke="#fbbf24" strokeWidth="0.5" />
        <text x="87.5" y="29" fill="white" textAnchor="middle" className="text-[2.2px] font-semibold font-mono">OUTPUT</text>
      </g>

      {/* Signal flow animations */}
      <motion.circle r="1" fill="#00f2fe" initial={{ cx: 14, cy: 27 }} animate={{ cx: [14, 39, 64, 87.5] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} />
    </svg>
  );
}

// 2. Data Analysis curve helper
function DataAnalysisVisualizer() {
  const points = useMemo(() => {
    // Generate scattered random dots under a bell curve representation
    const pts = [];
    for (let i = 0; i < 20; i++) {
      const rx = 15 + Math.random() * 70;
      const dist = Math.abs(rx - 50);
      const limitY = 48 - (30 * Math.exp(-Math.pow(dist, 2) / 200));
      const ry = limitY + Math.random() * (48 - limitY);
      pts.push({ x: rx, y: ry });
    }
    return pts;
  }, []);

  return (
    <svg viewBox="0 0 100 55" className="w-full h-full">
      {/* Standard Deviation Bands */}
      <line x1="38" y1="5" x2="38" y2="48" stroke="rgba(0, 245, 160, 0.2)" strokeWidth="0.5" strokeDasharray="1,1" />
      <line x1="62" y1="5" x2="62" y2="48" stroke="rgba(0, 245, 160, 0.2)" strokeWidth="0.5" strokeDasharray="1,1" />
      <line x1="50" y1="5" x2="50" y2="48" stroke="rgba(0, 242, 254, 0.3)" strokeWidth="0.5" />
      
      {/* Labels */}
      <text x="50" y="52" fill="#00f2fe" className="text-[1.8px]" textAnchor="middle">μ = 50.0</text>
      <text x="66" y="52" fill="#00f5a0" className="text-[1.8px]">σ</text>
      <text x="32" y="52" fill="#00f5a0" className="text-[1.8px]">-σ</text>

      {/* Scattered datapoints */}
      {points.map((p, idx) => (
        <circle key={idx} cx={p.x} cy={p.y} r="0.8" fill="rgba(255,255,255,0.4)" />
      ))}

      {/* Bell Curve Math function */}
      <path
        d="M 10,48 Q 30,48 38,40 T 50,15 T 62,40 Q 70,48 90,48"
        fill="none"
        stroke="#00f5a0"
        strokeWidth="1.2"
        style={{ filter: 'drop-shadow(0 0 2px rgba(0, 255, 160, 0.4))' }}
      />
    </svg>
  );
}

// 3. Machine Learning Decision Boundary helper
function MachineLearningVisualizer() {
  const redNodes = [
    { x: 18, y: 15 }, { x: 26, y: 12 }, { x: 15, y: 25 }, { x: 24, y: 22 }, { x: 32, y: 18 }
  ];
  const blueNodes = [
    { x: 78, y: 40 }, { x: 86, y: 45 }, { x: 68, y: 44 }, { x: 74, y: 32 }, { x: 82, y: 28 }
  ];

  return (
    <svg viewBox="0 0 100 55" className="w-full h-full">
      {/* Margin bounds (dotted lines) */}
      <line x1="30" y1="5" x2="50" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="1,1" />
      <line x1="50" y1="5" x2="70" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="1,1" />

      {/* SVM Separating Hyperplane */}
      <line x1="40" y1="5" x2="60" y2="50" stroke="#00f5a0" strokeWidth="1.2" style={{ filter: 'drop-shadow(0 0 2px rgba(0,255,160,0.4))' }} />
      <text x="56" y="15" fill="#00f5a0" className="text-[1.8px] font-semibold">w·x + b = 0</text>

      {/* Red Class (Cluster 0) */}
      {redNodes.map((n, i) => (
        <circle key={`red-${i}`} cx={n.x} cy={n.y} r="1.4" fill="#ff4d4d" />
      ))}

      {/* Blue Class (Cluster 1) */}
      {blueNodes.map((n, i) => (
        <circle key={`blue-${i}`} cx={n.x} cy={n.y} r="1.4" fill="#3b82f6" />
      ))}
    </svg>
  );
}

// 4. Deep Learning MLP Synapses helper (original neural net)
function DeepLearningVisualizer({ synapseConnections }: { synapseConnections: any[] }) {
  const LAYERS = [
    { name: 'Input', nodes: [15, 30, 45] },
    { name: 'Hidden 1', nodes: [10, 22, 35, 47] },
    { name: 'Hidden 2', nodes: [10, 22, 35, 47] },
    { name: 'Output', nodes: [20, 40] },
  ];
  const LAYER_X = [10, 38, 66, 92];

  return (
    <svg viewBox="0 0 100 55" className="w-full h-full">
      {/* Synapse Lines */}
      {synapseConnections.map((conn, idx) => {
        const strokeColor = conn.pulse ? '#00f5a0' : '#00f2fe';
        const opacity = 0.05 + conn.seedWeight * 0.45;
        const width = 0.15 + conn.seedWeight * 0.7;

        return (
          <g key={`synapse-${idx}`}>
            <line
              x1={conn.x1}
              y1={conn.y1}
              x2={conn.x2}
              y2={conn.y2}
              stroke={strokeColor}
              strokeWidth={width}
              strokeOpacity={opacity}
            />
            {conn.pulse && (
              <motion.circle
                r="0.6"
                fill="#00f5a0"
                initial={{ cx: conn.x1, cy: conn.y1 }}
                animate={{ cx: conn.x2, cy: conn.y2 }}
                transition={{
                  duration: 1.2 + conn.seedWeight * 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {LAYERS.map((layer, lIdx) => {
        const x = LAYER_X[lIdx];
        return layer.nodes.map((y, nIdx) => {
          let fill = '#1e293b';
          let stroke = 'rgba(255,255,255,0.25)';
          
          if (lIdx === 0) stroke = '#f8fafc';
          else if (lIdx === 3) { stroke = '#00f5a0'; fill = 'rgba(0, 245, 160, 0.1)'; }
          else { stroke = '#00f2fe'; fill = 'rgba(0, 242, 254, 0.05)'; }

          return (
            <circle
              key={`node-${lIdx}-${nIdx}`}
              cx={x}
              cy={y}
              r="1.8"
              fill={fill}
              stroke={stroke}
              strokeWidth="0.4"
            />
          );
        });
      })}
    </svg>
  );
}

// 5. Computer Vision camera scanning tracker helper
function ComputerVisionVisualizer() {
  const [laserY, setLaserY] = useState(10);

  useEffect(() => {
    let direction = 1;
    const interval = setInterval(() => {
      setLaserY((prev) => {
        if (prev > 45) direction = -1;
        if (prev < 8) direction = 1;
        return prev + direction * 1.2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg viewBox="0 0 100 55" className="w-full h-full">
      {/* Scanner grid lines overlay */}
      <line x1="20" y1="0" x2="20" y2="55" stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" />
      <line x1="40" y1="0" x2="40" y2="55" stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" />
      <line x1="60" y1="0" x2="60" y2="55" stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" />
      <line x1="80" y1="0" x2="80" y2="55" stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" />

      {/* Target scanning boxes */}
      <g>
        <rect x="15" y="10" width="30" height="24" fill="none" stroke="#00f5a0" strokeWidth="0.6" className="animate-pulse" />
        <rect x="15" y="6" width="22" height="4" fill="#00f5a0" />
        <text x="17" y="9" fill="black" className="text-[1.8px] font-bold">DRONE_LEAF [95.8%]</text>
      </g>
      <g>
        <rect x="55" y="22" width="28" height="22" fill="none" stroke="#00f2fe" strokeWidth="0.6" />
        <rect x="55" y="18" width="16" height="4" fill="#00f2fe" />
        <text x="57" y="21" fill="black" className="text-[1.8px] font-bold">WEED [92.0%]</text>
      </g>

      {/* Oscillating scan line */}
      <line x1="0" y1={laserY} x2="100" y2={laserY} stroke="#ff4d4d" strokeWidth="0.75" style={{ filter: 'drop-shadow(0 0 2px #ff4d4d)' }} />
    </svg>
  );
}

// 6. Natural Language Processing attention grid helper
function NLPVisualizer() {
  const words = ['Transformers', 'Attention', 'Decoder', 'Encoder', 'Weights'];
  return (
    <svg viewBox="0 0 100 55" className="w-full h-full">
      {/* Attention Heat Map grid blocks */}
      {words.map((wVal, i) =>
        words.map((hVal, j) => {
          const intensity = Math.max(0.05, Math.sin((i * 2 + j * 3) * 0.45));
          return (
            <rect
              key={`${i}-${j}`}
              x={22 + i * 11}
              y={5 + j * 9}
              width="9.5"
              height="7.5"
              fill="#00f2fe"
              fillOpacity={intensity * 0.65}
              stroke="rgba(0,0,0,0.5)"
              strokeWidth="0.2"
            />
          );
        })
      )}

      {/* Row labels */}
      {words.map((w, idx) => (
        <text key={`lbl-${idx}`} x="18" y={9.5 + idx * 9} fill="white" className="text-[1.8px]" textAnchor="end">
          {w}
        </text>
      ))}

      {/* Column labels */}
      {words.map((w, idx) => (
        <text key={`col-${idx}`} x={26.7 + idx * 11} y="52" fill="white" className="text-[1.8px]" textAnchor="middle">
          {w.substring(0, 4)}
        </text>
      ))}
    </svg>
  );
}

// 7. MLOps continuous cycle loop helper
function MLOpsVisualizer() {
  return (
    <svg viewBox="0 0 100 55" className="w-full h-full">
      {/* CI/CD Infinity loop paths representing deployment */}
      <path
        d="M 25,27 C 10,10 10,44 25,27 C 40,10 60,10 75,27 C 90,44 90,10 75,27 C 60,44 40,44 25,27 Z"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="1.2"
        strokeDasharray="2,2"
      />
      
      {/* Loop Nodes */}
      <g>
        <circle cx="25" cy="27" r="1.5" fill="#00f5a0" />
        <text x="25" y="32" fill="white" className="text-[1.8px]" textAnchor="middle">BUILD</text>
      </g>
      <g>
        <circle cx="50" cy="19" r="1.5" fill="#00f2fe" />
        <text x="50" y="15" fill="white" className="text-[1.8px]" textAnchor="middle">TEST</text>
      </g>
      <g>
        <circle cx="75" cy="27" r="1.5" fill="#fbbf24" />
        <text x="75" y="32" fill="white" className="text-[1.8px]" textAnchor="middle">DEPLOY</text>
      </g>
      <g>
        <circle cx="50" cy="35" r="1.5" fill="#ff4d4d" />
        <text x="50" y="40" fill="white" className="text-[1.8px]" textAnchor="middle">MONITOR</text>
      </g>

      {/* Running pipeline package */}
      <motion.path
        d="M 25,27 C 10,10 10,44 25,27 C 40,10 60,10 75,27 C 90,44 90,10 75,27 C 60,44 40,44 25,27 Z"
        fill="none"
        stroke="#00f2fe"
        strokeWidth="1.8"
        strokeLinecap="round"
        initial={{ strokeDasharray: '0, 100', strokeDashoffset: 0 }}
        animate={{ strokeDasharray: '10, 90', strokeDashoffset: [0, -100] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
      />
    </svg>
  );
}

export default function LearningRoadmap() {
  const [activeStep, setActiveStep] = useState<RoadmapNode>(ROADMAP_STEPS[0]);

  // Seeding DL connection weights dynamically
  const synapseConnections = useMemo(() => {
    const list: { x1: number; y1: number; x2: number; y2: number; seedWeight: number; pulse: boolean }[] = [];
    const LAYERS = [
      { name: 'Input', nodes: [15, 30, 45] },
      { name: 'Hidden 1', nodes: [10, 22, 35, 47] },
      { name: 'Hidden 2', nodes: [10, 22, 35, 47] },
      { name: 'Output', nodes: [20, 40] },
    ];
    const LAYER_X = [10, 38, 66, 92];

    for (let l = 0; l < LAYERS.length - 1; l++) {
      const fromLayer = LAYERS[l];
      const toLayer = LAYERS[l + 1];
      const x1 = LAYER_X[l];
      const x2 = LAYER_X[l + 1];

      fromLayer.nodes.forEach((y1, i) => {
        toLayer.nodes.forEach((y2, j) => {
          const hashString = `${activeStep.id}-${l}-${i}-${j}`;
          let hash = 0;
          for (let k = 0; k < hashString.length; k++) {
            hash = hashString.charCodeAt(k) + ((hash << 5) - hash);
          }
          const seedWeight = Math.abs((hash % 100) / 100);
          const difficultyMultiplier = 
            activeStep.difficulty === 'Beginner' ? 0.3 :
            activeStep.difficulty === 'Intermediate' ? 0.6 : 1.0;

          const pulse = seedWeight < 0.25 * difficultyMultiplier;
          list.push({ x1, y1, x2, y2, seedWeight, pulse });
        });
      });
    }
    return list;
  }, [activeStep]);

  // Switch animation based on selected category ID
  const renderVisualizer = () => {
    switch (activeStep.id) {
      case 'python':
        return <PythonVisualizer />;
      case 'data_analysis':
        return <DataAnalysisVisualizer />;
      case 'machine_learning':
        return <MachineLearningVisualizer />;
      case 'deep_learning':
        return <DeepLearningVisualizer synapseConnections={synapseConnections} />;
      case 'computer_vision':
        return <ComputerVisionVisualizer />;
      case 'nlp':
        return <NLPVisualizer />;
      case 'mlops':
        return <MLOpsVisualizer />;
      default:
        return <PythonVisualizer />;
    }
  };

  const getVisualizerLabel = () => {
    switch (activeStep.id) {
      case 'python': return 'MODEL: COMPILER_FLOWCHART';
      case 'data_analysis': return 'MODEL: GAUSSIAN_PROBABILITY_DENSITY';
      case 'machine_learning': return 'MODEL: SVM_SEPARATING_HYPERPLANE';
      case 'deep_learning': return 'MODEL: MLP_SYNAPSE_WEIGHTS';
      case 'computer_vision': return 'MODEL: OBJECT_DETECTION_LASER_GRID';
      case 'nlp': return 'MODEL: TRANSFORMER_SELF_ATTENTION';
      case 'mlops': return 'MODEL: CICD_PIPELINE_FLOW';
      default: return 'MODEL: GRAPH';
    }
  };

  return (
    <section id="ds-journey" className="relative py-24 bg-brand-bg/95 border-b border-brand-border">
      {/* Background Grid */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-start mb-16">
          <span className="font-mono text-xs text-brand-cyan tracking-widest uppercase mb-2">
            [ KNOWLEDGE LAYER: CURRICULUM ]
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Data Science <br />
            <span className="bg-gradient-to-r from-brand-cyan to-brand-emerald bg-clip-text text-transparent">
              Roadmap Journey
            </span>
          </h2>
        </div>

        {/* Dynamic Nodes & Graph Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Timeline Nodes Selector */}
          <div className="col-span-1 lg:col-span-5 flex flex-col gap-3">
            {ROADMAP_STEPS.map((step, index) => {
              const isActive = activeStep.id === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step)}
                  className={`group w-full flex items-center justify-between p-4 bg-brand-card hover:bg-brand-cyan/5 border rounded text-left transition-all duration-300 relative overflow-hidden ${
                    isActive ? 'border-brand-cyan glow-cyan' : 'border-brand-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Node count index indicator */}
                    <div className="font-mono text-xs text-brand-muted/70 min-w-[20px]">
                      0{index + 1}
                    </div>
                    {/* Icon wrapper */}
                    <div className={`p-2 bg-slate-900 border border-brand-border rounded transition-colors ${
                      isActive ? 'border-brand-cyan' : 'group-hover:border-slate-700'
                    }`}>
                      {step.icon}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm md:text-base leading-tight">
                        {step.title}
                      </div>
                      <div className="font-mono text-[10px] text-brand-muted mt-0.5">
                        {step.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded uppercase ${
                      step.difficulty === 'Beginner' ? 'bg-blue-950 text-blue-400 border border-blue-900' :
                      step.difficulty === 'Intermediate' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' :
                      step.difficulty === 'Advanced' ? 'bg-amber-950 text-amber-400 border border-amber-900' :
                      'bg-purple-950 text-purple-400 border border-purple-900'
                    }`}>
                      {step.difficulty}
                    </span>
                    <ChevronRight size={14} className={`text-brand-muted group-hover:text-white transition-transform ${
                      isActive ? 'translate-x-1 text-brand-cyan' : ''
                    }`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Expanded Knowledge Panel */}
          <div className="col-span-1 lg:col-span-7">
            <div className="bg-brand-card border border-brand-border rounded p-6 md:p-8 backdrop-blur-sm relative overflow-hidden min-h-[460px] flex flex-col justify-between">
              {/* Decorative data stream log */}
              <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-brand-muted/30 select-none uppercase">
                MODULE_HASH: MD_{activeStep.id.toUpperCase()}_v3
              </div>

              <div>
                {/* Node Title Header */}
                <div className="flex items-center gap-3.5 pb-6 border-b border-brand-border/40">
                  <div className="p-3 bg-slate-900 border border-brand-border rounded-lg">
                    {activeStep.icon}
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                      {activeStep.title}
                    </h3>
                    <div className="font-mono text-xs text-brand-cyan mt-1">
                      {activeStep.subtitle}
                    </div>
                  </div>
                </div>

                {/* Sub layout: Split details on Left and Neural Synapses Visualizer on Right */}
                <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Left Column: Core concepts */}
                  <div className="md:col-span-7 space-y-5">
                    <div>
                      <h4 className="font-mono text-xs text-brand-emerald tracking-wider uppercase mb-2">
                        ■ CORE CONCEPTS
                      </h4>
                      <ul className="space-y-1.5 text-xs md:text-sm text-slate-300">
                        {activeStep.concepts.map((c, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-brand-cyan mt-1 shrink-0">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-mono text-xs text-brand-cyan tracking-wider uppercase mb-2">
                        ■ RECOMMENDED TOOLKIT
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {activeStep.tools.map((t) => (
                          <span key={t} className="px-2 py-0.5 bg-slate-900 border border-brand-border rounded font-mono text-[10px] text-slate-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Dynamic Category Specific Visualizer */}
                  <div className="md:col-span-5 h-[180px] md:h-[220px] w-full border border-brand-border bg-slate-950/40 rounded p-3 flex flex-col justify-between relative overflow-hidden">
                    <span className="font-mono text-[7px] text-brand-muted uppercase absolute top-2 left-2">
                      {getVisualizerLabel()}
                    </span>
                    
                    <div className="w-full h-full flex items-center justify-center pt-2">
                      {renderVisualizer()}
                    </div>
                    
                    <span className="font-mono text-[7.5px] text-brand-emerald uppercase text-right w-full block">
                      ● DATA SCIENCE SIMULATOR
                    </span>
                  </div>

                </div>
              </div>

              {/* Lab Practice challenge panel */}
              <div className="mt-4 p-4 bg-slate-950 border border-brand-border/60 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="font-mono text-[10px] text-brand-emerald uppercase tracking-wider">
                    ▼ LAB MILESTONE CHALLENGE
                  </div>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    {activeStep.challenge}
                  </p>
                </div>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/40 hover:border-brand-cyan/80 text-brand-cyan font-mono text-xs rounded transition-all duration-300 shrink-0">
                  <span>Start Lab</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
