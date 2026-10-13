"use client";
import { useRouter } from "next/navigation";

/**
 * A table row that opens a record.
 *
 * It was a bare `<tr onClick>`: no href, no tabindex, no role. Three
 * consequences, all of them things you notice while actually using the list —
 * the rows could not be reached or opened with the keyboard at all, there was
 * no way to middle-click a booking into a new tab, and a screen reader
 * announced an ordinary table row with nothing to say it did anything.
 *
 * The row keeps the whole-row click target, and the first cell in each row
 * also carries a real `<a>` (see the Guest column), so the href exists for
 * keyboard, middle-click and "copy link". This adds the keyboard path for the
 * row itself and tells assistive tech what it is.
 */
export function ClickableRow({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  return (
    <tr
      onClick={(e) => {
        // Let a real link, button or text selection inside the row win.
        const t = e.target as HTMLElement;
        if (t.closest("a, button, input, label")) return;
        if (window.getSelection()?.toString()) return;
        router.push(href);
      }}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(href);
        }
      }}
      tabIndex={0}
      role="link"
      className={`cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1B4F72] ${className ?? ""}`}
    >
      {children}
    </tr>
  );
}
