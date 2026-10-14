"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Navigation } from "lucide-react";
import { ISLAND_PATH, ISLAND_VIEWBOX } from "@/lib/island-outline";

/**
 * The island, with the places you would actually drive to.
 *
 * Every other section argues price, insurance or logistics. None of them
 * answered the question a visitor is really asking — what would I do with a
 * buggy for a day? — so this lays the island out and puts the stops on it with
 * how long each one takes from the port.
 *
 * The coastline is the real one, from a location map of the island, so the
 * pins are placed from actual coordinates rather than by eye: the original
 * carried a 5 km scale bar, which calibrates the projection, and the southern
 * tip anchors it. What stays approximate is the driving times, and the section
 * says so underneath.
 *
 * The pins are real buttons on a layer above the drawing, not shapes inside it:
 * an SVG `<g>` with a click handler cannot be tabbed to, and a map you can only
 * use with a mouse is a map half the point of which is missing.
 */

export interface Stop {
  id: string;
  name: string;
  desc: string;
  minutes: number;
  /** Position on the drawing, in percent. */
  x: number;
  y: number;
  /** The rental office rather than a destination. */
  home?: boolean;
}

export function IslandMapCanvas({
  stops,
  locale,
  labels,
}: {
  stops: Stop[];
  locale: string;
  labels: { minutes: string; fromPort: string; office: string; readMore: string; pick: string };
}) {
  const [activeId, setActiveId] = useState(stops.find((s) => !s.home)?.id ?? stops[0].id);
  const active = stops.find((s) => s.id === activeId) ?? stops[0];

  return (
    <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center">
      {/* ── The drawing ── */}
      <div data-reveal className="relative mx-auto w-full max-w-sm lg:max-w-md">
        {/* The real coastline, not a drawing — which is the only reason the pins
            can be placed from coordinates. See lib/island-outline.ts. */}
        <svg viewBox={ISLAND_VIEWBOX} className="w-full h-auto" role="img" aria-label={labels.pick}>
          <defs>
            <linearGradient id="island-sea" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#A8D5D5" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#7FB5B5" stopOpacity="0.18" />
            </linearGradient>
            <linearGradient id="island-land" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%" stopColor="#F9F4EE" />
              <stop offset="100%" stopColor="#E8DCCD" />
            </linearGradient>
          </defs>

          <rect x="17" y="-2" width="932" height="1047" rx="30" fill="url(#island-sea)" />

          <path
            d={ISLAND_PATH}
            fill="url(#island-land)"
            stroke="#1B4F72"
            strokeOpacity="0.22"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>

        {/* ── The pins ── */}
        {stops.map((stop) => {
          const isActive = stop.id === activeId;
          return (
            <button
              key={stop.id}
              type="button"
              onClick={() => setActiveId(stop.id)}
              aria-pressed={isActive}
              className="absolute -translate-x-1/2 -translate-y-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C05232] rounded-full"
              style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
            >
              <span className="sr-only">{stop.name}</span>
              <span
                aria-hidden="true"
                className={`flex items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
                  stop.home
                    ? "w-9 h-9 bg-[#1B4F72] ring-4 ring-white"
                    : isActive
                      ? "w-8 h-8 bg-[#C05232] ring-4 ring-white scale-110"
                      : "w-6 h-6 bg-white ring-2 ring-[#C05232]/60 hover:scale-110"
                }`}
              >
                {stop.home ? (
                  <Navigation className="w-4 h-4 text-white" />
                ) : (
                  <MapPin className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#C05232]"}`} />
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── The list and the detail ── */}
      <div>
        <div data-reveal className="flex flex-wrap gap-2 mb-6">
          {stops
            .filter((s) => !s.home)
            .map((stop) => (
              <button
                key={stop.id}
                type="button"
                onClick={() => setActiveId(stop.id)}
                aria-pressed={stop.id === activeId}
                className={`min-h-10 px-3.5 rounded-full text-sm font-bold transition-colors ${
                  stop.id === activeId
                    ? "bg-[#C05232] text-white"
                    : "bg-white text-[#1B4F72] ring-1 ring-[#1B4F72]/12 hover:ring-[#C05232]/50"
                }`}
              >
                {stop.name}
              </button>
            ))}
        </div>

        {/* aria-live so a change announces itself: the detail is the answer to
            pressing a pin, and a sighted user sees it move. */}
        <div
          data-reveal
          style={{ transitionDelay: "80ms" }}
          aria-live="polite"
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm shadow-[#1B4F72]/5 ring-1 ring-[#1B4F72]/[0.06]"
        >
          <p className="inline-flex items-center gap-1.5 text-[0.7rem] font-black uppercase tracking-[0.16em] text-[#9B3A1A] bg-[#C05232]/12 rounded-full px-3 py-1 mb-4">
            <Clock className="w-3 h-3" aria-hidden="true" />
            {labels.minutes.replace("{minutes}", String(active.minutes))} · {labels.fromPort}
          </p>

          <h3 className="font-display font-black text-[#1B4F72] text-2xl sm:text-[1.75rem] tracking-[-0.02em] mb-3">
            {active.name}
          </h3>

          <p className="text-[#404650] leading-relaxed">{active.desc}</p>

          <Link
            href={`/${locale}/blog/best-places-to-visit-cozumel-by-buggy`}
            className="inline-flex items-center gap-1.5 text-[#A8411F] font-black text-sm mt-6 hover:gap-3 transition-all"
          >
            {labels.readMore}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
