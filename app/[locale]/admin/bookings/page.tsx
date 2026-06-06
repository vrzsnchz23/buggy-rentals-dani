import { db } from "@/lib/db";
import { formatCurrency, parseItems, VEHICLES } from "@/lib/utils";
import { AdminNav } from "@/components/admin/AdminNav";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string; date?: string; q?: string }>;
}

export default async function BookingsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { status, q } = await searchParams;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { guestName: { contains: q } },
      { guestEmail: { contains: q } },
      { guestPhone: { contains: q } },
    ];
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

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav locale={locale} />
      <main className="ml-0 lg:ml-60 p-6 pt-20 lg:pt-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-[#1B4F72]">Bookings</h1>
            <span className="text-gray-400 text-sm">{bookings.length} total</span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {["", "pending", "confirmed", "completed", "cancelled"].map((s) => (
              <Link
                key={s}
                href={s ? `?status=${s}` : `/${locale}/admin/bookings`}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  status === s || (!status && !s)
                    ? "bg-[#1B4F72] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {s || "All"}
              </Link>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left p-4 text-gray-400 font-medium text-xs">Guest</th>
                    <th className="text-left p-4 text-gray-400 font-medium text-xs">Date</th>
                    <th className="text-left p-4 text-gray-400 font-medium text-xs">Vehicles</th>
                    <th className="text-left p-4 text-gray-400 font-medium text-xs">Pickup</th>
                    <th className="text-left p-4 text-gray-400 font-medium text-xs">Total</th>
                    <th className="text-left p-4 text-gray-400 font-medium text-xs">Status</th>
                    <th className="text-left p-4 text-gray-400 font-medium text-xs">Payment</th>
                    <th className="text-left p-4 text-gray-400 font-medium text-xs"></th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-gray-800">{b.guestName}</div>
                        <div className="text-xs text-gray-400">{b.guestEmail}</div>
                        <div className="text-xs text-gray-400">{b.guestPhone}</div>
                      </td>
                      <td className="p-4 text-gray-600 whitespace-nowrap">
                        {new Date(b.rentalDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="p-4 text-gray-600 text-xs">
                        {parseItems(b.items).filter((i) => i.qty > 0).map((i) => `${i.qty}× ${VEHICLES[i.type].label}`).join(", ") || "—"}
                      </td>
                      <td className="p-4 text-gray-600 text-xs">
                        {b.deliveryType === "pickup" ? "🚢 Port pickup" : `🏨 ${b.hotelName}`}
                      </td>
                      <td className="p-4 font-bold text-[#E8836A]">{formatCurrency(b.totalAmount)}</td>
                      <td className="p-4">
                        <Badge variant={statusColor(b.status)}>{b.status}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={b.paymentStatus === "paid" ? "success" : b.paymentStatus === "deposit_paid" ? "info" : "warning"}>
                          {b.paymentStatus}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/${locale}/admin/bookings/${b.id}`}
                          className="text-[#1B4F72] font-semibold hover:underline text-xs"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && (
                <div className="text-center py-16 text-gray-400">No bookings found</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
