import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { MapPin, DollarSign, Clock, Car } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionWave } from "@/components/ui/SectionWave";
import bandPhoto from "@/public/images/cozumel-sign.jpg";

const icons = [MapPin, DollarSign, Clock, Car];

const accents = [
  { bg: "bg-[#1B4F72]/10", text: "text-[#1B4F72]", bar: "bg-[#1B4F72]" },
  { bg: "bg-[#C05232]/10", text: "text-[#C05232]", bar: "bg-[#C05232]" },
  { bg: "bg-[#7FB5B5]/20", text: "text-[#3F7878]", bar: "bg-[#3F7878]" },
  { bg: "bg-[#1B4F72]/10", text: "text-[#1B4F72]", bar: "bg-[#1B4F72]" },
];

export function WhyUs() {
  const t = useTranslations("whyUs");
  const locale = useLocale();
  const items = t.raw("items") as Array<{ title: string; desc: string }>;

  return (
    <section
      id="why-us"
      className="pt-20 pb-32 sm:pt-28 sm:pb-40 bg-[#F5F0EB] relative overflow-hidden"
    >
      {/* Decorative background circles */}
      <div className="absolute top-10 right-0 w-72 h-72 rounded-full bg-[#7FB5B5]/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-40 left-0 w-56 h-56 rounded-full bg-[#E8836A]/10 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        <SectionHeading eyebrow={t("badge")} title={t("title")} subtitle={t("subtitle")} />

        {/* Cards.
            The accent bar grows on hover instead of being a static top border —
            the card now responds to the pointer the way the hero responds to
            arrival, rather than just lifting. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {items.map((item, i) => {
            const Icon = icons[i];
            const a = accents[i];
            return (
              <div
                key={i}
                data-reveal
                style={{ transitionDelay: `${i * 80}ms` }}
                className="group relative bg-white rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-2xl hover:shadow-[#1B4F72]/10 transition-all duration-300 hover:-translate-y-2 border border-black/5 overflow-hidden"
              >
                {/* Track plus fill, rather than a bare floating bar: the track
                    reads as the card's top border, so the growing fill has
                    something to grow along instead of appearing as a tab stuck
                    to one rounded corner. */}
                <span className="absolute inset-x-0 top-0 h-[3px] bg-black/[0.06]" aria-hidden="true" />
                <span
                  className={`absolute top-0 left-0 h-[3px] w-1/3 ${a.bar} transition-all duration-500 group-hover:w-full`}
                  aria-hidden="true"
                />

                {/* The step number sits behind the icon as a watermark, which
                    gives the four cards a reading order without adding a
                    second row of visual noise. */}
                <span
                  className="absolute top-4 right-5 font-display font-black text-5xl text-[#1B4F72]/[0.06] leading-none select-none"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>

                <div className={`relative w-14 h-14 rounded-2xl ${a.bg} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
                  <Icon className={`w-6 h-6 ${a.text}`} aria-hidden="true" />
                </div>

                <h3 className="relative font-display font-black text-[#1B4F72] text-lg mb-2 leading-tight tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className="relative text-[#5A616B] text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* ── Closing band ──
            This used to be a bare centred button on an empty cream field, which
            was the flattest moment on the page. The same call to action now
            arrives on a photograph, so the section ends on the island rather
            than on whitespace. */}
        <div
          data-reveal
          data-reveal-style="zoom"
          className="relative mt-16 sm:mt-20 rounded-3xl overflow-hidden bg-[#0d2d42] shadow-2xl shadow-[#1B4F72]/15"
        >
          {/* ── Phones: the photo gets its own strip ──
              Behind the copy it was unreadable as an image: this panel is
              nearly square at 400px wide, the four lines of copy cover all of
              it, and the wash needed to carry them erased the photograph. A
              strip shows the shot properly and leaves the text on solid navy. */}
          <div className="relative h-44 sm:hidden">
            <Image
              src={bandPhoto}
              alt=""
              fill
              sizes="100vw"
              quality={50}
              placeholder="blur"
              className="object-cover object-[55%_42%]"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(8,28,44,0.1) 0%, rgba(8,28,44,0.25) 55%, rgba(8,28,44,0.85) 88%, #0d2d42 100%)",
              }}
              aria-hidden="true"
            />
          </div>

          {/* ── Tablet and up: full-bleed, copy in the lower half ──
              A short band with the copy centred over the whole frame needed a
              wash heavy enough to erase the photograph — 6:1 contrast and
              nothing left to look at. Giving the panel height and dropping the
              copy to the bottom is the hero's answer to the same problem: the
              top half stays nearly clear, the bottom carries the text. */}
          <div className="absolute inset-0 hidden sm:block">
            <Image
              src={bandPhoto}
              alt=""
              fill
              sizes="(max-width: 1152px) 100vw, 1100px"
              quality={50}
              placeholder="blur"
              className="object-cover object-[55%_38%]"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(8,28,44,0.95) 0%, rgba(8,28,44,0.93) 28%, rgba(8,28,44,0.72) 50%, rgba(8,28,44,0.22) 72%, rgba(8,28,44,0.06) 100%)",
              }}
              aria-hidden="true"
            />
          </div>

          <div className="on-dark relative px-6 pt-8 pb-12 sm:px-12 sm:pt-56 sm:pb-14 text-center">
            <h3 className="font-display font-black text-white text-3xl sm:text-4xl lg:text-5xl tracking-[-0.03em] leading-[1.05] text-balance">
              {t("bandTitle")}
            </h3>
            <p className="text-[#E2E8F0] text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed text-pretty">
              {t("bandDesc")}
            </p>
            <Link
              href={`/${locale}/book`}
              className="inline-flex items-center justify-center bg-[#C05232] hover:bg-[#A8411F] text-white font-black text-base sm:text-lg px-10 sm:px-12 py-4 rounded-full transition-all hover:shadow-2xl hover:shadow-[#C05232]/40 hover:-translate-y-1 mt-8"
            >
              {t("cta")} →
            </Link>
            <p className="text-white/75 text-xs sm:text-sm mt-4">{t("ctaNote")}</p>
          </div>
        </div>
      </div>

      {/* Into the navy fleet section below. */}
      <SectionWave next="#1B4F72" />
    </section>
  );
}
