"use client";
import { useState } from "react";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, Wind, Thermometer, Shield, Users, Fuel, MessageCircle } from "lucide-react";

/* ─── data ─────────────────────────────────────────────────────── */

const BUGGY = {
  type: "buggy",
  name: "Open-Air Buggy",
  heroAlt: "Open-air buggy for rent in Cozumel, $75/day up to 5 people",
  tagline: "Feel the wind. Own the island.",
  price: 75,
  deposit: 25,
  accent: "#E8836A",
  accentDark: "#c86a52",
  bgGradient: "from-[#1a1a1a]/80 via-[#1a1a1a]/40 to-transparent",
  badge: { icon: Wind, label: "Open Air · No Doors" },
  stats: [
    { icon: Users, val: "5", label: "max people" },
    { icon: Shield, val: "✓", label: "insurance" },
    { icon: Fuel, val: "Full", label: "tank · return full" },
    { icon: MessageCircle, val: "WA", label: "support" },
  ],
  hero: "/images/buggy10.png",
  photos: [
    { src: "/images/buggy11.png", label: "Groups & Friends" },
    { src: "/images/buggy5.jpg",  label: "Ocean View" },
    { src: "/images/buggy4.jpg",  label: "Sunset Drive" },
    { src: "/images/buggy3.jpg",  label: "Beach Vibes" },
  ],
};

const COMPACT = {
  type: "compact",
  name: "Compact Car (A/C)",
  heroAlt: "Compact car with A/C for rent in Cozumel, $65/day",
  tagline: "Cool & comfortable, all day long.",
  price: 65,
  deposit: 25,
  accent: "#1B4F72",
  accentDark: "#163d58",
  bgGradient: "from-[#0d1f2d]/85 via-[#0d1f2d]/40 to-transparent",
  badge: { icon: Thermometer, label: "Air Conditioning" },
  stats: [
    { icon: Users,         val: "5",    label: "max people" },
    { icon: Thermometer,   val: "A/C",  label: "included" },
    { icon: Shield,        val: "✓",    label: "insurance" },
    { icon: Fuel,          val: "Full", label: "tank · return full" },
  ],
  hero: "/images/compacto1.jpg",
  photos: [
    { src: "/images/compacto2.jpg", label: "Comfortable Ride" },
    { src: "/images/compacto3.jpg",  label: "Perfect for Families" },
    { src: "/images/compacto4.jpg",  label: "Cool Comfort" },
    { src: "/images/buggy12.png",    label: "Ready to Go" },
  ],
};

type Vehicle = typeof BUGGY;
type LightboxState = { vehicle: Vehicle; index: number } | null;

/* ─── main component ────────────────────────────────────────────── */

export function Fleet() {
  const locale = useLocale();
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  function open(vehicle: Vehicle, index: number) { setLightbox({ vehicle, index }); }
  function prev() { setLightbox(lb => lb ? { ...lb, index: lb.index > 0 ? lb.index - 1 : lb.vehicle.photos.length } : null); }
  function next() { setLightbox(lb => lb ? { ...lb, index: lb.index < lb.vehicle.photos.length ? lb.index + 1 : 0 } : null); }

  const allPhotos = (v: Vehicle) => [{ src: v.hero, label: v.heroAlt }, ...v.photos];

  return (
    <section id="fleet" className="pt-24 pb-32 overflow-hidden relative" style={{ background: "linear-gradient(160deg, #1B4F72 0%, #0f2d42 60%, #091e2d 100%)" }}>

      {/* Subtle dot grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      {/* Glow blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#7FB5B5]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#E8836A]/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-16 px-4 relative">
        <span className="inline-block bg-white/10 text-white/70 font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
          Our Fleet
        </span>
        <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Choose Your Ride</h2>
        <p className="text-white/50 text-lg max-w-xl mx-auto">
          Open-air buggies for the full island experience —{" "}
          <span className="text-[#7FB5B5] font-semibold">and if you need A/C, don&apos;t worry, we&apos;ve got you covered too.</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">

        <VehicleCard vehicle={BUGGY} locale={locale} onPhotoClick={(i) => open(BUGGY, i)} allPhotos={allPhotos(BUGGY)} />
        <VehicleCard vehicle={COMPACT} locale={locale} onPhotoClick={(i) => open(COMPACT, i)} allPhotos={allPhotos(COMPACT)} flipped />

        {/* Mix & match CTA */}
        <div className="relative rounded-3xl overflow-hidden p-10 text-center border border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="relative">
            <div className="flex items-center justify-center gap-3 text-4xl mb-4">🚗 <span className="text-white/30 text-2xl font-black">+</span> 🚙</div>
            <h3 className="text-white font-black text-2xl mb-2">Mix & match in one booking</h3>
            <p className="text-white/50 text-sm mb-7 max-w-md mx-auto">
              Book buggies and compact cars together. One reservation, one payment, one confirmation.
            </p>
            <Link
              href={`/${locale}/book`}
              className="inline-flex items-center bg-[#E8836A] hover:bg-[#d4724f] text-white font-black text-lg px-10 py-4 rounded-full transition-all hover:shadow-2xl hover:shadow-[#E8836A]/30 hover:-translate-y-1"
            >
              Build Your Rental →
            </Link>
            <p className="text-white/30 text-xs mt-3">Secure with just $25 deposit · Free cancellation 48h before</p>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (() => {
        const photos = allPhotos(lightbox.vehicle);
        const current = photos[lightbox.index];
        return (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightbox(null)}>
            <button className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white z-10" onClick={() => setLightbox(null)}>
              <X className="w-5 h-5" />
            </button>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">{lightbox.index + 1} / {photos.length}</div>
            <button className="absolute left-3 sm:left-6 w-11 h-11 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white z-10" onClick={e => { e.stopPropagation(); prev(); }}>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="relative w-full max-w-5xl max-h-[85vh] mx-16" onClick={e => e.stopPropagation()}>
              <Image src={current.src} alt={current.label} width={1400} height={900} className="object-contain w-full h-full max-h-[85vh] rounded-xl" priority />
            </div>
            <button className="absolute right-3 sm:right-6 w-11 h-11 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white z-10" onClick={e => { e.stopPropagation(); next(); }}>
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {photos.map((p, i) => (
                <button key={i} onClick={e => { e.stopPropagation(); setLightbox(lb => lb ? { ...lb, index: i } : null); }} className={`w-12 h-8 rounded-md overflow-hidden relative border-2 transition-all ${i === lightbox.index ? "border-white scale-110" : "border-transparent opacity-40 hover:opacity-70"}`}>
                  <Image src={p.src} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        );
      })()}
    </section>
  );
}

/* ─── vehicle card ──────────────────────────────────────────────── */

function VehicleCard({
  vehicle: v, locale, onPhotoClick, allPhotos, flipped,
}: {
  vehicle: Vehicle;
  locale: string;
  onPhotoClick: (i: number) => void;
  allPhotos: { src: string; label: string }[];
  flipped?: boolean;
}) {
  const BadgeIcon = v.badge.icon;

  return (
    <div className="rounded-3xl overflow-hidden shadow-xl bg-white">
      <div className={`grid grid-cols-1 lg:grid-cols-[65%_35%] ${flipped ? "lg:[grid-template-columns:35%_65%]" : ""}`}>

        {/* ── Photo side (65%) ── */}
        <div className={`flex flex-col ${flipped ? "lg:order-2" : ""}`}>
          {/* Hero photo */}
          <button
            onClick={() => onPhotoClick(0)}
            className="relative block group overflow-hidden flex-1"
            style={{ height: "480px" }}
          >
            <Image
              src={v.hero}
              alt={v.heroAlt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            {/* Price badge */}
            <div
              className="absolute top-5 right-5 text-white font-black text-2xl px-5 py-3 rounded-2xl shadow-2xl z-10"
              style={{ backgroundColor: v.accent }}
            >
              ${v.price}<span className="text-sm font-medium opacity-80">/day</span>
            </div>
            {/* Gallery hint */}
            <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
              View gallery ↗
            </div>
          </button>

          {/* Thumbnail strip */}
          <div className="grid grid-cols-3 gap-0.5 bg-gray-100">
            {v.photos.slice(0, 3).map((photo, i) => (
              <button
                key={i}
                onClick={() => onPhotoClick(i + 1)}
                className="relative overflow-hidden group"
                style={{ height: "110px" }}
              >
                <Image
                  src={photo.src}
                  alt={photo.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Info side (35%) ── */}
        <div className={`flex flex-col justify-between p-8 lg:p-10 ${flipped ? "lg:order-1" : ""}`}>

          {/* Top */}
          <div>
            <div
              className="inline-flex items-center gap-1.5 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-5"
              style={{ backgroundColor: v.accent }}
            >
              <BadgeIcon className="w-3.5 h-3.5" />
              {v.badge.label}
            </div>

            <h3 className="text-4xl font-black text-[#1B4F72] leading-tight mb-2">{v.name}</h3>
            <p className="text-gray-400 font-medium italic mb-6">&ldquo;{v.tagline}&rdquo;</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {v.stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="flex items-center gap-3 bg-[#F5F0EB] rounded-xl px-4 py-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: v.accent + "25" }}>
                      <Icon className="w-4 h-4" style={{ color: v.accent }} />
                    </div>
                    <div>
                      <div className="font-black text-[#1B4F72] text-sm leading-none">{s.val}</div>
                      <div className="text-gray-400 text-xs">{s.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom — price + CTA */}
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-6xl font-black leading-none" style={{ color: v.accent }}>${v.price}</span>
              <div>
                <div className="text-gray-400 text-sm font-medium">USD / day</div>
                <div className="text-gray-400 text-sm font-medium">per vehicle</div>
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-5">
              Reserve with just <span className="font-bold" style={{ color: v.accent }}>${v.deposit} deposit</span>
            </p>
            <Link
              href={`/${locale}/book?type=${v.type}`}
              className="flex items-center justify-center text-white font-black text-base py-4 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-0.5 w-full"
              style={{ backgroundColor: v.accent }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = v.accentDark)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = v.accent)}
            >
              Book this vehicle →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
