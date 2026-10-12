import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MessageCircle } from "lucide-react";

const WHATSAPP = "529872743477";

export default function LocaleNotFound() {
  const t = useTranslations("notFound");
  const locale = useLocale();

  return (
    <>
      <Navbar />
      <main id="main" className="on-dark min-h-[80vh] flex items-center relative overflow-hidden" style={{ background: "linear-gradient(160deg, #1B4F72 0%, #0d2d42 100%)" }}>
        <div className="absolute top-10 right-0 w-80 h-80 rounded-full bg-[#7FB5B5]/10 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#E8836A]/10 blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative grid gap-10 md:grid-cols-[1fr_auto] items-center">
          <div>
            <p className="text-[#A8D5D5] font-black text-7xl sm:text-8xl leading-none mb-4">
              {t("code")}
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">{t("title")}</h1>
            <p className="text-[#CBD5E1] text-lg leading-relaxed mb-8 max-w-md">{t("desc")}</p>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}`}
                className="inline-flex items-center bg-[#C05232] hover:bg-[#A8411F] text-white font-black px-7 min-h-12 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                {t("home")}
              </Link>
              <Link
                href={`/${locale}/book`}
                className="inline-flex items-center border border-white/30 hover:border-white/60 hover:bg-white/5 text-white font-semibold px-7 min-h-12 rounded-full transition-all"
              >
                {t("book")}
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#157038] hover:bg-[#0F5F2B] text-white font-semibold px-6 min-h-12 rounded-full transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-none" aria-hidden="true" />
                {t("whatsapp")}
              </a>
            </div>
          </div>

          <div className="hidden md:block w-64 shrink-0" aria-hidden="true">
            <Image
              src="/images/buggy9.png"
              alt=""
              width={256}
              height={256}
              sizes="256px"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
