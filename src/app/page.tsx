import { getFilesFromDir } from "@/lib/markdown";
import Hero3D from "@/components/Hero3D";
import EventTimeline from "@/components/EventTimeline";
import ProjectPipeline from "@/components/ProjectPipeline";
import JoinOnboarding from "@/components/JoinOnboarding";
import Footer from "@/components/Footer";
import fs from 'fs';
import path from 'path';
import dynamic from 'next/dynamic';

const NeuralBackground = dynamic(() => import('@/components/NeuralBackground'));

export default function Home() {
  // Read events and projects from content markdown files
  const events = getFilesFromDir("events");
  const projects = getFilesFromDir("projects");

  // Read hero frames configuration
  let heroFrames = [];
  try {
    const filePath = path.join(process.cwd(), 'content', 'hero-frames.json');
    if (fs.existsSync(filePath)) {
      heroFrames = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (err) {
    console.error('Failed to load hero frames:', err);
  }

  return (
    <>
      {/* 3D Interactive Three.js Neural Network Canvas Background */}
      <NeuralBackground />

      {/* 1. Hero Experience (Copy + Slogan & Compact Stat Metrics Cards) */}
      <Hero3D frames={heroFrames} />

      {/* 2. Etkinliklerimiz (Milestone Events - All events in slider) */}
      <EventTimeline events={events} showMoreButton={events.length > 3} />

      {/* 3. Projelerimiz (Completed Community Projects - Stacked Reveal) */}
      <ProjectPipeline projects={projects} />

      {/* 4. Bize Katıl (Final Application Wizard Flow) */}
      <JoinOnboarding />

      {/* Scientific Community Footer */}
      <Footer />
    </>
  );
}
