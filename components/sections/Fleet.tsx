"use client";
import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, Wind, Thermometer, Shield, Users, Fuel, MessageCircle } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionWave } from "@/components/ui/SectionWave";
import lineupPhoto from "@/public/images/fleet-lineup.jpg";

/* ─── static, non-translated data ───────────────────────────────── */

type VehicleKey = "buggy" | "compact";

const VEHICLE_ART = {
  buggy: {
    type: "buggy",
    price: 75,
    deposit: 25,
    accent: "#C05232",
    accentDark: "#A8411F",
    badgeIcon: Wind,
    hero: "/images/buggy10.png",
    photos: ["/images/buggy11.png", "/images/buggy5.jpg", "/images/buggy4.jpg", "/images/buggy3.jpg"],
    statIcons: [Users, Shield, Fuel, MessageCircle],
  },
  compact: {
    type: "compact",
    price: 65,
    deposit: 25,
    accent: "#1B4F72",
    accentDark: "#163d58",
    badgeIcon: Thermometer,
    hero: "/images/compacto1.jpg",
    photos: ["/images/compacto2.jpg", "/images/compacto3.jpg", "/images/compacto4.jpg", "/images/buggy12.png"],
    statIcons: [Users, Thermometer, Shield, Fuel],
  },
} as const;

type Photo = { src: string; label: string };
type Vehicle = {
  key: VehicleKey;
  type: string;
  name: string;
  tagline: string;
  badgeLabel: string;
  badgeIcon: typeof Wind;
  price: number;
  deposit: number;
  accent: string;
  accentDark: string;
  hero: string;
  heroAlt: string;
  photos: Photo[];
  stats: { icon: typeof Users; val: string; label: string }[];
};

type LightboxState = { vehicle: Vehicle; index: number } | null;

/* ─── main component ────────────────────────────────────────────── */

export function Fleet() {
  const locale = useLocale();
  const t = useTranslations("fleet");
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  function buildVehicle(key: VehicleKey): Vehicle {
    const art = VEHICLE_ART[key];
    const stats =
      key === "buggy"
        ? [
            { icon: art.statIcons[0], val: "5", label: t("stats.maxPeople") },
            { icon: art.statIcons[1], val: "✓", label: t("stats.insurance") },
            { icon: art.statIcons[2], val: t("stats.fullValue"), label: t("stats.fuel") },
            { icon: art.statIcons[3], val: "WA", label: t("stats.support") },
          ]
        : [
            { icon: art.statIcons[0], val: "5", label: t("stats.maxPeople") },
            { icon: art.statIcons[1], val: "A/C", label: t("stats.acIncluded") },
            { icon: art.statIcons[2], val: "✓", label: t("stats.insurance") },
            { icon: art.statIcons[3], val: t("stats.fullValue"), label: t("stats.fuel") },
          ];

    return {
      key,
      type: art.type,
      name: t(`${key}.name`),
      tagline: t(`${key}.tagline`),
      badgeLabel: t(`${key}.badge`),
      badgeIcon: art.badgeIcon,
      price: art.price,
      deposit: art.deposit,
      accent: art.accent,
      accentDark: art.accentDark,
      hero: art.hero,
      heroAlt: t(`${key}.alt`),
      photos: art.photos.map((src, i) => ({ src, label: t(`${key}.photo${i + 1}`) })),
      stats,
    };
  }

  const buggy = buildVehicle("buggy");
  const compact = buildVehicle("compact");

  const allPhotos = (v: Vehicle): Photo[] => [{ src: v.hero, label: v.heroAlt }, ...v.photos];

  function open(vehicle: Vehicle, index: number) { setLightbox({ vehicle, index }); }
  function prev() { setLightbox(lb => lb ? { ...lb, index: lb.index > 0 ? lb.index - 1 : lb.vehicle.photos.length } : null); }
  function next() { setLightbox(lb => lb ? { ...lb, index: lb.index < lb.vehicle.photos.length ? lb.index + 1 : 0 } : null); }

  // Keyboard control for the lightbox, and the page stays put behind it.
  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  return (
    <section id="fleet" className="on-dark pt-20 pb-32 sm:pt-28 sm:pb-40 overflow-hidden relative" style={{ background: "linear-gradient(160deg, #1B4F72 0%, #0f2d42 60%, #091e2d 100%)" }}>

      {/* Subtle dot grid */}
      <div className="absolute inset-0 opacity-[0.04]" aria-hidden="true" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      {/* Glow blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#7FB5B5]/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#E8836A]/10 blur-3xl pointer-events-none" aria-hidden="true" />

      {/* Header */}
      <div className="px-4 relative">
        <SectionHeading
          tone="dark"
          eyebrow={t("badge")}
          title={t("heading")}
          subtitle={
            <>
              {t("subheadingBefore")}{" "}
              <span className="text-[#A8D5D5] font-semibold">{t("subheadingHighlight")}</span>
            </>
          }
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">

        <VehicleCard vehicle={buggy} locale={locale} onPhotoClick={(i) => open(buggy, i)} />
        <VehicleCard vehicle={compact} locale={locale} onPhotoClick={(i) => open(compact, i)} flipped />

        {/* ── Mix & match CTA ──
            The pitch is "take one of each", and we have a photograph of the
            whole line-up parked together. Two car emoji were standing in for
            it, which undersold the one thing this panel is claiming. */}
        <div className="relative rounded-3xl overflow-hidden text-center border border-white/10" data-reveal data-reveal-style="zoom">
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src={lineupPhoto}
              alt=""
              fill
              sizes="(max-width: 1280px) 100vw, 1216px"
              quality={50}
              placeholder="blur"
              className="object-cover object-[50%_58%]"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(9,30,45,0.95) 0%, rgba(9,30,45,0.86) 48%, rgba(9,30,45,0.62) 100%)",
              }}
            />
          </div>
          <div className="relative p-8 sm:p-12">
            <h3 className="text-white font-display font-black text-2xl sm:text-3xl mb-2.5 tracking-[-0.02em]">{t("mixTitle")}</h3>
            <p className="text-[#E2E8F0] text-sm sm:text-base mb-7 max-w-md mx-auto leading-relaxed">{t("mixDesc")}</p>
            <Link
              href={`/${locale}/book`}
              className="inline-flex items-center bg-[#C05232] hover:bg-[#A8411F] text-white font-black text-lg px-10 py-4 rounded-full transition-all hover:shadow-2xl hover:shadow-[#C05232]/30 hover:-translate-y-1"
            >
              {t("mixCta")} →
            </Link>
            <p className="text-white/60 text-xs mt-3">{t("mixNote")}</p>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (() => {
        const photos = allPhotos(lightbox.vehicle);
        const current = photos[lightbox.index];
        return (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label={t("openGallery")}
          >
            <button
              className="absolute top-4 right-4 w-11 h-11 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white z-10"
              onClick={() => setLightbox(null)}
              aria-label={t("closeGallery")}
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">{lightbox.index + 1} / {photos.length}</div>
            <button
              className="absolute left-3 sm:left-6 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white z-10"
              onClick={e => { e.stopPropagation(); prev(); }}
              aria-label={t("previousPhoto")}
            >
              <ChevronLeft className="w-6 h-6" aria-hidden="true" />
            </button>
            <div className="relative w-full max-w-5xl max-h-[85vh] mx-16" onClick={e => e.stopPropagation()}>
              <Image
                src={current.src}
                alt={current.label}
                width={1400}
                height={900}
                sizes="(max-width: 1024px) 90vw, 1024px"
                className="object-contain w-full h-full max-h-[85vh] rounded-xl"
                priority
              />
            </div>
            <button
              className="absolute right-3 sm:right-6 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white z-10"
              onClick={e => { e.stopPropagation(); next(); }}
              aria-label={t("nextPhoto")}
            >
              <ChevronRight className="w-6 h-6" aria-hidden="true" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {photos.map((p, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setLightbox(lb => lb ? { ...lb, index: i } : null); }}
                  aria-label={t("goToPhoto", { n: i + 1 })}
                  aria-current={i === lightbox.index}
                  className={`w-14 h-11 rounded-md overflow-hidden relative border-2 transition-all ${i === lightbox.index ? "border-white scale-110" : "border-transparent opacity-50 hover:opacity-80"}`}
                >
                  <Image src={p.src} alt="" fill sizes="56px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Back out into the cream "how it works" section. */}
      <SectionWave next="#F5F0EB" />
    </section>
  );
}

/* ─── vehicle card ──────────────────────────────────────────────── */

function VehicleCard({
  vehicle: v, locale, onPhotoClick, flipped,
}: {
  vehicle: Vehicle;
  locale: string;
  onPhotoClick: (i: number) => void;
  flipped?: boolean;
}) {
  const t = useTranslations("fleet");
  const BadgeIcon = v.badgeIcon;

  const photoBlock = (
    <div className="flex flex-col">
      <button
        onClick={() => onPhotoClick(0)}
        className="relative block group overflow-hidden h-72 sm:h-96 lg:h-[480px]"
        aria-label={t("openGallery")}
      >
        <Image
          src={v.hero}
          alt={v.heroAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 65vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute top-5 right-5 text-white font-black text-2xl px-5 py-3 rounded-2xl shadow-2xl z-10"
          style={{ backgroundColor: v.accent }}
        >
          ${v.price}<span className="text-sm font-medium opacity-90">{t("perDayShort")}</span>
        </div>
        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {t("viewGallery")} ↗
        </div>
      </button>
      <div className="grid grid-cols-3 gap-0.5 bg-gray-100">
        {v.photos.slice(0, 3).map((photo, i) => (
          <button
            key={i}
            onClick={() => onPhotoClick(i + 1)}
            className="relative overflow-hidden group h-24 sm:h-28"
            aria-label={photo.label}
          >
            <Image
              src={photo.src}
              alt={photo.label}
              fill
              sizes="(max-width: 1024px) 33vw, 22vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="rounded-3xl overflow-hidden shadow-xl bg-white" data-reveal>
      <div className={`grid grid-cols-1 ${flipped ? "lg:grid-cols-[35%_65%]" : "lg:grid-cols-[65%_35%]"}`}>

        {flipped ? null : photoBlock}

        {/* ── Info side ── */}
        <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">

          {/* Top */}
          <div>
            <div
              className="inline-flex items-center gap-1.5 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-5"
              style={{ backgroundColor: v.accent }}
            >
              <BadgeIcon className="w-3.5 h-3.5" aria-hidden="true" />
              {v.badgeLabel}
            </div>

            <h3 className="text-3xl sm:text-4xl font-black text-[#1B4F72] leading-tight mb-2">{v.name}</h3>
            <p className="text-[#5A616B] font-medium italic mb-6">&ldquo;{v.tagline}&rdquo;</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {v.stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="flex items-center gap-3 bg-[#F5F0EB] rounded-xl px-4 py-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: v.accent + "25" }}>
                      <Icon className="w-4 h-4" style={{ color: v.accent }} aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-black text-[#1B4F72] text-sm leading-none">{s.val}</div>
                      <div className="text-[#5A616B] text-xs">{s.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom — price + CTA */}
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-5xl sm:text-6xl font-black leading-none" style={{ color: v.accent }}>${v.price}</span>
              <div>
                <div className="text-[#5A616B] text-sm font-medium">{t("usdPerDay")}</div>
                <div className="text-[#5A616B] text-sm font-medium">{t("perVehicle")}</div>
              </div>
            </div>
            <p className="text-[#5A616B] text-xs mb-5">
              {t("reserveWithBefore")}{" "}
              <span className="font-bold" style={{ color: v.accent }}>${v.deposit}</span>{" "}
              {t("reserveWithAfter")}
            </p>
            <Link
              href={`/${locale}/book?type=${v.type}`}
              className="flex items-center justify-center text-white font-black text-base py-4 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-0.5 w-full"
              style={{ backgroundColor: v.accent }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = v.accentDark)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = v.accent)}
            >
              {t("bookVehicle")} →
            </Link>
          </div>
        </div>

        {flipped ? photoBlock : null}
      </div>
    </div>
  );
}
