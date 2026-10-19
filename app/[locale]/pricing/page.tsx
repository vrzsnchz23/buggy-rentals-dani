import { Navbar } from "@/components/Navbar";
import { VEHICLES } from "@/lib/utils";
import { Footer } from "@/components/Footer";
import { Pricing } from "@/components/sections/Pricing";
import { PriceCalculator } from "@/components/sections/PriceCalculator";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionWave } from "@/components/ui/SectionWave";
import { getLocale, getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Umbrella,
  Users,
  Waves,
  Car,
  Trophy,
  Check,
  Receipt,
  Settings2,
  Map,
  MessageCircle,
  ArrowRight,
  Wallet,
} from "lucide-react";
import heroPhoto from "@/public/images/pricing-hero.jpg";
import waterPhoto from "@/public/images/pricing-water.jpg";

const WHATSAPP = "529872743477";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = await getTranslations({ locale, namespace: "metadata" });
  return pageMetadata({ locale, path: "/pricing", title: m("pricingTitle"), description: m("pricingDescription") });
}

/** Icons for the comparison rows and the FAQ, in message-array order. */
const COMPARE_ICONS = [Umbrella, Users, Waves, Car];
const FAQ_ICONS = [Receipt, Settings2, Map, MessageCircle];

export default async function PricingPage() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "pricing" });

  const compareItems = t.raw("compareItems") as { label: string; note: string; price: string }[];
  const comparePerks = t.raw("comparePerks") as string[];
  const faqItems = t.raw("faqItems") as { q: string; a: string }[];
  const ctaChips = t.raw("ctaChips") as string[];

  /**
   * The headline "per person" figure, rounded UP so the copy around it stays
   * true: $99 split five ways is $19.80, which is "less than $20" — rounding
   * down would print $19 and claim a price nobody actually pays.
   */
  const perPerson = Math.ceil(VEHICLES.buggy.price / 5);

  const stats = [
    { value: `$${VEHICLES.buggy.price}`, label: t("statBuggy"), highlight: false },
    { value: `$${perPerson}`, label: t("statPerPerson"), highlight: true },
    { value: `$${VEHICLES.buggy.deposit}`, label: t("statDeposit"), highlight: false },
  ];

  return (
    <>
      <Navbar />
      <main className="bg-[#F5F0EB]">

        {/* ─── HERO ───
            This was a flat gradient with a 254px cut-out PNG stretched into a
            420px box, and an emoji inside the h1 (which a screen reader reads
            aloud as "face with cold sweat"). It now leads with a photograph,
            the same way the homepage does. */}
        <section className="on-dark relative min-h-[32rem] sm:min-h-[36rem] flex items-end sm:items-center overflow-hidden">
          {/* ── Crop, measured rather than guessed ──
              Pink pixels put the buggy at x 29-79% and y 59-79% of the frame,
              centred on (60%, 71%).

              This box used to be sm:w-[130%] anchored left, copied from the
              homepage hero — where the widening exists to push the subject OUT
              from behind the headline. Here it did the opposite: it shoved the
              buggy past the right edge of the screen, which is why the hero
              looked like a photo of a palm trunk.

              At w-full the maths works out so that nothing is cropped
              horizontally on a desktop (the short section makes height the
              constrained axis), so the whole width of the photo is visible and
              only the vertical offset matters. 80% lands the buggy below the
              skyline with road underneath it. On a phone it inverts — the full
              height shows and the horizontal offset is what counts, so 70%
              centres the buggy in the narrow window. */}
          <div className="absolute inset-0">
            <Image
              src={heroPhoto}
              alt={t("buggyAlt")}
              fill
              sizes="100vw"
              placeholder="blur"
              priority
              className="object-cover object-[70%_center] sm:object-[center_80%]"
            />
          </div>

          {/* Desktop carries the copy on a horizontal wash, phones on a
              vertical one, because the text sits lower there. */}
          <div className="absolute inset-0 bg-[#0d2d42]/15" aria-hidden="true" />
          <div
            className="absolute inset-0 hidden sm:block"
            aria-hidden="true"
            style={{ background: "linear-gradient(96deg, rgba(8,28,44,0.95) 0%, rgba(8,28,44,0.88) 30%, rgba(8,28,44,0.6) 46%, rgba(8,28,44,0.2) 62%, rgba(8,28,44,0) 76%)" }}
          />
          <div
            className="absolute inset-0 sm:hidden"
            aria-hidden="true"
            style={{ background: "linear-gradient(to top, rgba(8,28,44,0.96) 0%, rgba(8,28,44,0.93) 46%, rgba(8,28,44,0.72) 66%, rgba(8,28,44,0.28) 85%, rgba(8,28,44,0.06) 100%)" }}
          />

          <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14 sm:py-24">
            <div className="max-w-xl">
              <span className="hero-in inline-flex items-center gap-2 bg-[#E8836A]/20 text-[#FBC7B7] border border-[#E8836A]/40 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-semibold mb-5" style={{ "--delay": "80ms" } as React.CSSProperties}>
                <Wallet className="w-3.5 h-3.5" aria-hidden="true" />
                {t("heroBadge")}
              </span>

              <h1 className="font-display font-black text-white text-[2.75rem] sm:text-6xl lg:text-7xl leading-[0.98] tracking-[-0.03em] mb-5">
                <span className="hero-in block" style={{ "--delay": "200ms" } as React.CSSProperties}>
                  {t("heroTitleLead")}
                </span>
                <span className="hero-in block text-[#A8D5D5]" style={{ "--delay": "300ms" } as React.CSSProperties}>
                  {t("heroTitleAccent")}
                </span>
              </h1>

              <p className="hero-in text-gray-100 text-base sm:text-lg max-w-md leading-relaxed" style={{ "--delay": "400ms" } as React.CSSProperties}>
                {t("heroDesc")}
              </p>

              <div className="hero-in flex flex-wrap gap-3 mt-8" style={{ "--delay": "520ms" } as React.CSSProperties}>
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className={`rounded-2xl px-3.5 py-2.5 sm:px-5 sm:py-3.5 text-center ${
                      s.highlight
                        ? "bg-[#C05232] shadow-lg shadow-[#C05232]/40"
                        : "bg-white/12 border border-white/25 backdrop-blur-sm"
                    }`}
                  >
                    <div className="font-display text-xl sm:text-2xl font-black text-white leading-none">{s.value}</div>
                    <div className="text-[0.65rem] sm:text-xs font-semibold mt-1.5 text-white whitespace-nowrap">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Into the white plan cards below. */}
          <SectionWave next="#ffffff" />
        </section>

        {/* ─── PLAN CARDS ─── */}
        <Pricing />

        {/* ─── CALCULATOR · COMPARISON · FAQ ─── */}
        <div className="bg-[#F5F0EB] py-20 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">

            <PriceCalculator />

            {/* ─── COMPARISON ─── */}
            <div data-reveal className="rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-xl shadow-[#1B4F72]/10">

              {/* The alternatives */}
              <div
                className="on-dark relative p-7 sm:p-10 flex flex-col"
                style={{ background: "linear-gradient(160deg, #0d1f38 0%, #112844 100%)" }}
              >
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" aria-hidden="true" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
                <div className="relative flex-1 flex flex-col">
                  <div className="mb-7">
                    <span className="inline-block bg-white/10 border border-white/15 text-[#A8D5D5] font-bold text-[0.65rem] uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4">
                      {t("compareBadge")}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-black text-white tracking-[-0.02em] text-balance">
                      {t("compareTitle", { price: perPerson })}
                    </h3>
                    <p className="text-[#CBD5E1] text-sm mt-2">{t("compareSubtitle")}</p>
                  </div>

                  <ul className="flex-1 space-y-0">
                    {compareItems.map((item, i) => {
                      const Icon = COMPARE_ICONS[i];
                      return (
                        <li key={item.label} className="flex items-center gap-4 py-4 border-b border-white/10 last:border-0">
                          <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-[#A8D5D5]" aria-hidden="true" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-semibold text-sm leading-tight">{item.label}</div>
                            <div className="text-[#CBD5E1] text-xs mt-1">{item.note}</div>
                          </div>
                          <span className="font-display text-2xl font-black text-white/70 shrink-0 tabular-nums">
                            ${item.price}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  <p className="text-[#A8D5D5] text-[0.7rem] mt-6">{t("compareFootnote")}</p>
                </div>
              </div>

              {/* The buggy */}
              <div
                className="on-dark relative p-7 sm:p-10 flex flex-col items-center justify-center text-center overflow-hidden"
                style={{ background: "linear-gradient(145deg, #8E3418 0%, #A8411F 55%, #C05232 100%)" }}
              >
                <div className="absolute inset-0 opacity-[0.07] pointer-events-none" aria-hidden="true" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/15 blur-3xl pointer-events-none" aria-hidden="true" />

                <div className="relative">
                  <span className="inline-flex items-center gap-1.5 bg-black/25 text-white text-[0.65rem] font-black px-3 py-1.5 rounded-full mb-6 uppercase tracking-[0.2em]">
                    <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
                    {t("compareWinner")}
                  </span>

                  <div className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-2">
                    {t("compareYouPay")}
                  </div>

                  <div
                    className="font-display font-black text-white leading-none mb-2 tracking-[-0.04em]"
                    style={{ fontSize: "clamp(4.5rem, 14vw, 7.5rem)", textShadow: "0 8px 40px rgba(0,0,0,0.25)" }}
                  >
                    ${perPerson}
                  </div>

                  <div className="text-white text-sm mb-9">{t("comparePerPerson", { buggy: VEHICLES.buggy.price })}</div>

                  <ul className="space-y-3 text-left w-full max-w-xs mx-auto">
                    {comparePerks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center shrink-0 mt-px">
                          <Check className="w-3 h-3 text-white" strokeWidth={3} aria-hidden="true" />
                        </span>
                        <span className="text-white text-sm font-medium">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            {/* ─── FAQ ───
                Native <details> so it works without JavaScript, which is why it
                is not the homepage accordion. The emoji badges are gone; the
                icons match the set used everywhere else. */}
            <div data-reveal className="rounded-3xl overflow-hidden bg-white shadow-xl shadow-[#1B4F72]/5">
              <div className="px-7 sm:px-10 pt-12">
                <SectionHeading
                  eyebrow={t("faqBadge")}
                  title={t("faqTitle")}
                  subtitle={t("faqSubtitle")}
                />
              </div>

              <div className="px-5 sm:px-8 pb-10 space-y-3">
                {faqItems.map((faq, i) => {
                  const Icon = FAQ_ICONS[i];
                  const isDrivingGuide = i === 2;
                  return (
                    <details key={faq.q} className="group rounded-2xl border border-black/5 overflow-hidden bg-[#F5F0EB]">
                      <summary className="flex items-center gap-4 px-5 py-4 cursor-pointer list-none select-none min-h-14 hover:bg-[#EFE8E1] transition-colors">
                        <span className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-black/5">
                          <Icon className="w-4 h-4 text-[#1B4F72]" aria-hidden="true" />
                        </span>
                        <span className="font-display font-bold text-[#1B4F72] flex-1 text-sm sm:text-base leading-snug">
                          {faq.q}
                        </span>
                        {/* A plus that becomes a cross. Rotating 45deg is the
                            whole animation, so there is no second glyph. */}
                        <span
                          className="relative w-8 h-8 rounded-full bg-white border border-black/5 shrink-0 grid place-items-center text-[#C05232] text-xl font-black leading-none transition-transform duration-200 group-open:rotate-45"
                          aria-hidden="true"
                        >
                          +
                        </span>
                      </summary>
                      <div className="px-5 pb-5 pt-1">
                        <div className="pl-[3.5rem]">
                          <p className="text-[#5A616B] text-sm leading-relaxed">{faq.a}</p>
                          {isDrivingGuide && (
                            <Link
                              href={`/${locale}/driving-guide`}
                              className="mt-3 inline-flex items-center gap-1.5 font-bold text-[#A8411F] hover:text-[#8E3418] hover:underline text-sm min-h-11"
                            >
                              <Map className="w-4 h-4" aria-hidden="true" />
                              {t("faqDrivingGuide")}
                              <ArrowRight className="w-4 h-4" aria-hidden="true" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </details>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* ─── CLOSING CTA ───
            Four decorative emoji used to float in the corners here. The
            destination itself does that job better. */}
        <section className="on-dark relative overflow-hidden py-24 sm:py-28 text-center">
          <div className="absolute inset-0">
            <Image
              src={waterPhoto}
              alt=""
              fill
              sizes="100vw"
              quality={50}
              placeholder="blur"
              className="object-cover object-[50%_60%]"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{ background: "linear-gradient(to top, rgba(8,28,44,0.95) 0%, rgba(8,28,44,0.9) 45%, rgba(8,28,44,0.84) 100%)" }}
            />
          </div>

          <div className="relative max-w-2xl mx-auto px-4">
            <span data-reveal className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#A8D5D5] text-xs font-bold uppercase tracking-[0.18em] px-4 py-2 rounded-full mb-7">
              {t("ctaBadge")}
            </span>

            <h2 data-reveal style={{ transitionDelay: "90ms" }} className="font-display text-[2.1rem] sm:text-5xl font-black text-white mb-4 leading-[1.05] tracking-[-0.03em]">
              {t("ctaTitleLead")}
              <br />
              <span className="text-[#A8D5D5]">{t("ctaTitleAccent")}</span>
            </h2>

            <p data-reveal style={{ transitionDelay: "150ms" }} className="text-[#E2E8F0] text-base mb-10 max-w-md mx-auto leading-relaxed">
              {t("ctaDesc")}
            </p>

            <div data-reveal style={{ transitionDelay: "210ms" }} className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link
                href={`/${locale}/book`}
                className="inline-flex items-center justify-center gap-2 bg-[#C05232] hover:bg-[#A8411F] text-white font-black text-lg px-10 min-h-14 rounded-full transition-all hover:shadow-2xl hover:shadow-[#C05232]/40 hover:-translate-y-0.5"
              >
                {t("ctaPrimary")}
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t("ctaWhatsappPrefill"))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/12 hover:bg-white/20 text-white font-bold text-lg px-10 min-h-14 rounded-full transition-all border border-white/25 backdrop-blur-sm"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                {t("ctaSecondary")}
              </a>
            </div>

            <ul data-reveal style={{ transitionDelay: "270ms" }} className="flex flex-wrap justify-center gap-2.5">
              {ctaChips.map((chip) => (
                <li
                  key={chip}
                  className="inline-flex items-center gap-1.5 bg-white/12 border border-white/20 text-white text-xs font-medium px-4 py-2 rounded-full"
                >
                  <Check className="w-3.5 h-3.5 text-[#A8D5D5]" strokeWidth={3} aria-hidden="true" />
                  {chip}
                </li>
              ))}
            </ul>
          </div>

          {/* Into the navy footer below. */}
          <SectionWave next="#1B4F72" />
        </section>

      </main>
      <Footer />
    </>
  );
}
