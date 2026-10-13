import Link from "next/link";
import { Lightbulb } from "lucide-react";

/**
 * The little markdown renderer for a post body.
 *
 * It used to live inside app/[locale]/blog/[slug]/page.tsx. It is out here
 * because the editor in the admin panel renders its live preview with this
 * exact function — a preview drawn by a second, approximate renderer is worse
 * than no preview, since it teaches you the wrong thing about what you are
 * writing. Both the published page and the preview now go through one
 * implementation, so what Dani sees while writing is what ships.
 *
 * Nothing in here touches a server-only API, so it works in a client
 * component.
 */

/** The accepted syntax, for the editor's help panel. */
export const SYNTAX = {
  heading: "## ",
  subheading: "### ",
  bold: "**",
  link: "[text](/en/page)",
  item: "- ",
  rule: "---",
  tip: "**Tip:** ",
  tipEs: "**Consejo:** ",
} as const;

export function renderInline(text: string): React.ReactNode[] {
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
export function renderContent(content: string, tipLabel: string) {
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

/** What the blog shows as "6 min read". 200 wpm, floor of one minute. */
export function estimateReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** A title to a URL slug: "The 7 Best Places!" -> "the-7-best-places". */
export function slugify(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
