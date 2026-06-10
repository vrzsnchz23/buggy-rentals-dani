"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Star, CalendarDays } from "lucide-react";
import { VEHICLES } from "@/lib/utils";

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const totalVehicles = Object.values(VEHICLES).reduce((s, v) => s + v.stock, 0);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-visible">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1B4F72] via-[#1B4F72] to-[#0d2d42]" />
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-[#7FB5B5]/10 blur-3xl" />
      <div className="absolute bottom-32 left-10 w-48 h-48 rounded-full bg-[#E8836A]/10 blur-3xl" />
      {/* Decorative waves */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 100 C360 180 1080 20 1440 100 L1440 200 L0 200 Z" fill="#F5F0EB" />
          <path d="M0 140 C400 80 1040 180 1440 120 L1440 200 L0 200 Z" fill="#F5F0EB" opacity="0.4"/>
        </svg>
      </div>


      {/* Layout: texto izquierda | buggy derecha */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 flex flex-col lg:flex-row items-center lg:items-end gap-8">

        {/* Texto — columna izquierda */}
        <div className="w-full lg:w-[52%] text-center lg:text-left pb-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#E8836A]/20 text-[#E8836A] border border-[#E8836A]/30 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <Star className="w-3.5 h-3.5 fill-current" />
            {t("badge")}
          </div>

          <p className="text-[#7FB5B5] font-semibold text-base mb-2 tracking-wide uppercase">
            {t("tagline")}
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none mb-1">
            {t("title")}
          </h1>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#7FB5B5] italic mb-5">
            {t("subtitle")}
          </h2>

          <p className="text-gray-300 text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
            {t("description")}
          </p>

          {/* Date picker + CTA */}
          <div className="flex flex-col gap-3 max-w-lg mx-auto lg:mx-0">
            <div className="flex gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-2">
              <div className="flex items-center gap-2 flex-1 px-2">
                <CalendarDays className="w-4 h-4 text-white/60 shrink-0" />
                <input
                  type="date"
                  min={today}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1 bg-transparent text-white text-sm focus:outline-none [color-scheme:dark] placeholder-white/40"
                />
              </div>
              <button
                onClick={() => router.push(`/${locale}/book${selectedDate ? `?date=${selectedDate}` : ""}`)}
                className="bg-[#E8836A] hover:bg-[#d4724f] text-white font-black text-sm px-6 py-2.5 rounded-xl transition-all hover:shadow-xl hover:shadow-[#E8836A]/30 whitespace-nowrap"
              >
                {t("cta")} →
              </button>
            </div>
            <a
              href={`/${locale}#how-it-works`}
              className="inline-flex items-center justify-center text-white font-semibold text-sm px-6 py-3 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/5 transition-all w-fit mx-auto lg:mx-0"
            >
              {t("secondaryCta")}
            </a>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-10 text-gray-400 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span>5.0 on Google Reviews</span>
            </div>
            <div className="w-px h-4 bg-gray-600" />
            <span>🚗 Fleet of {totalVehicles} vehicles</span>
            <div className="w-px h-4 bg-gray-600 hidden sm:block" />
            <span className="hidden sm:block">🏝️ Cozumel's #1 buggy rental</span>
          </div>
        </div>

        {/* Buggy — columna derecha, sobresale del hero hacia abajo */}
        <div className="flex-shrink-0 flex items-end justify-end pointer-events-none select-none buggy-enter"
             style={{ marginRight: "-2%", marginBottom: "-100px", zIndex: 20, position: "relative", width: "50%" }}>
          <div className="buggy-float w-full" style={{ animationDelay: "1.1s" }}>
            <Image
              src="/images/buggy8.png"
              alt="Buggy Rentals with Dani"
              width={1300}
              height={850}
              className="w-full h-auto"
              style={{ filter: "drop-shadow(0px 30px 20px rgba(0,0,0,0.25))" }}
              priority
            />
          </div>
        </div>

      </div>

      {/* Scroll indicator */}
      <a
        href={`#why-us`}
        className="absolute bottom-36 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-6 h-6" />
      </a>
    </section>
  );
}
