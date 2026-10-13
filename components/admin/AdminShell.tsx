import { AdminNav } from "@/components/admin/AdminNav";

/**
 * The chrome every admin page sits in.
 *
 * All nine pages repeated the same three wrappers by hand —
 * `min-h-screen bg-[#F0F4F8]`, the nav, and a `main` with the sidebar offset
 * and the mobile top-bar padding — and they had drifted: different max widths,
 * different top padding, and a header that was centred on one page and
 * left-aligned on the next. One shell means a change to the layout happens in
 * one place.
 */
const WIDTHS = { "4xl": "max-w-4xl", "5xl": "max-w-5xl", "7xl": "max-w-7xl" } as const;

export function AdminShell({
  locale,
  children,
  width = "7xl",
}: {
  locale: string;
  children: React.ReactNode;
  /** `4xl` single record · `5xl` a thread or editor · `7xl` a list or the dashboard. */
  width?: "4xl" | "5xl" | "7xl";
}) {
  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      <AdminNav locale={locale} />
      {/* pt-20 clears the fixed mobile top bar; lg has the sidebar instead. */}
      <main className="lg:ml-60 px-4 sm:px-6 lg:px-8 pt-20 pb-12 lg:pt-8">
        <div className={`${WIDTHS[width]} mx-auto`}>{children}</div>
      </main>
    </div>
  );
}

/**
 * A page's title block.
 *
 * `eyebrow` carried `text-[#55606E]` before, which measures 2.54:1 on white and
 * 2.30:1 on this page background. Everything secondary in the admin now uses
 * #55606E — 6.39:1 on a card, 5.78:1 on the page.
 */
export function AdminHeader({
  title,
  eyebrow,
  meta,
  children,
}: {
  title: string;
  eyebrow?: React.ReactNode;
  meta?: React.ReactNode;
  /** Actions that belong on the title row. */
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-7 sm:mb-8">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#55606E] mb-1.5">{eyebrow}</p>
        )}
        <h1 className="font-display text-[1.75rem] sm:text-[2.125rem] font-black text-[#0F2035] leading-none tracking-[-0.02em]">
          {title}
        </h1>
        {meta && <p className="text-sm text-[#55606E] mt-2">{meta}</p>}
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
}

/** A white card. Used so often that the radius and shadow were drifting. */
export function AdminCard({
  children,
  className = "",
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={`bg-white rounded-2xl shadow-sm shadow-[#0F2035]/[0.04] ring-1 ring-[#0F2035]/[0.04] ${padded ? "p-5 sm:p-6" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

/** The header inside an AdminCard: icon tile, title, optional right slot. */
export function CardHeader({
  icon: Glyph,
  title,
  tone = "navy",
  children,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  title: string;
  tone?: "navy" | "coral" | "teal";
  children?: React.ReactNode;
}) {
  const tones = {
    navy: "bg-[#1B4F72]/10 text-[#1B4F72]",
    coral: "bg-[#C05232]/10 text-[#A8411F]",
    teal: "bg-[#7FB5B5]/25 text-[#2F6060]",
  };
  return (
    <div className="flex items-center justify-between gap-3 mb-5">
      <h2 className="font-bold text-[#0F2035] flex items-center gap-2.5 min-w-0">
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tones[tone]}`}>
          <Glyph className="w-4 h-4" aria-hidden="true" />
        </span>
        <span className="truncate">{title}</span>
      </h2>
      {children}
    </div>
  );
}

/** What a list shows when it has nothing to show. */
export function EmptyState({
  icon: Glyph,
  children,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  children: React.ReactNode;
}) {
  return (
    <div className="text-center py-12">
      <span className="w-12 h-12 bg-[#0F2035]/[0.05] rounded-full flex items-center justify-center mx-auto mb-3">
        <Glyph className="w-6 h-6 text-[#55606E]" aria-hidden="true" />
      </span>
      {/* text-[#55606E] here was 2.54:1 — the one message on an empty screen. */}
      <p className="text-[#55606E] text-sm">{children}</p>
    </div>
  );
}
