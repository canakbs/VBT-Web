'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Terminal, 
  FileDown, 
  PlusCircle, 
  Sparkles, 
  LogOut, 
  Edit, 
  Trash2, 
  Loader2, 
  AlertTriangle, 
  ChevronRight, 
  RefreshCw, 
  FolderOpen 
} from 'lucide-react';
import Link from 'next/link';
import { 
  logout, 
  getContentList, 
  getFileContent, 
  saveContent, 
  deleteContent 
} from './actions';

export default function Workspace() {
  // Navigation & Tabs
  const [activeView, setActiveView] = useState<'list' | 'composer'>('list');
  const [activeTab, setActiveTab] = useState<'events' | 'blog' | 'projects'>('events');
  const [contentList, setContentList] = useState<any[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isSandboxMode, setIsSandboxMode] = useState(false);

  // Composer state fields
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

  // Commit tracking
  const [editingFilename, setEditingFilename] = useState('');
  const [editingSha, setEditingSha] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [consoleLines, setConsoleLines] = useState<string[]>([
    'SYSTEM INITIALIZED: AVBT CMS CORE v2.5',
    'AWAITING INSTRUCTIONS...'
  ]);

  // Load Content List
  const fetchList = async (type: 'events' | 'blog' | 'projects') => {
    setIsLoadingList(true);
    setIsSandboxMode(false);
    try {
      const items = await getContentList(type);
      setContentList(items);
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('GITHUB_PAT_NOT_CONFIGURED')) {
        setIsSandboxMode(true);
      }
      setContentList([]);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    if (activeView === 'list') {
      fetchList(activeTab);
    }
  }, [activeTab, activeView]);

  const addConsoleLine = (text: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLines(prev => [...prev, `[${timestamp}] ${text}`]);
  };

  // Switch to create mode
  const handleCreateNew = () => {
    setTitle('');
    setSummary('');
    setContent('');
    setTagsInput('');
    setEditingFilename('');
    setEditingSha(undefined);
    
    // Set defaults
    setEventDate(new Date().toISOString().split('T')[0]);
    setEventCategory('AI Workshops');
    setEventStats('120+ Participants, 5 Hours');
    setEventOutcome('Built a custom neural network from scratch.');
    
    setBlogDate(new Date().toISOString().split('T')[0]);
    setBlogAuthor('');
    setBlogStats('Read Time: 5 min');
    
    setProjectStage('Development');
    setProjectCategory('Machine Learning');
    setProjectGithub('');
    setProjectStats('Precision: 94%, Inference: 12ms');
    
    setConsoleLines([
      'SYSTEM STATE: COMPOSING NEW DOCUMENT',
      'FORM WORKSPACE DECRYPTED.'
    ]);
    setActiveView('composer');
  };

  // Fetch file for editing
  const handleEdit = async (path: string) => {
    setConsoleLines([`INITIALIZING EDIT FOR FILE: ${path}`]);
    addConsoleLine('CONNECTING TO GITHUB API CORE...');
    try {
      const fileData = await getFileContent(path);
      addConsoleLine('DECODING FILE CONTENT STREAMS...');

      setTitle(fileData.metadata.title || '');
      setSummary(fileData.metadata.summary || '');
      setContent(fileData.content || '');
      setTagsInput(fileData.metadata.tags ? fileData.metadata.tags.join(', ') : '');

      const parts = path.split('/');
      const name = parts[parts.length - 1];
      setEditingFilename(name);
      setEditingSha(fileData.sha);

      if (activeTab === 'events') {
        setEventDate(fileData.metadata.date || new Date().toISOString().split('T')[0]);
        setEventCategory(fileData.metadata.category || 'AI Workshops');
        setEventStats(fileData.metadata.stats || '');
        setEventOutcome(fileData.metadata.outcome || '');
      } else if (activeTab === 'blog') {
        setBlogDate(fileData.metadata.date || new Date().toISOString().split('T')[0]);
        setBlogAuthor(fileData.metadata.author || '');
        setBlogStats(fileData.metadata.stats || 'Read Time: 5 min');
      } else {
        setProjectStage(fileData.metadata.stage || 'Development');
        setProjectCategory(fileData.metadata.category || 'Machine Learning');
        setProjectGithub(fileData.metadata.github || '');
        setProjectStats(fileData.metadata.stats || '');
      }

      addConsoleLine('DECRYPTION SUCCESSFUL. FILE POPULATED IN EDITOR CONSOLE.');
      setActiveView('composer');
    } catch (err: any) {
      console.error(err);
      addConsoleLine(`LOAD FAILED: ${err.message || 'Unknown error'}`);
      alert(`Load failed: ${err.message || 'Unknown error'}`);
    }
  };

  // Delete document
  const handleDelete = async (path: string, sha: string) => {
    if (!window.confirm(`Are you sure you want to delete this file?\nPath: ${path}\n\nThis will permanently remove it from GitHub.`)) {
      return;
    }

    addConsoleLine(`DISPATCHING DELETION TRANSACTION: ${path}`);
    try {
      await deleteContent(path, sha);
      addConsoleLine('DELETION COMMITTED SUCCESSFULLY ON GITHUB.');
      fetchList(activeTab);
    } catch (err: any) {
      console.error(err);
      addConsoleLine(`DELETE FAILED: ${err.message || 'Unknown error'}`);
      alert(`Deletion failed: ${err.message || 'Unknown error'}`);
    }
  };

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

    if (activeTab === 'events') {
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

    if (activeTab === 'blog') {
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

    let filename = editingFilename;
    const cleanTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (!filename) {
      if (activeTab === 'events') {
        filename = `${eventDate}-${cleanTitle || 'new-event'}.md`;
      } else if (activeTab === 'blog') {
        filename = `${blogDate}-${cleanTitle || 'new-blog'}.md`;
      } else {
        filename = `${cleanTitle || 'new-project'}.md`;
      }
    }

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addConsoleLine(`MANUAL DOWNLOAD TRIGGERED: ${filename}`);
  };

  const handleSaveToGithub = async () => {
    if (!title || isSaving) return;
    setIsSaving(true);

    let filename = editingFilename;
    const cleanTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (!filename) {
      if (activeTab === 'events') {
        filename = `${eventDate}-${cleanTitle || 'new-event'}.md`;
      } else if (activeTab === 'blog') {
        filename = `${blogDate}-${cleanTitle || 'new-blog'}.md`;
      } else {
        filename = `${cleanTitle || 'new-project'}.md`;
      }
    }

    addConsoleLine(`COMMITTING DATABASE UPDATE: content/${activeTab}/${filename}`);
    addConsoleLine('GENERATING MARKDOWN COMPILATION STRING...');
    const mdContent = generateMarkdownString();

    try {
      const res = await saveContent(activeTab, filename, mdContent, editingSha);
      addConsoleLine(`COMMIT SUCCESSFUL! GITHUB OBJECT SHA: ${res.sha.substring(0, 8)}`);
      addConsoleLine('VERCEL CD WEBHOOK ENGAGED. REBUILD SEQUENCE COMMENCED.');
      setIsSaving(false);
      
      // Navigate back to list after 1s
      setTimeout(() => {
        setActiveView('list');
      }, 1000);
    } catch (err: any) {
      console.error(err);
      addConsoleLine(`TRANSACTION ABORTED: ${err.message || 'Unknown error'}`);
      setIsSaving(false);
      alert(`Commit failed: ${err.message || 'Unknown error'}`);
    }
  };

  const handleLogoutClick = async () => {
    await logout();
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-brand-bg flex flex-col justify-between">
      {/* Background Grids */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />

      {/* Top Header */}
      <div className="w-full border-b border-brand-border bg-slate-950/70 py-4 px-6 relative z-25 backdrop-blur-md">
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
            <span className="font-mono text-xs text-brand-emerald">
              {isSandboxMode ? 'STATUS: SANDBOX_MODE' : 'STATUS: CLOUD_READY'}
            </span>
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-1.5 px-3 py-1 bg-red-950/20 border border-red-900/50 hover:border-red-600 rounded font-mono text-[10px] text-red-400 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut size={10} />
              <span>TERMINATE SESSION</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="flex-grow max-w-7xl w-full mx-auto p-6 relative z-10">
        
        {/* VIEW A: CONTENT MANAGER TABLE GRID */}
        {activeView === 'list' && (
          <div className="space-y-6">
            
            {/* Control Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border/40 pb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FolderOpen className="text-brand-cyan w-6 h-6" />
                  <span>Database Repository Manager</span>
                </h1>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  MANAGE EXCLUSIVELY DEPLOYED ASSETS AND DATA STREAM SOURCES
                </p>
              </div>
              
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-emerald hover:bg-brand-emerald/80 text-black font-mono font-bold text-xs rounded transition-all duration-300 shadow-[0_0_15px_rgba(0,245,160,0.1)] hover:shadow-[0_0_25px_rgba(0,245,160,0.2)] cursor-pointer"
              >
                <PlusCircle size={14} />
                <span>COMPILE NEW ENTRY</span>
              </button>
            </div>

            {/* Sandbox alert */}
            {isSandboxMode && (
              <div className="border border-dashed border-amber-600/40 bg-amber-950/10 text-amber-300 text-xs px-4 py-3.5 rounded font-mono flex items-start gap-2.5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]">
                <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={16} />
                <div>
                  <span className="font-bold">SYSTEM WARNING: GITHUB_PAT NOT DETECTED IN ENVIRONMENT VARIABLES</span>
                  <p className="mt-1 text-slate-400">
                    Running in local sandbox mode. Cloud list query and automatic push operations are disabled. You can still create compositions and click <strong className="text-white">Download Markdown</strong> to save files manually into the local repository folder.
                  </p>
                </div>
              </div>
            )}

            {/* Tab Navigation & List Grid */}
            <div className="bg-brand-card border border-brand-border rounded overflow-hidden">
              <div className="flex border-b border-brand-border bg-slate-950/40">
                {(['events', 'blog', 'projects'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 font-mono text-xs uppercase font-bold border-r border-brand-border transition-colors cursor-pointer ${
                      activeTab === tab
                        ? 'bg-slate-900/60 text-brand-cyan border-b-2 border-b-brand-cyan'
                        : 'text-slate-400 hover:text-white hover:bg-slate-950/20'
                    }`}
                  >
                    {tab === 'events' && 'Events Archive'}
                    {tab === 'blog' && 'Publications / Blog'}
                    {tab === 'projects' && 'Research Projects'}
                  </button>
                ))}
              </div>

              {/* Grid content list */}
              <div className="p-6">
                {isLoadingList ? (
                  <div className="py-24 flex flex-col justify-center items-center text-center font-mono text-xs text-brand-cyan">
                    <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-cyan" />
                    <span>FETCHING CONTENT STREAMS FROM GITHUB FOR: {activeTab.toUpperCase()}...</span>
                  </div>
                ) : contentList.length === 0 ? (
                  <div className="py-24 text-center border border-dashed border-brand-border/60 rounded flex flex-col justify-center items-center text-brand-muted font-mono text-xs uppercase">
                    <AlertTriangle className="w-8 h-8 mb-3 text-slate-700" />
                    {isSandboxMode 
                      ? 'Sandbox Mode Active: Unable to fetch items without GITHUB_PAT' 
                      : `No data entries detected in: content/${activeTab}/`}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-brand-border/60 text-slate-500 uppercase tracking-widest text-[10px]">
                          <th className="pb-3 font-semibold">Title / Identifier</th>
                          <th className="pb-3 font-semibold hidden md:table-cell">File Path</th>
                          <th className="pb-3 font-semibold text-center hidden sm:table-cell">
                            {activeTab === 'projects' ? 'Stage' : 'Date'}
                          </th>
                          <th className="pb-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border/30">
                        {contentList.map((item) => (
                          <tr key={item.name} className="hover:bg-slate-950/30 group transition-colors">
                            <td className="py-4 pr-4">
                              <span className="text-white font-bold block group-hover:text-brand-cyan transition-colors truncate max-w-[280px] sm:max-w-md">
                                {item.title}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono mt-0.5 block truncate max-w-[200px]">
                                {item.summary || 'No teaser summary text...'}
                              </span>
                            </td>
                            <td className="py-4 text-slate-400 font-mono hidden md:table-cell">
                              {item.path}
                            </td>
                            <td className="py-4 text-center text-brand-muted hidden sm:table-cell">
                              {activeTab === 'projects' ? (
                                <span className="px-2.5 py-0.5 bg-slate-900 border border-brand-border rounded-full text-[10px]">
                                  {item.date || 'Research'}
                                </span>
                              ) : (
                                item.date || 'N/A'
                              )}
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleEdit(item.path)}
                                  className="p-2 bg-slate-900 border border-brand-border hover:border-slate-500 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition-all cursor-pointer"
                                  title="Edit entry"
                                >
                                  <Edit size={12} />
                                </button>
                                <button
                                  onClick={() => handleDelete(item.path, item.sha)}
                                  className="p-2 bg-slate-900 border border-brand-border hover:border-red-600 hover:bg-red-950/20 text-red-400 hover:text-red-300 rounded transition-all cursor-pointer"
                                  title="Delete entry"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW B: COMPOSER & PREVIEW INTERFACE */}
        {activeView === 'composer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Composer Form Pane */}
            <div className="col-span-1 lg:col-span-6 bg-brand-card border border-brand-border rounded p-6">
              <div className="flex justify-between items-center pb-4 border-b border-brand-border/40 mb-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveView('list')}
                    className="p-1.5 bg-slate-900 border border-brand-border hover:border-slate-600 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Back to list"
                  >
                    <ArrowLeft size={12} />
                  </button>
                  <h2 className="text-white font-bold text-base md:text-lg flex items-center gap-2 font-mono">
                    <PlusCircle className="text-brand-cyan w-5 h-5" />
                    <span>{editingSha ? 'MODIFY ENTRY' : 'CREATE ENTRY'}</span>
                  </h2>
                </div>

                <div className="px-3 py-1 bg-slate-950 border border-brand-border rounded font-mono text-[9px] text-brand-cyan uppercase">
                  DIRECTORY: content/{activeTab}/
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
                    onChange={(e) => {
                      setTitle(e.target.value);
                      addConsoleLine(`UPDATED TITLE: ${e.target.value}`);
                    }}
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

                {/* Tab conditional input fields */}
                {activeTab === 'events' && (
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

                {activeTab === 'blog' && (
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

                {activeTab === 'projects' && (
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

                {/* Tags */}
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

                {/* Markdown body text */}
                <div className="flex flex-col">
                  <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Markdown Description Body</label>
                  <textarea
                    rows={10}
                    placeholder="### Details Section&#10;Write markdown content paragraphs, lists, structures..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors font-mono"
                  />
                </div>

                {/* Action button triggers */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => setActiveView('list')}
                    className="flex-grow flex items-center justify-center gap-2 p-3 bg-slate-900 hover:bg-slate-800 border border-brand-border text-slate-300 hover:text-white rounded font-mono font-bold transition-all duration-300 cursor-pointer"
                  >
                    <span>CANCEL</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    disabled={!title}
                    className={`flex-grow flex items-center justify-center gap-2 p-3 border border-brand-border rounded font-mono font-bold transition-all duration-300 cursor-pointer ${
                      !title 
                        ? 'bg-slate-950 text-brand-muted border-brand-border/40 cursor-not-allowed' 
                        : 'bg-slate-900 hover:bg-slate-800 hover:border-slate-500 text-white'
                    }`}
                  >
                    <FileDown size={14} />
                    <span>DOWNLOAD .MD</span>
                  </button>

                  {!isSandboxMode && (
                    <button
                      onClick={handleSaveToGithub}
                      disabled={!title || isSaving}
                      className={`flex-grow flex items-center justify-center gap-2 p-3.5 rounded font-mono font-bold transition-all duration-300 shadow-[0_0_15px_rgba(0,245,160,0.05)] cursor-pointer ${
                        !title || isSaving
                          ? 'bg-slate-950 border border-brand-border text-brand-muted cursor-not-allowed'
                          : 'bg-brand-emerald hover:bg-brand-emerald/80 text-black shadow-[0_0_20px_rgba(0,245,160,0.15)]'
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>SAVING TO REPO...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} />
                          <span>{editingSha ? 'UPDATE GITHUB' : 'PUSH TO GITHUB'}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Diagnostic Console & Preview Pane */}
            <div className="col-span-1 lg:col-span-6 flex flex-col gap-6">
              
              {/* Output Preview Screen */}
              <div className="bg-slate-950 border border-brand-border rounded overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-900 border-b border-brand-border flex justify-between items-center font-mono text-[10px] text-brand-muted uppercase">
                  <div className="flex items-center gap-2">
                    <Terminal size={12} className="text-brand-cyan" />
                    <span>Compiler_Stdout.txt</span>
                  </div>
                  <span className="text-brand-emerald font-bold">PREVIEW</span>
                </div>
                
                <pre className="p-4 overflow-x-auto text-[11px] md:text-xs font-mono text-slate-300 leading-relaxed max-h-[380px] min-h-[320px]">
                  <code>{generateMarkdownString()}</code>
                </pre>
              </div>

              {/* Console log stream display */}
              <div className="bg-slate-950 border border-brand-border rounded overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-900 border-b border-brand-border flex justify-between items-center font-mono text-[10px] text-brand-muted uppercase">
                  <div className="flex items-center gap-2">
                    <Terminal size={12} className="text-brand-emerald" />
                    <span>Terminal_Diagnostics.log</span>
                  </div>
                  <button 
                    onClick={() => setConsoleLines(['CONSOLE CLEANSED.', 'AWAITING INSTRUCTIONS...'])}
                    className="text-[9px] hover:text-white transition-colors cursor-pointer"
                  >
                    CLEAR
                  </button>
                </div>
                
                <div className="p-4 overflow-y-auto text-[10px] font-mono text-brand-emerald space-y-1 max-h-[220px] min-h-[160px] bg-black/90 scrollbar-thin">
                  {consoleLines.map((line, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-slate-600 select-none">{String(i + 1).padStart(3, '0')}:</span>
                      <span className="break-all">{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="w-full border-t border-brand-border py-4 px-6 text-center font-mono text-[10px] text-brand-muted">
        AVBT CMS CLOUD CORE v2.5 // INTEGRATED DIRECT REPOSITORY SYNC
      </div>
    </main>
  );
}
