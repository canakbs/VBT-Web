import type { Metadata } from "next";
import { getFilesFromDir } from "@/lib/markdown";
import EventList from "@/components/EventList";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import NeuralBackground from "@/components/NeuralBackground";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Etkinlik Arşivi | Akdeniz Veri Bilimi Topluluğu",
  description:
    "Akdeniz Veri Bilimi Topluluğu etkinlik arşivi — workshoplar, hackathonlar, yapay zekâ seminerleri ve teknoloji buluşmaları.",
  keywords: [
    "Akdeniz Veri Bilimi Etkinlikleri",
    "Antalya Yapay Zeka Seminerleri",
    "Python Workshop Antalya",
    "Data Talk Buluşmaları",
    "Hackathon Antalya",
    "Veri Bilimi Çalıştayları",
    "Akdeniz Üniversitesi Etkinlik Arşivi",
  ],
  openGraph: {
    title: "Etkinlik Arşivi | Akdeniz Veri Bilimi Topluluğu",
    description: "Workshoplar, hackathonlar ve teknoloji buluşmaları arşivi.",
    url: "https://akdenizveribilimi.com/etkinlikler",
    images: ["/logo.webp"],
  },
};

export default function EventsArchivePage() {
  const allEvents = getFilesFromDir("events");

  return (
    <>
      <NeuralBackground />

      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        <SiteNav />

        <div className="pt-24 pb-16 flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-brand-muted hover:text-white transition-colors px-3 py-1.5 bg-brand-card/50 border border-brand-border rounded-lg"
            >
              <ArrowLeft size={14} />
              <span>Ana Sayfaya Dön</span>
            </Link>
            <span className="font-mono text-xs text-brand-cyan uppercase">
              TOPLAM {allEvents.length} ETKİNLİK
            </span>
          </div>

          <EventList events={allEvents} />
        </div>

        <Footer />
      </div>
    </>
  );
}
