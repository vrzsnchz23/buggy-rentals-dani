"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

/**
 * The island, with the places you would actually drive to.
 *
 * Every other section argues price, insurance or logistics. None of them
 * answered the question a visitor is really asking — what would I do with a
 * buggy for a day? — so this lays the island out and says how long each stop
 * takes from the port.
 *
 * The map itself is an illustration Dani had made, one file per language. It
 * replaced a coastline this section used to draw inline, and it says far more
 * than that outline did: it labels every place, marks the office, the cruise
 * piers and the ring road, and carries its own legend, scale bar and "not for
 * navigation" note.
 *
 * It is rendered as an image rather than inlined. The file imports two
 * typefaces from Google Fonts, and inlining it would mean a remote font
 * request from inside the page — which the site's Content-Security-Policy
 * blocks anyway. As an <img> the browser never loads it, the map falls back to
 * the family it declares, and nothing external is fetched. `unoptimized`
 * because the image optimiser refuses SVGs unless the site opts into serving
 * arbitrary SVG, which is not a door worth opening for one file we ship
 * ourselves.
 *
 * What the map cannot carry is the driving times and the short descriptions,
 * so those stay here. They are also the accessible version of the map: the
 * place names inside an <img> reach no screen reader, and the buttons and
 * panel below are the equivalent that does.
 *
 * The map gets a row of its own rather than a column beside the panel, which
 * is how the drawn version used to sit. That version was an outline and a
 * handful of pins and read fine small; this one labels twenty-four places at
 * 11 to 12.5 units against a 960-unit viewBox, so how legible it is follows
 * directly from how wide it renders. In the two-column layout it came out
 * 512px across — a scale of 0.53, putting those labels under 7px. No column
 * arrangement fixes that: handing the map the dominant share of max-w-6xl
 * still only reaches about 620px, and less again at the lg breakpoint itself.
 * Stacked and capped at max-w-3xl it renders at 768px, a scale of 0.8, which
 * puts the labels at 10px and the place names back within reading. On a phone
 * they shrink past reading whatever we do, and there the panel below is what
 * carries the island.
 */

export interface Stop {
  id: string;
  name: string;
  desc: string;
  minutes: number;
  /** The rental office rather than a destination. */
  home?: boolean;
}

/** One illustration per language; they differ only in their labels. */
const MAP_BY_LOCALE: Record<string, string> = {
  en: "/images/cozumel-map-en.svg",
  es: "/images/cozumel-map-es.svg",
};

/**
 * Where each stop sits on the illustration, as a percentage of its 960x1000
 * viewBox.
 *
 * These are measured off the artwork, not projected onto it. The drawn map
 * this replaced was a real equirectangular projection, so its pins could be
 * placed from coordinates — and had to be, which is how San Gervasio ended up
 * kilometres out until Dani caught it. An illustration owes nothing to a
 * projection: its island is drawn for legibility, so the only position that
 * is correct is the one the artwork itself uses. Each figure below is the
 * centre of that place's own icon as the browser reports it (getBBox on the
 * <use>), and the two language files carry those icons at identical
 * coordinates, so one table serves both.
 *
 * It follows that these numbers belong to this artwork. Redraw the map and
 * they are all wrong, silently — a pin in the sea is the obvious case, a pin
 * on the wrong beach is the dangerous one. Re-measure rather than nudge.
 */
const PIN_POSITIONS: Record<string, { x: number; y: number }> = {
  sanMiguel: { x: 43.81, y: 30.72 }, // the street grid, not the label beside it
  sanGervasio: { x: 69.11, y: 32.33 },
  mezcalitos: { x: 68.4, y: 48.96 },
  elCedral: { x: 31.63, y: 65.45 },
  palancar: { x: 27.91, y: 75.12 },
  playaBonita: { x: 50.72, y: 71.28 },
  puntaSur: { x: 37.01, y: 81.6 },
};

export function IslandMapCanvas({
  stops,
  locale,
  labels,
}: {
  stops: Stop[];
  locale: string;
  labels: {
    minutes: string;
    fromPort: string;
    readMore: string;
    mapAlt: string;
  };
}) {
  const [activeId, setActiveId] = useState(
    stops.find((s) => !s.home)?.id ?? stops[0].id,
  );
  const active = stops.find((s) => s.id === activeId) ?? stops[0];
  const destinations = stops.filter((s) => !s.home);
  const panel = useRef<HTMLDivElement>(null);

  /**
   * Pressing a pin changes the panel, and on a phone the panel is most of a
   * screen below the map — so the answer would arrive somewhere the reader
   * cannot see it. Bring it up, but only when it is actually out of reach, and
   * never animate it for someone who has asked for less motion.
   */
  function pick(id: string) {
    setActiveId(id);
    const el = panel.current;
    if (!el) return;
    if (el.getBoundingClientRect().top < window.innerHeight - 120) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "center" });
  }

  return (
    <div className="mx-auto w-full max-w-3xl xl:max-w-none xl:grid xl:grid-cols-[2fr_1fr] xl:gap-12 xl:items-center">
      <div data-reveal className="relative @container">
        <Image
          src={MAP_BY_LOCALE[locale] ?? MAP_BY_LOCALE.en}
          alt={labels.mapAlt}
          width={960}
          height={1000}
          unoptimized
          className="w-full h-auto rounded-3xl"
        />

        {/* The map draws an icon at each of these points already, so a pin
            rings that icon rather than covering it — the ring has no fill and
            the artwork shows through. The container ignores the pointer so
            only the buttons themselves are clickable.

            The ring is sized in cqw, a percentage of the map's own width,
            because what it has to fit is drawn in the artwork: the icons are
            16 units across and the place name starts about 11 units right of
            each icon's centre. A fixed pixel ring cannot respect that at two
            different map widths — at 24px over a 601px map it spanned 38
            units and struck straight through the labels, which read as broken
            text ("S an Gervasio"). In container units it holds its proportion
            at every width: 2.08cqw is 20 units, clearing the nearest label by
            just over one, and the active ring at 2.71cqw grazes it by less
            than two, which at this scale is under a pixel and reads as the
            highlight it is. The hit target is the button around it and stays
            in pixels, because a thumb is the same size whatever the map does.

            The idle ring is navy over a white halo rather than plain white:
            white alone disappeared into the icons, which carry white strokes
            of their own, so the pins read as nothing to press. The halo is
            what keeps the navy legible where a pin sits on the dark teal
            coastline instead of the cream. */}
        <div className="absolute inset-0 pointer-events-none">
          {destinations.map((stop) => {
            const at = PIN_POSITIONS[stop.id];
            if (!at) return null;
            const isActive = stop.id === activeId;
            return (
              <button
                key={stop.id}
                type="button"
                onClick={() => pick(stop.id)}
                aria-pressed={isActive}
                aria-label={stop.name}
                style={{ left: `${at.x}%`, top: `${at.y}%` }}
                className="group pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 sm:w-10 sm:h-10 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4F72] focus-visible:ring-offset-2"
              >
                <span
                  aria-hidden="true"
                  className={`block rounded-full transition-all duration-200 w-[2.08cqw] h-[2.08cqw] group-hover:w-[2.71cqw] group-hover:h-[2.71cqw] ${
                    isActive
                      ? "!w-[2.71cqw] !h-[2.71cqw] ring-[3px] ring-[#C05232] shadow-[0_0_0_3px_rgba(255,255,255,0.85)]"
                      : "ring-2 ring-[#1B4F72]/60 shadow-[0_0_0_2px_rgba(255,255,255,0.7)] group-hover:ring-[#C05232]"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Chips and panel are one column from xl up, so the panel reads beside
          the map instead of a screen below it. Stacked, the map had to be
          scrolled past to see the answer to pressing a pin, which is most of
          the point of pressing one. */}
      <div>
        <div
          data-reveal
          className="flex flex-wrap justify-center xl:justify-start gap-2 mt-8 xl:mt-0 mb-5"
        >
          {destinations.map((stop) => (
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
          pressing a pin or a name, and a sighted user sees it move. */}
        <div
          ref={panel}
          data-reveal
          style={{ transitionDelay: "80ms" }}
          aria-live="polite"
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm shadow-[#1B4F72]/5 ring-1 ring-[#1B4F72]/[0.06]"
        >
          <p className="inline-flex items-center gap-1.5 text-[0.7rem] font-black uppercase tracking-[0.16em] text-[#9B3A1A] bg-[#C05232]/12 rounded-full px-3 py-1 mb-4">
            <Clock className="w-3 h-3" aria-hidden="true" />
            {labels.minutes.replace("{minutes}", String(active.minutes))} ·{" "}
            {labels.fromPort}
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
