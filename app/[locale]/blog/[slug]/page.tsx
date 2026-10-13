import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionWave } from "@/components/ui/SectionWave";
import { blogPosts, getPost, type BlogPost } from "@/lib/blog/posts";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Clock, ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";
import ctaPhoto from "@/public/images/guide-cta.jpg";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const locales = ["en", "es"];
  return locales.flatMap((locale) => blogPosts.map((post) => ({ locale, slug: post.slug })));
}

/**
 * Every post used to advertise its English title and excerpt regardless of
 * locale, and shipped no canonical or hreflang at all — so the Spanish article
 * had no way to tell a search engine it was the Spanish article.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const isEs = locale === "es";
  return pageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: isEs ? post.titleEs : post.title,
    description: isEs ? post.excerptEs : post.excerpt,
    image: `${SITE_URL}${post.coverImage.src}`,
  });
}

/* ── The little markdown renderer ───────────────────────────────────────── */

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold text-[#1B4F72]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <Link
          key={idx}
          href={linkMatch[2]}
          /* The hover colour was #d4724f, which is 3.32:1 on white — the link
             became *less* readable on hover. Both states are ink now. */
          className="text-[#A8411F] font-semibold underline decoration-[#C05232]/40 decoration-2 underline-offset-2 hover:decoration-[#A8411F] transition-colors"
        >
          {linkMatch[1]}
        </Link>
      );
    }
    return part;
  });
}

/**
 * Renders a post body.
 *
 * The previous version pushed bare `<li>` elements into the flow with no list
 * around them — 16 of them across the five posts. Invalid HTML, and a screen
 * reader announces no list at all, so "three things to pack" arrived as three
 * loose sentences. Consecutive items are collected into one `<ul>`.
 */
function renderContent(content: string, tipLabel: string) {
  const lines = content.trim().split("\n");
  const out: React.ReactNode[] = [];
  let items: React.ReactNode[] = [];
  let key = 0;

  const flushList = () => {
    if (!items.length) return;
    out.push(
      <ul key={`ul-${key++}`} className="my-5 space-y-2.5">
        {items}
      </ul>
    );
    items = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith("- ")) {
      items.push(
        <li key={key++} className="flex gap-3 text-[#404650] leading-relaxed">
          <span className="mt-[0.55rem] w-1.5 h-1.5 rounded-full bg-[#C05232] shrink-0" aria-hidden="true" />
          <span>{renderInline(line.slice(2))}</span>
        </li>
      );
      continue;
    }

    flushList();

    if (line.startsWith("## ")) {
      out.push(
        <h2
          key={key++}
          className="font-display font-black text-[#1B4F72] text-[1.625rem] sm:text-[2rem] leading-[1.15] tracking-[-0.02em] mt-12 mb-4 first:mt-0 text-balance"
        >
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      out.push(
        <h3 key={key++} className="font-display font-black text-[#1B4F72] text-xl sm:text-2xl tracking-[-0.01em] mt-8 mb-3">
          {line.replace("### ", "")}
        </h3>
      );
    } else if (line === "---") {
      /* There are 54 of these, one before almost every heading. A full-width
         grey rule that often made the page look like a form; the headings
         already carry the separation, so this is just a breath. */
      out.push(<hr key={key++} className="border-0 border-t border-[#1B4F72]/8 my-10" />);
    } else if (/^\*\*(?:Tip|Consejo):\*\*/.test(line)) {
      out.push(
        <aside key={key++} className="my-7 bg-[#F0FAF9] border border-[#7FB5B5]/60 rounded-3xl px-5 sm:px-7 py-6 flex gap-4 items-start">
          <span className="shrink-0 w-10 h-10 rounded-2xl bg-[#3F7878] flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <span className="block text-[0.65rem] font-black uppercase tracking-[0.18em] text-[#2F6060] mb-1.5">
              {tipLabel}
            </span>
            <p className="text-[#404650] leading-relaxed">
              {renderInline(line.replace(/^\*\*(?:Tip|Consejo):\*\*\s*/, ""))}
            </p>
          </div>
        </aside>
      );
    } else {
      out.push(
        <p key={key++} className="text-[#404650] leading-relaxed mb-5 text-[1.0625rem] sm:text-lg">
          {renderInline(line)}
        </p>
      );
    }
  }

  flushList();
  return out;
}

/* ───────────────────────────────────────────────────────────────────────── */

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "blog" });
  const isEs = locale === "es";
  const post = getPost(slug);

  if (!post) notFound();

  const title = isEs ? post.titleEs : post.title;
  const content = isEs ? post.contentEs : post.content;
  const category = isEs ? post.categoryEs : post.category;
  const tag = isEs ? "es-MX" : "en-US";

  const related = blogPosts
    .filter((p) => p.slug !== slug)
    .sort((a: BlogPost, b: BlogPost) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);

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
            src={post.coverImage}
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
                        src={p.coverImage}
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
