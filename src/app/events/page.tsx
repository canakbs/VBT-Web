import { getFilesFromDir } from "@/lib/markdown";
import EventTimeline from "@/components/EventTimeline";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EventsArchivePage() {
  const allEvents = getFilesFromDir("events");

  return (
    <main className="min-h-screen bg-brand-bg flex flex-col justify-between">
      {/* Background Grids */}
      <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />

      {/* Navigation Header */}
      <header className="w-full border-b border-brand-border bg-slate-950/70 py-4 px-6 relative z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link 
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-brand-border hover:border-slate-600 rounded font-mono text-xs text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={12} />
            <span>Ana Sayfaya Dön</span>
          </Link>
          <span className="font-mono text-xs text-brand-cyan uppercase">ETKİNLİK ARŞİVİ // TOTAL: {allEvents.length} UNIT</span>
        </div>
      </header>

      {/* Main Full Timeline Archives */}
      <div className="flex-grow relative z-10">
        <EventTimeline events={allEvents} showMoreButton={false} />
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-brand-border py-6 px-6 text-center font-mono text-[10px] text-brand-muted relative z-20 bg-slate-950">
        AVBT EVENT ARCHIVE SERVICE CORE v1.0
      </footer>
    </main>
  );
}
