import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Sunset } from "lucide-react";
import sunsetPhoto from "@/public/images/buggy4.jpg";

/**
 * The last thing on the page.
 *
 * Every photograph on this site was taken in the middle of the day. Nine
 * sections of bright turquoise is a lot of one note, and the page ended on a
 * FAQ — a list of objections — which is a strange last impression for
 * something sold on how the day feels.
 *
 * This is the one golden-hour frame from the shoot, and it closes the page on
 * the feeling rather than on the paperwork. The wash is warm rather than the
 * brand navy used everywhere else: navy over an orange sky turns to mud, and
 * the point of the photograph is the colour of the light.
 *
 * The numbers repeat what the pricing and booking sections already say, so
 * there is nothing here to keep in step with them beyond the price itself.
 */
export function SunsetCTA() {
  const t = useTranslations("sunset");
  const locale = useLocale();

  return (
    <section className="on-dark relative min-h-[24rem] sm:min-h-[30rem] flex items-center overflow-hidden">
      <div className="absolute inset-x-0 -top-[7%] h-[114%] photo-parallax" aria-hidden="true">
        <Image
          src={sunsetPhoto}
          alt=""
          fill
          sizes="100vw"
          placeholder="blur"
          className="object-cover object-[center_58%]"
        />
      </div>

      {/* Warm, bottom-weighted. Measured against the real pixels of this frame
          by scripts/check-overlay-contrast.mjs — change one, re-run the other. */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to top, rgba(32,15,10,0.94) 0%, rgba(32,15,10,0.88) 38%, rgba(32,15,10,0.76) 62%, rgba(32,15,10,0.62) 85%, rgba(32,15,10,0.54) 100%)",
        }}
      />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <span
          data-reveal
          className="inline-flex items-center gap-2 bg-white/12 border border-white/25 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#FFD9A8] mb-6"
        >
          <Sunset className="w-3.5 h-3.5" aria-hidden="true" />
          {t("badge")}
        </span>

        <h2
          data-reveal
          style={{ transitionDelay: "90ms" }}
          className="font-display font-black text-white text-[2.25rem] leading-[1.05] sm:text-5xl lg:text-[3.5rem] tracking-[-0.03em] text-balance"
        >
          {t("title")}
        </h2>

        <p
          data-reveal
          style={{ transitionDelay: "170ms" }}
          className="text-[#F3E7DD] text-base sm:text-lg max-w-xl mx-auto mt-5 leading-relaxed text-pretty"
        >
          {t("subtitle")}
        </p>

        <div data-reveal style={{ transitionDelay: "250ms" }} className="mt-9">
          <Link
            href={`/${locale}/book`}
            className="inline-flex items-center gap-2 bg-[#C05232] hover:bg-[#A8411F] text-white font-black min-h-14 px-8 rounded-2xl transition-all hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-0.5"
          >
            {t("cta")}
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>

          <p className="text-[#F3E7DD] text-xs sm:text-sm mt-4">{t("note")}</p>
        </div>
      </div>
    </section>
  );
}
