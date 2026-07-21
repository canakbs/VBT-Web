import TeamNetwork from "@/components/TeamNetwork";
import NeuralBackground from "@/components/NeuralBackground";
import SiteNav from "@/components/SiteNav";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getFilesFromDir } from "@/lib/markdown";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ekibimiz | Akdeniz Veri Bilimi Topluluğu",
  description: "Akdeniz Veri Bilimi Topluluğu yönetim ekibi, akademik danışmanlarımız, takım liderlerimiz ve mentörlerimiz.",
};

export default function EkibimizPage() {
  const teamFiles = getFilesFromDir("team");

  return (
    <>
      <NeuralBackground />

      <div className="relative z-10">
        <SiteNav />

        <div className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-brand-muted hover:text-white transition-colors px-3 py-1.5 bg-brand-card/50 border border-brand-border rounded-lg"
            >
              <ArrowLeft size={14} />
              <span>Ana Sayfaya Dön</span>
            </Link>
          </div>

          <TeamNetwork variant="full" teamFiles={teamFiles} />
        </div>
      </div>

      <footer className="bg-[#090d16] border-t border-brand-border py-10 px-4 sm:px-6 relative z-10 font-mono text-xs text-brand-muted">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span>© 2025 Akdeniz Veri Bilimi Topluluğu</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <a href="/#join-us" className="hover:text-brand-cyan transition-colors font-bold">Bize Katıl</a>
          </div>
        </div>
      </footer>
    </>
  );
}
