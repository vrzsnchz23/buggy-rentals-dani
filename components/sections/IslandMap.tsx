import { useLocale, useTranslations } from "next-intl";
import { Map as MapIcon } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionWave } from "@/components/ui/SectionWave";
import { IslandMapCanvas, type Stop } from "@/components/sections/IslandMapCanvas";
import { ISLAND_POSITIONS } from "@/lib/island-outline";

/**
 * Where a day in a buggy actually goes.
 *
 * The positions are not written here: they are projected from each stop's real
 * coordinates onto the real coastline, in lib/island-outline.ts. The stops are
 * the same ones the blog post covers, so the two cannot drift apart and a pin
 * can send someone to read the long version.
 */
const HOME = "office";

export function IslandMap() {
  const t = useTranslations("islandMap");
  const locale = useLocale();
  const items = t.raw("stops") as Array<{ id: string; name: string; desc: string; minutes: number }>;

  const stops: Stop[] = items
    .filter((item) => ISLAND_POSITIONS[item.id])
    .map((item) => ({ ...item, ...ISLAND_POSITIONS[item.id], home: item.id === HOME }));

  return (
    <section id="island-map" className="pt-12 pb-20 sm:pt-16 sm:pb-24 bg-white relative overflow-hidden">
      <div
        className="absolute top-20 right-0 w-72 h-72 rounded-full bg-[#7FB5B5]/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading
          eyebrow={t("badge")}
          title={t("title")}
          subtitle={t("subtitle")}
          icon={<MapIcon className="w-3.5 h-3.5" aria-hidden="true" />}
        />

        <IslandMapCanvas
          stops={stops}
          locale={locale}
          labels={{
            minutes: t.raw("minutes") as string,
            fromPort: t("fromPort"),
            office: t("office"),
            readMore: t("readMore"),
            pick: t("pick"),
          }}
        />

        {/* Said plainly rather than implied: the drawing is an illustration and
            the times are estimates. */}
        <p data-reveal className="text-center text-xs text-[#5A616B] mt-8 max-w-lg mx-auto leading-relaxed">
          {t("disclaimer")}
        </p>
      </div>

      <SectionWave next="#F5F0EB" />
    </section>
  );
}
