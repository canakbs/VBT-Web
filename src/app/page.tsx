import { getFilesFromDir } from "@/lib/markdown";
import Hero3D from "@/components/Hero3D";
import EventTimeline from "@/components/EventTimeline";
import ProjectPipeline from "@/components/ProjectPipeline";
import ImpactDashboard from "@/components/ImpactDashboard";
import JoinOnboarding from "@/components/JoinOnboarding";
import ContactSection from "@/components/ContactSection";
import NeuralBackground from "@/components/NeuralBackground";

export default function Home() {
  // Read events and projects from content markdown files
  const events = getFilesFromDir("events");
  const projects = getFilesFromDir("projects");

  return (
    <>
      {/* 3D Interactive Three.js Neural Network Canvas Background */}
      <NeuralBackground />

      {/* 1. Hero Experience (2D Linear Regression Interactive Physics Canvas + Copy + Large CTAs) */}
      <Hero3D />

      {/* 2. Topluluğumuz Rakamlarla (Statistics Dashboard & Sparklines) */}
      <ImpactDashboard />

      {/* 3. Etkinliklerimiz (Milestone Events - Limit 3 on Homepage) */}
      <EventTimeline events={events.slice(0, 3)} showMoreButton={events.length > 3} />

      {/* 4. Projelerimiz (Completed Community Projects) */}
      <ProjectPipeline projects={projects} />

      {/* 5. Bize Katıl (Final Application Wizard Flow) */}
      <JoinOnboarding />

      {/* 6. İletişim & İş Birliği (Questions, Inquiries, Collaborations Form) */}
      <ContactSection />

      {/* Scientific Community Footer */}
      <footer className="bg-[#090d16] border-t border-brand-border py-12 px-6 relative z-10 font-mono text-xs text-brand-muted">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.svg" 
              alt="Akdeniz Veri Bilimi Logo" 
              className="w-10 h-10 rounded-full object-contain border border-brand-border bg-slate-950 p-1"
            />
            <div className="flex flex-col items-center md:items-start gap-0.5">
              <span className="text-white font-bold tracking-wider">AKDENİZ VERİ BİLİMİ</span>
              <span>Akdeniz Veri Bilimi Topluluğu // 2025</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-[11px]">
            <a href="/#community-impact" className="hover:text-brand-cyan transition-colors">Rakamlar</a>
            <a href="/#event-archive" className="hover:text-brand-cyan transition-colors">Etkinlikler</a>
            <a href="/#project-showcase" className="hover:text-brand-cyan transition-colors">Projeler</a>
            <a href="/ekibimiz" className="hover:text-brand-cyan transition-colors">Ekibimiz</a>
            <a href="/veri-bilimi-nedir" className="hover:text-brand-cyan transition-colors">Veri Bilimi Nedir?</a>
            <a href="/#contact" className="hover:text-brand-cyan transition-colors">İletişim</a>
            <a href="/#join-us" className="hover:text-brand-emerald transition-colors font-bold">BİZE KATIL</a>
          </div>

          <div className="text-[10px] text-slate-600">
            © 2025 Akdeniz Veri Bilimi Topluluğu
          </div>
        </div>
      </footer>
    </>
  );
}
