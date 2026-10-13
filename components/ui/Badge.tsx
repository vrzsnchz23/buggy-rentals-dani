import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

/**
 * Status pills.
 *
 * Two of the five inks did not clear AA on their own tint: `danger` was
 * red-600 on red-50 at 4.41:1 and `warning` was amber-700 on amber-50 at
 * 4.84:1 — passing, but these are 12px labels that carry the difference
 * between a paid and an unpaid booking, so both moved to a darker ink with
 * room to spare. Measured on the tint each one actually sits on:
 *   success #047857 on #ecfdf5 = 5.21:1
 *   warning #92400e on #fffbeb = 6.84:1
 *   danger  #b91c1c on #fef2f2 = 5.91:1
 *   info    #1d4ed8 on #eff6ff = 6.16:1
 *   default #374151 on #f3f4f6 = 9.37:1
 * The dot is decorative and repeats the pill colour, so it is hidden from
 * assistive tech rather than announced as an empty element.
 */
const variants = {
  default: { pill: "bg-gray-100 text-[#374151]", dot: "bg-[#6b7280]" },
  success: { pill: "bg-emerald-50 text-[#047857]", dot: "bg-emerald-600" },
  warning: { pill: "bg-amber-50 text-[#92400e]", dot: "bg-amber-500" },
  danger: { pill: "bg-red-50 text-[#b91c1c]", dot: "bg-red-600" },
  info: { pill: "bg-blue-50 text-[#1d4ed8]", dot: "bg-blue-600" },
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const v = variants[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap",
        v.pill,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", v.dot)} aria-hidden="true" />
      {children}
    </span>
  );
}
