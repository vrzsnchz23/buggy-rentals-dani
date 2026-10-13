import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, ExternalLink, Newspaper, Pencil, Plus } from "lucide-react";
import { AdminShell, AdminHeader, AdminCard, EmptyState } from "@/components/admin/AdminShell";
import { BlogRowActions } from "@/components/admin/BlogRowActions";
import { Badge } from "@/components/ui/Badge";
import { getAllArticles, type Article } from "@/lib/blog/store";

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata = { title: "Blog · Admin" };

/** Live, draft or hidden — the three states an article can be in. */
function status(a: Article) {
  if (a.published) return { label: "Live", variant: "success" as const };
  if (a.source === "db" && a.overridden) return { label: "Hidden", variant: "default" as const };
  return { label: "Draft", variant: "warning" as const };
}

export default async function AdminBlogPage({ params }: Props) {
  const { locale } = await params;
  const session = await auth();
  if (!session) redirect(`/${locale}/admin/login`);

  const articles = await getAllArticles();
  const live = articles.filter((a) => a.published).length;
  const drafts = articles.length - live;

  const fmt = (ymd: string) =>
    new Date(`${ymd}T12:00:00.000Z`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });

  return (
    <AdminShell locale={locale}>
      <AdminHeader
        title="Blog"
        eyebrow="Articles"
        meta={`${live} live on the site${drafts > 0 ? ` · ${drafts} not published` : ""}`}
      >
        <Link
          href={`/${locale}/admin/blog/new`}
          className="inline-flex items-center gap-2 min-h-11 px-5 rounded-xl bg-[#C05232] hover:bg-[#A8411F] text-sm font-black text-white transition-colors"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          New article
        </Link>
      </AdminHeader>

      {articles.length === 0 ? (
        <AdminCard>
          <EmptyState icon={Newspaper}>Nothing written yet.</EmptyState>
        </AdminCard>
      ) : (
        <div className="space-y-3">
          {articles.map((a) => {
            const s = status(a);
            return (
              <AdminCard key={a.slug} padded={false}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                  <Link
                    href={`/${locale}/admin/blog/${a.slug}`}
                    aria-label={`Edit ${a.title}`}
                    className="relative w-full sm:w-32 h-24 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-[#F0F4F8] ring-1 ring-[#0F2035]/[0.06]"
                  >
                    <Image
                      src={a.cover}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="(max-width: 640px) 100vw, 128px"
                      quality={50}
                      placeholder="blur"
                      className="object-cover"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge variant={s.variant}>{s.label}</Badge>
                      {a.source === "seed" && (
                        <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#55606E]">
                          In the code
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/${locale}/admin/blog/${a.slug}`}
                      className="font-bold text-[#0F2035] hover:text-[#A8411F] transition-colors block truncate"
                    >
                      {a.title}
                    </Link>
                    <p className="text-sm text-[#55606E] truncate">{a.titleEs}</p>

                    <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#55606E] mt-1.5">
                      <span>{fmt(a.date)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        {a.readTime} min
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{a.category}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <Link
                      href={`/${locale}/admin/blog/${a.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B4F72] hover:text-[#A8411F] transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                      Edit
                    </Link>
                    {a.published && (
                      <Link
                        href={`/${locale}/blog/${a.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B4F72] hover:text-[#A8411F] transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        View
                      </Link>
                    )}
                    <BlogRowActions
                      slug={a.slug}
                      title={a.title}
                      isSeed={a.source === "seed" || a.overridden}
                    />
                  </div>
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}

      <p className="text-xs text-[#55606E] mt-6 max-w-2xl leading-relaxed">
        A draft is saved but invisible to visitors. Publishing needs both languages filled in, because an article
        without its Spanish text would render an empty page at /es/blog/. The five original articles live in the
        site&rsquo;s code and cannot be deleted from here — hiding one takes it off the site and the editor can bring it
        back.
      </p>
    </AdminShell>
  );
}
