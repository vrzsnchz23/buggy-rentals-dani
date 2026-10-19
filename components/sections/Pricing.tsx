import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Check, Star, Snowflake } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import buggyPhoto from "@/public/images/pricing-buggy.jpg";
import compactPhoto from "@/public/images/compacto1.jpg";
import { VEHICLES } from "@/lib/utils";

/**
 * The two plan cards.
 *
 * Both cards used a 254x193 cut-out PNG blown up to 220px tall with
 * `scale-125`, which was the softest image on the site. They now show the same
 * photographs the rest of the site uses, cropped to a band so the price stays
 * the first thing read.
 */
export function Pricing() {
  const t = useTranslations("pricing");
  const locale = useLocale();

  const buggyPerks = t.raw("buggyPerks") as string[];
  const compactPerks = t.raw("compactPerks") as string[];

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-[#E8836A]/[0.07] blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#7FB5B5]/[0.07] blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        <SectionHeading eyebrow={t("badge")} title={t("title")} subtitle={t("subtitle")} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">

          {/* ── Buggy — the featured plan ── */}
          <div
            data-reveal
            className="on-dark rounded-3xl overflow-hidden bg-[#0d3251] relative flex flex-col shadow-xl shadow-[#1B4F72]/20"
          >
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none" aria-hidden="true" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "26px 26px" }} />

            <div className="relative h-48 sm:h-56 w-full">
              <Image
                src={buggyPhoto}
                alt={t("buggyAlt")}
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                quality={50}
                placeholder="blur"
                className="object-cover object-[50%_58%]"
              />
              {/* Fades the photo into the card body so the join is not a line.
                  Nothing but the solid-filled pill sits on this band, so the
                  wash only has to do the blend — it is concentrated in the
                  bottom third and clears completely by 62%, leaving the vehicle
                  itself untouched. */}
              <div
                className="absolute inset-0"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(to top, #0d3251 0%, rgba(13,50,81,0.9) 9%, rgba(13,50,81,0.55) 22%, rgba(13,50,81,0.22) 36%, rgba(13,50,81,0.05) 50%, rgba(13,50,81,0) 62%)",
                }}
              />
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-[#C05232] text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wide shadow-lg">
                <Star className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                {t("mostPopular")}
              </div>
            </div>

            <div className="p-7 sm:p-8 relative flex flex-col flex-1">
              <span className="text-[#A8D5D5] text-xs font-bold uppercase tracking-[0.18em]">
                {t("buggyKicker")}
              </span>

              <div className="flex items-end gap-3 mt-2 mb-1.5">
                <span className="font-display text-6xl sm:text-7xl font-black text-white leading-none tracking-[-0.04em]">${VEHICLES.buggy.price}</span>
                <span className="text-[#CBD5E1] text-sm pb-2 leading-tight">{t("perDayBuggy")}</span>
              </div>

              <p className="text-[#CBD5E1] text-sm mb-7">
                {t("depositBefore")}{" "}
                <span className="text-[#FBC7B7] font-bold">{t("depositAmount")}</span>
                {t("depositAfter")}
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {buggyPerks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5 text-white text-sm">
                    <span className="w-5 h-5 rounded-full bg-[#E8836A]/25 flex items-center justify-center shrink-0 mt-px">
                      <Check className="w-3 h-3 text-[#FBC7B7]" strokeWidth={3} aria-hidden="true" />
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}/book?type=buggy`}
                className="flex items-center justify-center bg-[#C05232] hover:bg-[#A8411F] text-white font-black text-base min-h-14 px-5 rounded-2xl transition-all hover:shadow-2xl hover:shadow-[#C05232]/40 hover:-translate-y-0.5 w-full text-center"
              >
                {t("bookBuggy")} →
              </Link>
              <p className="text-[#CBD5E1] text-xs text-center mt-3">{t("cardNote")}</p>
            </div>
          </div>

          {/* ── Compact — the alternative ── */}
          <div
            data-reveal
            style={{ transitionDelay: "90ms" }}
            className="rounded-3xl overflow-hidden bg-[#F5F0EB] relative flex flex-col border border-[#e0d8d0]"
          >
            <div className="relative h-48 sm:h-56 w-full">
              <Image
                src={compactPhoto}
                alt={t("compactAlt")}
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                quality={50}
                placeholder="blur"
                className="object-cover object-[50%_62%]"
              />
              <div
                className="absolute inset-0"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(to top, #F5F0EB 0%, rgba(245,240,235,0.9) 9%, rgba(245,240,235,0.55) 22%, rgba(245,240,235,0.22) 36%, rgba(245,240,235,0.05) 50%, rgba(245,240,235,0) 62%)",
                }}
              />
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white text-[#1B4F72] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide border border-[#1B4F72]/15 shadow-sm">
                <Snowflake className="w-3.5 h-3.5" aria-hidden="true" />
                {t("acComfort")}
              </div>
            </div>

            <div className="p-7 sm:p-8 relative flex flex-col flex-1">
              <span className="text-[#2F6060] text-xs font-bold uppercase tracking-[0.18em]">
                {t("compactKicker")}
              </span>

              <div className="flex items-end gap-3 mt-2 mb-1.5">
                <span className="font-display text-6xl sm:text-7xl font-black text-[#1B4F72] leading-none tracking-[-0.04em]">${VEHICLES.compact.price}</span>
                <span className="text-[#5A616B] text-sm pb-2 leading-tight">{t("perDayCompact")}</span>
              </div>

              <p className="text-[#5A616B] text-sm mb-7">
                {t("depositBefore")}{" "}
                <span className="text-[#A8411F] font-bold">{t("depositAmount")}</span>
                {t("depositAfter")}
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {compactPerks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5 text-[#404650] text-sm">
                    <span className="w-5 h-5 rounded-full bg-[#7FB5B5]/30 flex items-center justify-center shrink-0 mt-px">
                      <Check className="w-3 h-3 text-[#2F6060]" strokeWidth={3} aria-hidden="true" />
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}/book?type=compact`}
                className="flex items-center justify-center bg-[#1B4F72] hover:bg-[#163d5a] text-white font-black text-base min-h-14 px-5 rounded-2xl transition-all hover:shadow-xl hover:shadow-[#1B4F72]/25 hover:-translate-y-0.5 w-full text-center"
              >
                {t("bookCompact")} →
              </Link>
              <p className="text-[#5A616B] text-xs text-center mt-3">{t("cardNote")}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
