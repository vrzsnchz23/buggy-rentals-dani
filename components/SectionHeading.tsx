/**
 * The one section header on the public site.
 *
 * Every section used to roll its own: three different title sizes, two badge
 * styles and inconsistent spacing, which read as six separate pages stitched
 * together. This keeps the rhythm identical everywhere and lets each section
 * only choose its surface (cream/white vs. navy).
 *
 * The three parts reveal in sequence rather than together, which is the same
 * choreography the hero uses — the page keeps the character of its opening.
 */
type Tone = "light" | "dark";

const TONES: Record<Tone, { eyebrow: string; title: string; subtitle: string; rule: string }> = {
  // "light" = on cream or white. "dark" = on navy.
  light: {
    eyebrow: "bg-[#C05232]/12 text-[#9B3A1A]",
    title: "text-[#1B4F72]",
    subtitle: "text-[#5A616B]",
    rule: "bg-[#C05232]/35",
  },
  dark: {
    eyebrow: "bg-white/10 text-[#C2E4E4] border border-white/15",
    title: "text-white",
    subtitle: "text-[#CBD5E1]",
    rule: "bg-[#A8D5D5]/40",
  },
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  tone = "light",
  icon,
  className = "",
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  tone?: Tone;
  /** Optional glyph inside the eyebrow pill (e.g. the Google G on reviews). */
  icon?: React.ReactNode;
  className?: string;
  /** Anything that belongs under the subtitle, e.g. the rating row. */
  children?: React.ReactNode;
}) {
  const c = TONES[tone];

  return (
    <div className={`text-center mb-9 sm:mb-12 ${className}`}>
      <span
        data-reveal
        className={`inline-flex items-center gap-2 ${c.eyebrow} font-bold text-[0.7rem] sm:text-xs uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-4`}
      >
        {icon}
        {eyebrow}
      </span>

      {/* Display type at the hero's scale, so the page does not shrink after
          the fold. The tracking matches the h1. */}
      <h2
        data-reveal
        style={{ transitionDelay: "90ms" }}
        className={`font-display font-black ${c.title} text-[2.25rem] leading-[1.05] sm:text-5xl lg:text-[3.5rem] tracking-[-0.03em] text-balance`}
      >
        {title}
      </h2>

      <span
        data-reveal
        aria-hidden="true"
        style={{ transitionDelay: "160ms" }}
        className={`block w-16 h-[3px] rounded-full ${c.rule} mx-auto mt-4`}
      />

      {subtitle && (
        <p
          data-reveal
          style={{ transitionDelay: "200ms" }}
          className={`${c.subtitle} text-base sm:text-lg max-w-xl mx-auto mt-4 leading-relaxed text-pretty`}
        >
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
}
