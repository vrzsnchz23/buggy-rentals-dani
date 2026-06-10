import { db } from "@/lib/db";
import { formatCurrency, formatDate, parseItems, VEHICLES } from "@/lib/utils";
import { AdminNav } from "@/components/admin/AdminNav";
import { Badge } from "@/components/ui/Badge";
import { Car, DollarSign, Calendar, TrendingUp, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [allBookings, todayBookings, upcomingBookings, monthlyBookings] = await Promise.all([
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
      where: { rentalDate: { gte: startOfMonth, lte: endOfMonth }, status: { not: "cancelled" } },
    }),
  ]);

  const monthlyRevenue = monthlyBookings.reduce((s: number, b: any) => s + b.totalAmount, 0);
  const monthlyVehicles = monthlyBookings.reduce(
    (s: number, b: any) => s + parseItems(b.items).reduce((si: number, i: any) => si + i.qty, 0),
    0
  );
  const recentBookings = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const stats = [
    {
      label: "Total Bookings",
      value: allBookings,
      icon: Calendar,
      gradient: "from-[#1B4F72] to-[#2471A3]",
      iconBg: "bg-white/20",
    },
    {
      label: "Today's Rentals",
      value: todayBookings.length,
      icon: Car,
      gradient: "from-[#E8836A] to-[#e8a06a]",
      iconBg: "bg-white/20",
    },
    {
      label: "Monthly Revenue",
      value: formatCurrency(monthlyRevenue),
      icon: DollarSign,
      gradient: "from-[#0e7c7b] to-[#7FB5B5]",
      iconBg: "bg-white/20",
    },
    {
      label: "Vehicles This Month",
      value: monthlyVehicles,
      icon: TrendingUp,
      gradient: "from-[#6c3483] to-[#9b59b6]",
      iconBg: "bg-white/20",
    },
  ];

  const statusColor = (s: string) => {
    if (s === "confirmed") return "success";
    if (s === "pending") return "warning";
    if (s === "cancelled") return "danger";
    if (s === "completed") return "info";
    return "default";
  };

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      <AdminNav locale={locale} />
      <main className="ml-0 lg:ml-60 p-6 pt-20 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <p className="text-sm text-gray-400 font-medium">{greeting}, Dani 👋</p>
            <h1 className="text-3xl font-black text-[#0F2035] mt-0.5">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">{formatDate(new Date())}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-5 shadow-lg text-white`}
                >
                  <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-3xl font-black leading-none">{stat.value}</div>
                  <div className="text-white/70 text-xs mt-1.5 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's rentals */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-[#0F2035] flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#E8836A]/10 rounded-lg flex items-center justify-center">
                    <Car className="w-4 h-4 text-[#E8836A]" />
                  </span>
                  Today&apos;s Rentals
                </h2>
                <span className="text-xs font-bold bg-[#E8836A]/10 text-[#E8836A] px-2.5 py-1 rounded-full">
                  {todayBookings.length} total
                </span>
              </div>
              {todayBookings.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Car className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-gray-400 text-sm">No rentals today</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {todayBookings.map((b: any) => (
                    <Link
                      key={b.id}
                      href={`/${locale}/admin/bookings/${b.id}`}
                      className="flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#1B4F72]/10 flex items-center justify-center text-[#1B4F72] font-bold text-sm">
                          {b.guestName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-gray-800">{b.guestName}</div>
                          <div className="text-xs text-gray-400">
                            {parseItems(b.items)
                              .filter((i) => i.qty > 0)
                              .map((i) => `${i.qty}× ${VEHICLES[i.type]?.label ?? i.type}`)
                              .join(", ")}{" "}
                            · {b.deliveryType === "pickup" ? "Port pickup" : `Hotel: ${b.hotelName}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={statusColor(b.status) as "default" | "success" | "warning" | "danger" | "info"}>
                          {b.status}
                        </Badge>
                        <span className="font-bold text-sm text-[#E8836A]">{formatCurrency(b.totalAmount)}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-[#0F2035] flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#1B4F72]/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-[#1B4F72]" />
                  </span>
                  Upcoming
                </h2>
              </div>
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">No upcoming bookings</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingBookings.map((b: any) => (
                    <Link
                      key={b.id}
                      href={`/${locale}/admin/bookings/${b.id}`}
                      className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#E8836A]/10 flex items-center justify-center text-[#E8836A] font-bold text-xs shrink-0">
                        {b.guestName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-gray-800 truncate">{b.guestName}</div>
                        <div className="text-xs text-gray-400">{formatDate(b.rentalDate)}</div>
                      </div>
                      <div className="ml-auto text-xs font-bold text-[#E8836A] shrink-0">{formatCurrency(b.totalAmount)}</div>
                    </Link>
                  ))}
                </div>
              )}
              <Link
                href={`/${locale}/admin/bookings`}
                className="flex items-center justify-center gap-1.5 mt-5 pt-4 border-t border-gray-100 text-sm text-[#1B4F72] font-semibold hover:text-[#E8836A] transition-colors"
              >
                View all bookings <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Recent bookings table */}
          <div className="mt-6 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-[#0F2035]">Recent Bookings</h2>
              <Link
                href={`/${locale}/admin/bookings`}
                className="text-xs text-[#1B4F72] font-semibold hover:text-[#E8836A] transition-colors flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="text-left px-6 py-3 text-gray-400 font-medium text-xs uppercase tracking-wide">Guest</th>
                    <th className="text-left px-6 py-3 text-gray-400 font-medium text-xs uppercase tracking-wide">Date</th>
                    <th className="text-left px-6 py-3 text-gray-400 font-medium text-xs uppercase tracking-wide">Vehicles</th>
                    <th className="text-left px-6 py-3 text-gray-400 font-medium text-xs uppercase tracking-wide">Total</th>
                    <th className="text-left px-6 py-3 text-gray-400 font-medium text-xs uppercase tracking-wide">Status</th>
                    <th className="text-left px-6 py-3 text-gray-400 font-medium text-xs uppercase tracking-wide">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentBookings.map((b: any) => (
                    <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/${locale}/admin/bookings/${b.id}`} className="group flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#1B4F72]/10 flex items-center justify-center text-[#1B4F72] font-bold text-xs shrink-0">
                            {b.guestName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 group-hover:text-[#1B4F72] transition-colors">
                              {b.guestName}
                            </div>
                            <div className="text-xs text-gray-400">{b.guestEmail}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(b.rentalDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {parseItems(b.items)
                          .filter((i) => i.qty > 0)
                          .map((i) => `${i.qty}× ${VEHICLES[i.type]?.label ?? i.type}`)
                          .join(", ") || "—"}
                      </td>
                      <td className="px-6 py-4 font-bold text-[#E8836A]">{formatCurrency(b.totalAmount)}</td>
                      <td className="px-6 py-4">
                        <Badge variant={statusColor(b.status) as "default" | "success" | "warning" | "danger" | "info"}>
                          {b.status}
                        </Badge>
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
                    </tr>
                  ))}
                </tbody>
              </table>
              {recentBookings.length === 0 && (
                <div className="text-center py-16 text-gray-400">No bookings yet</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
