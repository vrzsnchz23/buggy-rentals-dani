"use client";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Ship, MapPin, Clock, ArrowRight } from "lucide-react";
import { SectionWave } from "@/components/ui/SectionWave";
import cruisePhoto from "@/public/images/cruise-downtown.jpg";

export function CruiseBanner() {
  const locale = useLocale();
  const t = useTranslations("cruiseBanner");

  return (
    <section className="on-dark bg-[#0d2d42] pt-12 pb-20 sm:pt-14 sm:pb-24 relative overflow-hidden">
      {/* Subtle gradient rule on top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8836A] via-[#7FB5B5] to-[#E8836A]" aria-hidden="true" />

      {/* ── Background: the actual street outside the terminals ──
          A flat navy slab here made the busiest claim on the page ("five
          minutes from the port") look generic. The photo is pushed far back so
          it reads as texture, never as something competing with the copy. */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={cruisePhoto}
          alt=""
          fill
          sizes="100vw"
          quality={50}
          placeholder="blur"
          className="object-cover object-[50%_62%] opacity-[0.45]"
        />
        {/* Left-weighted wash: keeps the headline side solidly dark and lets
            the right-hand side of the photo stay visible behind the buttons. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(13,45,66,0.96) 0%, rgba(13,45,66,0.9) 38%, rgba(13,45,66,0.79) 70%, rgba(13,45,66,0.72) 100%)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative" data-reveal>
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-[#E8836A]/20 border border-[#E8836A]/40 flex items-center justify-center shrink-0 backdrop-blur-sm">
            <Ship className="w-8 h-8 text-[#FBC7B7]" aria-hidden="true" />
          </div>

          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-white font-black text-xl sm:text-2xl mb-1.5 tracking-[-0.02em]">{t("title")}</h2>
            <p className="text-[#CBD5E1] text-sm leading-relaxed max-w-xl">
              {t("descBefore")}{" "}
              <span className="text-[#A8D5D5] font-semibold">{t("descHighlight")}</span>
              {t("descAfter")}
            </p>
          </div>

          {/* Badges + CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 backdrop-blur-sm rounded-xl px-3 py-2 text-xs text-white/90">
                <MapPin className="w-3.5 h-3.5 text-[#A8D5D5]" aria-hidden="true" /> {t("portPickup")}
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 backdrop-blur-sm rounded-xl px-3 py-2 text-xs text-white/90">
                <Clock className="w-3.5 h-3.5 text-[#A8D5D5]" aria-hidden="true" /> {t("readyInMinutes")}
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href={`/${locale}/cruise-excursion`}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-4 min-h-12 rounded-xl transition-all border border-white/20 whitespace-nowrap backdrop-blur-sm"
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

      {/* Into the cream section below. */}
      <SectionWave next="#F5F0EB" />
    </section>
  );
}
