'use client';

import React, { useState } from 'react';
import { ArrowLeft, Terminal, FileDown, PlusCircle, Sparkles, BookOpen, Layers } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [contentType, setContentType] = useState<'events' | 'blog' | 'projects'>('events');

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
          <span className="font-mono text-xs text-brand-emerald">STATUS: READY_TO_BUILD</span>
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
