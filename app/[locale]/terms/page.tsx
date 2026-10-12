import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { MessageCircle } from "lucide-react";
import { pageMetadata } from "@/lib/seo";

const WHATSAPP = "529872743477";
const LAST_UPDATED = "2026-10-12";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return pageMetadata({
    locale,
    path: "/terms",
    title: t("termsTitle"),
    description: t("termsDescription"),
  });
}

function TermsBody() {
  const t = useTranslations("terms");
  const sections = t.raw("sections") as Array<{ heading: string; body: string }>;

  return (
    <>
      {/* Header band */}
      <header className="on-dark bg-[#1B4F72] pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#7FB5B5]/10 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#E8836A]/10 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">{t("title")}</h1>
          <p className="text-[#CBD5E1] text-lg leading-relaxed">{t("intro")}</p>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-[#5A616B] text-sm mb-10">
          {t("lastUpdated")}:{" "}
          <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>
        </p>

        <div className="space-y-8">
          {sections.map((s, i) => (
            <section key={i} data-reveal className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200 shadow-sm">
              <h2 className="font-black text-[#1B4F72] text-lg mb-2 leading-tight">{s.heading}</h2>
              <p className="text-[#4B5563] leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>

        {/* Questions CTA */}
        <div className="on-dark mt-12 bg-[#1B4F72] rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#7FB5B5]/20" aria-hidden="true" />
          <div className="relative">
            <h2 className="font-black text-white text-xl mb-2">{t("questionsTitle")}</h2>
            <p className="text-[#CBD5E1] text-sm mb-6 max-w-md mx-auto">{t("questionsDesc")}</p>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#157038] hover:bg-[#0F5F2B] text-white font-bold px-6 min-h-12 rounded-xl transition-all hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4 fill-white stroke-none" aria-hidden="true" />
              {t("questionsCta")}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-[#F5F0EB]">
        <TermsBody />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
