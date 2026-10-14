import { useTranslations } from "next-intl";
import { Camera } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionWave } from "@/components/ui/SectionWave";
import { GalleryGrid, type GalleryPhoto } from "@/components/sections/GalleryGrid";
import coupleSign from "@/public/images/gallery-couple-sign.jpg";
import reefSwim from "@/public/images/gallery-reef-swim.jpg";
import fleetColours from "@/public/images/gallery-fleet-colours.jpg";
import townStreet from "@/public/images/gallery-town-street.jpg";
import hotelDelivery from "@/public/images/gallery-hotel-delivery.jpg";
import beachPalms from "@/public/images/gallery-beach-palms.jpg";
import greenSign from "@/public/images/gallery-green-sign.jpg";

/**
 * What the island actually looks like.
 *
 * The page had one photograph of anybody enjoying themselves, and twenty-five
 * professional shots from the shoot were sitting in public/images unused. Every
 * other section argues the case — price, insurance, how booking works — and
 * none of them showed the thing being bought. This sits straight after the
 * fleet, so "choose your ride" is followed by "here is where you would take
 * it".
 *
 * Chosen for range rather than for the best single frame: a couple at the
 * landmark, clear water, the fleet's colours, a working town street, a hotel
 * delivery and the palms you park under. The shoot is heavy on the same pink
 * buggy in the same three places, and seven near-identical tiles would have
 * made the page look emptier, not fuller.
 *
 * The tile shapes are fixed here rather than derived, because the mosaic is a
 * composition: the couple anchors it at double size, the two wide tiles break
 * the rhythm, and the rest fill in around them.
 */
const SPANS = [
  "col-span-2 row-span-2",
  "col-span-2",
  "",
  "",
  "",
  "",
  "col-span-2",
];

const IMAGES = [coupleSign, reefSwim, fleetColours, townStreet, hotelDelivery, beachPalms, greenSign];

export function Gallery() {
  const t = useTranslations("gallery");
  const items = t.raw("items") as Array<{ alt: string; caption: string }>;

  const photos: GalleryPhoto[] = IMAGES.map((image, i) => ({
    image,
    alt: items[i]?.alt ?? "",
    caption: items[i]?.caption ?? "",
    span: SPANS[i] ?? "",
  }));

  return (
    <section id="gallery" className="pt-12 pb-20 sm:pt-16 sm:pb-24 bg-[#F5F0EB] relative overflow-hidden">
      {/* The same decorative wash the other cream sections use. */}
      <div
        className="absolute -top-10 left-1/4 w-80 h-80 rounded-full bg-[#7FB5B5]/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading
          eyebrow={t("badge")}
          title={t("title")}
          subtitle={t("subtitle")}
          icon={<Camera className="w-3.5 h-3.5" aria-hidden="true" />}
        />

        <GalleryGrid
          photos={photos}
          labels={{
            open: t("open"),
            close: t("close"),
            prev: t("prev"),
            next: t("next"),
            counter: t.raw("counter") as string,
          }}
        />
      </div>

      <SectionWave next="#1B4F72" />
    </section>
  );
}
