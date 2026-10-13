import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * A dashboard figure.
 *
 * Two things changed. First, contrast: the four cards were `bg-gradient-to-br`
 * into light stops, and white text on the light end of each measured 5.30,
 * 2.17, 2.29 and 4.67 to one — so the two numbers Dani looks at most, today's
 * rentals and the month's revenue, were the least readable things on the
 * screen. The labels were `text-white/70` and failed on all four. These are
 * flat surfaces chosen so white clears 4.5:1, with labels at #E2E8F0.
 *
 * Second, they are links. A dashboard number that cannot be opened is a dead
 * end: seeing "4 today" and then having to go find those four in a list is the
 * kind of small friction that makes a tool annoying to use all day.
 */
const TONES = {
  navy: "bg-[#164463] hover:bg-[#1B4F72]",
  coral: "bg-[#A8411F] hover:bg-[#95381A]",
  teal: "bg-[#2F6060] hover:bg-[#356B6B]",
  plum: "bg-[#5B2C6F] hover:bg-[#6C3483]",
} as const;

export function StatCard({
  label,
  value,
  hint,
  icon: Glyph,
  tone,
  href,
}: {
  label: string;
  value: string | number;
  /** A second line, e.g. "3 still unpaid". */
  hint?: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  tone: keyof typeof TONES;
  /** Where the figure comes from. Omit for a figure with nowhere to go. */
  href?: string;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between">
        <span className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
          <Glyph className="w-5 h-5 text-white" aria-hidden="true" />
        </span>
        {href && (
          <ArrowUpRight
            className="w-4 h-4 text-[#E2E8F0] opacity-0 group-hover:opacity-100 transition-opacity"
            aria-hidden="true"
          />
        )}
      </div>
      <div className="font-display text-[2rem] sm:text-[2.25rem] font-black leading-none text-white mt-4 tabular-nums">
        {value}
      </div>
      <div className="text-[#E2E8F0] text-xs mt-2 font-semibold">{label}</div>
      {hint && <div className="text-[#E2E8F0] text-[0.7rem] mt-1">{hint}</div>}
    </>
  );

  const shell = `on-dark group block rounded-2xl p-5 shadow-sm transition-colors ${TONES[tone]}`;

  return href ? (
    <Link href={href} className={shell}>
      {body}
    </Link>
  ) : (
    <div className={shell}>{body}</div>
  );
}
