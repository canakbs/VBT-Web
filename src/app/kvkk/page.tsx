import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import NeuralBackground from "@/components/NeuralBackground";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | Akdeniz Veri Bilimi Topluluğu",
  description:
    "Akdeniz Veri Bilimi Topluluğu Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında Aydınlatma Metni.",
  keywords: [
    "Akdeniz Veri Bilimi KVKK",
    "Kişisel Verilerin Korunması Aydınlatma Metni",
    "AVBT Gizlilik Politikası",
  ],
  openGraph: {
    title: "KVKK Aydınlatma Metni | Akdeniz Veri Bilimi Topluluğu",
    description: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında Aydınlatma Metni.",
    url: "https://akdenizveribilimi.com/kvkk",
    images: ["/logo.webp"],
  },
};

const SECTIONS = [
  {
    title: "1. Veri Sorumlusu",
    content:
      "6698 sayılı Kişisel Verilerin Korunması Kanunu (\"KVKK\") kapsamında, kişisel verileriniz; veri sorumlusu sıfatıyla Akdeniz Üniversitesi bünyesinde faaliyet gösteren Akdeniz Veri Bilimi Topluluğu tarafından aşağıda açıklanan amaçlar doğrultusunda işlenmektedir.",
  },
  {
    title: "2. Toplanan Kişisel Veriler",
    content: null,
    list: [
      "Ad Soyad",
      "E-posta Adresi",
      "İlgi Alanları (topluluk başvuru formu)",
      "Teknik Seviye (topluluk başvuru formu)",
      "Tercih Edilen Departman (topluluk başvuru formu)",
      "Hedef ve Motivasyon Açıklaması (topluluk başvuru formu)",
      "İletişim Mesajı İçeriği (iletişim formu)",
    ],
  },
  {
    title: "3. Kişisel Verilerin İşlenme Amaçları",
    content: null,
    list: [
      "Topluluk üyelik başvurularının değerlendirilmesi ve yönetilmesi",
      "Başvuru sahipleriyle iletişim kurulması",
      "İletişim formundan gelen soru, öneri ve iş birliği taleplerinin yanıtlanması",
      "Topluluk etkinlikleri hakkında bilgilendirme yapılması",
      "Topluluğun iç organizasyonu ve ekip planlamasının yürütülmesi",
    ],
  },
  {
    title: "4. Hukuki Dayanak",
    content:
      "Kişisel verileriniz, KVKK m.5/2 kapsamında aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:",
    list: [
      "Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (m.5/2-c) — Topluluk üyelik sürecinin yürütülmesi",
      "İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması (m.5/2-f) — İletişim taleplerinin cevaplanması",
    ],
  },
  {
    title: "5. Kişisel Verilerin Aktarılması",
    content:
      "Toplanan kişisel verileriniz, yukarıda belirtilen amaçlar dışında üçüncü kişi veya kuruluşlarla paylaşılmamaktadır. Verileriniz yalnızca topluluk yönetim ekibi tarafından erişilebilir şekilde saklanmaktadır. E-posta iletimi için kullanılan teknik altyapı hizmet sağlayıcıları haricinde herhangi bir veri aktarımı yapılmamaktadır.",
  },
  {
    title: "6. Saklama Süresi",
    content:
      "Kişisel verileriniz, topluluk üyeliğiniz devam ettiği sürece saklanır. Üyeliğinizin sona ermesi veya talebiniz halinde verileriniz makul süre içinde silinir, yok edilir veya anonim hale getirilir. İletişim formu aracılığıyla iletilen veriler, talep konusu çözümlendiğinde ve yasal yükümlülükler sona erdiğinde silinir.",
  },
  {
    title: "7. Veri Güvenliği",
    content:
      "Kişisel verilerinizin hukuka aykırı olarak işlenmesini ve erişilmesini önlemek ile verilerin muhafazasını sağlamak amacıyla uygun güvenlik düzeyini temin etmeye yönelik gerekli teknik ve idari tedbirler alınmaktadır.",
  },
  {
    title: "8. İlgili Kişi Hakları (KVKK m.11)",
    content:
      "KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:",
    list: [
      "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
      "Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme",
      "Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme",
      "Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme",
      "Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme",
      "KVKK m.7 çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme",
      "Düzeltme ve silme işlemlerinin, kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme",
      "İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme",
      "Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme",
    ],
  },
  {
    title: "9. İletişim",
    content:
      "Yukarıda belirtilen haklarınızı kullanmak veya kişisel verilerinizle ilgili sorularınız için aşağıdaki iletişim kanalını kullanabilirsiniz:",
    contact: {
      label: "E-posta",
      value: "akdenizveri07@gmail.com",
    },
  },
];

export default function KVKKPage() {
  return (
    <>
      <NeuralBackground />

      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        <SiteNav />

        <div className="pt-24 pb-12 flex-grow">
          {/* Top bar */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-brand-muted hover:text-white transition-colors px-3 py-1.5 bg-brand-card/50 border border-brand-border rounded-lg"
            >
              <ArrowLeft size={14} />
              <span>Ana Sayfaya Dön</span>
            </Link>
            <span className="font-mono text-xs text-brand-cyan uppercase">
              KVKK AYDINLATMA METNİ
            </span>
          </div>

          {/* Main Content */}
          <section className="relative pt-10 md:pt-12 pb-20 md:pb-24 bg-transparent">
            <div className="absolute inset-0 scientific-grid opacity-10 pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6">
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-12">
                <div className="w-16 h-16 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan mb-6">
                  <Shield size={32} />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                  Kişisel Verilerin Korunması
                </h1>
                <p className="text-slate-400 text-sm md:text-base max-w-xl mt-4 leading-relaxed">
                  6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında
                  Aydınlatma Metni
                </p>
                <div className="mt-4 px-4 py-1.5 bg-brand-card border border-brand-border rounded-full">
                  <span className="font-mono text-[10px] text-brand-muted uppercase">
                    Son Güncelleme: Ağustos 2026
                  </span>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-6">
                {SECTIONS.map((section, idx) => (
                  <div
                    key={idx}
                    className="bg-brand-card border border-brand-border rounded-xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden"
                  >
                    {/* Section number accent */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brand-cyan/60 to-transparent rounded-l-xl" />

                    <h2 className="text-lg md:text-xl font-bold text-white mb-4 pl-4">
                      {section.title}
                    </h2>

                    {section.content && (
                      <p className="text-sm text-slate-300 leading-relaxed pl-4">
                        {section.content}
                      </p>
                    )}

                    {section.list && (
                      <ul className="mt-3 space-y-2 pl-4">
                        {section.list.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm text-slate-300"
                          >
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-cyan shrink-0" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.contact && (
                      <div className="mt-4 pl-4">
                        <div className="inline-flex items-center gap-3 px-4 py-3 bg-slate-900/80 border border-brand-border rounded-lg">
                          <span className="font-mono text-[10px] text-brand-muted uppercase">
                            {section.contact.label}:
                          </span>
                          <a
                            href={`mailto:${section.contact.value}`}
                            className="font-mono text-sm text-brand-cyan hover:text-white transition-colors"
                          >
                            {section.contact.value}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom note */}
              <div className="mt-10 text-center">
                <p className="text-xs text-brand-muted font-mono">
                  Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması
                  Kanunu&apos;nun 10. maddesi gereğince hazırlanmıştır.
                </p>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
}
