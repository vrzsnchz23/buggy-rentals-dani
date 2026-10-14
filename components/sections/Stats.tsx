import { useTranslations } from "next-intl";
import { CountUp } from "@/components/ui/CountUp";
import { SectionWave } from "@/components/ui/SectionWave";
import { VEHICLES } from "@/lib/utils";

/**
 * Four numbers, counted up as they arrive.
 *
 * Every figure here is one the page already states somewhere else — the island
 * is 48 km end to end, the fleet size comes from the same VEHICLES config the
 * hero counts, the price is the price, and the rating is whatever the reviews
 * actually say. Nothing was invented to fill a slot, which is the only reason
 * a band like this is worth having: a made-up "10,000 happy guests" is the
 * fastest way to make the rest of the page look made up too.
 *
 * A slim navy band between the mosaic and the map, which also gives the two
 * photo-heavy sections something to breathe against.
 */
export function Stats({ rating }: { rating: number }) {
  const t = useTranslations("stats");
  const fleetSize = Object.values(VEHICLES).reduce((sum, v) => sum + v.stock, 0);

  const figures = [
    { value: 48, decimals: 0, suffix: "", label: t("island") },
    { value: fleetSize, decimals: 0, suffix: "", label: t("fleet") },
    { value: 75, decimals: 0, prefix: "$", label: t("price") },
    { value: rating, decimals: 1, suffix: "", label: t("rating") },
  ];

  return (
    <section className="on-dark bg-[#1B4F72] pt-12 pb-20 sm:pt-14 sm:pb-24 relative overflow-hidden">
      {/* The same dot texture the fleet section uses, very faint. */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4">
          {figures.map((figure, i) => (
            <div key={figure.label} data-reveal style={{ transitionDelay: `${i * 80}ms` }} className="text-center">
              <dd className="font-display font-black text-white text-[2.5rem] sm:text-5xl leading-none tracking-[-0.03em] tabular-nums">
                {figure.prefix}
                <CountUp to={figure.value} decimals={figure.decimals} />
              </dd>
              {/* #C2E4E4 is 6.44:1 on this navy. */}
              <dt className="text-[#C2E4E4] text-xs sm:text-sm font-semibold mt-2.5 text-balance">{figure.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      <SectionWave next="#ffffff" />
    </section>
  );
}
