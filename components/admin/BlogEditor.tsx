"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Eye,
  ExternalLink,
  Heading1,
  Heading2,
  Bold,
  Link2,
  List,
  Minus,
  Lightbulb,
  Loader2,
  Pencil,
  Save,
  Send,
  EyeOff,
} from "lucide-react";
import { AdminCard } from "@/components/admin/AdminShell";
import { CoverPicker } from "@/components/admin/CoverPicker";
import { renderContent, estimateReadTime, slugify } from "@/lib/blog/render";
import type { UploadMeta } from "@/lib/blog/uploads";

/**
 * Where an article gets written.
 *
 * Three things drove the shape of this screen.
 *
 * The site is bilingual, and a published article missing its Spanish text
 * renders an empty page at /es/blog/... So the two languages are tabs over one
 * article rather than two separate records, there is a readiness strip that
 * says exactly what each language is still missing, and the publish button
 * refuses until both are complete. A draft carries no such requirement, which
 * is the whole reason drafts exist.
 *
 * The body is the small markdown dialect the blog has always used, and the
 * preview calls the published page's own renderer rather than a lookalike, so
 * the headings, the tip boxes and the bullet lists on the right are the real
 * ones.
 *
 * And nothing saves implicitly. Every write is a button press, the slug is
 * fixed once the article exists because renaming it would break a published
 * URL, and a failed save says so instead of looking like it worked.
 */

export interface Draft {
  slug: string;
  title: string;
  titleEs: string;
  excerpt: string;
  excerptEs: string;
  content: string;
  contentEs: string;
  category: string;
  categoryEs: string;
  coverImage: string;
  date: string;
  readTime: number;
  published: boolean;
}

/** The categories already in use, so the two languages stay in step. */
const CATEGORIES: [string, string][] = [
  ["Travel Guide", "Guía de Viaje"],
  ["Cruise Tips", "Tips para Cruceristas"],
  ["Family Travel", "Viaje en Familia"],
  ["Beaches", "Playas"],
  ["Buggy Tips", "Tips de Buggy"],
  ["Island Life", "Vida en la Isla"],
];

type Lang = "en" | "es";

const FIELD: Record<Lang, { title: keyof Draft; excerpt: keyof Draft; content: keyof Draft; category: keyof Draft }> = {
  en: { title: "title", excerpt: "excerpt", content: "content", category: "category" },
  es: { title: "titleEs", excerpt: "excerptEs", content: "contentEs", category: "categoryEs" },
};

const LANG_LABEL: Record<Lang, string> = { en: "English", es: "Español" };

/** What a language is still missing before the article can be published. */
function missing(d: Draft, lang: Lang) {
  const f = FIELD[lang];
  const gaps: string[] = [];
  if (!String(d[f.title]).trim()) gaps.push("title");
  if (!String(d[f.excerpt]).trim()) gaps.push("summary");
  if (!String(d[f.content]).trim()) gaps.push("text");
  if (!String(d[f.category]).trim()) gaps.push("category");
  return gaps;
}

/* ── Small pieces, declared at module level so React keeps their state ──── */

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold text-[#55606E] uppercase tracking-wider mb-1">
      {children}
    </label>
  );
}

function ToolbarButton({
  label,
  icon: Glyph,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="w-9 h-9 flex items-center justify-center rounded-lg text-[#44505E] hover:bg-[#0F2035]/[0.06] hover:text-[#0F2035] transition-colors"
    >
      <Glyph className="w-4 h-4" aria-hidden="true" />
    </button>
  );
}

/** Says what each language still needs, since publishing requires both. */
function Readiness({ draft }: { draft: Draft }) {
  const langs: Lang[] = ["en", "es"];
  return (
    <div className="flex flex-wrap gap-2">
      {langs.map((lang) => {
        const gaps = missing(draft, lang);
        return (
          <span
            key={lang}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              gaps.length === 0 ? "bg-emerald-50 text-[#047857]" : "bg-amber-50 text-[#92400e]"
            }`}
          >
            {gaps.length === 0 ? (
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            {LANG_LABEL[lang]}
            {gaps.length > 0 && <span className="font-normal">· needs {gaps.join(", ")}</span>}
          </span>
        );
      })}
    </div>
  );
}

/* ── The editor ─────────────────────────────────────────────────────────── */

export function BlogEditor({
  locale,
  initial,
  isNew,
  isSeed,
  uploads,
  justSaved = false,
}: {
  locale: string;
  initial: Draft;
  isNew: boolean;
  /** One of the five articles that live in lib/blog/posts.ts. */
  isSeed: boolean;
  /** Cover photos uploaded before, so they can be reused. */
  uploads: UploadMeta[];
  /** Arrived here from a first save, which navigates to the new address. */
  justSaved?: boolean;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(initial);
  const [lang, setLang] = useState<Lang>(locale === "es" ? "es" : "en");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [busy, setBusy] = useState<null | "save" | "publish">(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(justSaved);
  const [dirty, setDirty] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [readTimeTouched, setReadTimeTouched] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const f = FIELD[lang];
  const body = String(draft[f.content] ?? "");

  /** Every change goes through here, so `dirty` cannot drift. */
  function set(patch: Partial<Draft>) {
    setDraft((d) => ({ ...d, ...patch }));
    setDirty(true);
    setSaved(false);
  }

  /** The slug follows the English title until the article exists. */
  function setTitle(value: string) {
    const patch = { [f.title]: value } as Partial<Draft>;
    if (lang === "en" && !slugTouched) patch.slug = slugify(value);
    set(patch);
  }

  function setBody(value: string) {
    const patch = { [f.content]: value } as Partial<Draft>;
    if (!readTimeTouched) patch.readTime = estimateReadTime(value);
    set(patch);
  }

  function setCategory(value: string) {
    const patch = { [f.category]: value } as Partial<Draft>;
    /* Choosing a known category in one language fills in the other: the
       difference between the pair staying in step and quietly drifting. */
    const pair = CATEGORIES.find(([en, es]) => (lang === "en" ? en === value : es === value));
    if (pair) {
      if (lang === "en" && !draft.categoryEs.trim()) patch.categoryEs = pair[1];
      if (lang === "es" && !draft.category.trim()) patch.category = pair[0];
    }
    set(patch);
  }

  /* Saving a new article changes its address, which is a navigation, which
     throws this component away — so the confirmation has to survive in the URL
     and then be cleaned out of it, or a later reload would still claim the
     article was just saved. */
  useEffect(() => {
    if (!justSaved) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("saved");
    window.history.replaceState(null, "", url.toString());
  }, [justSaved]);

  /* A writing screen is the one place in the admin where closing the tab by
     accident actually costs something. */
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  /* ── The markdown toolbar ─────────────────────────────────────────────── */

  function apply(kind: "h2" | "h3" | "bold" | "link" | "list" | "rule" | "tip") {
    const ta = bodyRef.current;
    if (!ta) return;
    const value = ta.value;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);

    let next = value;
    let caret = end;

    if (kind === "bold" || kind === "link") {
      const text = selected || (kind === "bold" ? "bold text" : "link text");
      const wrapped = kind === "bold" ? `**${text}**` : `[${text}](/${locale}/book)`;
      next = value.slice(0, start) + wrapped + value.slice(end);
      caret = start + wrapped.length;
    } else if (kind === "rule") {
      const block = `${start > 0 && value[start - 1] !== "\n" ? "\n" : ""}\n---\n\n`;
      next = value.slice(0, start) + block + value.slice(end);
      caret = start + block.length;
    } else {
      /* Line prefixes go at the start of the line the caret sits on, and they
         replace each other rather than stacking. Pressing Heading and then
         changing your mind and pressing Tip used to produce
         `**Tip:** ## a heading`, which renders as neither. */
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const prefix =
        kind === "h2"
          ? "## "
          : kind === "h3"
            ? "### "
            : kind === "list"
              ? "- "
              : lang === "es"
                ? "**Consejo:** "
                : "**Tip:** ";

      const rest = value.slice(lineStart);
      const existing = rest.match(/^(?:### |## |- |\*\*Tip:\*\* |\*\*Consejo:\*\* )/);
      const dropped = existing ? existing[0].length : 0;

      next = value.slice(0, lineStart) + prefix + rest.slice(dropped);
      caret = Math.max(lineStart + prefix.length, end + prefix.length - dropped);
    }

    setBody(next);
    /* React owns the value, so the caret has to be put back after the render
       that applies it. */
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(caret, caret);
    }, 0);
  }

  /* ── Saving ───────────────────────────────────────────────────────────── */

  async function save(published: boolean) {
    setBusy(published && !draft.published ? "publish" : "save");
    setError(null);
    try {
      const res = await fetch(isNew ? "/api/admin/blog" : `/api/admin/blog/${initial.slug}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, published }),
      });

      if (!res.ok) {
        let detail = `${res.status} ${res.statusText}`;
        try {
          const json = await res.json();
          if (json?.error) detail = String(json.error);
        } catch {}
        throw new Error(detail);
      }

      setDraft((d) => ({ ...d, published }));
      setDirty(false);
      setSaved(true);
      if (isNew) router.replace(`/${locale}/admin/blog/${draft.slug}?saved=1`);
      else router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "The article could not be saved. Nothing was changed.");
    } finally {
      setBusy(null);
    }
  }

  /* Ctrl/Cmd+S, because this is a text editor. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (!busy) void save(draft.published);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const ready = missing(draft, "en").length === 0 && missing(draft, "es").length === 0;
  const tipLabel = lang === "es" ? "Consejo" : "Tip";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <Link
          href={`/${locale}/admin/blog`}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#1B4F72] hover:text-[#A8411F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          All articles
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {saved && !dirty && (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#047857]">
              <Check className="w-4 h-4" aria-hidden="true" />
              Saved
            </span>
          )}
          {dirty && <span className="text-sm text-[#55606E]">Unsaved changes</span>}

          {!isNew && draft.published && (
            <Link
              href={`/${locale}/blog/${initial.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl bg-white ring-1 ring-[#0F2035]/15 text-sm font-bold text-[#0F2035] hover:bg-[#F0F4F8] transition-colors"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              View
            </Link>
          )}

          <button
            type="button"
            onClick={() => void save(false)}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl bg-white ring-1 ring-[#0F2035]/15 text-sm font-bold text-[#44505E] hover:bg-[#F0F4F8] transition-colors disabled:text-[#55606E] disabled:hover:bg-white"
          >
            {busy === "save" ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : draft.published ? (
              <EyeOff className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Save className="w-4 h-4" aria-hidden="true" />
            )}
            {draft.published ? "Unpublish" : "Save draft"}
          </button>

          <button
            type="button"
            onClick={() => void save(true)}
            disabled={busy !== null || !ready}
            title={ready ? undefined : "Both languages have to be complete before an article goes live"}
            className="inline-flex items-center gap-2 min-h-11 px-5 rounded-xl bg-[#C05232] hover:bg-[#A8411F] text-sm font-black text-white transition-colors disabled:bg-[#E3E8EF] disabled:text-[#55606E] disabled:hover:bg-[#E3E8EF]"
          >
            {busy === "publish" ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="w-4 h-4" aria-hidden="true" />
            )}
            {draft.published ? "Save changes" : "Publish"}
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 bg-red-50 ring-1 ring-red-200 rounded-xl px-4 py-3 mb-5 text-sm text-[#b91c1c]"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {isSeed && (
        <p className="text-sm text-[#44505E] bg-white ring-1 ring-[#0F2035]/[0.06] rounded-xl px-4 py-3 mb-5">
          This is one of the five original articles, which lives in the site&rsquo;s code. Saving it here stores your
          version in the database and the site serves that one from then on. The original stays in the code either way.
        </p>
      )}

      <div className="grid xl:grid-cols-2 gap-6">
        {/* ─── The form ─── */}
        <div className={`space-y-5 ${tab === "preview" ? "hidden xl:block" : ""}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-xl bg-[#0F2035]/[0.06] p-1" role="tablist" aria-label="Language">
              {(["en", "es"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  role="tab"
                  aria-selected={lang === l}
                  onClick={() => setLang(l)}
                  className={`min-h-9 px-4 rounded-lg text-sm font-bold transition-colors ${
                    lang === l ? "bg-white text-[#0F2035] shadow-sm" : "text-[#55606E] hover:text-[#0F2035]"
                  }`}
                >
                  {LANG_LABEL[l]}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setTab("preview")}
              className="xl:hidden inline-flex items-center gap-2 text-sm font-bold text-[#1B4F72]"
            >
              <Eye className="w-4 h-4" aria-hidden="true" />
              Preview
            </button>
          </div>

          <Readiness draft={draft} />

          <AdminCard>
            <div className="space-y-4">
              <div>
                <Label htmlFor="post-title">Title · {LANG_LABEL[lang]}</Label>
                <input
                  id="post-title"
                  className="form-input"
                  value={String(draft[f.title] ?? "")}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={lang === "es" ? "Los 5 mejores miradores de Cozumel" : "The 5 best lookouts in Cozumel"}
                />
              </div>

              <div>
                <Label htmlFor="post-excerpt">Summary · {LANG_LABEL[lang]}</Label>
                <textarea
                  id="post-excerpt"
                  className="form-input h-20 resize-none"
                  value={String(draft[f.excerpt] ?? "")}
                  onChange={(e) => set({ [f.excerpt]: e.target.value } as Partial<Draft>)}
                  placeholder="Two or three lines. This is what the blog list and Google show."
                />
                <p className="text-xs text-[#55606E] mt-1">
                  {String(draft[f.excerpt] ?? "").length} characters · around 160 reads best in search results
                </p>
              </div>

              <div>
                <Label htmlFor="post-category">Category · {LANG_LABEL[lang]}</Label>
                <input
                  id="post-category"
                  className="form-input"
                  list="post-categories"
                  value={String(draft[f.category] ?? "")}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <datalist id="post-categories">
                  {CATEGORIES.map(([en, es]) => (
                    <option key={en} value={lang === "es" ? es : en} />
                  ))}
                </datalist>
              </div>
            </div>
          </AdminCard>

          <AdminCard padded={false}>
            <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-[#0F2035]/8">
              <ToolbarButton label="Heading" icon={Heading1} onClick={() => apply("h2")} />
              <ToolbarButton label="Subheading" icon={Heading2} onClick={() => apply("h3")} />
              <ToolbarButton label="Bold" icon={Bold} onClick={() => apply("bold")} />
              <ToolbarButton label="Link" icon={Link2} onClick={() => apply("link")} />
              <ToolbarButton label="Bullet list" icon={List} onClick={() => apply("list")} />
              <ToolbarButton label="Divider" icon={Minus} onClick={() => apply("rule")} />
              <ToolbarButton label={`${tipLabel} box`} icon={Lightbulb} onClick={() => apply("tip")} />
              <span className="ml-auto text-xs text-[#55606E] pr-1">
                {body.trim() ? body.trim().split(/\s+/).length : 0} words
              </span>
            </div>
            <textarea
              ref={bodyRef}
              aria-label={`Article text in ${LANG_LABEL[lang]}`}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={
                lang === "es"
                  ? "## Un encabezado\n\nEscribe aquí. Una línea vacía separa los párrafos.\n\n- un punto de lista\n\n**Consejo:** algo útil que sabes tú y los demás no."
                  : "## A heading\n\nWrite here. A blank line separates paragraphs.\n\n- a bullet point\n\n**Tip:** something useful you know and they do not."
              }
              className="w-full h-[28rem] px-5 py-4 text-[0.9375rem] leading-relaxed text-[#1E2733] font-mono resize-y border-0 focus:outline-none rounded-b-2xl"
            />
          </AdminCard>

          <AdminCard>
            <div className="space-y-4">
              <div>
                <Label>Cover photo</Label>
                <CoverPicker
                  value={draft.coverImage}
                  onChange={(key) => set({ coverImage: key })}
                  initialUploads={uploads}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="post-date">Date</Label>
                  <input
                    id="post-date"
                    type="date"
                    className="form-input"
                    value={draft.date}
                    onChange={(e) => set({ date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="post-readtime">Read time (minutes)</Label>
                  <input
                    id="post-readtime"
                    type="number"
                    min={1}
                    max={90}
                    className="form-input"
                    value={draft.readTime}
                    onChange={(e) => {
                      setReadTimeTouched(true);
                      set({ readTime: Number(e.target.value) });
                    }}
                  />
                  {!readTimeTouched && <p className="text-xs text-[#55606E] mt-1">Counted from the text as you write</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="post-slug">Web address</Label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm text-[#55606E]">/{locale}/blog/</span>
                  <input
                    id="post-slug"
                    className="form-input flex-1 min-w-[12rem] disabled:bg-[#F0F4F8] disabled:text-[#55606E]"
                    value={draft.slug}
                    disabled={!isNew}
                    onChange={(e) => {
                      setSlugTouched(true);
                      set({ slug: slugify(e.target.value) });
                    }}
                  />
                </div>
                <p className="text-xs text-[#55606E] mt-1">
                  {isNew
                    ? "Built from the English title. Lowercase letters, numbers and dashes."
                    : "Fixed once an article exists, because changing it would break the links already pointing here."}
                </p>
              </div>
            </div>
          </AdminCard>
        </div>

        {/* ─── The preview ─── */}
        <div className={tab === "write" ? "hidden xl:block" : ""}>
          <div className="xl:sticky xl:top-8">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="text-xs font-semibold text-[#55606E] uppercase tracking-wider">
                Preview · {LANG_LABEL[lang]}
              </h2>
              <button
                type="button"
                onClick={() => setTab("write")}
                className="xl:hidden inline-flex items-center gap-2 text-sm font-bold text-[#1B4F72]"
              >
                <Pencil className="w-4 h-4" aria-hidden="true" />
                Back to writing
              </button>
            </div>

            {/* The cream page background and the white article card the
                published page uses, so the preview is not flattering about
                spacing or line length. */}
            <div className="bg-[#F5F0EB] rounded-2xl p-4 sm:p-6 max-h-[calc(100vh-10rem)] overflow-y-auto ring-1 ring-[#0F2035]/[0.06]">
              <h1 className="font-display font-black text-[#1B4F72] text-2xl sm:text-3xl leading-[1.05] tracking-[-0.02em] text-balance mb-5">
                {String(draft[f.title] ?? "") || (lang === "es" ? "Sin título" : "Untitled")}
              </h1>
              <article className="bg-white rounded-3xl shadow-sm shadow-[#1B4F72]/5 p-5 sm:p-8">
                {body.trim() ? (
                  renderContent(body, tipLabel)
                ) : (
                  <p className="text-[#55606E] text-sm">
                    {lang === "es" ? "Nada escrito todavía." : "Nothing written yet."}
                  </p>
                )}
              </article>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
