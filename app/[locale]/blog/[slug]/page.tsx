import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionWave } from "@/components/ui/SectionWave";
import { getArticle, getArticles, type Article } from "@/lib/blog/store";
import { renderContent } from "@/lib/blog/render";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";
import ctaPhoto from "@/public/images/guide-cta.jpg";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

/** Articles written in the admin are included. A slug that first appears
 *  after the build still renders on demand: `dynamicParams` defaults to true. */
export async function generateStaticParams() {
  const locales = ["en", "es"];
  const articles = await getArticles();
  return locales.flatMap((locale) => articles.map((post) => ({ locale, slug: post.slug })));
}

/**
 * Every post used to advertise its English title and excerpt regardless of
 * locale, and shipped no canonical or hreflang at all — so the Spanish article
 * had no way to tell a search engine it was the Spanish article.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getArticle(slug);
  if (!post) return {};
  const isEs = locale === "es";
  return pageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: isEs ? post.titleEs : post.title,
    description: isEs ? post.excerptEs : post.excerpt,
    image: `${SITE_URL}${post.cover.src}`,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "blog" });
  const isEs = locale === "es";
  const post = await getArticle(slug);

  if (!post) notFound();

  const title = isEs ? post.titleEs : post.title;
  const content = isEs ? post.contentEs : post.content;
  const category = isEs ? post.categoryEs : post.category;
  const tag = isEs ? "es-MX" : "en-US";

  const related = (await getArticles()).filter((p: Article) => p.slug !== slug).slice(0, 2);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(tag, { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

  return (
    <>
      <Navbar />
      <main className="bg-[#F5F0EB]">

        {/* ─── HERO ───
            The wash was `from-navy/90 via-navy/40 to-transparent`, which put
            the title on 0.9 but left the middle of the frame at 0.4 — fine over
            a dark cover, unreadable over a bright one, and the covers are
            chosen per post. It is a bottom-weighted wash now, strong enough for
            the brightest cover in the set. */}
        <section className="on-dark relative h-[22rem] sm:h-[30rem] w-full overflow-hidden flex items-end">
          <Image
            src={post.cover}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            placeholder="blur"
            priority
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{ background: "linear-gradient(to top, rgba(8,28,44,0.82) 0%, rgba(8,28,44,0.72) 38%, rgba(8,28,44,0.45) 65%, rgba(8,28,44,0.2) 85%, rgba(8,28,44,0.1) 100%)" }}
          />

          <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20">
            <span className="inline-flex items-center bg-[#C05232] text-white text-[0.65rem] font-black uppercase tracking-[0.14em] px-3 py-1.5 rounded-full mb-4 shadow-lg">
              {category}
            </span>

            <h1 className="font-display font-black text-white text-[1.875rem] sm:text-5xl leading-[1.05] tracking-[-0.03em] text-balance">
              {title}
            </h1>

            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-5 text-[#CBD5E1] text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                {t("readTime", { count: post.readTime })}
              </span>
              <span aria-hidden="true">·</span>
              <span>{fmtDate(post.date)}</span>
            </p>
          </div>

          <SectionWave next="#F5F0EB" />
        </section>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-[#1B4F72] font-bold text-sm mb-8 hover:text-[#A8411F] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            {t("backToBlog")}
          </Link>

          <article data-reveal className="bg-white rounded-3xl shadow-sm shadow-[#1B4F72]/5 p-6 sm:p-10 lg:p-12">
            {renderContent(content, t("tipLabel"))}
          </article>

          {/* ─── CTA ───
              Flat navy before; the same panel on a photograph, which is how
              the other pages close. */}
          <section className="on-dark relative mt-12 rounded-3xl overflow-hidden">
            <Image
              src={ctaPhoto}
              alt=""
              aria-hidden="true"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              quality={50}
              placeholder="blur"
              className="object-cover object-[center_60%]"
            />
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{ background: "linear-gradient(140deg, rgba(8,28,44,0.82) 0%, rgba(8,28,44,0.74) 55%, rgba(8,28,44,0.64) 100%)" }}
            />
            <div className="relative z-10 px-7 sm:px-10 py-10 sm:py-12 text-center">
              <h2 className="font-display font-black text-white text-2xl sm:text-[2rem] leading-tight tracking-[-0.02em] text-balance">
                {t("ctaTitle")}
              </h2>
              <p className="text-[#CBD5E1] mt-3 max-w-md mx-auto leading-relaxed">{t("ctaDesc")}</p>
              <Link
                href={`/${locale}/book`}
                className="inline-flex items-center gap-2 mt-7 bg-[#C05232] hover:bg-[#A8411F] text-white font-black min-h-14 px-8 rounded-2xl transition-all hover:shadow-2xl hover:shadow-[#C05232]/40 hover:-translate-y-0.5"
              >
                {t("ctaButton")}
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </div>
          </section>

          {related.length > 0 && (
            <section className="mt-14">
              <h2 className="font-display font-black text-[#1B4F72] text-xl sm:text-2xl tracking-[-0.02em] mb-6">
                {t("relatedTitle")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {related.map((p, i) => (
                  <Link
                    key={p.slug}
                    data-reveal
                    style={{ transitionDelay: `${i * 80}ms` }}
                    href={`/${locale}/blog/${p.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm shadow-[#1B4F72]/5 hover:shadow-lg hover:shadow-[#1B4F72]/10 transition-all hover:-translate-y-1"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={p.cover}
                        alt={isEs ? p.titleEs : p.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 352px"
                        quality={50}
                        placeholder="blur"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-[0.65rem] font-black uppercase tracking-[0.14em] text-[#A8411F] mb-1.5">
                        {isEs ? p.categoryEs : p.category}
                      </p>
                      <h3 className="font-display font-black text-[#1B4F72] text-base leading-snug group-hover:text-[#A8411F] transition-colors text-balance">
                        {isEs ? p.titleEs : p.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
