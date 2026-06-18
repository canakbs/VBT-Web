'use client';

import React, { useState } from 'react';
import { ArrowLeft, Lock, ShieldAlert, Cpu, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { authenticate } from './actions';

export default function Login() {
  const [passwordInput, setPasswordInput] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptProgress, setDecryptProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isChecking || isDecrypting) return;
    setIsChecking(true);
    setErrorMsg('');

    try {
      const res = await authenticate(passwordInput);
      if (res.success) {
        setIsDecrypting(true);
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setDecryptProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              // Reload page to let server re-render and detect the valid HTTP-only cookie
              window.location.reload();
            }, 300);
          }
        }, 100);
      } else {
        setErrorMsg(res.error || 'INVALID PASSCODE');
        setIsChecking(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('SYSTEM ERROR: CRYPTO ENGINE FAILED');
      setIsChecking(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Grids */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />
      
      {/* Glare effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-emerald/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="max-w-md w-full relative z-10">
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

            <div className="bg-slate-950 border border-brand-border/60 rounded p-4 mb-6 font-mono text-[10px] text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>[SECURE STATE]</span>
                <span className="text-red-500">LOCKED</span>
              </div>
              <div className="flex justify-between">
                <span>[DECRYPTION ENGINE]</span>
                <span className="text-brand-cyan">AES_SECURE_AUTH</span>
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
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
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
