"use client";
import { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Review } from "@/lib/reviews";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionWave } from "@/components/ui/SectionWave";

const AVATAR_COLORS = ["#1B4F72", "#C05232", "#3F7878", "#1B4F72"];
const AUTOPLAY_MS = 7000;

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {[...Array(count)].map((_, i) => (
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      ))}
    </div>
  );
}

function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function Avatar({ review, index, size }: { review: Review; index: number; size: "lg" | "sm" }) {
  const dim = size === "lg" ? "w-12 h-12" : "w-10 h-10";
  const text = size === "lg" ? "text-sm" : "text-xs";
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <div className="relative shrink-0">
      {review.author_photo ? (
        <Image
          src={review.author_photo}
          alt=""
          width={size === "lg" ? 48 : 40}
          height={size === "lg" ? 48 : 40}
          className={`${dim} rounded-full object-cover`}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className={`${dim} rounded-full flex items-center justify-center font-black text-white ${text}`}
          style={{ background: color }}
          aria-hidden="true"
        >
          {initials(review.author_name)}
        </div>
      )}
    </div>
  );
}

export function ReviewsCarousel({
  reviews,
  rating,
  total,
}: {
  reviews: Review[];
  rating: number;
  total: number | null;
}) {
  const t = useTranslations("reviews");
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);

  const count = reviews.length;

  function prev() { setCurrent((i) => (i > 0 ? i - 1 : count - 1)); }
  function next() { setCurrent((i) => (i < count - 1 ? i + 1 : 0)); }

  // Gentle autoplay. Stops on hover, on focus inside the carousel, when the tab
  // is hidden, and entirely for anyone who asked for reduced motion.
  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      if (document.hidden) return;
      setCurrent((i) => (i < count - 1 ? i + 1 : 0));
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [paused, count]);

  const review = reviews[current];
  if (!review) return null;

  return (
    <section className="pt-12 pb-20 sm:pt-16 sm:pb-24 bg-white relative overflow-hidden">

      <div className="absolute top-10 left-0 w-72 h-72 rounded-full bg-[#7FB5B5]/8 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#E8836A]/8 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        <SectionHeading
          eyebrow={t("badge")}
          icon={<GoogleG className="w-3.5 h-3.5" />}
          title={t("title")}
          subtitle={t("subtitle")}
        >
          {/* The score is the single most persuasive thing in this section, so
              it is set at display scale instead of as a line of small print. */}
          <div
            data-reveal
            style={{ transitionDelay: "260ms" }}
            className="inline-flex items-center gap-4 mt-8 bg-white rounded-2xl border border-black/5 shadow-lg shadow-[#1B4F72]/5 px-6 py-4"
          >
            <span className="font-display font-black text-5xl sm:text-6xl text-[#1B4F72] leading-none tracking-[-0.04em]">
              {rating.toFixed(1)}
            </span>
            <span className="w-px h-12 bg-black/10" aria-hidden="true" />
            <span className="text-left">
              <span className="flex gap-0.5 mb-1" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </span>
              <span className="block text-[#5A616B] text-xs sm:text-sm">
                {t("onGoogle")}{total ? ` · ${t("reviewsCount", { count: total })}` : ""}
              </span>
            </span>
          </div>
        </SectionHeading>

        <div
          ref={regionRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={t("title")}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-reveal>

            {/* Featured review */}
            <div className="on-dark lg:col-span-2 bg-[#1B4F72] rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" aria-hidden="true" />
              <div className="absolute -bottom-16 -left-10 w-56 h-56 rounded-full bg-white/5" aria-hidden="true" />

              <div className="relative" aria-live="polite" aria-atomic="true">
                <Quote className="w-10 h-10 text-[#F7B9A6] mb-6" aria-hidden="true" />
                <p className="text-white text-lg leading-relaxed font-medium">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>

              <div className="relative flex items-center justify-between mt-8 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Avatar review={review} index={current} size="lg" />
                  <div>
                    <div className="font-bold text-white">{review.author_name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Stars count={review.rating} />
                      <span className="text-[#CBD5E1] text-xs">{review.relative_time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                  <GoogleG className="w-4 h-4" />
                  <span className="text-white/90 text-xs font-medium">{t("googleReview")}</span>
                </div>
              </div>
            </div>

            {/* Thumbnail list.
                The featured card is `lg:col-span-2` in the same grid row, so it
                stretches to whatever this column measures. At four reviews that
                was fine; at nine the column ran past 1,100px and the featured
                card became a navy slab with three lines of text floating in it.
                The thumbnails get their own capped, scrollable box from `lg` up —
                where the stretching happens — and the two links stay outside it
                so they are always in view. The scrollbar is left visible on
                purpose: it is the only thing saying there are more below. */}
            <div className="flex flex-col gap-3">
              {/* Hidden on a phone: the thumbnails are a desktop affordance, and
                  stacked on a 375px screen they added 1,095px of previews below a
                  carousel that already has arrows and dots doing the same job. The
                  two links below stay visible at every width. */}
              <div className="hidden lg:flex flex-col gap-3 lg:max-h-[21rem] lg:overflow-y-auto lg:pr-1.5">
                {reviews.map((r, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-current={i === current}
                  className={`text-left rounded-2xl p-4 flex items-start gap-3 transition-all border-2 ${
                    i === current
                      ? "border-[#1B4F72] bg-[#1B4F72]/5 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <Avatar review={r} index={i} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-sm ${i === current ? "text-[#1B4F72]" : "text-gray-700"}`}>
                      {r.author_name}
                    </div>
                    <div className="flex gap-0.5 my-0.5" aria-hidden="true">
                      {[...Array(r.rating)].map((_, j) => (
                        <Star key={j} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-[#5A616B] text-xs leading-relaxed line-clamp-2">{r.text}</p>
                  </div>
                </button>
                ))}
              </div>

              <a
                href="https://maps.app.goo.gl/QYZiN1rf1vXbhR8g8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center text-center text-sm font-semibold text-[#1B4F72] hover:text-[#C05232] transition-colors min-h-11"
              >
                {t("seeAll")} →
              </a>

              <a
                href="https://g.page/r/CfS3VjCYpjOMEBM/review"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#1B4F72] hover:bg-[#154060] text-white font-bold text-sm py-3 px-4 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <GoogleG className="w-4 h-4 shrink-0" />
                {t("leaveReview")}
              </a>
            </div>
          </div>

          {/* Navigation — all controls are at least 44px so they can be tapped. */}
          {count > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={prev}
                aria-label={t("previous")}
                className="w-11 h-11 rounded-full border-2 border-gray-300 hover:border-[#1B4F72] flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" aria-hidden="true" />
              </button>
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={t("goTo", { n: i + 1 })}
                  aria-current={i === current}
                  className="w-11 h-11 flex items-center justify-center group"
                >
                  <span
                    className={`block rounded-full transition-all ${
                      i === current
                        ? "w-6 h-2.5 bg-[#1B4F72]"
                        : "w-2.5 h-2.5 bg-gray-300 group-hover:bg-gray-400"
                    }`}
                  />
                </button>
              ))}
              <button
                onClick={next}
                aria-label={t("next")}
                className="w-11 h-11 rounded-full border-2 border-gray-300 hover:border-[#1B4F72] flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Into the navy location section below. */}
      <SectionWave next="#1B4F72" />
    </section>
  );
}
