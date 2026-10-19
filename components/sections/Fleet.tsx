"use client";
import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Wind,
  Thermometer,
  Mountain,
  Shield,
  Users,
  Fuel,
  MessageCircle,
  Check,
  Images,
} from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { VEHICLES, VEHICLE_ORDER } from "@/lib/utils";
import { SectionWave } from "@/components/ui/SectionWave";
import lineupPhoto from "@/public/images/fleet-lineup.jpg";

/**
 * The fleet.
 *
 * Three vehicles now, shown side by side with no selector. Four other shapes
 * were tried and each failed for a reason worth recording, because they are
 * the reasons this one is plain:
 *
 *   Two full-height split panels, stacked — about 1,400px of page each, so a
 *   third would have run the section past 4,200px.
 *
 *   A row of text pills above one big panel — scrolling past it you registered
 *   one vehicle and moved on. That there was a choice at all did not read.
 *
 *   A row of photo thumbnails above one big panel — now the choice read, but
 *   the open vehicle's photograph appeared twice on screen, one above the
 *   other, and the rounded-photo-card shape repeated three times in one
 *   section.
 *
 *   An expanding row, each vehicle one panel, the open one wide — every
 *   vehicle appeared exactly once and the choice read, and it was still wrong.
 *
 * What all four share is that they make the visitor operate something to
 * compare two things that fit on one screen. Three cards side by side need no
 * selector, show every vehicle exactly once, repeat nothing, and cannot hide
 * an option. The shared facts are stated once above, so each card carries only
 * what makes its vehicle different.
 */

/* ─── static, non-translated data ───────────────────────────────── */

type VehicleKey = "buggy" | "compact" | "jimny";

const VEHICLE_ART = {
  buggy: {
    type: "buggy",
    accent: "#C05232",
    accentDark: "#A8411F",
    badgeIcon: Wind,
    hero: "/images/buggy10.png",
    photos: ["/images/buggy11.png", "/images/buggy5.jpg", "/images/buggy4.jpg", "/images/buggy3.jpg"],
  },
  compact: {
    type: "compact",
    accent: "#1B4F72",
    accentDark: "#163d58",
    badgeIcon: Thermometer,
    hero: "/images/compacto-cover.jpg",
    photos: ["/images/compacto1.jpg", "/images/compacto2.jpg", "/images/compacto3.jpg", "/images/compacto4.jpg"],
  },
  jimny: {
    type: "jimny",
    accent: "#2F6060", // brand teal ink — white on it is 7.09:1
    accentDark: "#265050",
    badgeIcon: Mountain,
    hero: "/images/jimny-2.jpg",
    photos: ["/images/jimny-1.jpg"],
  },
} as const;

const ORDER: readonly VehicleKey[] = VEHICLE_ORDER;

/** The four things every vehicle comes with, in the order they are listed. */
const SHARED_ICONS = [Users, Shield, Fuel, MessageCircle];

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
  /** Only what sets this vehicle apart from the others. */
  differences: string[];
  /** Flagged in the fleet config; drives the "Most popular" badge. */
  popular: boolean;
};

type LightboxState = { vehicle: Vehicle; index: number } | null;

/* ─── main component ────────────────────────────────────────────── */

export function Fleet() {
  const locale = useLocale();
  const t = useTranslations("fleet");
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  function buildVehicle(key: VehicleKey): Vehicle {
    const art = VEHICLE_ART[key];
    return {
      key,
      type: art.type,
      name: t(`${key}.name`),
      tagline: t(`${key}.tagline`),
      badgeLabel: t(`${key}.badge`),
      badgeIcon: art.badgeIcon,
      price: VEHICLES[key].price,
      deposit: VEHICLES[key].deposit,
      accent: art.accent,
      accentDark: art.accentDark,
      hero: art.hero,
      heroAlt: t(`${key}.alt`),
      photos: art.photos.map((src, i) => ({ src, label: t(`${key}.photo${i + 1}`) })),
      differences: t.raw(`${key}.differences`) as string[],
      popular: VEHICLES[key].popular,
    };
  }

  const vehicles = ORDER.map(buildVehicle);
  const included = t.raw("included") as string[];

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
    <section id="fleet" className="on-dark pt-12 pb-20 sm:pt-16 sm:pb-24 overflow-hidden relative" style={{ background: "linear-gradient(160deg, #1B4F72 0%, #0f2d42 60%, #091e2d 100%)" }}>

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative">

        {/* ── What every vehicle comes with ──
            Said once, instead of each card repeating the three facts that are
            the same for all of them. */}
        <div data-reveal className="text-center">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#A8D5D5] mb-3">
            {t("includedLabel")}
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {included.map((item, i) => {
              const Icon = SHARED_ICONS[i] ?? Check;
              return (
                <li key={item} className="inline-flex items-center gap-2 text-white text-sm font-semibold">
                  <Icon className="w-4 h-4 text-[#A8D5D5] shrink-0" aria-hidden="true" />
                  {item}
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── The three vehicles ──
            `items-stretch` plus `mt-auto` on each price block keeps the prices
            and the buttons on one line across the row however much the copy
            above them differs. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {vehicles.map((v, i) => {
            const BadgeIcon = v.badgeIcon;
            const photoCount = allPhotos(v).length;
            return (
              <article
                key={v.key}
                data-reveal
                style={{ transitionDelay: `${i * 90}ms` }}
                className="flex flex-col rounded-3xl overflow-hidden bg-white shadow-xl"
              >
                <button
                  type="button"
                  onClick={() => open(v, 0)}
                  className="group relative block aspect-[16/10] overflow-hidden"
                  aria-label={`${v.name} — ${t("openGallery")}`}
                >
                  <Image
                    src={v.hero}
                    alt={v.heroAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span
                    className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                    style={{ backgroundColor: v.accent }}
                  >
                    <BadgeIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    {v.badgeLabel}
                  </span>
                  {/* Always visible, not hover-only: on a touch screen there is
                      no hover, so the one hint that the photo opens a gallery
                      never appeared on a phone. White on black at 70% is 9:1
                      even over a white photo. */}
                  <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-sm text-white text-[0.7rem] font-semibold px-2.5 py-1.5 rounded-full">
                    <Images className="w-3.5 h-3.5" aria-hidden="true" />
                    {photoCount}
                  </span>
                </button>

                <div className="flex flex-col flex-1 p-6 sm:p-7">
                  {v.popular && (
                    <span
                      className="inline-flex items-center self-start rounded-full px-3 py-1 mb-2 text-xs font-black uppercase tracking-[0.12em] text-white"
                      style={{ backgroundColor: v.accent }}
                    >
                      {t("mostPopular")}
                    </span>
                  )}
                  <h3 className="font-display font-black text-[#1B4F72] text-2xl leading-tight tracking-[-0.01em]">
                    {v.name}
                  </h3>
                  <p className="text-[#5A616B] font-medium italic mt-1.5 mb-5">&ldquo;{v.tagline}&rdquo;</p>

                  <ul className="space-y-2.5">
                    {v.differences.map((line) => (
                      <li key={line} className="flex items-start gap-2.5 text-[#404650] text-[0.9375rem] leading-snug">
                        <span
                          className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: v.accent + "25" }}
                          aria-hidden="true"
                        >
                          <Check className="w-3 h-3" style={{ color: v.accent }} />
                        </span>
                        {line}
                      </li>
                    ))}
                  </ul>

                  {/* mt-auto: whatever the copy above, this block sits on the
                      card's floor, so the three prices line up. */}
                  <div className="mt-auto pt-6">
                    <div className="flex items-baseline gap-2">
                          <span className="font-display text-5xl font-black leading-none" style={{ color: v.accent }}>
                        ${v.price}
                      </span>
                      <div>
                        <div className="text-[#5A616B] text-sm font-medium leading-tight">{t("usdPerDay")}</div>
                        <div className="text-[#5A616B] text-sm font-medium leading-tight">{t("perVehicle")}</div>
                      </div>
                    </div>
                    <p className="text-[#5A616B] text-xs mt-2 mb-4">
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
              </article>
            );
          })}
        </div>

        {/* ── Mix & match CTA ──
            The pitch is "take one of each", and we have a photograph of the
            whole line-up parked together. */}
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
            {photos.length > 1 && (
              <button
                className="absolute left-3 sm:left-6 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white z-10"
                onClick={e => { e.stopPropagation(); prev(); }}
                aria-label={t("previousPhoto")}
              >
                <ChevronLeft className="w-6 h-6" aria-hidden="true" />
              </button>
            )}
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
            {photos.length > 1 && (
              <button
                className="absolute right-3 sm:right-6 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white z-10"
                onClick={e => { e.stopPropagation(); next(); }}
                aria-label={t("nextPhoto")}
              >
                <ChevronRight className="w-6 h-6" aria-hidden="true" />
              </button>
            )}
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
