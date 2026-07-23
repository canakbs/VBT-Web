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
  FolderOpen,
  Inbox,
  User,
  Mail,
  Calendar,
  Network,
  Crosshair
} from 'lucide-react';
import Link from 'next/link';
import { 
  logout, 
  getContentList, 
  getFileContent, 
  saveContent, 
  deleteContent,
  uploadImageAction,
  getApplicationsList,
  deleteApplication
} from './actions';

export default function Workspace() {
  // Navigation & Tabs
  const [activeView, setActiveView] = useState<'list' | 'composer'>('list');
  const [activeTab, setActiveTab] = useState<'events' | 'blog' | 'projects' | 'team' | 'applications'>('events');
  const [contentList, setContentList] = useState<any[]>([]);
  const [applicationsList, setApplicationsList] = useState<any[]>([]);
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

  // Team member specific fields
  const [teamRole, setTeamRole] = useState('');
  const [teamDepartment, setTeamDepartment] = useState('Üst Yönetim');
  const [teamSkills, setTeamSkills] = useState('');
  const [teamBio, setTeamBio] = useState('');
  const [teamGithub, setTeamGithub] = useState('');
  const [teamLinkedin, setTeamLinkedin] = useState('');
  const [teamConnections, setTeamConnections] = useState('');
  const [teamX, setTeamX] = useState(50);
  const [teamY, setTeamY] = useState(50);
  
  // Image handling
  const [imagePath, setImagePath] = useState('/images/placeholder.jpg');

  // Commit tracking
  const [editingFilename, setEditingFilename] = useState('');
  const [editingSha, setEditingSha] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [consoleLines, setConsoleLines] = useState<string[]>([
    'SYSTEM INITIALIZED: AVBT CMS CORE v2.5',
    'AWAITING INSTRUCTIONS...'
  ]);

  // Load Content List
  const fetchList = async (type: 'events' | 'blog' | 'projects' | 'team' | 'applications') => {
    setIsLoadingList(true);
    setIsSandboxMode(false);

    if (type === 'applications') {
      try {
        const apps = await getApplicationsList();
        setApplicationsList(apps);
      } catch (err) {
        console.error(err);
        setApplicationsList([]);
      } finally {
        setIsLoadingList(false);
      }
      return;
    }

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

  // Handle interactive SVG map position selection
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const yPct = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setTeamX(Math.max(5, Math.min(95, xPct)));
    setTeamY(Math.max(5, Math.min(95, yPct)));
    addConsoleLine(`AĞ HARİTASI KONUMU GÜNCELLENDİ: X=${xPct}%, Y=${yPct}%`);
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
    setEventDate('');
    setEventCategory('AI Workshops');
    setEventStats('');
    setEventOutcome('');
    
    setBlogDate('');
    setBlogAuthor('');
    setBlogStats('');
    
    setProjectStage('Idea');
    setProjectCategory('');
    setProjectGithub('');
    setProjectStats('');

    setTeamRole('');
    setTeamDepartment('Üst Yönetim');
    setTeamSkills('');
    setTeamBio('');
    setTeamGithub('');
    setTeamLinkedin('');
    setTeamConnections('');
    setTeamX(50);
    setTeamY(50);
    setImagePath('');
    
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
      setImagePath(fileData.metadata.image || '');

      const parts = path.split('/');
      const name = parts[parts.length - 1];
      setEditingFilename(name);
      setEditingSha(fileData.sha);

      if (activeTab === 'events') {
        setEventDate(fileData.metadata.date || '');
        setEventCategory(fileData.metadata.category || 'AI Workshops');
        setEventStats(fileData.metadata.stats || '');
        setEventOutcome(fileData.metadata.outcome || '');
      } else if (activeTab === 'blog') {
        setBlogDate(fileData.metadata.date || '');
        setBlogAuthor(fileData.metadata.author || '');
        setBlogStats(fileData.metadata.stats || '');
      } else if (activeTab === 'team') {
        setTeamRole(fileData.metadata.role || '');
        setTeamDepartment(fileData.metadata.department || 'Üst Yönetim');
        setTeamSkills(fileData.metadata.skills ? (Array.isArray(fileData.metadata.skills) ? fileData.metadata.skills.join(', ') : fileData.metadata.skills) : '');
        setTeamBio(fileData.metadata.bio || fileData.content || '');
        setTeamGithub(fileData.metadata.github || '');
        setTeamLinkedin(fileData.metadata.linkedin || '');
        setTeamConnections(fileData.metadata.connections ? (Array.isArray(fileData.metadata.connections) ? fileData.metadata.connections.join(', ') : fileData.metadata.connections) : '');
        setTeamX(fileData.metadata.x ? Number(fileData.metadata.x) : 50);
        setTeamY(fileData.metadata.y ? Number(fileData.metadata.y) : 50);
      } else {
        setProjectStage(fileData.metadata.stage || 'Idea');
        setProjectCategory(fileData.metadata.category || '');
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
    if (!window.confirm(`Bu dosyayı silmek istediğinizden emin misiniz?\nYol: ${path}`)) {
      return;
    }

    addConsoleLine(`DELETING FILE: ${path}`);
    try {
      await deleteContent(path, sha);
      addConsoleLine('FILE DELETED SUCCESSFULLY.');
      fetchList(activeTab);
    } catch (err: any) {
      console.error(err);
      addConsoleLine(`DELETE FAILED: ${err.message || 'Unknown error'}`);
      alert(`Silme başarısız: ${err.message || 'Unknown error'}`);
    }
  };

  // Delete application record
  const handleDeleteApp = async (id: string) => {
    if (!window.confirm('Bu başvuruyu silmek istediğinizden emin misiniz?')) return;
    try {
      await deleteApplication(id);
      fetchList('applications');
    } catch (err: any) {
      alert('Silinemedi: ' + err.message);
    }
  };

  // Helper: Compile tags
  const getTagsArray = () => {
    return tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  };

  // Image Uploader
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        addConsoleLine(`STARTING IMAGE UPLOAD: ${file.name}...`);
        const base64String = (event.target?.result as string).split(',')[1];
        const destFolder = activeTab === 'applications' ? 'events' : activeTab;
        const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
        const finalName = `${Date.now()}-${cleanName}`;
        
        const result = await uploadImageAction(
          destFolder as 'events' | 'blog' | 'projects' | 'team', 
          finalName, 
          base64String
        );
        if (result.success && result.path) {
          setImagePath(result.path);
          addConsoleLine(`IMAGE UPLOAD SUCCESSFUL: ${result.path}`);
        }
      } catch (err: any) {
        console.error(err);
        addConsoleLine(`IMAGE UPLOAD FAILED: ${err.message}`);
        alert('Resim yüklenirken hata oluştu: ' + err.message);
      }
    };
    reader.readAsDataURL(file);
  };

  // Compile final markdown content string
  const generateMarkdownString = () => {
    const tagsArr = getTagsArray();
    const formattedTags = tagsArr.length ? `\ntags: ${JSON.stringify(tagsArr)}` : '';

    if (activeTab === 'events') {
      return `---
title: "${title}"
date: "${eventDate}"
category: "${eventCategory}"
stats: "${eventStats}"
outcome: "${eventOutcome}"
image: "${imagePath}"
summary: "${summary}"${formattedTags}
---

${content}
`;
    }

    if (activeTab === 'blog') {
      return `---
title: "${title}"
date: "${blogDate}"
author: "${blogAuthor}"
stats: "${blogStats}"
image: "/images/blog/placeholder.jpg"
summary: "${summary}"${formattedTags}
---

${content}
`;
    }

    // Projects
    if (activeTab === 'projects') {
      return `---
title: "${title}"
stage: "${projectStage}"
category: "${projectCategory}"
github: "${projectGithub}"
stats: "${projectStats}"
image: "${imagePath}"
summary: "${summary}"${formattedTags}
---

${content}
`;
    }

    // Team Member
    const skillsArray = teamSkills.split(',').map((s) => s.trim()).filter(Boolean);
    const connArray = teamConnections.split(',').map((s) => s.trim()).filter(Boolean);

    return `---
title: "${title}"
role: "${teamRole}"
department: "${teamDepartment}"
skills: ${JSON.stringify(skillsArray)}
bio: "${teamBio}"
github: "${teamGithub}"
linkedin: "${teamLinkedin}"
connections: ${JSON.stringify(connArray)}
x: ${teamX}
y: ${teamY}
summary: "${summary || teamRole}"${formattedTags}
---

${content || teamBio}
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
      } else if (activeTab === 'team') {
        filename = `${cleanTitle || 'new-member'}.md`;
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
    if (!title || isSaving || activeTab === 'applications') return;
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
      } else if (activeTab === 'team') {
        filename = `${cleanTitle || 'new-member'}.md`;
      } else {
        filename = `${cleanTitle || 'new-project'}.md`;
      }
    }

    addConsoleLine(`SAVING CONTENT: content/${activeTab}/${filename}`);
    const mdContent = generateMarkdownString();

    try {
      const res = await saveContent(activeTab, filename, mdContent, editingSha);
      addConsoleLine(`KAYIT BAŞARILI! SHA: ${res.sha.substring(0, 8)}`);
      setIsSaving(false);
      
      setTimeout(() => {
        setActiveView('list');
      }, 1000);
    } catch (err: any) {
      console.error(err);
      addConsoleLine(`KAYIT HATASI: ${err.message || 'Bilinmeyen hata'}`);
      setIsSaving(false);
      alert(`Kayıt başarısız: ${err.message || 'Bilinmeyen hata'}`);
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
              <span>Ana Sayfa</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-cyan" />
              <span className="font-mono text-xs text-white uppercase tracking-wider">
                Yönetim Kontrol Paneli
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-brand-emerald">
              DURUM: KONTROL PANELİ AKTİF
            </span>
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-1.5 px-3 py-1 bg-red-950/20 border border-red-900/50 hover:border-red-600 rounded font-mono text-[10px] text-red-400 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut size={10} />
              <span>ÇIKIŞ YAP</span>
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
                  <span>İçerik Yönetim Paneli</span>
                </h1>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  ETKİNLİKLERİ, PROJELERİ, EKİBİ VE BAŞVURULARI BURADAN DÜZENLEYEBİLİRSİNİZ
                </p>
              </div>
              
              {activeTab !== 'applications' && (
                <button
                  onClick={handleCreateNew}
                  className="flex items-center gap-2 px-5 py-2.5 bg-brand-emerald hover:bg-brand-emerald/80 text-black font-mono font-bold text-xs rounded transition-all duration-300 shadow-[0_0_15px_rgba(0,245,160,0.1)] hover:shadow-[0_0_25px_rgba(0,245,160,0.2)] cursor-pointer"
                >
                  <PlusCircle size={14} />
                  <span>YENİ {activeTab === 'team' ? 'EKİP ÜYESİ' : 'İÇERİK'} EKLE</span>
                </button>
              )}
            </div>

            {/* Tab Navigation & List Grid */}
            <div className="bg-brand-card border border-brand-border rounded overflow-hidden">
              <div className="flex border-b border-brand-border bg-slate-950/40 flex-wrap">
                {(['events', 'blog', 'projects', 'team', 'applications'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 font-mono text-xs uppercase font-bold border-r border-brand-border transition-colors cursor-pointer flex items-center gap-2 ${
                      activeTab === tab
                        ? 'bg-slate-900/60 text-brand-cyan border-b-2 border-b-brand-cyan'
                        : 'text-slate-400 hover:text-white hover:bg-slate-950/20'
                    }`}
                  >
                    {tab === 'applications' && <Inbox size={14} className="text-amber-400" />}
                    {tab === 'events' && 'Etkinlikler'}
                    {tab === 'blog' && 'Blog / Yayınlar'}
                    {tab === 'projects' && 'Projeler'}
                    {tab === 'team' && 'Ekip Üyeleri'}
                    {tab === 'applications' && 'Gelen Başvurular'}
                  </button>
                ))}
              </div>

              {/* Applications List Render */}
              {activeTab === 'applications' ? (
                <div className="p-6">
                  {isLoadingList ? (
                    <div className="py-24 flex flex-col justify-center items-center text-center font-mono text-xs text-brand-cyan">
                      <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-cyan" />
                      <span>BAŞVURULAR YÜKLENİYOR...</span>
                    </div>
                  ) : applicationsList.length === 0 ? (
                    <div className="py-24 text-center border border-dashed border-brand-border/60 rounded flex flex-col justify-center items-center text-brand-muted font-mono text-xs uppercase">
                      <Inbox className="w-8 h-8 mb-3 text-slate-700" />
                      Henüz kaydedilmiş başvuru bulunmuyor.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="font-mono text-xs text-brand-cyan mb-2">
                        TOPLAM {applicationsList.length} BAŞVURU KAYDI
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {applicationsList.map((app) => (
                          <div key={app.id} className="p-5 bg-slate-950 border border-brand-border rounded-xl font-mono text-xs text-slate-300 space-y-3 relative group">
                            <div className="flex justify-between items-start border-b border-brand-border/40 pb-3">
                              <div>
                                <span className="text-white font-bold text-sm flex items-center gap-2">
                                  <User size={14} className="text-brand-cyan" />
                                  {app.fullName}
                                </span>
                                <span className="text-brand-cyan text-xs flex items-center gap-1.5 mt-1">
                                  <Mail size={12} />
                                  {app.email}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                  <Calendar size={10} />
                                  {new Date(app.submittedAt).toLocaleString('tr-TR')}
                                </span>
                                <button
                                  onClick={() => handleDeleteApp(app.id)}
                                  className="p-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-900/40 text-red-400 rounded transition-colors"
                                  title="Başvuruyu sil"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                              <div><strong className="text-slate-400">Departman:</strong> {app.department}</div>
                              <div><strong className="text-slate-400">Seviye:</strong> {app.level}</div>
                              <div className="sm:col-span-2">
                                <strong className="text-slate-400">İlgi Alanları:</strong> {app.selectedInterests?.join(', ') || 'Yok'}
                              </div>
                            </div>

                            {app.goals && (
                              <div className="p-3 bg-slate-900 border border-brand-border/30 rounded text-[11px] text-slate-300">
                                <strong className="text-brand-cyan block mb-1">Hedefler &amp; Proje Fikirleri:</strong>
                                {app.goals}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Grid Content List (Events/Blog/Projects/Team) */
                <div className="p-6">
                  {isLoadingList ? (
                    <div className="py-24 flex flex-col justify-center items-center text-center font-mono text-xs text-brand-cyan">
                      <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-cyan" />
                      <span>İÇERİKLER YÜKLENİYOR: {activeTab.toUpperCase()}...</span>
                    </div>
                  ) : contentList.length === 0 ? (
                    <div className="py-24 text-center border border-dashed border-brand-border/60 rounded flex flex-col justify-center items-center text-brand-muted font-mono text-xs uppercase">
                      <AlertTriangle className="w-8 h-8 mb-3 text-slate-700" />
                      {`Henüz kayıtlı dosya yok: content/${activeTab}/`}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-mono text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-brand-border/60 text-slate-500 uppercase tracking-widest text-[10px]">
                            <th className="pb-3 font-semibold">Ad Soyad / Başlık</th>
                            <th className="pb-3 font-semibold hidden md:table-cell">Dosya Yolu</th>
                            <th className="pb-3 font-semibold text-center hidden sm:table-cell">
                              {activeTab === 'team' ? 'Departman' : activeTab === 'projects' ? 'Aşama' : 'Tarih'}
                            </th>
                            <th className="pb-3 font-semibold text-right">İşlemler</th>
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
                                  {item.summary || item.role || 'Özet yok...'}
                                </span>
                              </td>
                              <td className="py-4 text-slate-400 font-mono hidden md:table-cell">
                                {item.path}
                              </td>
                              <td className="py-4 text-center text-brand-muted hidden sm:table-cell">
                                {activeTab === 'team' ? (
                                  <span className="px-2.5 py-0.5 bg-slate-900 border border-brand-border rounded-full text-[10px] text-brand-cyan font-bold">
                                    {item.department || 'Takım'}
                                  </span>
                                ) : activeTab === 'projects' ? (
                                  <span className="px-2.5 py-0.5 bg-slate-900 border border-brand-border rounded-full text-[10px]">
                                    {item.date || 'Araştırma'}
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
                                    title="Düzenle"
                                  >
                                    <Edit size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(item.path, item.sha)}
                                    className="p-2 bg-slate-900 border border-brand-border hover:border-red-600 hover:bg-red-950/20 text-red-400 hover:text-red-300 rounded transition-all cursor-pointer"
                                    title="Sil"
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
              )}
            </div>
          </div>
        )}

        {/* VIEW B: COMPOSER INTERFACE */}
        {activeView === 'composer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Form Pane */}
            <div className="col-span-1 lg:col-span-6 bg-brand-card border border-brand-border rounded p-6">
              <div className="flex justify-between items-center pb-4 border-b border-brand-border/40 mb-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveView('list')}
                    className="p-1.5 bg-slate-900 border border-brand-border hover:border-slate-600 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Listeye dön"
                  >
                    <ArrowLeft size={12} />
                  </button>
                  <h2 className="text-white font-bold text-base md:text-lg flex items-center gap-2 font-mono">
                    <PlusCircle className="text-brand-cyan w-5 h-5" />
                    <span>{editingSha ? 'KAYDI DÜZENLE' : 'YENİ KAYIT EKLE'}</span>
                  </h2>
                </div>

                <div className="px-3 py-1 bg-slate-950 border border-brand-border rounded font-mono text-[9px] text-brand-cyan uppercase">
                  DİZİN: content/{activeTab}/
                </div>
              </div>

              <div className="space-y-4 font-mono text-xs text-slate-300">
                {/* Title */}
                <div className="flex flex-col">
                  <label className="text-slate-400 mb-1.5 uppercase tracking-wider font-bold">
                    {activeTab === 'team' ? 'Ad Soyad' : 'Başlık'}
                  </label>
                  <input
                    type="text"
                    placeholder={activeTab === 'team' ? 'Örn: Dr. Ayşe Yılmaz' : "Örn: Derin Öğrenme Bootcamp'i"}
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      addConsoleLine(`GÜNCELLENEN BAŞLIK: ${e.target.value}`);
                    }}
                    className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors"
                  />
                </div>

                {/* Team Member Specific Inputs */}
                {activeTab === 'team' && (
                  <div className="space-y-4 p-4 bg-slate-950 border border-brand-border/60 rounded-xl">
                    <div className="font-mono text-xs text-brand-cyan font-bold flex items-center gap-2 mb-2">
                      <Network size={14} />
                      <span>EKİP ÜYESİ VE AĞ AYARLARI</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="text-slate-400 mb-1 uppercase text-[10px]">Görev / Unvan</label>
                        <input
                          type="text"
                          placeholder="Örn: NLP Lideri / Araştırmacı"
                          value={teamRole}
                          onChange={(e) => setTeamRole(e.target.value)}
                          className="p-2.5 bg-slate-900 border border-brand-border rounded text-white text-xs focus:border-brand-cyan focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-slate-400 mb-1 uppercase text-[10px]">Departman</label>
                        <select
                          value={teamDepartment}
                          onChange={(e) => setTeamDepartment(e.target.value)}
                          className="p-2.5 bg-slate-900 border border-brand-border rounded text-white text-xs focus:border-brand-cyan focus:outline-none"
                        >
                          <option value="Üst Yönetim">Üst Yönetim</option>
                          <option value="Etkinlik &amp; Organizasyon">Etkinlik &amp; Organizasyon</option>
                          <option value="Sosyal Medya">Sosyal Medya</option>
                          <option value="ARGE">ARGE</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-slate-400 mb-1 uppercase text-[10px]">Uzmanlık &amp; İlgi Alanları (Virgülle)</label>
                      <input
                        type="text"
                        placeholder="Örn: PyTorch, Transformers, MLOps, NLP"
                        value={teamSkills}
                        onChange={(e) => setTeamSkills(e.target.value)}
                        className="p-2.5 bg-slate-900 border border-brand-border rounded text-white text-xs focus:border-brand-cyan focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="text-slate-400 mb-1 uppercase text-[10px]">GitHub URL (İsteğe Bağlı)</label>
                        <input
                          type="url"
                          placeholder="Örn: https://github.com/kullanici"
                          value={teamGithub}
                          onChange={(e) => setTeamGithub(e.target.value)}
                          className="p-2.5 bg-slate-900 border border-brand-border rounded text-white text-xs focus:border-brand-cyan focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-slate-400 mb-1 uppercase text-[10px]">LinkedIn URL (İsteğe Bağlı)</label>
                        <input
                          type="url"
                          placeholder="Örn: https://linkedin.com/in/kullanici"
                          value={teamLinkedin}
                          onChange={(e) => setTeamLinkedin(e.target.value)}
                          className="p-2.5 bg-slate-900 border border-brand-border rounded text-white text-xs focus:border-brand-cyan focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-slate-400 mb-1 uppercase text-[10px]">Bağlantılı Kişiler (Virgülle Ad Soyad)</label>
                      <input
                        type="text"
                        placeholder="Örn: Alperen Demir, Begüm Kaya"
                        value={teamConnections}
                        onChange={(e) => setTeamConnections(e.target.value)}
                        className="p-2.5 bg-slate-900 border border-brand-border rounded text-white text-xs focus:border-brand-cyan focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-500 mt-1">İnteraktif ağ grafiğinde bu üyenin kimlerle çizgi bağlantısı olacağını belirler.</span>
                    </div>

                    {/* Interactive Graphical Node Position Picker */}
                    <div className="space-y-2 pt-3 border-t border-brand-border/40">
                      <div className="flex justify-between items-center">
                        <label className="text-brand-cyan font-bold uppercase text-[11px] flex items-center gap-1.5">
                          <Crosshair size={13} />
                          <span>GÖRSEL AĞ KONUMU SEÇİCİ</span>
                        </label>
                        <span className="font-mono text-xs text-brand-emerald font-bold">
                          X: %{teamX} | Y: %{teamY}
                        </span>
                      </div>

                      <div className="relative aspect-[4/3] bg-slate-900 border border-brand-cyan/40 rounded-xl overflow-hidden cursor-crosshair group shadow-inner">
                        <div className="absolute inset-0 scientific-grid opacity-20 pointer-events-none" />
                        
                        <svg
                          viewBox="0 0 100 100"
                          className="w-full h-full select-none"
                          onClick={handleMapClick}
                        >
                          {/* Grid crosshair guides */}
                          <line x1={teamX} y1={0} x2={teamX} y2={100} stroke="rgba(0, 242, 254, 0.2)" strokeWidth={0.3} strokeDasharray="1 1" />
                          <line x1={0} y1={teamY} x2={100} y2={teamY} stroke="rgba(0, 242, 254, 0.2)" strokeWidth={0.3} strokeDasharray="1 1" />

                          {/* Existing team nodes */}
                          {contentList.map((item, idx) => {
                            const isCurrent = item.title === title || item.path.includes(editingFilename);
                            if (isCurrent) return null;
                            const px = item.x ? Number(item.x) : (20 + (idx * 15) % 65);
                            const py = item.y ? Number(item.y) : (30 + (idx * 18) % 55);
                            return (
                              <g key={item.name || idx}>
                                <circle cx={px} cy={py} r={3} fill="#1e293b" stroke="#475569" strokeWidth={0.5} />
                                <text x={px} y={py + 5} fill="#64748b" fontSize="2.5" textAnchor="middle" className="font-mono">
                                  {item.title ? item.title.split(' ')[0] : 'Üye'}
                                </text>
                              </g>
                            );
                          })}

                          {/* Target active member node */}
                          <g>
                            <circle cx={teamX} cy={teamY} r={7} fill="rgba(0, 242, 254, 0.15)" stroke="#00f2fe" strokeWidth={0.5} />
                            <circle cx={teamX} cy={teamY} r={4} fill="#00f2fe" />
                            <text x={teamX} y={teamY - 6} fill="#ffffff" fontSize="3.2" fontWeight="bold" textAnchor="middle">
                              {title || 'Yeni Üye'}
                            </text>
                          </g>
                        </svg>

                        <div className="absolute bottom-2 left-2 text-[9px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-brand-border">
                          👉 Haritada istediğiniz noktaya tıklayarak konumu belirleyin
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="flex flex-col">
                  <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Kısa Özet</label>
                  <textarea
                    rows={2}
                    placeholder="Kısa bir özet yazın (1-2 cümle)..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors"
                  />
                </div>

                {/* Conditional fields for Events */}
                {activeTab === 'events' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-brand-border/30 py-4">
                    <div className="flex flex-col sm:col-span-2">
                      <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Kapak Fotoğrafı</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="p-2 bg-slate-900 border border-brand-border rounded text-white text-xs w-full"
                        />
                        {imagePath && (
                          <div className="w-10 h-10 overflow-hidden rounded border border-brand-cyan shrink-0">
                            <img src={imagePath} alt="preview" className="object-cover w-full h-full" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Etkinlik Tarihi</label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Kategori</label>
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
                  </div>
                )}

                {/* Conditional fields for Projects */}
                {activeTab === 'projects' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-brand-border/30 py-4">
                    <div className="flex flex-col sm:col-span-2">
                      <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Proje Fotoğrafı (Sol Bölüm İçin)</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="p-2 bg-slate-900 border border-brand-border rounded text-white text-xs w-full"
                        />
                        {imagePath && (
                          <div className="w-10 h-10 overflow-hidden rounded border border-brand-cyan shrink-0">
                            <img src={imagePath} alt="preview" className="object-cover w-full h-full" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Proje Aşaması</label>
                      <select
                        value={projectStage}
                        onChange={(e) => setProjectStage(e.target.value)}
                        className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors"
                      >
                        <option value="Idea">Fikir Aşaması (Idea)</option>
                        <option value="Research">Araştırma Aşaması (Research)</option>
                        <option value="Development">Geliştirme Aşaması (Development)</option>
                        <option value="Deployment">Yayınlandı / Canlıda (Deployment)</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Kategori</label>
                      <input
                        type="text"
                        placeholder="Örn: NLP, Computer Vision, Reinforcement Learning"
                        value={projectCategory}
                        onChange={(e) => setProjectCategory(e.target.value)}
                        className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-slate-400 mb-1.5 uppercase tracking-wider">GitHub Linki</label>
                      <input
                        type="url"
                        placeholder="Örn: https://github.com/akdeniz-veri/proje"
                        value={projectGithub}
                        onChange={(e) => setProjectGithub(e.target.value)}
                        className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Performans Metrikleri / İstatistikler</label>
                      <input
                        type="text"
                        placeholder="Örn: Accuracy: %95, Latency: 12ms"
                        value={projectStats}
                        onChange={(e) => setProjectStats(e.target.value)}
                        className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-col">
                  <label className="text-slate-400 mb-1.5 uppercase tracking-wider">Etiketler (Virgülle)</label>
                  <input
                    type="text"
                    placeholder="Örn: PyTorch, YOLOv8, CNN"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="p-3 bg-slate-900 border border-brand-border rounded text-white focus:border-brand-cyan focus:outline-none transition-colors"
                  />
                </div>

                {/* Markdown body text */}
                <div className="flex flex-col">
                  <label className="text-slate-400 mb-1.5 uppercase tracking-wider">
                    {activeTab === 'team' ? 'Biyografi Metni' : 'Markdown İçeriği'}
                  </label>
                  <textarea
                    rows={8}
                    placeholder={activeTab === 'team' ? 'Ekip üyesinin detaylı biyografisi...' : 'Markdown içerik metni...'}
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
                    <span>İPTAL</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    disabled={!title}
                    className="flex-grow flex items-center justify-center gap-2 p-3 bg-slate-900 border border-brand-border rounded font-mono font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <FileDown size={14} />
                    <span>MARKDOWN (.MD) İNDİR</span>
                  </button>

                  <button
                    onClick={handleSaveToGithub}
                    disabled={!title || isSaving}
                    className="flex-grow flex items-center justify-center gap-2 p-3.5 bg-brand-emerald hover:bg-brand-emerald/80 text-black rounded font-mono font-bold transition-all shadow-md cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>KAYDEDİLİYOR...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        <span>KAYDET</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Preview Pane */}
            <div className="col-span-1 lg:col-span-6 flex flex-col gap-6">
              <div className="bg-slate-950 border border-brand-border rounded overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-900 border-b border-brand-border flex justify-between items-center font-mono text-[10px] text-brand-muted uppercase">
                  <div className="flex items-center gap-2">
                    <Terminal size={12} className="text-brand-cyan" />
                    <span>Önizleme.md</span>
                  </div>
                  <span className="text-brand-emerald font-bold">PREVIEW</span>
                </div>
                
                <pre className="p-4 overflow-x-auto text-[11px] md:text-xs font-mono text-slate-300 leading-relaxed max-h-[380px] min-h-[320px]">
                  <code>{generateMarkdownString()}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="w-full border-t border-brand-border py-4 px-6 text-center font-mono text-[10px] text-brand-muted">
        AVBT CMS YÖNETİM PANELİ
      </div>
    </main>
  );
}
