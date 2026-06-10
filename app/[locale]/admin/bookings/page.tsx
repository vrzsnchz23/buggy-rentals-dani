import { db } from "@/lib/db";
import { formatCurrency, parseItems, VEHICLES } from "@/lib/utils";
import { AdminNav } from "@/components/admin/AdminNav";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { BookingsSearch } from "@/components/admin/BookingsSearch";
import { ArrowRight, List, CalendarDays, X } from "lucide-react";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string; date?: string; q?: string; [key: string]: string | undefined }>;
}

export default async function BookingsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { status, q, date } = await searchParams;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { guestName: { contains: q } },
      { guestEmail: { contains: q } },
      { guestPhone: { contains: q } },
    ];
  }
  if (date) {
    const d = new Date(date);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    where.rentalDate = { gte: d, lt: next };
  }

  const bookings = await db.booking.findMany({
    where,
    orderBy: { rentalDate: "desc" },
  });

  const statusColor = (s: string): "default" | "success" | "warning" | "danger" | "info" => {
    if (s === "confirmed") return "success";
    if (s === "pending") return "warning";
    if (s === "cancelled") return "danger";
    if (s === "completed") return "info";
    return "default";
  };

  const filters = [
    { value: "", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  function filterHref(statusValue: string) {
    const params = new URLSearchParams();
    if (statusValue) params.set("status", statusValue);
    if (q) params.set("q", q);
    const qs = params.toString();
    return `/${locale}/admin/bookings${qs ? `?${qs}` : ""}`;
  }

  const activeDateLabel = date
    ? new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      <AdminNav locale={locale} />
      <main className="ml-0 lg:ml-60 p-6 pt-20 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-[#0F2035]">Bookings</h1>
              <p className="text-gray-400 text-sm mt-0.5">{bookings.length} total results</p>
            </div>
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
              <List className="w-5 h-5 text-[#1B4F72]" />
            </div>
          </div>

          {/* Active date filter banner */}
          {activeDateLabel && (
            <div className="flex items-center gap-2 mb-4 bg-[#1B4F72]/8 border border-[#1B4F72]/20 rounded-xl px-4 py-2.5">
              <CalendarDays className="w-4 h-4 text-[#1B4F72] shrink-0" />
              <span className="text-sm text-[#1B4F72] font-medium flex-1">
                Showing bookings for <span className="font-bold">{activeDateLabel}</span>
              </span>
              <Link
                href={`/${locale}/admin/bookings`}
                className="flex items-center gap-1 text-xs text-[#1B4F72]/70 hover:text-[#1B4F72] font-semibold transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </Link>
            </div>
          )}

          {/* Search + Filters */}
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <BookingsSearch defaultValue={q} />
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <Link
                  key={f.value}
                  href={filterHref(f.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    status === f.value || (!status && !f.value)
                      ? "bg-[#1B4F72] text-white shadow-sm"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {f.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="text-left px-6 py-3.5 text-gray-400 font-medium text-xs uppercase tracking-wide">Guest</th>
                    <th className="text-left px-6 py-3.5 text-gray-400 font-medium text-xs uppercase tracking-wide">Date</th>
                    <th className="text-left px-6 py-3.5 text-gray-400 font-medium text-xs uppercase tracking-wide">Vehicles</th>
                    <th className="text-left px-6 py-3.5 text-gray-400 font-medium text-xs uppercase tracking-wide">Pickup</th>
                    <th className="text-left px-6 py-3.5 text-gray-400 font-medium text-xs uppercase tracking-wide">Total</th>
                    <th className="text-left px-6 py-3.5 text-gray-400 font-medium text-xs uppercase tracking-wide">Status</th>
                    <th className="text-left px-6 py-3.5 text-gray-400 font-medium text-xs uppercase tracking-wide">Payment</th>
                    <th className="px-6 py-3.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map((b: any) => (
                    <tr
                      key={b.id}
                      className="hover:bg-[#1B4F72]/[0.04] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#1B4F72]/10 flex items-center justify-center text-[#1B4F72] font-bold text-sm shrink-0">
                            {b.guestName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 group-hover:text-[#1B4F72] transition-colors">{b.guestName}</div>
                            <div className="text-xs text-gray-400">{b.guestEmail}</div>
                            <div className="text-xs text-gray-400">{b.guestPhone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {new Date(b.rentalDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {parseItems(b.items)
                          .filter((i) => i.qty > 0)
                          .map((i) => `${i.qty}× ${VEHICLES[i.type].label}`)
                          .join(", ") || "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {b.deliveryType === "pickup" ? "🚢 Port pickup" : `🏨 ${b.hotelName}`}
                      </td>
                      <td className="px-6 py-4 font-bold text-[#E8836A]">{formatCurrency(b.totalAmount)}</td>
                      <td className="px-6 py-4">
                        <Badge variant={statusColor(b.status)}>{b.status}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            b.paymentStatus === "paid"
                              ? "success"
                              : b.paymentStatus === "deposit_paid"
                              ? "info"
                              : "warning"
                          }
                        >
                          {b.paymentStatus}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#1B4F72] transition-colors" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <List className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-gray-400 text-sm">No bookings found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
