'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Terminal, FileDown, PlusCircle, Sparkles, BookOpen, Layers, Lock, Unlock, ShieldAlert, Cpu, RefreshCw, LogOut } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptProgress, setDecryptProgress] = useState(0);

  const [contentType, setContentType] = useState<'events' | 'blog' | 'projects'>('events');

  useEffect(() => {
    // Check if session authorization already exists
    if (sessionStorage.getItem('avbt_cms_session') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isChecking || isDecrypting) return;
    setIsChecking(true);
    setErrorMsg('');

    try {
      // Direct comparison with env var if configured (baked in during build)
      const envPasscode = process.env.NEXT_PUBLIC_ADMIN_PASSCODE;
      if (envPasscode && passwordInput === envPasscode) {
        triggerSuccessAnimation();
        return;
      }

      // Cryptographic SHA-256 validation (for default passcode 'avbt2026')
      const msgBuffer = new TextEncoder().encode(passwordInput);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Hash of 'avbt2026'
      const targetHash = '000b735db5627b3e08d5c7f26bdbd1bda10a6af38e3272a474065abcc2bd863c';
      
      if (hashHex === targetHash) {
        triggerSuccessAnimation();
      } else {
        setErrorMsg('SECURE INTERRUPT: INVALID SYSTEM PROTOCOL CODE');
        setIsChecking(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('SYSTEM ERROR: CRYPTO ENGINE FAILED');
      setIsChecking(false);
    }
  };

  const triggerSuccessAnimation = () => {
    setIsDecrypting(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setDecryptProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsAuthenticated(true);
          sessionStorage.setItem('avbt_cms_session', 'true');
          setIsDecrypting(false);
          setIsChecking(false);
          setPasswordInput('');
        }, 400);
      }
    }, 100);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('avbt_cms_session');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-brand-bg flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Grids */}
        <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />
        
        {/* Glare effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-emerald/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div className="max-w-md w-full relative z-10">
          {/* Header/Back Link */}
          <div className="mb-6 flex justify-between items-center font-mono text-xs">
            <Link 
              href="/"
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-brand-border hover:border-slate-600 rounded text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={12} />
              <span>Exit to Main Site</span>
            </Link>
            <span className="text-slate-500 uppercase tracking-widest text-[9px]">// AVBT_SECURE_AUTH</span>
          </div>

          <AnimatePresence>
            <motion.div
              key="auth-card"
              initial={{ opacity: 0, y: 20 }}
              animate={errorMsg ? { opacity: 1, y: 0, x: [-8, 8, -8, 8, 0] } : { opacity: 1, y: 0 }}
              transition={errorMsg ? { type: "spring", stiffness: 300, damping: 15 } : { duration: 0.5 }}
              className="bg-brand-card border border-brand-border rounded p-8 relative overflow-hidden shadow-2xl"
            >
              {/* Corner highlights */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-brand-cyan" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-brand-cyan" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-brand-cyan" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-brand-cyan" />

              <div className="flex flex-col items-center text-center mb-8">
                <div className="p-3 bg-slate-900 border border-brand-border rounded-full mb-4 text-brand-cyan">
                  {isDecrypting ? (
                    <RefreshCw className="w-8 h-8 animate-spin" />
                  ) : (
                    <Lock className="w-8 h-8" />
                  )}
                </div>
                <h2 className="text-white font-bold tracking-tight text-lg uppercase font-mono">
                  System Access Protocol
                </h2>
                <p className="text-brand-muted text-xs font-mono mt-1 tracking-wider uppercase">
                  Mediterranean Data Science Community
                </p>
              </div>

              {/* Simulated terminal diagnostic status */}
              <div className="bg-slate-950 border border-brand-border/60 rounded p-4 mb-6 font-mono text-[10px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>[SECURE STATE]</span>
                  <span className="text-red-500">LOCKED</span>
                </div>
                <div className="flex justify-between">
                  <span>[DECRYPTION ENGINE]</span>
                  <span className="text-brand-cyan">SHA-256</span>
                </div>
                <div className="flex justify-between">
                  <span>[CONNECTION PORT]</span>
                  <span>SECURE_HTTPS // 443</span>
                </div>
                {errorMsg ? (
                  <div className="text-red-400 mt-2 border-t border-red-950 pt-1.5 flex items-center gap-1 animate-pulse">
                    <ShieldAlert size={10} />
                    <span>{errorMsg}</span>
                  </div>
                ) : isDecrypting ? (
                  <div className="text-brand-emerald mt-2 border-t border-emerald-950 pt-1.5 font-bold">
                    DECRYPTING STREAMS... {decryptProgress}%
                  </div>
                ) : (
                  <div className="text-brand-muted mt-2 border-t border-slate-900 pt-1.5">
                    SYSTEM READY. AWAITING BOARD TOKEN KEY.
                  </div>
                )}
              </div>

              {isDecrypting ? (
                <div className="space-y-4">
                  <div className="w-full bg-slate-900 border border-brand-border h-3 rounded overflow-hidden p-0.5">
                    <div 
                      className="bg-gradient-to-r from-brand-cyan to-brand-emerald h-full rounded transition-all duration-100"
                      style={{ width: `${decryptProgress}%` }}
                    />
                  </div>
                  <div className="text-center font-mono text-[9px] text-slate-500 uppercase">
                    Initializing CMS Core Workspace Module...
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAuthenticate} className="space-y-4 font-mono text-xs">
                  <div className="flex flex-col">
                    <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Access Passcode</label>
                    <input
                      type="password"
                      placeholder="Enter Board Member Passcode"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      disabled={isChecking}
                      className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors text-center tracking-widest font-sans"
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isChecking || !passwordInput}
                    className={`w-full flex items-center justify-center gap-2 p-3.5 rounded font-mono font-bold transition-all duration-300 ${
                      isChecking || !passwordInput
                        ? 'bg-slate-900 border border-brand-border text-brand-muted cursor-not-allowed'
                        : 'bg-brand-cyan hover:bg-brand-cyan/80 text-black cursor-pointer shadow-[0_0_15px_rgba(0,245,160,0.15)] hover:shadow-[0_0_25px_rgba(0,245,160,0.25)]'
                    }`}
                  >
                    {isChecking ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>CHECKING PROTOCOLS...</span>
                      </>
                    ) : (
                      <>
                        <Cpu size={14} />
                        <span>DECRYPT WORKSPACE</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-8 pt-4 border-t border-brand-border/40 text-center font-mono text-[9px] text-brand-muted uppercase">
                AVBT SYSTEM SECURITY LAYER v2.1 // AUTHORIZED PERSONNEL ONLY
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    );
  }

  // Common fields
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Event specific fields
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventCategory, setEventCategory] = useState('AI Workshops');
  const [eventStats, setEventStats] = useState('120+ Participants, 5 Hours');
  const [eventOutcome, setEventOutcome] = useState('Built a custom neural network from scratch.');

  // Blog specific fields
  const [blogDate, setBlogDate] = useState(new Date().toISOString().split('T')[0]);
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogStats, setBlogStats] = useState('Read Time: 5 min');

  // Project specific fields
  const [projectStage, setProjectStage] = useState('Development');
  const [projectCategory, setProjectCategory] = useState('Machine Learning');
  const [projectGithub, setProjectGithub] = useState('');
  const [projectStats, setProjectStats] = useState('Precision: 94%, Inference: 12ms');

  // Helper: Compile tags
  const getTagsArray = () => {
    return tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  };

  // Compile final markdown content string
  const generateMarkdownString = () => {
    const tagsArr = getTagsArray();
    const formattedTags = tagsArr.length ? `\ntags: ${JSON.stringify(tagsArr)}` : '';

    if (contentType === 'events') {
      return `---
title: "${title || 'Event Title'}"
date: "${eventDate}"
category: "${eventCategory}"
stats: "${eventStats}"
outcome: "${eventOutcome}"
image: "/images/events/placeholder.jpg"
summary: "${summary || 'Brief summary here'}"${formattedTags}
---

${content || '### Event Details\nWrite the event description body here...'}
`;
    }

    if (contentType === 'blog') {
      return `---
title: "${title || 'Blog Post Title'}"
date: "${blogDate}"
author: "${blogAuthor || 'Author Name'}"
stats: "${blogStats}"
image: "/images/blog/placeholder.jpg"
summary: "${summary || 'Brief summary here'}"${formattedTags}
---

${content || '### Article Body\nWrite the article body here...'}
`;
    }

    // Projects
    return `---
title: "${title || 'Project Title'}"
stage: "${projectStage}"
category: "${projectCategory}"
github: "${projectGithub || 'https://github.com/akdeniz-veri'}"
stats: "${projectStats}"
summary: "${summary || 'Brief summary here'}"${formattedTags}
---

${content || '### Project Implementation\nWrite project details and pipeline stages here...'}
`;
  };

  const handleDownload = () => {
    const mdString = generateMarkdownString();
    const blob = new Blob([mdString], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Build standard filename
    let filename = '';
    const cleanTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (contentType === 'events') {
      filename = `${eventDate}-${cleanTitle || 'new-event'}.md`;
    } else if (contentType === 'blog') {
      filename = `${blogDate}-${cleanTitle || 'new-blog'}.md`;
    } else {
      filename = `${cleanTitle || 'new-project'}.md`;
    }

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-brand-bg flex flex-col justify-between">
      {/* Background Grids */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />

      {/* Top Header */}
      <div className="w-full border-b border-brand-border bg-slate-950/70 py-4 px-6 relative z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-brand-border hover:border-slate-600 rounded font-mono text-xs text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={12} />
              <span>Back Home</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-cyan" />
              <span className="font-mono text-xs text-white uppercase tracking-wider">
                CMS System Workspace
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-brand-emerald">STATUS: READY_TO_BUILD</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1 bg-red-950/20 border border-red-900/50 hover:border-red-600 rounded font-mono text-[10px] text-red-400 hover:text-white transition-colors"
            >
              <LogOut size={10} />
              <span>TERMINATE SESSION</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Form/Preview Workspace */}
      <div className="flex-grow max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Form Input Column */}
        <div className="col-span-1 lg:col-span-6 bg-brand-card border border-brand-border rounded p-6">
          <div className="flex justify-between items-center pb-4 border-b border-brand-border/40 mb-6">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <PlusCircle className="text-brand-cyan w-5 h-5" />
              <span>Composer Console</span>
            </h2>
            
            {/* Content Type Selector */}
            <div className="flex gap-1 p-0.5 bg-slate-900 border border-brand-border rounded">
              {(['events', 'blog', 'projects'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  className={`px-3 py-1 font-mono text-[10px] rounded uppercase transition-colors ${
                    contentType === type
                      ? 'bg-brand-cyan/20 text-white'
                      : 'text-brand-muted hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 font-mono text-xs text-slate-300">
            {/* Title */}
            <div className="flex flex-col">
              <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Title</label>
              <input
                type="text"
                placeholder="e.g. Deep Learning Bootcamp"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors"
              />
            </div>

            {/* Summary */}
            <div className="flex flex-col">
              <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Short Summary</label>
              <textarea
                rows={2}
                placeholder="Write a brief 2-sentence teaser summary..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors"
              />
            </div>

            {/* Content type conditional inputs */}
            {contentType === 'events' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-brand-border/30 py-4">
                <div className="flex flex-col">
                  <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Event Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                    className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors"
                  >
                    <option value="AI Workshops">AI Workshops</option>
                    <option value="Hackathons">Hackathons</option>
                    <option value="Meetups">Meetups</option>
                    <option value="Technical Talks">Technical Talks</option>
                    <option value="Competitions">Competitions</option>
                  </select>
                </div>
                <div className="flex flex-col sm:col-span-2">
                  <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Telemetry Stats</label>
                  <input
                    type="text"
                    placeholder="e.g. 150+ Hackers, 36 Hours Codeathon"
                    value={eventStats}
                    onChange={(e) => setEventStats(e.target.value)}
                    className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col sm:col-span-2">
                  <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Research Outcome</label>
                  <input
                    type="text"
                    placeholder="e.g. Developed 12 lightweight CV applications."
                    value={eventOutcome}
                    onChange={(e) => setEventOutcome(e.target.value)}
                    className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {contentType === 'blog' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-brand-border/30 py-4">
                <div className="flex flex-col">
                  <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Publish Date</label>
                  <input
                    type="date"
                    value={blogDate}
                    onChange={(e) => setBlogDate(e.target.value)}
                    className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Author Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Alperen Demir"
                    value={blogAuthor}
                    onChange={(e) => setBlogAuthor(e.target.value)}
                    className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col sm:col-span-2">
                  <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Reading Time / Stats</label>
                  <input
                    type="text"
                    placeholder="e.g. Read Time: 8 min"
                    value={blogStats}
                    onChange={(e) => setBlogStats(e.target.value)}
                    className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {contentType === 'projects' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-brand-border/30 py-4">
                <div className="flex flex-col">
                  <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Pipeline Stage</label>
                  <select
                    value={projectStage}
                    onChange={(e) => setProjectStage(e.target.value)}
                    className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors"
                  >
                    <option value="Idea">Idea (Data Synthesis)</option>
                    <option value="Research">Research (Math Validation)</option>
                    <option value="Development">Development (Neural Train)</option>
                    <option value="Deployment">Deployment (Production Edge)</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Project Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Reinforcement Learning"
                    value={projectCategory}
                    onChange={(e) => setProjectCategory(e.target.value)}
                    className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col sm:col-span-2">
                  <label className="text-slate-400 mb-1.5 uppercase tracking-wider">GitHub Repository</label>
                  <input
                    type="text"
                    placeholder="e.g. https://github.com/akdeniz-veri/repo-name"
                    value={projectGithub}
                    onChange={(e) => setProjectGithub(e.target.value)}
                    className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col sm:col-span-2">
                  <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Performance Metrics</label>
                  <input
                    type="text"
                    placeholder="e.g. Congestion Reduction: 22%"
                    value={projectStats}
                    onChange={(e) => setProjectStats(e.target.value)}
                    className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Tags Input */}
            <div className="flex flex-col">
              <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. PyTorch, YOLOv8, CNN"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors"
              />
            </div>

            {/* Markdown Body Content */}
            <div className="flex flex-col">
              <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Markdown Description Body</label>
              <textarea
                rows={8}
                placeholder="### Summary Section&#10;Write markdown descriptions, lists, headers, etc."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors font-mono"
              />
            </div>

            {/* Submit Download button */}
            <button
              onClick={handleDownload}
              disabled={!title}
              className={`w-full flex items-center justify-center gap-2 p-3.5 rounded font-mono font-bold transition-all duration-300 ${
                !title
                  ? 'bg-slate-800 border border-brand-border text-brand-muted cursor-not-allowed'
                  : 'bg-brand-emerald hover:bg-brand-emerald/80 text-black cursor-pointer'
              }`}
            >
              <FileDown size={16} />
              <span>COMPILE &amp; DOWNLOAD .MD FILE</span>
            </button>
          </div>
        </div>

        {/* Right Preview Column */}
        <div className="col-span-1 lg:col-span-6 flex flex-col gap-6">
          
          {/* File Output Stream Window */}
          <div className="bg-slate-950 border border-brand-border rounded overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-900 border-b border-brand-border flex justify-between items-center font-mono text-[10px] text-brand-muted uppercase">
              <div className="flex items-center gap-2">
                <Terminal size={12} className="text-brand-cyan" />
                <span>Compiler_Stdout.txt</span>
              </div>
              <span className="text-brand-emerald">PREVIEW</span>
            </div>
            
            <pre className="p-4 overflow-x-auto text-[11px] md:text-xs font-mono text-slate-300 leading-relaxed max-h-[460px] min-h-[400px]">
              <code>{generateMarkdownString()}</code>
            </pre>
          </div>

          {/* Help panel */}
          <div className="bg-brand-card border border-brand-border rounded p-6 font-mono text-xs">
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-brand-emerald animate-pulse" />
              <span>CMS Deployment Guide</span>
            </h4>
            <ol className="space-y-3.5 text-slate-400 leading-relaxed list-decimal pl-4">
              <li>Complete the form inputs on the left.</li>
              <li>Verify that the compiled Markdown in the top right fits the required layout criteria.</li>
              <li>Click <strong className="text-brand-emerald">Compile &amp; Download</strong> to acquire the markdown file locally.</li>
              <li>Place the downloaded file directly under the folder corresponding to its type:
                <ul className="mt-1.5 space-y-1 pl-4 list-disc text-slate-500">
                  <li>Events: <code className="text-slate-300">content/events/</code></li>
                  <li>Blog: <code className="text-slate-300">content/blog/</code></li>
                  <li>Projects: <code className="text-slate-300">content/projects/</code></li>
                </ul>
              </li>
              <li>Push / deploy changes. The site automatically parses and builds the content. <strong className="text-brand-cyan">No code edits required!</strong></li>
            </ol>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full border-t border-brand-border py-4 px-6 text-center font-mono text-[10px] text-brand-muted">
        AVBT CMS CORE v2.1 // POWERED BY MARKDOWN PARSING
      </div>
    </main>
  );
}
