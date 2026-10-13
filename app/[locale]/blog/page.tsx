import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionWave } from "@/components/ui/SectionWave";
import { getArticles } from "@/lib/blog/store";
import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Clock, ArrowRight, Newspaper } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import heroPhoto from "@/public/images/blog-hero.jpg";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = await getTranslations({ locale, namespace: "metadata" });
  return pageMetadata({
    locale,
    path: "/blog",
    title: m("blogTitle"),
    description: m("blogDescription"),
  });
}

/** The posts' own dates were only ever used in array order, so the newest
 *  article sat fourth in the grid. The store sorts newest first, which is also
 *  what makes "latest" mean anything. */

export default async function BlogPage() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "blog" });
  const tag = locale === "es" ? "es-MX" : "en-US";

  const sorted = await getArticles();
  const [featured, ...rest] = sorted;

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(tag, { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

  return (
    <>
      <Navbar />
      <main className="bg-[#F5F0EB]">

        {/* ─── HERO ───
            Was a flat navy band with centred copy; it now opens on a
            photograph with the copy on a horizontal wash, like every other
            page on the site. Column sampling of this frame puts the brightest
            part of the copy area at a 0.53 alpha requirement, well inside what
            the shared wash provides. */}
        <section className="on-dark relative min-h-[26rem] sm:min-h-[28rem] flex items-end sm:items-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={heroPhoto}
              alt={t("heroAlt")}
              fill
              sizes="100vw"
              placeholder="blur"
              priority
              className="object-cover object-[60%_center] sm:object-center"
            />
          </div>

          <div className="absolute inset-0 bg-[#0d2d42]/15" aria-hidden="true" />
          <div
            className="absolute inset-0 hidden sm:block"
            aria-hidden="true"
            style={{ background: "linear-gradient(96deg, rgba(8,28,44,0.95) 0%, rgba(8,28,44,0.9) 34%, rgba(8,28,44,0.7) 50%, rgba(8,28,44,0.3) 64%, rgba(8,28,44,0) 78%)" }}
          />
          <div
            className="absolute inset-0 sm:hidden"
            aria-hidden="true"
            style={{ background: "linear-gradient(to top, rgba(8,28,44,0.76) 0%, rgba(8,28,44,0.68) 45%, rgba(8,28,44,0.58) 75%, rgba(8,28,44,0.5) 100%)" }}
          />

          <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14 sm:py-20">
            <div className="max-w-xl">
              <span
                className="hero-in inline-flex items-center gap-2 bg-[#E8836A]/20 text-[#FBC7B7] border border-[#E8836A]/40 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] mb-5"
                style={{ "--delay": "80ms" } as React.CSSProperties}
              >
                <Newspaper className="w-4 h-4" aria-hidden="true" />
                {t("eyebrow")}
              </span>

              <h1
                className="hero-in font-display font-black text-white text-[2.75rem] sm:text-6xl lg:text-7xl leading-[0.98] tracking-[-0.03em] mb-5"
                style={{ "--delay": "200ms" } as React.CSSProperties}
              >
                {t("title")}
              </h1>

              <p
                className="hero-in text-gray-100 text-base sm:text-lg max-w-md leading-relaxed"
                style={{ "--delay": "320ms" } as React.CSSProperties}
              >
                {t("subtitle")}
              </p>

              <p
                className="hero-in inline-flex items-center gap-2 mt-7 rounded-2xl bg-white/12 border border-white/25 backdrop-blur-sm px-4 py-2.5 text-sm font-semibold text-white"
                style={{ "--delay": "440ms" } as React.CSSProperties}
              >
                <Newspaper className="w-4 h-4 text-[#A8D5D5]" aria-hidden="true" />
                {t("postCount", { count: sorted.length })}
              </p>
            </div>
          </div>

          <SectionWave next="#F5F0EB" />
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">

          {/* ─── FEATURED ───
              Five cards of identical size gave the reader no way in. The
              newest article gets the width of the column. */}
          {featured && (
            <Link
              data-reveal
              href={`/${locale}/blog/${featured.slug}`}
              className="group block bg-white rounded-3xl overflow-hidden shadow-sm shadow-[#1B4F72]/5 hover:shadow-xl hover:shadow-[#1B4F72]/10 transition-all duration-300 hover:-translate-y-1 mb-12 sm:mb-16"
            >
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[22rem] overflow-hidden">
                  <Image
                    src={featured.cover}
                    alt={locale === "es" ? featured.titleEs : featured.title}
                    fill
                    /* Every blog <Image> was a `fill` with no `sizes`, which
                       defaults to 100vw — so a 384px card downloaded a
                       full-viewport-width file. */
                    sizes="(max-width: 768px) 100vw, 592px"
                    placeholder="blur"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 bg-[#C05232] text-white text-[0.65rem] font-black uppercase tracking-[0.14em] px-3 py-1.5 rounded-full shadow-lg">
                    {locale === "es" ? featured.categoryEs : featured.category}
                  </span>
                </div>

                <div className="p-7 sm:p-10 flex flex-col justify-center">
                  <span className="inline-flex items-center gap-2 self-start bg-[#C05232]/12 text-[#9B3A1A] font-bold text-[0.65rem] uppercase tracking-[0.18em] px-3 py-1 rounded-full mb-4">
                    {t("featuredLabel")}
                  </span>

                  <h2 className="font-display font-black text-[#1B4F72] text-2xl sm:text-[2rem] leading-[1.1] tracking-[-0.02em] text-balance group-hover:text-[#A8411F] transition-colors">
                    {locale === "es" ? featured.titleEs : featured.title}
                  </h2>

                  <p className="text-[#404650] text-sm sm:text-base leading-relaxed mt-4 line-clamp-3">
                    {locale === "es" ? featured.excerptEs : featured.excerpt}
                  </p>

                  <Meta readTime={t("readTime", { count: featured.readTime })} date={fmtDate(featured.date)} />

                  <span className="inline-flex items-center gap-1.5 text-[#A8411F] font-black text-sm mt-6 group-hover:gap-3 transition-all">
                    {t("readMore")}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* ─── THE REST ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7">
            {rest.map((post, i) => (
              <Link
                key={post.slug}
                data-reveal
                style={{ transitionDelay: `${i * 70}ms` }}
                href={`/${locale}/blog/${post.slug}`}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm shadow-[#1B4F72]/5 hover:shadow-xl hover:shadow-[#1B4F72]/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={post.cover}
                    alt={locale === "es" ? post.titleEs : post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 568px"
                    placeholder="blur"
                    quality={50}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 bg-[#C05232] text-white text-[0.65rem] font-black uppercase tracking-[0.14em] px-3 py-1.5 rounded-full shadow-lg">
                    {locale === "es" ? post.categoryEs : post.category}
                  </span>
                </div>

                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  <h2 className="font-display font-black text-[#1B4F72] text-lg sm:text-xl leading-snug tracking-[-0.01em] text-balance group-hover:text-[#A8411F] transition-colors">
                    {locale === "es" ? post.titleEs : post.title}
                  </h2>

                  <p className="text-[#404650] text-sm leading-relaxed mt-3 line-clamp-3 flex-1">
                    {locale === "es" ? post.excerptEs : post.excerpt}
                  </p>

                  <Meta readTime={t("readTime", { count: post.readTime })} date={fmtDate(post.date)} />

                  <span className="inline-flex items-center gap-1.5 text-[#A8411F] font-black text-sm mt-4 group-hover:gap-3 transition-all">
                    {t("readMore")}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/** Read time and date. text-gray-400 measured 2.54:1 on white; #5A616B is
 *  5.52:1 on cream and 7.0:1 here. */
function Meta({ readTime, date }: { readTime: string; date: string }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#5A616B] mt-5">
      <span className="inline-flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
        {readTime}
      </span>
      <span aria-hidden="true">·</span>
      <span>{date}</span>
    </p>
  );
}
