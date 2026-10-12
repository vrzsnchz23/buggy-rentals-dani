"use client";
import { useState } from "react";
import Link from "next/link";
import { Users, Divide, Equal, ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

/**
 * "What does it cost each of you?"
 *
 * The maths and the interaction are unchanged — picking a group size and
 * watching the per-person number fall is the most persuasive thing on this
 * page. What changed is the skin. It used to be a retro arcade HUD: neon cyan
 * (#00E5FF), scanline overlay, gold/purple/blue rank badges, "STAGE",
 * "SELECT PLAYERS", "EASY MODE" and "ACHIEVEMENT UNLOCKED". None of those
 * colours or words exist anywhere else on the site, so the page read as three
 * different products stacked on top of each other.
 *
 * It now speaks the brand's language, and the tier is carried by the sentence
 * under the result rather than by a colour that changes on every click.
 */

const PRICE_PER_BUGGY = 75;
const SEATS_PER_BUGGY = 5;
/** What a guided group tour costs per person — the bar's full scale. */
const TOUR_PRICE = 95;
const GROUP_SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/** Picked by price per person; the copy lives in messages/*.json. */
function verdictKey(perPerson: number) {
  if (perPerson <= 10) return "under10";
  if (perPerson <= 15) return "under15";
  if (perPerson <= 20) return "under20";
  if (perPerson <= 30) return "under30";
  return "over30";
}

export function PriceCalculator() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const [people, setPeople] = useState(4);

  const vehicles = Math.ceil(people / SEATS_PER_BUGGY);
  const total = vehicles * PRICE_PER_BUGGY;
  const perPerson = Math.ceil(total / people);
  const barPct = Math.min((perPerson / TOUR_PRICE) * 100, 100);

  return (
    <div
      data-reveal
      className="on-dark relative rounded-3xl overflow-hidden shadow-2xl shadow-[#1B4F72]/25"
      style={{ background: "linear-gradient(160deg, #1B4F72 0%, #0f2d42 58%, #091e2d 100%)" }}
    >
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        aria-hidden="true"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      />
      <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-[#E8836A]/15 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-20 -left-16 w-72 h-72 rounded-full bg-[#7FB5B5]/12 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative p-7 sm:p-10 lg:p-12">

        {/* Header */}
        <div className="text-center mb-9">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-[#A8D5D5] font-bold text-[0.7rem] sm:text-xs uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-5">
            <Divide className="w-3.5 h-3.5" aria-hidden="true" />
            {t("calcBadge")}
          </span>
          <h2 className="font-display font-black text-white text-[1.9rem] sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.03em] text-balance">
            {t("calcTitle")}
          </h2>
          <p className="text-[#CBD5E1] text-sm sm:text-base mt-4 max-w-md mx-auto">{t("calcSubtitle")}</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">

          {/* ── Group size ── */}
          <fieldset className="rounded-2xl p-5 bg-white/[0.06] border border-white/12">
            <legend className="flex items-center gap-2 px-1 text-[#A8D5D5] text-[0.7rem] font-bold uppercase tracking-[0.2em]">
              <Users className="w-3.5 h-3.5" aria-hidden="true" />
              {t("calcGroupLabel")}
            </legend>

            <div className="flex flex-wrap gap-2 mt-4">
              {GROUP_SIZES.map((n) => {
                const active = people === n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPeople(n)}
                    aria-pressed={active}
                    aria-label={t("calcPeopleAria", { count: n })}
                    className={`w-11 h-11 rounded-xl font-display font-black text-base transition-all duration-150 border ${
                      active
                        ? "bg-[#C05232] border-[#C05232] text-white shadow-lg shadow-[#C05232]/40 -translate-y-0.5"
                        : "bg-white/[0.07] border-white/15 text-white hover:bg-white/15 hover:border-white/30"
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* ── Result ── */}
          <div className="rounded-2xl overflow-hidden bg-black/25 border border-white/12">

            <div className="flex items-center justify-between gap-3 px-5 py-3 text-xs border-b border-white/10 bg-white/[0.04] flex-wrap">
              <span className="text-[#CBD5E1]">
                {vehicles === 1
                  ? t("calcVehiclesOne")
                  : t("calcVehiclesMany", { count: vehicles })}
              </span>
              <span className="text-[#A8D5D5]">{t("calcCapacityNote")}</span>
            </div>

            <div className="p-6 sm:p-8">
              {/* The sum, read left to right. aria-live so the result is
                  announced when the group size changes. */}
              <div
                className="flex items-center justify-center gap-5 sm:gap-8 flex-wrap mb-7"
                aria-live="polite"
                aria-atomic="true"
              >
                <div className="text-center">
                  <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#A8D5D5] mb-1.5">{t("calcTotal")}</div>
                  <div className="font-display text-4xl sm:text-5xl font-black text-white tracking-[-0.03em]">${total}</div>
                </div>

                <Divide className="w-6 h-6 text-white/30 hidden sm:block" aria-hidden="true" />

                <div className="text-center">
                  <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#A8D5D5] mb-1.5">{t("calcPeople")}</div>
                  <div className="font-display text-4xl sm:text-5xl font-black text-white tracking-[-0.03em]">{people}</div>
                </div>

                <Equal className="w-6 h-6 text-white/30 hidden sm:block" aria-hidden="true" />

                <div className="text-center">
                  <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#FBC7B7] mb-1.5">{t("calcPerPerson")}</div>
                  <div className="font-display text-6xl sm:text-7xl font-black leading-none text-[#FBC7B7] tracking-[-0.04em]">
                    ${perPerson}
                  </div>
                </div>
              </div>

              {/* Against a guided tour */}
              <div className="mb-6">
                <div className="flex justify-between items-baseline gap-3 mb-2 flex-wrap">
                  <span className="text-[#CBD5E1] text-[0.7rem] font-bold uppercase tracking-[0.16em]">
                    {t("calcBarLabel")}
                  </span>
                  <span className="text-[#A8D5D5] text-xs tabular-nums">
                    {t("calcBarValue", { perPerson })}
                  </span>
                </div>
                <div
                  className="h-3 rounded-full overflow-hidden bg-white/10 border border-white/10"
                  role="img"
                  aria-label={t("calcBarValue", { perPerson })}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#E8836A] to-[#C05232] transition-all duration-500"
                    style={{ width: `${barPct}%` }}
                  />
                </div>
              </div>

              <p className="text-white text-sm sm:text-base leading-relaxed text-center">
                {t(`verdicts.${verdictKey(perPerson)}`)}
              </p>
            </div>
          </div>

          <Link
            href={`/${locale}/book`}
            className="flex items-center justify-center gap-2 bg-[#C05232] hover:bg-[#A8411F] text-white font-black text-base sm:text-lg min-h-14 px-6 rounded-2xl transition-all hover:shadow-2xl hover:shadow-[#C05232]/40 hover:-translate-y-0.5 w-full text-center"
          >
            {t("calcCta", { total })}
            <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
          </Link>

          <p className="text-center text-[#CBD5E1] text-xs">{t("calcNote")}</p>
        </div>
      </div>
    </div>
  );
}
