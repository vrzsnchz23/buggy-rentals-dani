import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionWave } from "@/components/ui/SectionWave";
import { getLocale, getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  Map as MapIcon,
  Building2,
  Compass,
  Zap,
  Octagon,
  TrafficCone,
  RotateCw,
  Bike,
  ShieldAlert,
  CircleParking,
  Handshake,
  Fuel,
  Gauge,
  HeartHandshake,
  TriangleAlert,
  Mountain,
  Ship,
  Clock,
  CalendarDays,
  Trophy,
  Umbrella,
  Landmark,
  Martini,
  Cookie,
  Waves,
  SignalZero,
  PawPrint,
  Pin,
  Check,
  ArrowRight,
} from "lucide-react";
import coastPhoto from "@/public/images/guide-east-coast.jpg";
import aerialPhoto from "@/public/images/guide-road.jpg";
import gridPhoto from "@/public/images/guide-street-grid.jpg";
import trafficPhoto from "@/public/images/guide-street-traffic.jpg";
import clubPhoto from "@/public/images/guide-beach-club.jpg";
import waterPhoto from "@/public/images/guide-reef-water.jpg";
import ctaPhoto from "@/public/images/guide-cta.jpg";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = await getTranslations({ locale, namespace: "metadata" });
  return pageMetadata({
    locale,
    path: "/driving-guide",
    title: m("drivingGuideTitle"),
    description: m("drivingGuideDescription"),
  });
}

/* ── Ink ──
   Two of this page's colours were decorative values used as text. #7FB5B5 as
   body copy measures 2.29:1 on white and #C05232 drops to 4.13:1 on cream, so
   both are replaced by the ink-on-light pair already defined in globals.css.
   White on a #7FB5B5 *surface* is worse still at 2.29:1 — below even the 3:1
   large-text floor — so the teal card header moves to #3F7878, where white
   reads at 5.04:1 and the colour is still recognisably teal. */
const TEAL_INK = "text-[#2F6060]";
const CORAL_INK = "text-[#A8411F]";

/** The seven module anchors, in order. Used by the syllabus bar and the
 *  headers, so a reordering cannot desynchronise the two. */
const MODULES = ["mod-1", "mod-2", "mod-3", "mod-4", "mod-5", "mod-6", "mod-7"] as const;

export default async function DrivingGuidePage() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "drivingGuide" });

  const heroStats = t.raw("heroStats") as { label: string; value: string }[];
  const moduleNames = t.raw("modules") as string[];
  const rules = t.raw("m2.rules") as { title: string; body: string; verdict: string }[];
  const cruiseChips = t.raw("m5.cruiseChips") as string[];
  const bananaPerks = t.raw("m6.bananaPerks") as string[];
  const sanFranPerks = t.raw("m6.sanFranPerks") as string[];

  /** `<b>` in a message becomes a <strong> that picks up the surface's ink. */
  const light = { b: (c: React.ReactNode) => <strong className="font-bold text-[#1B4F72]">{c}</strong> };
  const dark = { b: (c: React.ReactNode) => <strong className="font-bold text-white">{c}</strong> };

  const RULE_ICONS = [Octagon, RotateCw, Bike];
  const CHIP_ICONS = [Clock, CalendarDays];

  return (
    <>
      <Navbar />
      <main className="bg-[#F5F0EB]">

        {/* ─── HERO ───
            Was a flat navy gradient with centred copy and an emoji mortarboard
            in the badge. It now opens on a photograph of an actual Cozumel
            road, with the copy on a horizontal wash — the same construction as
            the homepage and pricing heroes, so the guide reads as part of the
            site rather than a microsite. */}
        <section className="on-dark relative min-h-[32rem] sm:min-h-[34rem] flex items-end sm:items-center overflow-hidden">
          {/* ── Why this photograph and not the aerial ──
              The aerial of the Transversal was here first and had to go, for a
              reason that is geometric rather than aesthetic. Its subject sits
              at 37% of the frame width; measured in the live DOM at the user's
              1900px window, the hero is 1885x592 and the copy column runs
              x 398-974 — so the buggy landed underneath the headline, and the
              remaining 55% of the frame was bare asphalt.

              Normally the fix is the homepage hero's trick: widen the image box
              and anchor it left, which scales the photo up and pushes the
              subject out past the copy. That needs the subject at 37% to reach
              x>974, which works out to a box 1.6x the section — a 1.6x upscale
              of a 1920-wide file. Visibly soft. The source simply has no
              horizontal headroom for an 1885px hero.

              This frame is 2400 wide and composed the other way round: open
              sea and shoreline fill the copy column, and the vehicle sits
              entirely to the right of it. Nothing has to be zoomed. The aerial
              moved to module 7, where "one straight road, no signal" is
              exactly what it shows. */}
          <div className="absolute inset-0">
            <Image
              src={coastPhoto}
              alt={t("heroAlt")}
              fill
              sizes="100vw"
              placeholder="blur"
              priority
              className="object-cover object-[72%_center] sm:object-center"
            />
          </div>

          <div className="absolute inset-0 bg-[#0d2d42]/15" aria-hidden="true" />
          <div
            className="absolute inset-0 hidden sm:block"
            aria-hidden="true"
            /* Ramp shifted right: the copy column's far edge sat at 0.52
               total alpha, which measured 4.26:1 over this brighter frame. */
            style={{ background: "linear-gradient(96deg, rgba(8,28,44,0.95) 0%, rgba(8,28,44,0.9) 34%, rgba(8,28,44,0.7) 50%, rgba(8,28,44,0.3) 64%, rgba(8,28,44,0) 78%)" }}
          />
          {/* A phone shows this frame almost edge to edge, and row sampling
              puts its 95th-percentile grey at 174-244 the whole way down — sea,
              sky and pale road, needing 0.42 at the bottom rising to 0.58 at
              the top. There is no dark band to hand the copy, so this wash is
              close to flat and heavier than the one the aerial needed. */}
          <div
            className="absolute inset-0 sm:hidden"
            aria-hidden="true"
            style={{ background: "linear-gradient(to top, rgba(8,28,44,0.54) 0%, rgba(8,28,44,0.58) 40%, rgba(8,28,44,0.62) 65%, rgba(8,28,44,0.7) 100%)" }}
          />

          <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:py-24">
            <div className="max-w-xl">
              <span
                className="hero-in inline-flex items-center gap-2 bg-[#E8836A]/20 text-[#FBC7B7] border border-[#E8836A]/40 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] mb-5"
                style={{ "--delay": "80ms" } as React.CSSProperties}
              >
                <GraduationCap className="w-4 h-4" aria-hidden="true" />
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

              <p
                className="hero-in text-gray-100 text-base sm:text-lg max-w-md leading-relaxed"
                style={{ "--delay": "400ms" } as React.CSSProperties}
              >
                {t("heroDesc")}
              </p>

              {/* The course card was a three-up grid of white/40 labels on
                  navy — 2.77:1. Same information, as the hero chips the other
                  pages use. */}
              <dl
                className="hero-in flex flex-wrap gap-3 mt-8"
                style={{ "--delay": "520ms" } as React.CSSProperties}
              >
                {heroStats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl bg-white/12 border border-white/25 backdrop-blur-sm px-3.5 py-2.5 sm:px-5 sm:py-3"
                  >
                    <dt className="text-[0.6rem] sm:text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#A8D5D5]">
                      {s.label}
                    </dt>
                    <dd className="text-white font-bold text-sm sm:text-base mt-1 leading-tight">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <SectionWave next="#C05232" />
        </section>

        {/* ─── SYLLABUS ───
            Seven module names that were plain <span>s sitting above seven
            sections that already had ids. They are links now, and the bar
            sticks under the navbar, which is what a 4,000-word guide actually
            needs. */}
        <nav
          aria-label={t("jumpToModule")}
          className="sticky top-16 z-40 bg-[#C05232] shadow-md shadow-[#1B4F72]/15"
        >
          <ul className="flex items-center gap-1 max-w-6xl mx-auto px-2 sm:px-4 overflow-x-auto scrollbar-none">
            {moduleNames.map((name, i) => (
              <li key={MODULES[i]} className="shrink-0">
                <a
                  href={`#${MODULES[i]}`}
                  className="flex items-center gap-2 px-3 py-3.5 text-white text-sm font-bold whitespace-nowrap rounded-xl hover:bg-white/15 focus-visible:bg-white/15 transition-colors"
                >
                  {/* Solid white, not white/70. Only full white clears 4.5:1
                      on #C05232 (4.67:1); at 70% it measured 3.09:1, and at
                      14px/900 it is not large text, so there is no 3:1 floor to
                      fall back on. The hierarchy comes from the size instead. */}
                  <span className="font-display font-black text-white text-xs tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-20 sm:space-y-28">

          {/* ─── MODULE 1 · THE GRID ─── */}
          <section id="mod-1" className="scroll-mt-28">
            <ModuleHeader
              number={1}
              icon={MapIcon}
              label={t("moduleLabel", { number: "01" })}
              title={t("m1.title")}
              subtitle={t("m1.subtitle")}
            />

            <div className="grid md:grid-cols-2 gap-5 mt-10">
              <GridCard
                surface="bg-[#1B4F72]"
                blobs={<><div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-white/5" /><div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-[#E8836A]/20 blur-xl" /></>}
                tag={t("m1.avenidasTag")}
                icon={Building2}
                title={t("m1.avenidasTitle")}
                body={t.rich("m1.avenidasBody", light)}
                ruleIcon={Zap}
                rule={t("m1.avenidasRule")}
              />
              <GridCard
                surface="bg-[#3F7878]"
                blobs={<><div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-white/10" /><div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-[#1B4F72]/25 blur-xl" /></>}
                tag={t("m1.callesTag")}
                icon={Compass}
                title={t("m1.callesTitle")}
                body={t.rich("m1.callesBody", light)}
                ruleIcon={Octagon}
                rule={t("m1.callesRule")}
                delay="90ms"
              />
            </div>

            <Note title={t("m1.noteTitle")} label={t("noteLabel")}>
              {t.rich("m1.noteBody", light)}
            </Note>

            <Figure photo={gridPhoto} alt={t("m1.photoAlt")} caption={t("m1.photoCaption")} position="object-[center_62%]" />
          </section>

          {/* ─── MODULE 2 · ROAD RULES ─── */}
          <section id="mod-2" className="scroll-mt-28">
            <ModuleHeader
              number={2}
              icon={TrafficCone}
              label={t("moduleLabel", { number: "02" })}
              title={t("m2.title")}
              subtitle={t("m2.subtitle")}
            />

            <div className="mt-10 space-y-4">
              {rules.map((rule, i) => {
                const Icon = RULE_ICONS[i];
                const tone = ["coral", "teal", "navy"][i] as "coral" | "teal" | "navy";
                return (
                  <RuleCard
                    key={rule.title}
                    tone={tone}
                    icon={Icon}
                    title={rule.title}
                    body={rule.body}
                    verdict={rule.verdict}
                    delay={`${i * 80}ms`}
                  />
                );
              })}
            </div>

            <Figure photo={trafficPhoto} alt={t("m2.photoAlt")} caption={t("m2.photoCaption")} position="object-[center_58%]" />
          </section>

          {/* ─── MODULE 3 · NO TICKETS ─── */}
          <section id="mod-3" className="scroll-mt-28">
            <ModuleHeader
              number={3}
              icon={ShieldAlert}
              label={t("moduleLabel", { number: "03" })}
              title={t("m3.title")}
              subtitle={t("m3.subtitle")}
            />

            <div className="mt-10 grid md:grid-cols-2 gap-5">
              <article data-reveal className="bg-white rounded-3xl p-7 shadow-sm shadow-[#1B4F72]/5 border-t-4 border-[#C05232]">
                <span className="w-11 h-11 rounded-2xl bg-[#C05232]/10 flex items-center justify-center mb-4">
                  <CircleParking className={`w-5 h-5 ${CORAL_INK}`} aria-hidden="true" />
                </span>
                <h3 className="font-display font-black text-[#1B4F72] text-xl mb-2 tracking-[-0.01em]">{t("m3.parkTitle")}</h3>
                <p className="text-[#404650] text-sm leading-relaxed">{t.rich("m3.parkBody", light)}</p>
              </article>

              <article data-reveal style={{ transitionDelay: "90ms" }} className="bg-white rounded-3xl p-7 shadow-sm shadow-[#1B4F72]/5 border-t-4 border-[#3F7878]">
                <span className="w-11 h-11 rounded-2xl bg-[#7FB5B5]/20 flex items-center justify-center mb-4">
                  <Handshake className={`w-5 h-5 ${TEAL_INK}`} aria-hidden="true" />
                </span>
                <h3 className="font-display font-black text-[#1B4F72] text-xl mb-2 tracking-[-0.01em]">{t("m3.pulledOverTitle")}</h3>
                <p className="text-[#404650] text-sm leading-relaxed">{t.rich("m3.pulledOverBody", light)}</p>
                {/* The one phrase on this page a reader may need to say out
                    loud, so it gets to look like a thing to read from. */}
                <p lang="es" className="my-3 rounded-2xl bg-[#F5F0EB] border-l-4 border-[#3F7878] px-4 py-3 font-display font-black text-[#1B4F72] text-base leading-snug">
                  “{t("m3.pulledOverQuote")}”
                </p>
                <p className="text-[#404650] text-sm leading-relaxed">{t.rich("m3.pulledOverAfter", light)}</p>
              </article>
            </div>

            <Note variant="warning" label={t("warningLabel")}>
              {t.rich("m3.noteBody", light)}
            </Note>
          </section>

          {/* ─── MODULE 4 · GAS ─── */}
          <section id="mod-4" className="scroll-mt-28">
            <ModuleHeader
              number={4}
              icon={Fuel}
              label={t("moduleLabel", { number: "04" })}
              title={t("m4.title")}
              subtitle={t("m4.subtitle")}
            />

            <div
              data-reveal
              className="on-dark mt-10 rounded-3xl p-7 sm:p-9 relative overflow-hidden shadow-xl shadow-[#1B4F72]/15"
              style={{ background: "linear-gradient(160deg, #1B4F72 0%, #0f2d42 100%)" }}
            >
              <div className="absolute inset-0 opacity-[0.06] pointer-events-none" aria-hidden="true" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

              <h3 className="relative font-display font-black text-white text-xl sm:text-2xl mb-7 flex items-center gap-3 tracking-[-0.01em]">
                <span className="w-10 h-10 rounded-2xl bg-[#C05232] flex items-center justify-center shrink-0">
                  <TriangleAlert className="w-5 h-5 text-white" aria-hidden="true" />
                </span>
                {t("m4.protocolTitle")}
              </h3>

              <ol className="grid md:grid-cols-2 gap-5 relative">
                {/* white/10 put the 14px body copy at exactly 4.50:1 — the AA
                    threshold to two decimals. 8% buys 4.75:1. */}
                <li className="bg-white/[0.08] border border-white/15 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-display text-3xl font-black text-[#FBC7B7] leading-none tabular-nums">01</span>
                    <Gauge className="w-5 h-5 text-[#A8D5D5]" aria-hidden="true" />
                  </div>
                  <h4 className="font-bold text-white mb-1.5">{t("m4.step1Title")}</h4>
                  <p className="text-[#CBD5E1] text-sm leading-relaxed">{t.rich("m4.step1Body", dark)}</p>
                </li>
                <li className="bg-[#C05232]/25 border border-[#E8836A]/40 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-display text-3xl font-black text-[#FBC7B7] leading-none tabular-nums">02</span>
                    <HeartHandshake className="w-5 h-5 text-[#FBC7B7]" aria-hidden="true" />
                  </div>
                  <h4 className="font-bold text-white mb-1.5">{t("m4.step2Title")}</h4>
                  <p className="text-[#CBD5E1] text-sm leading-relaxed">{t.rich("m4.step2Body", dark)}</p>
                </li>
              </ol>
            </div>
          </section>

          {/* ─── MODULE 5 · HAZARDS ─── */}
          <section id="mod-5" className="scroll-mt-28">
            <ModuleHeader
              number={5}
              icon={TriangleAlert}
              label={t("moduleLabel", { number: "05" })}
              title={t("m5.title")}
              subtitle={t("m5.subtitle")}
            />

            <div className="mt-10 space-y-4">
              <article data-reveal className="bg-white rounded-3xl p-7 shadow-sm shadow-[#1B4F72]/5 flex gap-5">
                <span className="shrink-0 w-14 h-14 rounded-2xl bg-[#C05232] flex items-center justify-center">
                  <Mountain className="w-6 h-6 text-white" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display font-black text-[#1B4F72] text-lg sm:text-xl mb-1.5 tracking-[-0.01em]">{t("m5.topesTitle")}</h3>
                  <p className="text-[#404650] text-sm leading-relaxed">{t.rich("m5.topesBody", light)}</p>
                </div>
              </article>

              <article data-reveal style={{ transitionDelay: "90ms" }} className="bg-white rounded-3xl p-7 shadow-sm shadow-[#1B4F72]/5 flex gap-5">
                <span className="shrink-0 w-14 h-14 rounded-2xl bg-[#1B4F72] flex items-center justify-center">
                  <Ship className="w-6 h-6 text-white" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display font-black text-[#1B4F72] text-lg sm:text-xl mb-1.5 tracking-[-0.01em]">{t("m5.cruiseTitle")}</h3>
                  <p className="text-[#404650] text-sm leading-relaxed">{t("m5.cruiseBody")}</p>
                  <ul className="flex flex-wrap gap-2.5 mt-4">
                    {cruiseChips.map((chip, i) => {
                      const Icon = CHIP_ICONS[i];
                      return (
                        <li key={chip} className={`flex items-center gap-2 bg-[#7FB5B5]/20 ${TEAL_INK} font-bold text-xs px-3 py-2 rounded-full`}>
                          <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                          {chip}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </article>
            </div>
          </section>

          {/* ─── MODULE 6 · VIP SPOTS ─── */}
          <section id="mod-6" className="scroll-mt-28">
            <ModuleHeader
              number={6}
              icon={Trophy}
              label={t("moduleLabel", { number: "06" })}
              title={t("m6.title")}
              subtitle={t("m6.subtitle")}
            />

            <h3 data-reveal className="font-display font-black text-[#1B4F72] text-2xl mt-10 mb-5 flex items-center gap-2.5 tracking-[-0.02em]">
              <Umbrella className={`w-6 h-6 ${CORAL_INK}`} aria-hidden="true" />
              {t("m6.beachClubsTitle")}
            </h3>

            <div className="grid md:grid-cols-2 gap-5">
              <ClubCard
                name={t("m6.bananaName")}
                badge={t("m6.bananaBadge")}
                badgeClass="bg-[#C05232] text-white"
                price={t("m6.bananaPrice")}
                was={t("m6.bananaWas")}
                unit={t("m6.bananaUnit")}
                priceClass={CORAL_INK}
                perks={bananaPerks}
                note={t("m6.bananaNote")}
              />
              <ClubCard
                name={t("m6.sanFranName")}
                badge={t("m6.sanFranBadge")}
                badgeClass="bg-[#3F7878] text-white"
                price={t("m6.sanFranPrice")}
                unit={t("m6.sanFranUnit")}
                priceClass={TEAL_INK}
                perks={sanFranPerks}
                note={t("m6.sanFranNote")}
                delay="90ms"
              />
            </div>

            <Figure photo={clubPhoto} alt={t("m6.clubPhotoAlt")} caption={t("m6.clubPhotoCaption")} position="object-[center_55%]" />

            <h3 data-reveal className="font-display font-black text-[#1B4F72] text-2xl mt-14 mb-5 flex items-center gap-2.5 tracking-[-0.02em]">
              <Landmark className={`w-6 h-6 ${TEAL_INK}`} aria-hidden="true" />
              {t("m6.culturalTitle")}
            </h3>

            <div className="grid md:grid-cols-2 gap-5">
              <CulturalCard icon={Martini} name={t("m6.haciendaName")} kicker={t("m6.haciendaKicker")} body={t("m6.haciendaBody")} />
              <CulturalCard icon={Cookie} name={t("m6.saboresName")} kicker={t("m6.saboresKicker")} body={t("m6.saboresBody")} delay="90ms" />
            </div>

            <Figure photo={waterPhoto} alt={t("m6.waterPhotoAlt")} caption={t("m6.waterPhotoCaption")} position="object-[center_55%]" />
          </section>

          {/* ─── MODULE 7 · THE WILD EAST ─── */}
          <section id="mod-7" className="scroll-mt-28">
            <ModuleHeader
              number={7}
              icon={Waves}
              label={t("moduleLabel", { number: "07" })}
              title={t("m7.title")}
              subtitle={t("m7.subtitle")}
            />

            <div data-reveal className="mt-10 bg-white rounded-3xl p-7 sm:p-9 shadow-sm shadow-[#1B4F72]/5">
              <div className="grid md:grid-cols-3 gap-7 sm:gap-8">
                <EastCard icon={SignalZero} iconBg="bg-[#1B4F72]/10" iconInk="text-[#1B4F72]" title={t("m7.signalTitle")}>
                  {t.rich("m7.signalBody", light)}
                </EastCard>
                <EastCard icon={Waves} iconBg="bg-[#C05232]/10" iconInk={CORAL_INK} title={t("m7.swimTitle")}>
                  {t.rich("m7.swimBody", light)}
                </EastCard>
                <EastCard icon={PawPrint} iconBg="bg-[#7FB5B5]/20" iconInk={TEAL_INK} title={t("m7.wildlifeTitle")}>
                  {t.rich("m7.wildlifeBody", light)}
                </EastCard>
              </div>
            </div>

            <Note label={t("noteLabel")}>{t("m7.noteBody")}</Note>

            <Figure photo={aerialPhoto} alt={t("m7.photoAlt")} caption={t("m7.photoCaption")} position="object-[center_55%]" />
          </section>
        </div>

        {/* ─── FINAL GRADE ───
            The closing panel was flat navy with a mortarboard emoji at 48px.
            Same idea on a photograph, which is how every other page on the
            site closes. */}
        <section className="on-dark relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={ctaPhoto}
              alt={t("ctaAlt")}
              fill
              sizes="100vw"
              quality={50}
              placeholder="blur"
              className="object-cover object-[center_55%]"
            />
          </div>
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{ background: "linear-gradient(to top, rgba(8,28,44,0.96) 0%, rgba(8,28,44,0.9) 40%, rgba(8,28,44,0.82) 70%, rgba(8,28,44,0.76) 100%)" }}
          />

          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
            <span data-reveal className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-[#A8D5D5] font-bold text-[0.7rem] sm:text-xs uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-5">
              <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
              {t("ctaBadge")}
            </span>

            <h2
              data-reveal
              style={{ transitionDelay: "90ms" }}
              className="font-display font-black text-white text-[2.25rem] leading-[1.05] sm:text-5xl tracking-[-0.03em] text-balance"
            >
              {t("ctaTitle")}
            </h2>

            <p
              data-reveal
              style={{ transitionDelay: "180ms" }}
              className="text-[#CBD5E1] text-base sm:text-lg max-w-lg mx-auto mt-5 leading-relaxed text-pretty"
            >
              {t("ctaDesc")}
            </p>

            {/* Was hardcoded to /en/book, which sent every Spanish reader to
                the English booking flow. */}
            <Link
              data-reveal
              style={{ transitionDelay: "260ms" }}
              href={`/${locale}/book`}
              className="inline-flex items-center gap-2 mt-9 bg-[#C05232] hover:bg-[#A8411F] text-white font-black text-base sm:text-lg min-h-14 px-8 rounded-2xl transition-all hover:shadow-2xl hover:shadow-[#C05232]/40 hover:-translate-y-0.5"
            >
              {t("ctaButton")}
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/* ── Reusable parts ───────────────────────────────────────────────────────── */

type Icon = React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false"; strokeWidth?: number }>;

/**
 * A module's opening block.
 *
 * Deliberately left-aligned rather than reusing <SectionHeading/>: this page is
 * a long read with seven numbered chapters, and a centred header seven times
 * over loses the sense of progress. It borrows the shared header's type scale,
 * eyebrow pill and 3px rule so it still belongs to the same family.
 */
function ModuleHeader({
  number,
  icon: Glyph,
  label,
  title,
  subtitle,
}: {
  number: number;
  icon: Icon;
  label: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-5 sm:gap-6">
      <div
        data-reveal
        className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-[#1B4F72]/25"
        style={{ background: "linear-gradient(135deg, #1B4F72 0%, #0f2d42 100%)" }}
      >
        <Glyph className="w-6 h-6 sm:w-7 sm:h-7 text-[#A8D5D5]" aria-hidden="true" />
        {/* 3.47:1 as white/50 before; #A8D5D5 reads 8.91:1 on this gradient. */}
        <span className="font-display text-[0.6rem] font-black tracking-[0.2em] text-[#A8D5D5] tabular-nums">
          {String(number).padStart(2, "0")}
        </span>
      </div>

      <div className="min-w-0 pt-0.5">
        <span
          data-reveal
          className="inline-block bg-[#C05232]/12 text-[#9B3A1A] font-bold text-[0.7rem] uppercase tracking-[0.18em] px-3 py-1 rounded-full mb-3"
        >
          {label}
        </span>
        <h2
          data-reveal
          style={{ transitionDelay: "90ms" }}
          className="font-display font-black text-[#1B4F72] text-[1.875rem] leading-[1.05] sm:text-4xl lg:text-[2.75rem] tracking-[-0.03em] text-balance"
        >
          {title}
        </h2>
        <span
          data-reveal
          aria-hidden="true"
          style={{ transitionDelay: "160ms" }}
          className="block w-14 h-[3px] rounded-full bg-[#C05232]/35 mt-4"
        />
        {/* text-gray-400 was 2.24:1 on cream. */}
        <p
          data-reveal
          style={{ transitionDelay: "200ms" }}
          className="text-[#5A616B] text-sm sm:text-base mt-4 leading-relaxed max-w-2xl text-pretty"
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/** Module 1's two halves of the street grid: a coloured head, a white body. */
function GridCard({
  surface,
  blobs,
  tag,
  icon: Glyph,
  title,
  body,
  ruleIcon: RuleGlyph,
  rule,
  delay,
}: {
  surface: string;
  blobs: React.ReactNode;
  tag: string;
  icon: Icon;
  title: string;
  body: React.ReactNode;
  ruleIcon: Icon;
  rule: string;
  delay?: string;
}) {
  return (
    <article
      data-reveal
      style={delay ? { transitionDelay: delay } : undefined}
      className="rounded-3xl overflow-hidden shadow-sm shadow-[#1B4F72]/5 flex flex-col"
    >
      <div className={`on-dark ${surface} px-6 pt-6 pb-7 relative overflow-hidden`}>
        {blobs}
        <div className="relative">
          {/* A dark pill, not bg-white/20. Lightening the already-light teal
              head put white text at 3.41:1; darkening it reads 7.05:1 there and
              11.05:1 on the navy head. */}
          <span className="inline-block bg-black/20 text-white text-[0.65rem] font-black uppercase tracking-[0.18em] px-3 py-1 rounded-full mb-4">
            {tag}
          </span>
          <Glyph className="w-8 h-8 text-white mb-3" aria-hidden="true" strokeWidth={1.75} />
          <h3 className="font-display text-white font-black text-xl leading-tight tracking-[-0.01em]">{title}</h3>
        </div>
      </div>

      <div className="bg-white px-6 py-5 flex-1 flex flex-col">
        <p className="text-[#404650] text-sm leading-relaxed mb-4 flex-1">{body}</p>
        <div className="flex items-center gap-2.5 bg-[#C05232]/10 rounded-2xl px-4 py-3">
          <RuleGlyph className={`w-4 h-4 shrink-0 ${CORAL_INK}`} aria-hidden="true" />
          <span className={`${CORAL_INK} font-bold text-sm leading-snug`}>{rule}</span>
        </div>
      </div>
    </article>
  );
}

function RuleCard({
  tone,
  icon: Glyph,
  title,
  body,
  verdict,
  delay,
}: {
  tone: "coral" | "teal" | "navy";
  icon: Icon;
  title: string;
  body: string;
  verdict: string;
  delay?: string;
}) {
  const iconBg = { coral: "bg-[#C05232]", teal: "bg-[#3F7878]", navy: "bg-[#1B4F72]" }[tone];
  const badge = {
    coral: `bg-[#C05232]/10 ${CORAL_INK}`,
    teal: `bg-[#7FB5B5]/20 ${TEAL_INK}`,
    navy: "bg-[#1B4F72]/10 text-[#1B4F72]",
  }[tone];

  return (
    <article
      data-reveal
      style={delay ? { transitionDelay: delay } : undefined}
      className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm shadow-[#1B4F72]/5 flex gap-5 items-start hover:shadow-md transition-shadow"
    >
      <span className={`shrink-0 w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center`}>
        <Glyph className="w-6 h-6 text-white" aria-hidden="true" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2 mb-2">
          <h3 className="font-display font-black text-[#1B4F72] text-lg sm:text-xl leading-tight tracking-[-0.01em]">{title}</h3>
          <span className={`shrink-0 text-[0.65rem] font-black uppercase tracking-[0.14em] px-2.5 py-1 rounded-full ${badge}`}>
            {verdict}
          </span>
        </div>
        {/* text-gray-500 passed on white at 4.83:1, but #404650 matches the
            body copy used in the rest of this page. */}
        <p className="text-[#404650] text-sm leading-relaxed">{body}</p>
      </div>
    </article>
  );
}

function ClubCard({
  name,
  badge,
  badgeClass,
  price,
  was,
  unit,
  priceClass,
  perks,
  note,
  delay,
}: {
  name: string;
  badge: string;
  badgeClass: string;
  price: string;
  was?: string;
  unit: string;
  priceClass: string;
  perks: string[];
  note: string;
  delay?: string;
}) {
  return (
    <article
      data-reveal
      style={delay ? { transitionDelay: delay } : undefined}
      className="bg-white rounded-3xl overflow-hidden shadow-sm shadow-[#1B4F72]/5 flex flex-col"
    >
      <div className="bg-[#1B4F72] px-6 py-4 flex items-center justify-between gap-3">
        <h4 className="font-display font-black text-white text-lg leading-tight">{name}</h4>
        <span className={`shrink-0 text-[0.65rem] font-black uppercase tracking-[0.14em] px-3 py-1 rounded-full ${badgeClass}`}>
          {badge}
        </span>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <p className="flex items-baseline flex-wrap gap-x-2 gap-y-1 mb-4">
          <span className={`font-display text-4xl font-black leading-none ${priceClass}`}>{price}</span>
          {was && <span className="text-[#5A616B] text-sm line-through">{was}</span>}
          <span className="text-[#5A616B] text-sm">{unit}</span>
        </p>

        <ul className="space-y-2 text-sm flex-1">
          {perks.map((perk) => (
            <li key={perk} className="flex items-start gap-2.5 text-[#404650]">
              <span className="w-5 h-5 rounded-full bg-[#7FB5B5]/25 flex items-center justify-center shrink-0 mt-px">
                <Check className={`w-3 h-3 ${TEAL_INK}`} strokeWidth={3} aria-hidden="true" />
              </span>
              {perk}
            </li>
          ))}
        </ul>

        {/* #7FB5B5 here was 2.29:1 — the single least readable thing on the
            old page, repeated ten times. */}
        <p className={`${TEAL_INK} font-semibold text-xs mt-5`}>{note}</p>
      </div>
    </article>
  );
}

function CulturalCard({
  icon: Glyph,
  name,
  kicker,
  body,
  delay,
}: {
  icon: Icon;
  name: string;
  kicker: string;
  body: string;
  delay?: string;
}) {
  return (
    <article
      data-reveal
      style={delay ? { transitionDelay: delay } : undefined}
      className="on-dark bg-[#1B4F72] rounded-3xl p-7 relative overflow-hidden shadow-sm shadow-[#1B4F72]/10"
    >
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#E8836A]/20 blur-2xl" aria-hidden="true" />
      <div className="relative">
        <span className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-4">
          <Glyph className="w-5 h-5 text-[#A8D5D5]" aria-hidden="true" />
        </span>
        <h4 className="font-display font-black text-white text-lg leading-tight mb-1.5">{name}</h4>
        <p className="text-[#A8D5D5] text-[0.7rem] font-bold uppercase tracking-[0.16em] mb-3">{kicker}</p>
        <p className="text-[#CBD5E1] text-sm leading-relaxed">{body}</p>
      </div>
    </article>
  );
}

function EastCard({
  icon: Glyph,
  iconBg,
  iconInk,
  title,
  children,
}: {
  icon: Icon;
  iconBg: string;
  iconInk: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <span className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
        <Glyph className={`w-6 h-6 ${iconInk}`} aria-hidden="true" />
      </span>
      <h4 className="font-display font-black text-[#1B4F72] text-lg mb-2 tracking-[-0.01em]">{title}</h4>
      {/* text-gray-500 → the page's body ink, for consistency with the cards. */}
      <p className="text-[#404650] text-sm leading-relaxed">{children}</p>
    </div>
  );
}

/**
 * The professor's aside. The pin was an emoji, which a screen reader announces
 * as "pushpin" in the middle of the sentence; it is now a labelled icon.
 */
function Note({
  children,
  title,
  label,
  variant = "info",
}: {
  children: React.ReactNode;
  title?: string;
  label: string;
  variant?: "info" | "warning";
}) {
  const warn = variant === "warning";
  const shell = warn ? "bg-[#FFF4F1] border-[#E8836A]/50" : "bg-[#F0FAF9] border-[#7FB5B5]/60";
  const iconBg = warn ? "bg-[#C05232]" : "bg-[#3F7878]";
  const Glyph = warn ? TriangleAlert : Pin;

  return (
    <aside data-reveal className={`mt-7 ${shell} border rounded-3xl px-5 sm:px-7 py-6 flex gap-4 items-start`}>
      <span className={`shrink-0 w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center`}>
        <Glyph className="w-5 h-5 text-white" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <span className={`block text-[0.65rem] font-black uppercase tracking-[0.18em] mb-1.5 ${warn ? CORAL_INK : TEAL_INK}`}>
          {label}
        </span>
        {title && <strong className="block font-display font-black text-[#1B4F72] text-base mb-1">{title}</strong>}
        <p className="text-[#404650] text-sm leading-relaxed">{children}</p>
      </div>
    </aside>
  );
}

/**
 * A photograph with its caption.
 *
 * This replaces six dashed grey boxes that rendered as holes in the page —
 * placeholders left behind with a TODO. The photos come from the shoot already
 * in public/images; the three modules with no honest photograph (the police
 * stop, the gas station, the cultural tours) get none rather than a mislabelled
 * stand-in.
 */
function Figure({
  photo,
  alt,
  caption,
  position = "object-center",
}: {
  photo: StaticImageData;
  alt: string;
  caption: string;
  position?: string;
}) {
  return (
    <figure data-reveal data-reveal-style="zoom" className="mt-8">
      <div className="relative h-56 sm:h-80 rounded-3xl overflow-hidden shadow-lg shadow-[#1B4F72]/10">
        <Image
          src={photo}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 896px"
          quality={50}
          placeholder="blur"
          className={`object-cover ${position}`}
        />
      </div>
      <figcaption className="text-[#5A616B] text-xs sm:text-sm mt-3 text-center italic">{caption}</figcaption>
    </figure>
  );
}
