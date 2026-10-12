"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Ship, MapPin, Clock, ArrowRight } from "lucide-react";

export function CruiseBanner() {
  const locale = useLocale();
  const t = useTranslations("cruiseBanner");

  return (
    <section className="on-dark bg-[#0d2d42] py-10 relative overflow-hidden">
      {/* Subtle gradient rule on top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8836A] via-[#7FB5B5] to-[#E8836A]" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" data-reveal>
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-[#E8836A]/15 border border-[#E8836A]/30 flex items-center justify-center shrink-0">
            <Ship className="w-8 h-8 text-[#C05232]" aria-hidden="true" />
          </div>

          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-white font-black text-xl mb-1">{t("title")}</h2>
            <p className="text-[#CBD5E1] text-sm leading-relaxed max-w-xl">
              {t("descBefore")}{" "}
              <span className="text-[#A8D5D5] font-semibold">{t("descHighlight")}</span>
              {t("descAfter")}
            </p>
          </div>

          {/* Badges + CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-xs text-white/90">
                <MapPin className="w-3.5 h-3.5 text-[#A8D5D5]" aria-hidden="true" /> {t("portPickup")}
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-xs text-white/90">
                <Clock className="w-3.5 h-3.5 text-[#A8D5D5]" aria-hidden="true" /> {t("readyInMinutes")}
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href={`/${locale}/cruise-excursion`}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-4 min-h-12 rounded-xl transition-all border border-white/20 whitespace-nowrap"
              >
                {t("learnMore")}
              </Link>
              <Link
                href={`/${locale}/book`}
                className="flex items-center gap-2 bg-[#C05232] hover:bg-[#A8411F] text-white font-black text-sm px-6 min-h-12 rounded-xl transition-all hover:shadow-lg hover:shadow-[#C05232]/30 hover:-translate-y-0.5 whitespace-nowrap"
              >
                {t("cta")} <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
