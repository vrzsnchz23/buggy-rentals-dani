"use client";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Ship, MapPin, Clock, ArrowRight } from "lucide-react";

export function CruiseBanner() {
  const locale = useLocale();

  return (
    <section className="bg-[#0d2d42] py-10 relative overflow-hidden">
      {/* Subtle wave top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8836A] via-[#7FB5B5] to-[#E8836A]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-[#E8836A]/15 border border-[#E8836A]/30 flex items-center justify-center shrink-0">
            <Ship className="w-8 h-8 text-[#E8836A]" />
          </div>

          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-white font-black text-xl mb-1">
              On a cruise stop in Cozumel?
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
              We&apos;re a <span className="text-[#7FB5B5] font-semibold">5-minute walk from the port</span>.
              Book now and we&apos;ll be ready when your ship docks — no waiting, no hassle.
            </p>
          </div>

          {/* Badges + CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="flex gap-3">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/70">
                <MapPin className="w-3.5 h-3.5 text-[#7FB5B5]" /> Port pickup included
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/70">
                <Clock className="w-3.5 h-3.5 text-[#7FB5B5]" /> Ready in minutes
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/${locale}/cruise-excursion`}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white/80 font-semibold text-sm px-4 py-3 rounded-xl transition-all border border-white/15 whitespace-nowrap"
              >
                Learn more
              </Link>
              <Link
                href={`/${locale}/book`}
                className="flex items-center gap-2 bg-[#E8836A] hover:bg-[#d4724f] text-white font-black text-sm px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-[#E8836A]/30 hover:-translate-y-0.5 whitespace-nowrap"
              >
                Book for my cruise <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
