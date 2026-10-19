"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Star, CalendarDays, X, ShieldCheck, Car } from "lucide-react";
import { VEHICLES } from "@/lib/utils";
import { DatePicker } from "@/components/ui/DatePicker";
// Static import so Next can generate the blur placeholder at build time —
// the hero photo is the LCP element, and this keeps the load from flashing.
// Swap this one line to change the hero shot. Runners-up from the same shoot,
// if you want a different first impression:
//   "DSC_5307 copia 2 verde.jpg" — green buggy at the COZUMEL letters
//   "buggy10.png"                — couple cheering, best emotion, lower res
// After swapping, re-run: node scripts/check-hero-contrast.mjs
import heroPhoto from "@/public/images/hero-coast.jpg";

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
    <section className="on-dark relative min-h-[100svh] sm:min-h-[92svh] flex items-end sm:items-center overflow-hidden">

      {/* ── Background photograph ──
          A real Cozumel coastline instead of a flat gradient: for a tourism
          site the destination is the strongest thing we can lead with. */}
      {/* Wider than the section and anchored left, which slides the buggy out
          from behind the headline and into the clear right-hand third. The
          photo has almost no horizontal crop at this aspect ratio, so
          object-position alone could not move the subject. */}
      <div className="absolute inset-y-0 left-0 w-full sm:w-[138%] lg:w-[132%] hero-kenburns">
        <Image
          src={heroPhoto}
          alt={locale === "es"
            ? "Buggy rosa en la carretera costera de Cozumel, con el mar Caribe turquesa al fondo"
            : "Pink buggy on the coastal road in Cozumel, turquoise Caribbean sea behind"}
          fill
          // Breakpoints mirror the box width above (100% below sm, ~138% from
          // sm up). The fixed upper bound matters: an unbounded "140vw" lets a
          // preload scanner that has not yet matched the media query reach for
          // the 3840w candidate, which is ~450KB nobody needs.
          sizes="(max-width: 639px) 100vw, (max-width: 1024px) 140vw, 1900px"
          placeholder="blur"
          priority
          className="object-cover object-[62%_center] sm:object-center"
        />
      </div>

      {/* ── Scrims ──
          Readability is not left to chance here: a horizontal wash carries the
          desktop copy, a vertical one carries it on phones where the text sits
          lower, and a flat floor keeps the brand navy under everything. */}
      <div
        className="absolute inset-0 bg-[#0d2d42]/12"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 hidden sm:block"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(96deg, rgba(8,28,44,0.94) 0%, rgba(8,28,44,0.86) 26%, rgba(8,28,44,0.55) 42%, rgba(8,28,44,0.18) 58%, rgba(8,28,44,0) 72%)",
        }}
      />
      <div
        className="absolute inset-0 sm:hidden"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to top, rgba(8,28,44,0.96) 0%, rgba(8,28,44,0.94) 48%, rgba(8,28,44,0.74) 66%, rgba(8,28,44,0.3) 84%, rgba(8,28,44,0.08) 100%)",
        }}
      />

      {/* Warm bloom to tie the coral brand colour into the photo */}
      <div
        className="absolute left-[8%] top-[42%] w-80 h-80 rounded-full bg-[#E8836A]/20 blur-3xl pointer-events-none hidden sm:block"
        aria-hidden="true"
      />

      {/* ── Wave transition into the navy cruise banner below ──
          Painted in the banner's colour, not the cream of the section after it:
          the fill has to match whatever is immediately underneath, or the
          curve reads as a stray band rather than a transition. */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 100 C360 180 1080 20 1440 100 L1440 200 L0 200 Z" fill="#0d2d42" />
          <path d="M0 140 C400 80 1040 180 1440 120 L1440 200 L0 200 Z" fill="#0d2d42" opacity="0.4"/>
        </svg>
      </div>

      {/* ── Content ── */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-28 sm:pb-24">
        <div className="w-full max-w-xl lg:max-w-2xl">

          {/* Badge */}
          <div
            className="hero-in inline-flex items-center gap-2 bg-[#E8836A]/20 text-[#FBC7B7] border border-[#E8836A]/40 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-semibold mb-4 sm:mb-5"
            style={{ "--delay": "80ms" } as React.CSSProperties}
          >
            <Star className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
            {t("badge")}
          </div>

          <p
            className="hero-in block text-[#A8D5D5] font-semibold text-sm sm:text-base mb-2 tracking-[0.18em] uppercase"
            style={{ "--delay": "180ms" } as React.CSSProperties}
          >
            {t("tagline")}
          </p>

          {/* One h1 for the whole brand line. */}
          <h1 className="mb-5">
            <span
              className="hero-in block text-[2.5rem] leading-[0.95] sm:text-6xl lg:text-7xl font-black text-white tracking-[-0.03em] text-balance"
              style={{ "--delay": "260ms" } as React.CSSProperties}
            >
              {t("titleLead")}
            </span>
            <span
              className="hero-in block text-[1.75rem] leading-tight sm:text-4xl lg:text-5xl font-black text-[#A8D5D5] italic tracking-[-0.02em] mt-2 text-balance"
              style={{ "--delay": "360ms" } as React.CSSProperties}
            >
              {t("subtitle")}
            </span>
            <span className="sr-only">{t("titleLocation")}</span>
          </h1>

          <p
            className="hero-in text-gray-100 text-base sm:text-lg max-w-lg mb-6 sm:mb-7 leading-relaxed"
            style={{ "--delay": "460ms" } as React.CSSProperties}
          >
            <span className="sm:hidden">{t("descriptionShort")}</span>
            <span className="hidden sm:inline">{t("description")}</span>
          </p>

          {/* Date picker + CTA */}
          <div
            className="hero-in flex flex-col gap-3 max-w-lg"
            style={{ "--delay": "560ms" } as React.CSSProperties}
          >
            <div className="flex flex-col sm:flex-row gap-2 bg-white/12 backdrop-blur-md border border-white/25 rounded-2xl p-2 shadow-2xl shadow-black/20">
              <button
                type="button"
                onClick={() => setCalOpen((o) => !o)}
                aria-haspopup="dialog"
                aria-expanded={calOpen}
                className="flex items-center gap-2.5 flex-1 px-3 min-h-12 text-left rounded-xl hover:bg-white/10 transition-colors"
              >
                <CalendarDays className="w-4 h-4 text-white/80 shrink-0" aria-hidden="true" />
                <span className={`text-sm flex-1 ${dateLabel ? "text-white font-semibold" : "text-white/80"}`}>
                  {dateLabel ?? t("pickDate")}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-white/70 transition-transform ${calOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>

              <button
                onClick={() => router.push(`/${locale}/book${selectedDate ? `?date=${selectedDate}` : ""}`)}
                className="bg-[#C05232] hover:bg-[#A8411F] text-white font-black text-sm px-6 min-h-12 rounded-xl transition-all hover:shadow-xl hover:shadow-[#C05232]/40 whitespace-nowrap"
              >
                {t("cta")} →
              </button>
            </div>

            <a
              href={`/${locale}#how-it-works`}
              className="inline-flex items-center justify-center text-white font-semibold text-sm px-6 min-h-12 rounded-full border border-white/35 hover:border-white/70 hover:bg-white/10 transition-all w-fit backdrop-blur-sm"
            >
              {t("secondaryCta")}
            </a>
          </div>

          {/* Social proof — one compact row */}
          <div
            className="hero-in mt-7 flex flex-wrap items-center gap-x-5 gap-y-2.5"
            style={{ "--delay": "680ms" } as React.CSSProperties}
          >
            <div className="inline-flex items-center gap-2">
              <div className="flex gap-0.5" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-white font-black text-base leading-none">5.0</span>
              <span className="text-white/80 text-xs">{t("googleReviews")}</span>
            </div>

            <span className="hidden sm:inline text-white/30" aria-hidden="true">·</span>

            <div className="inline-flex items-center gap-1.5 text-white/90 text-sm font-semibold">
              <Car className="w-4 h-4 text-[#A8D5D5]" aria-hidden="true" />
              {t("fleetOf", { count: totalVehicles })}
            </div>

            <span className="hidden sm:inline text-white/30" aria-hidden="true">·</span>

            <div className="inline-flex items-center gap-1.5 text-white/90 text-sm font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#A8D5D5]" aria-hidden="true" />
              {t("insuranceIncluded")}
            </div>
          </div>
        </div>
      </div>

      {/* Date picker modal */}
      {calOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in"
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
        className="absolute bottom-28 right-6 lg:right-10 z-20 w-11 h-11 hidden lg:flex items-center justify-center rounded-full border border-white/30 text-white/70 hover:text-white hover:border-white/60 transition-colors animate-bounce"
        aria-label={t("scrollDown")}
      >
        <ChevronDown className="w-5 h-5" aria-hidden="true" />
      </a>
    </section>
  );
}
