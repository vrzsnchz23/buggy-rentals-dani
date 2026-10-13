import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { AdminShell, AdminHeader } from "@/components/admin/AdminShell";
import { BlogEditor, type Draft } from "@/components/admin/BlogEditor";
import { getArticleForAdmin, getUploads, isSeedSlug } from "@/lib/blog/store";
import { DEFAULT_COVER } from "@/lib/blog/photo-library";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ saved?: string }>;
}

/** Today in Cozumel, which is UTC-5 all year. */
function today() {
  const now = new Date();
  return new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

const EMPTY: Draft = {
  slug: "",
  title: "",
  titleEs: "",
  excerpt: "",
  excerptEs: "",
  content: "",
  contentEs: "",
  category: "Travel Guide",
  categoryEs: "Guía de Viaje",
  coverImage: DEFAULT_COVER,
  date: "",
  readTime: 5,
  published: false,
};

export default async function AdminBlogEditorPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const { saved } = await searchParams;
  const session = await auth();
  if (!session) redirect(`/${locale}/admin/login`);

  const isNew = slug === "new";
  const [article, uploads] = await Promise.all([
    isNew ? undefined : getArticleForAdmin(slug),
    getUploads(),
  ]);
  if (!isNew && !article) notFound();

  /* The editor takes a plain draft: the resolved StaticImageData and the
     source flags are not fields anyone edits. */
  const initial: Draft = isNew
    ? { ...EMPTY, date: today() }
    : {
        slug: article.slug,
        title: article.title,
        titleEs: article.titleEs,
        excerpt: article.excerpt,
        excerptEs: article.excerptEs,
        content: article.content,
        contentEs: article.contentEs,
        category: article.category,
        categoryEs: article.categoryEs,
        coverImage: article.coverImage,
        date: article.date,
        readTime: article.readTime,
        published: article.published,
      };

  return (
    <AdminShell locale={locale}>
      <AdminHeader
        title={isNew ? "New article" : initial.title || "Untitled"}
        eyebrow="Blog"
        meta={isNew ? "It goes live only when you publish it" : `/${locale}/blog/${initial.slug}`}
      />
      <BlogEditor
        locale={locale}
        initial={initial}
        isNew={isNew}
        isSeed={!isNew && isSeedSlug(slug)}
        uploads={uploads}
        justSaved={saved === "1"}
      />
    </AdminShell>
  );
}
