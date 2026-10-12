"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Star, CalendarDays, X } from "lucide-react";
import { VEHICLES } from "@/lib/utils";
import { DatePicker } from "@/components/ui/DatePicker";

export function Hero() {
  const t = useTranslations("hero");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const [calOpen, setCalOpen] = useState(false);
  const totalVehicles = Object.values(VEHICLES).reduce((s, v) => s + v.stock, 0);

  const dateLabel = selectedDate
    ? new Date(selectedDate + "T12:00:00").toLocaleDateString(locale === "es" ? "es-MX" : "en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  // Escape closes the calendar and the page behind it stays put while it is open.
  useEffect(() => {
    if (!calOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setCalOpen(false);
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [calOpen]);

  return (
    <section className="on-dark relative min-h-screen flex items-center justify-center overflow-visible">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1B4F72] via-[#1B4F72] to-[#0d2d42]" />
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-[#7FB5B5]/10 blur-3xl" />
      <div className="absolute bottom-32 left-10 w-48 h-48 rounded-full bg-[#E8836A]/10 blur-3xl" />
      {/* Decorative waves */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 100 C360 180 1080 20 1440 100 L1440 200 L0 200 Z" fill="#F5F0EB" />
          <path d="M0 140 C400 80 1040 180 1440 120 L1440 200 L0 200 Z" fill="#F5F0EB" opacity="0.4"/>
        </svg>
      </div>

      {/* Layout: text left | buggy right */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex flex-col lg:flex-row items-center lg:items-end gap-8">

        {/* Text — left column */}
        <div className="w-full lg:w-[52%] text-center lg:text-left pb-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#E8836A]/25 text-[#F7C3B4] border border-[#E8836A]/40 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <Star className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
            {t("badge")}
          </div>

          <p className="text-[#A8D5D5] font-semibold text-base mb-2 tracking-wide uppercase">
            {t("tagline")}
          </p>

          {/* One h1 for the whole brand line. The second line used to be an <h2>
              purely for styling, which wasted a heading level on a fragment. */}
          <h1 className="mb-5">
            <span className="block text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none mb-1">
              {t("titleLead")}
            </span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl font-black text-[#A8D5D5] italic">
              {t("subtitle")}
            </span>
            <span className="sr-only">{t("titleLocation")}</span>
          </h1>

          <p className="text-gray-200 text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
            {t("description")}
          </p>

          {/* Date picker + CTA.
              Stacked below sm — side by side these two squeezed the date label
              onto three lines on a 375px screen. */}
          <div className="flex flex-col gap-3 max-w-lg mx-auto lg:mx-0">
            <div className="flex flex-col sm:flex-row gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-2">
              {/* Date toggle button */}
              <button
                type="button"
                onClick={() => setCalOpen((o) => !o)}
                aria-haspopup="dialog"
                aria-expanded={calOpen}
                className="flex items-center gap-2.5 flex-1 px-3 min-h-12 text-left rounded-xl hover:bg-white/10 transition-colors"
              >
                <CalendarDays className="w-4 h-4 text-white/70 shrink-0" aria-hidden="true" />
                <span className={`text-sm flex-1 ${dateLabel ? "text-white font-semibold" : "text-white/70"}`}>
                  {dateLabel ?? t("pickDate")}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform ${calOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>

              {/* Book button */}
              <button
                onClick={() => router.push(`/${locale}/book${selectedDate ? `?date=${selectedDate}` : ""}`)}
                className="bg-[#C05232] hover:bg-[#A8411F] text-white font-black text-sm px-6 min-h-12 rounded-xl transition-all hover:shadow-xl hover:shadow-[#C05232]/30 whitespace-nowrap"
              >
                {t("cta")} →
              </button>
            </div>

            <a
              href={`/${locale}#how-it-works`}
              className="inline-flex items-center justify-center text-white font-semibold text-sm px-6 min-h-12 rounded-full border border-white/30 hover:border-white/60 hover:bg-white/5 transition-all w-fit mx-auto lg:mx-0"
            >
              {t("secondaryCta")}
            </a>
          </div>

          {/* Social proof — trust bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <div className="inline-flex items-center gap-2 bg-white/12 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 shadow-lg">
              <div className="flex gap-0.5" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-white font-black text-base leading-none">5.0</span>
              <span className="text-white/70 text-xs">{t("googleReviews")}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-white/12 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 shadow-lg text-white/90 text-sm font-semibold">
              🚗 {t("fleetOf", { count: totalVehicles })} · 🏝️ {t("numberOne")}
            </div>
          </div>
        </div>

        {/* Buggy — right column, overflows the hero downwards */}
        <div className="flex-shrink-0 flex items-end justify-end pointer-events-none select-none buggy-enter"
             style={{ marginRight: "-2%", marginBottom: "-100px", zIndex: 20, position: "relative", width: "50%" }}>
          <div className="buggy-float w-full" style={{ animationDelay: "1.1s" }}>
            <Image
              src="/images/buggy8.png"
              alt={locale === "es"
                ? "Buggy descapotable en renta en Cozumel, México — Buggy Rentals with Dani"
                : "Open-air buggy rental in Cozumel, Mexico — Buggy Rentals with Dani"}
              width={1300}
              height={850}
              sizes="(max-width: 1024px) 50vw, 640px"
              className="w-full h-auto"
              style={{ filter: "drop-shadow(0px 30px 20px rgba(0,0,0,0.25))" }}
              priority
            />
          </div>
        </div>

      </div>

      {/* Date picker modal */}
      {calOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-fade-in"
          onClick={() => setCalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t("pickDateAria")}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm animate-scale-in relative"
          >
            <button
              type="button"
              onClick={() => setCalOpen(false)}
              aria-label={tc("close")}
              className="absolute -top-3 -right-3 z-10 w-11 h-11 rounded-full bg-white text-[#1B4F72] shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
            </button>
            <DatePicker
              value={selectedDate}
              onChange={(val) => {
                setSelectedDate(val);
                setCalOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Scroll indicator */}
      <a
        href="#why-us"
        className="absolute bottom-36 left-1/2 -translate-x-1/2 w-11 h-11 hidden sm:flex items-center justify-center text-white/60 hover:text-white transition-colors animate-bounce"
        aria-label={t("scrollDown")}
      >
        <ChevronDown className="w-6 h-6" aria-hidden="true" />
      </a>
    </section>
  );
}
