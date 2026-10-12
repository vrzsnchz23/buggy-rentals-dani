/**
 * The soft edge between two sections.
 *
 * The hero already dissolves into the cream below it with a wave; every other
 * boundary on the page was a hard colour change, which made the sections look
 * stacked rather than composed. This draws the same family of curve at every
 * boundary.
 *
 * One rule, so there is nothing to get backwards: a section caps its *own*
 * bottom, painted in the colour of the section that comes next. The section
 * needs `relative` and enough bottom padding to clear the curve — every
 * section on the homepage already has both.
 */
export function SectionWave({
  next,
  height = "h-10 sm:h-16",
}: {
  /** CSS colour of the section that follows this one. */
  next: string;
  height?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute bottom-0 left-0 right-0 ${height} z-10 pointer-events-none`}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block"
      >
        <path
          d="M0 80 L1440 80 L1440 24 C1140 74 850 2 560 20 C362 32 152 60 0 38 Z"
          fill={next}
        />
      </svg>
    </div>
  );
}
