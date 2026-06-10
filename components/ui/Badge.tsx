import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const variants = {
  default: { pill: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
  success: { pill: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  warning: { pill: "bg-amber-50 text-amber-700", dot: "bg-amber-400" },
  danger: { pill: "bg-red-50 text-red-600", dot: "bg-red-400" },
  info: { pill: "bg-blue-50 text-blue-600", dot: "bg-blue-400" },
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const v = variants[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold",
        v.pill,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", v.dot)} />
      {children}
    </span>
  );
}
