import { getFilesFromDir } from "@/lib/markdown";
import Hero3D from "@/components/Hero3D";
import EventTimeline from "@/components/EventTimeline";
import LearningRoadmap from "@/components/LearningRoadmap";
import ProjectPipeline from "@/components/ProjectPipeline";
import TeamNetwork from "@/components/TeamNetwork";
import ImpactDashboard from "@/components/ImpactDashboard";
import JoinOnboarding from "@/components/JoinOnboarding";
import NeuralBackground from "@/components/NeuralBackground";

export default function Home() {
  // Read events and projects statically from content files
  const events = getFilesFromDir("events");
  const projects = getFilesFromDir("projects");

  return (
    <>
      <NeuralBackground />
      {/* 1. DATA: Hero Experience */}
      <Hero3D />

      {/* 2. KNOWLEDGE: Event Archive milestones (Limit to last 3 for homepage) */}
      <EventTimeline events={events.slice(0, 3)} showMoreButton={events.length > 3} />

      {/* 3. KNOWLEDGE: Data Science Journey paths */}
      <LearningRoadmap />

      {/* 5. COMMUNITY: Project Showcase dashboard */}
      <ProjectPipeline projects={projects} />

      {/* 6. COMMUNITY: Team organization network */}
      <TeamNetwork />

      {/* 7. IMPACT: Telemetry dashboard counters */}
      <ImpactDashboard />

      {/* 9. Join Us onboarding wizard flow */}
      <JoinOnboarding />

      {/* Interactive scientific footer */}
      <footer className="bg-slate-950 border-t border-brand-border py-12 px-6 relative z-10 font-mono text-xs text-brand-muted">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-white font-bold tracking-wider">AKDENİZ VERİ BİLİMİ</span>
            <span>Akdeniz Üniversitesi Veri Bilimi Topluluğu // 2024</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-[11px]">
            <a href="#who-we-are" className="hover:text-brand-cyan transition-colors">Biz Kimiz</a>
            <a href="#event-archive" className="hover:text-brand-cyan transition-colors">Etkinlikler</a>
            <a href="#ds-journey" className="hover:text-brand-cyan transition-colors">Yol Haritası</a>
            <a href="#project-showcase" className="hover:text-brand-cyan transition-colors">Projeler</a>
            <a href="#team" className="hover:text-brand-cyan transition-colors">Ekip</a>
            <a href="#join-us" className="hover:text-brand-emerald transition-colors font-bold">BİZE KATIL</a>
          </div>

          <div className="text-[10px] text-slate-600">
            © 2024 Akdeniz Veri Bilimi Topluluğu
          </div>
        </div>
      </footer>
    </>
  );
}
