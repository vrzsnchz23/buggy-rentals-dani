import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { blogPosts, getPost } from "@/lib/blog/posts";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { Clock, ArrowLeft, Tag } from "lucide-react";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Buggy Rentals with Dani`,
    description: post.excerpt,
  };
}

// Simple markdown-ish renderer
function renderContent(content: string) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) { key++; continue; }

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-2xl font-black text-[#1B4F72] mt-10 mb-4">
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-xl font-bold text-[#1B4F72] mt-6 mb-2">
          {line.replace("### ", "")}
        </h3>
      );
    } else if (line === "---") {
      elements.push(<hr key={key++} className="border-gray-200 my-8" />);
    } else if (line.startsWith("**Tip:**") || line.startsWith("**Consejo:**")) {
      elements.push(
        <div key={key++} className="bg-[#7FB5B5]/10 border-l-4 border-[#7FB5B5] rounded-r-xl px-4 py-3 my-4 text-sm text-gray-700">
          {line.replace(/\*\*/g, "")}
        </div>
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <li key={key++} className="text-gray-700 leading-relaxed ml-4 list-disc mb-1">
          {line.replace("- ", "")}
        </li>
      );
    } else {
      // Replace **bold** inline
      const parts = line.split(/\*\*(.*?)\*\*/g);
      const rendered = parts.map((part, idx) =>
        idx % 2 === 1 ? <strong key={idx} className="font-bold text-[#1B4F72]">{part}</strong> : part
      );
      elements.push(
        <p key={key++} className="text-gray-700 leading-relaxed mb-4 text-lg">
          {rendered}
        </p>
      );
    }
  }

  return elements;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const isEs = locale === "es";
  const post = getPost(slug);

  if (!post) notFound();

  const title = isEs ? post.titleEs : post.title;
  const content = isEs ? post.contentEs : post.content;
  const category = isEs ? post.categoryEs : post.category;

  // Related posts (other posts)
  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F0EB]">
        {/* Hero */}
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          <Image
            src={post.coverImage}
            alt={title}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B4F72]/90 via-[#1B4F72]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-4xl mx-auto">
            <span className="bg-[#E8836A] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
              {category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight mt-2">
              {title}
            </h1>
            <div className="flex items-center gap-4 mt-3 text-gray-300 text-sm">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime} {isEs ? "min de lectura" : "min read"}
              </span>
              <span>·</span>
              <span>
                {new Date(post.date).toLocaleDateString(isEs ? "es-MX" : "en-US", {
                  month: "long", day: "numeric", year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          {/* Back link */}
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-[#1B4F72] font-semibold text-sm mb-8 hover:text-[#E8836A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {isEs ? "Volver al Blog" : "Back to Blog"}
          </Link>

          {/* Article */}
          <article className="bg-white rounded-2xl shadow-sm p-6 sm:p-10">
            {renderContent(content)}
          </article>

          {/* CTA */}
          <div className="mt-10 bg-[#1B4F72] rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-black mb-2">
              {isEs ? "¿Listo para explorar Cozumel?" : "Ready to explore Cozumel?"}
            </h3>
            <p className="text-gray-300 mb-6">
              {isEs
                ? "Reserva tu buggy hoy — $75 USD por día, hasta 5 personas."
                : "Book your buggy today — $75 USD per day, up to 5 people."}
            </p>
            <Link
              href={`/${locale}/book`}
              className="inline-flex items-center bg-[#E8836A] hover:bg-[#d4724f] text-white font-black px-8 py-3.5 rounded-full transition-all hover:shadow-xl"
            >
              {isEs ? "Reservar Ahora →" : "Book Now →"}
            </Link>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div className="mt-12">
              <h3 className="font-black text-[#1B4F72] text-xl mb-6">
                {isEs ? "También te puede interesar" : "You might also like"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/${locale}/blog/${p.slug}`}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                      <Image
                        src={p.coverImage}
                        alt={isEs ? p.titleEs : p.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-[#E8836A] font-bold mb-1">{isEs ? p.categoryEs : p.category}</p>
                      <h4 className="font-bold text-[#1B4F72] text-sm leading-snug group-hover:text-[#E8836A] transition-colors">
                        {isEs ? p.titleEs : p.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
