import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { blogPosts } from "@/lib/blog/posts";
import Image from "next/image";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { Clock, Tag } from "lucide-react";

export const metadata = {
  title: "Blog | Buggy Rentals with Dani – Cozumel Travel Tips",
  description: "Cozumel travel guides, cruise tips, and the best things to do on the island. Expert local advice from Buggy Rentals with Dani.",
};

export default async function BlogPage() {
  const locale = await getLocale();
  const isEs = locale === "es";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F0EB]">
        {/* Header */}
        <div className="bg-[#1B4F72] pt-28 pb-16 text-center">
          <p className="text-[#7FB5B5] font-semibold text-sm uppercase tracking-widest mb-3">
            {isEs ? "Consejos & Guías" : "Tips & Guides"}
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            {isEs ? "Blog de Cozumel" : "Cozumel Blog"}
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto text-lg">
            {isEs
              ? "Guías de viaje, tips para cruceristas y las mejores cosas que hacer en Cozumel."
              : "Travel guides, cruise tips, and the best things to do in Cozumel."}
          </p>
        </div>

        {/* Posts grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/${locale}/blog/${post.slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* Cover image */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <Image
                    src={post.coverImage}
                    alt={isEs ? post.titleEs : post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#E8836A] text-white text-xs font-bold px-3 py-1 rounded-full">
                      {isEs ? post.categoryEs : post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime} {isEs ? "min de lectura" : "min read"}
                    </span>
                    <span>·</span>
                    <span>{new Date(post.date).toLocaleDateString(isEs ? "es-MX" : "en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <h2 className="font-black text-[#1B4F72] text-lg leading-snug mb-2 group-hover:text-[#E8836A] transition-colors">
                    {isEs ? post.titleEs : post.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                    {isEs ? post.excerptEs : post.excerpt}
                  </p>
                  <div className="mt-4 text-[#E8836A] font-bold text-sm group-hover:gap-2 flex items-center gap-1 transition-all">
                    {isEs ? "Leer más" : "Read more"} →
                  </div>
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
