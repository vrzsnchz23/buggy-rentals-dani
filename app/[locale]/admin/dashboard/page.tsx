import { db } from "@/lib/db";
import { formatCurrency, formatDate, parseItems } from "@/lib/utils";
import { AdminNav } from "@/components/admin/AdminNav";
import { Badge } from "@/components/ui/Badge";
import { Car, DollarSign, Users, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [
    allBookings,
    todayBookings,
    upcomingBookings,
    monthlyBookings,
  ] = await Promise.all([
    db.booking.count({ where: { status: { not: "cancelled" } } }),
    db.booking.findMany({
      where: { rentalDate: { gte: today, lt: tomorrow }, status: { not: "cancelled" } },
      orderBy: { createdAt: "desc" },
    }),
    db.booking.findMany({
      where: { rentalDate: { gte: tomorrow }, status: { not: "cancelled" } },
      orderBy: { rentalDate: "asc" },
      take: 5,
    }),
    db.booking.findMany({
      where: {
        rentalDate: { gte: startOfMonth, lte: endOfMonth },
        status: { not: "cancelled" },
      },
    }),
  ]);

  const monthlyRevenue = monthlyBookings.reduce((s, b) => s + b.totalAmount, 0);
  const monthlyVehicles = monthlyBookings.reduce((s, b) => s + parseItems(b.items).reduce((si, i) => si + i.qty, 0), 0);
  const recentBookings = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const stats = [
    { label: "Total Bookings", value: allBookings, icon: Calendar, color: "#1B4F72" },
    { label: "Today's Rentals", value: todayBookings.length, icon: Car, color: "#E8836A" },
    { label: "Monthly Revenue", value: formatCurrency(monthlyRevenue), icon: DollarSign, color: "#7FB5B5" },
    { label: "Vehicles This Month", value: monthlyVehicles, icon: TrendingUp, color: "#1B4F72" },
  ];

  const statusColor = (s: string) => {
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
          <div className="mb-8">
            <h1 className="text-2xl font-black text-[#1B4F72]">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">{formatDate(new Date())}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: stat.color + "15" }}>
                      <Icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-gray-800">{stat.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's rentals */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-[#1B4F72] mb-4 flex items-center gap-2">
                <Car className="w-4 h-4" /> Today&apos;s Rentals ({todayBookings.length})
              </h2>
              {todayBookings.length === 0 ? (
                <p className="text-gray-400 text-sm">No rentals today</p>
              ) : (
                <div className="space-y-3">
                  {todayBookings.map((b) => (
                    <Link
                      key={b.id}
                      href={`/${locale}/admin/bookings/${b.id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                    >
                      <div>
                        <div className="font-semibold text-sm text-gray-800">{b.guestName}</div>
                        <div className="text-xs text-gray-400">
                          {parseItems(b.items).filter(i => i.qty > 0).map(i => `${i.qty}× ${i.type}`).join(", ")} · {b.deliveryType === "pickup" ? "Port pickup" : `Hotel: ${b.hotelName}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={statusColor(b.status) as "default" | "success" | "warning" | "danger" | "info"}>{b.status}</Badge>
                        <span className="font-bold text-sm text-[#E8836A]">{formatCurrency(b.totalAmount)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-[#1B4F72] mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Upcoming
              </h2>
              {upcomingBookings.length === 0 ? (
                <p className="text-gray-400 text-sm">No upcoming bookings</p>
              ) : (
                <div className="space-y-3">
                  {upcomingBookings.map((b) => (
                    <Link
                      key={b.id}
                      href={`/${locale}/admin/bookings/${b.id}`}
                      className="block hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
                    >
                      <div className="font-semibold text-sm text-gray-800">{b.guestName}</div>
                      <div className="text-xs text-gray-400">{formatDate(b.rentalDate)}</div>
                      <div className="text-xs font-semibold text-[#E8836A]">{formatCurrency(b.totalAmount)}</div>
                    </Link>
                  ))}
                </div>
              )}
              <Link
                href={`/${locale}/admin/bookings`}
                className="block mt-4 text-sm text-center text-[#1B4F72] font-semibold hover:underline"
              >
                View all bookings →
              </Link>
            </div>
          </div>

          {/* Recent bookings table */}
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-bold text-[#1B4F72] mb-4">Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-gray-400 font-medium text-xs">Guest</th>
                    <th className="text-left py-2 text-gray-400 font-medium text-xs">Date</th>
                    <th className="text-left py-2 text-gray-400 font-medium text-xs">Vehicles</th>
                    <th className="text-left py-2 text-gray-400 font-medium text-xs">Total</th>
                    <th className="text-left py-2 text-gray-400 font-medium text-xs">Status</th>
                    <th className="text-left py-2 text-gray-400 font-medium text-xs">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3">
                        <Link href={`/${locale}/admin/bookings/${b.id}`} className="font-medium text-[#1B4F72] hover:underline">
                          {b.guestName}
                        </Link>
                        <div className="text-xs text-gray-400">{b.guestEmail}</div>
                      </td>
                      <td className="py-3 text-gray-600">{new Date(b.rentalDate).toLocaleDateString()}</td>
                      <td className="py-3 text-gray-600 text-xs">{parseItems(b.items).filter(i => i.qty > 0).map(i => `${i.qty}× ${i.type}`).join(", ") || "—"}</td>
                      <td className="py-3 font-semibold text-[#E8836A]">{formatCurrency(b.totalAmount)}</td>
                      <td className="py-3">
                        <Badge variant={statusColor(b.status) as "default" | "success" | "warning" | "danger" | "info"}>{b.status}</Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant={b.paymentStatus === "paid" ? "success" : b.paymentStatus === "deposit_paid" ? "info" : "warning"}>
                          {b.paymentStatus}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
