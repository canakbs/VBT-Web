import type { Metadata } from "next";
import { getFilesFromDir } from "@/lib/markdown";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import NeuralBackground from "@/components/NeuralBackground";
import Link from "next/link";
import { ArrowLeft, ExternalLink, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Proje Arşivi | Akdeniz Veri Bilimi Topluluğu",
  description:
    "Akdeniz Veri Bilimi Topluluğu öğrencileri ve araştırmacıları tarafından geliştirilen açık kaynak veri bilimi ve yapay zekâ projeleri.",
  keywords: [
    "Akdeniz Veri Bilimi Projeleri",
    "Açık Kaynak Yapay Zeka Projeleri",
    "Machine Learning GitHub",
    "Kira Tahmin Modeli",
    "Müzik Öneri Sistemi",
    "Not Kümeleme Algoritması",
    "Spam Mail Tespit Modeli",
    "Fon Tahmin Modeli",
    "Python Projeleri Antalya",
  ],
  openGraph: {
    title: "Proje Arşivi | Akdeniz Veri Bilimi Topluluğu",
    description: "Geliştirdiğimiz açık kaynak projeler, model mimarileri ve dokümanlar.",
    url: "https://akdenizveribilimi.com/projeler",
    images: ["/logo.webp"],
  },
};

export default function ProjectsPage() {
  const allProjects = getFilesFromDir("projects");

  return (
    <>
      <NeuralBackground />

      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        <SiteNav />

        <div className="pt-24 pb-16 flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-8 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-brand-muted hover:text-white transition-colors px-3 py-1.5 bg-brand-card/50 border border-brand-border rounded-lg"
            >
              <ArrowLeft size={14} />
              <span>Ana Sayfaya Dön</span>
            </Link>
            <span className="font-mono text-xs text-brand-cyan uppercase">
              TOPLAM {allProjects.length} PROJE
            </span>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="mb-12">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">
                Proje <span className="bg-gradient-to-r from-brand-cyan to-brand-emerald bg-clip-text text-transparent">Arşivi</span>
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-xl">
                Topluluğumuz tarafından geliştirilen tüm açık kaynak projeleri, model mimarilerini ve teknik dokümanları inceleyebilirsiniz.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects.map((project) => (
                <div
                  key={project.slug}
                  className="p-6 bg-brand-card/80 border border-brand-border hover:border-brand-cyan/40 rounded-xl transition-all duration-300 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-[10px] text-brand-cyan tracking-wider px-2 py-0.5 bg-brand-cyan/10 border border-brand-cyan/20 rounded">
                        {project.metadata.category}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-mono text-brand-emerald">
                        <CheckCircle2 size={12} />
                        <span>Tamamlandı</span>
                      </span>
                    </div>

                    <h3 className="text-white font-bold text-lg md:text-xl mb-3">
                      {project.metadata.title}
                    </h3>

                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-4">
                      {project.metadata.summary}
                    </p>

                    {project.metadata.tags && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.metadata.tags.map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 bg-slate-900 border border-brand-border rounded text-[10px] font-mono text-slate-400">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-brand-border/40 flex items-center justify-between text-xs font-mono">
                    {project.metadata.github ? (
                      <a
                        href={project.metadata.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-brand-cyan hover:text-white transition-colors"
                      >
                        <ExternalLink size={13} />
                        <span>GitHub Deposu</span>
                      </a>
                    ) : (
                      <span className="text-brand-muted">Açık Kaynak Proje</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
