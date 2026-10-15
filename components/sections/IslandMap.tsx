import { useLocale, useTranslations } from "next-intl";
import { Map as MapIcon } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionWave } from "@/components/ui/SectionWave";
import { IslandMapCanvas, type Stop } from "@/components/sections/IslandMapCanvas";

/**
 * Where a day in a buggy actually goes.
 *
 * The stops are the same ones the blog post covers, so the two cannot drift
 * apart and the panel can send someone to read the long version. They used to
 * be projected onto a coastline this section drew from coordinates; the
 * illustrated map that replaced it labels them itself, so all that is left
 * here is the copy and the driving times.
 */
const HOME = "office";

export function IslandMap() {
  const t = useTranslations("islandMap");
  const locale = useLocale();
  const items = t.raw("stops") as Array<{ id: string; name: string; desc: string; minutes: number }>;

  const stops: Stop[] = items.map((item) => ({ ...item, home: item.id === HOME }));

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
            readMore: t("readMore"),
            mapAlt: t("mapAlt"),
          }}
        />

        {/* The map says for itself that it is an illustration and not for
            navigation. The times are ours, and they are estimates. */}
        <p data-reveal className="text-center text-xs text-[#5A616B] mt-8 max-w-lg mx-auto leading-relaxed">
          {t("disclaimer")}
        </p>
      </div>

      <SectionWave next="#F5F0EB" />
    </section>
  );
}
