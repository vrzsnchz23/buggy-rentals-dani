import { db } from "@/lib/db";
import { AdminNav } from "@/components/admin/AdminNav";
import { formatCurrency, parseItems, VEHICLES } from "@/lib/utils";
import { Car, Users, DollarSign, BarChart3 } from "lucide-react";

export default async function FleetPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
  const tomorrow = new Date(today.getTime() + 86400000);

  const [todayBookings, recentBookings, totalRentals, totalRevAgg] = await Promise.all([
    db.booking.findMany({
      where: { rentalDate: { gte: today, lt: tomorrow }, status: { not: "cancelled" } },
    }),
    db.booking.findMany({
      where: { rentalDate: { gte: sixMonthsAgo }, status: { not: "cancelled" } },
      select: { rentalDate: true, totalAmount: true },
    }),
    db.booking.count({ where: { status: { not: "cancelled" } } }),
    db.booking.aggregate({ where: { status: { not: "cancelled" } }, _sum: { totalAmount: true } }),
  ]);

  const bookedBuggiesCount = todayBookings.reduce((s: number, b: any) => s + parseItems(b.items).filter((i: any) => i.type === "buggy").reduce((si: number, i: any) => si + i.qty, 0), 0);
  const bookedCompactsCount = todayBookings.reduce((s: number, b: any) => s + parseItems(b.items).filter((i: any) => i.type === "compact").reduce((si: number, i: any) => si + i.qty, 0), 0);
  const bookedToday = bookedBuggiesCount + bookedCompactsCount;
  const availableToday = VEHICLES.buggy.stock + VEHICLES.compact.stock - bookedToday;
  const totalRevenue = totalRevAgg._sum.totalAmount ?? 0;

  // Revenue by month — last 6 months, guaranteed order
  const monthKeys: string[] = [];
  const monthlyData: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    monthKeys.push(key);
    monthlyData[key] = 0;
  }
  for (const b of recentBookings) {
    const key = new Date(b.rentalDate).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    if (key in monthlyData) monthlyData[key] += b.totalAmount;
  }

  const buggies = Array.from({ length: VEHICLES.buggy.stock }, (_, i) => ({
    num: i + 1,
    available: i >= bookedBuggiesCount,
  }));
  const compacts = Array.from({ length: VEHICLES.compact.stock }, (_, i) => ({
    num: i + 1,
    available: i >= bookedCompactsCount,
  }));

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      <AdminNav locale={locale} />
      <main className="ml-0 lg:ml-60 p-6 pt-20 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-[#0F2035]">Fleet Management</h1>
            <p className="text-gray-400 text-sm mt-0.5">Vehicle availability and revenue overview</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Vehicles", value: `${VEHICLES.buggy.stock + VEHICLES.compact.stock}`, icon: Car, gradient: "from-[#1B4F72] to-[#2471A3]" },
              { label: "Available Today", value: availableToday.toString(), icon: Car, gradient: "from-[#0e7c7b] to-[#7FB5B5]" },
              { label: "Total Rentals", value: String(totalRentals), icon: Users, gradient: "from-[#E8836A] to-[#e8a06a]" },
              { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, gradient: "from-[#6c3483] to-[#9b59b6]" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className={`bg-gradient-to-br ${s.gradient} rounded-2xl p-5 shadow-lg text-white`}>
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-3xl font-black leading-none">{s.value}</div>
                  <div className="text-white/70 text-xs mt-1.5 font-medium">{s.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fleet status today */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-[#0F2035] mb-4 flex items-center gap-2">
                <Car className="w-4 h-4" /> Fleet Status Today
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">🚗 Open-Air Buggies</p>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {buggies.map((v) => (
                  <div key={v.num} className={`aspect-square rounded-xl flex flex-col items-center justify-center text-white font-bold text-sm ${v.available ? "bg-green-500" : "bg-[#E8836A]"}`}>
                    <Car className="w-5 h-5 mb-0.5" />
                    <span className="text-xs">#{v.num}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">🚙 Compact Cars (A/C)</p>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {compacts.map((v) => (
                  <div key={v.num} className={`aspect-square rounded-xl flex flex-col items-center justify-center text-white font-bold text-sm ${v.available ? "bg-green-500" : "bg-[#7FB5B5]"}`}>
                    <Car className="w-5 h-5 mb-0.5" />
                    <span className="text-xs">#{v.num}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-500" /> Available ({availableToday})</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#E8836A]" /> Rented ({bookedToday})</span>
              </div>
            </div>

            {/* Revenue by month */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-[#0F2035] mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Revenue by Month
              </h2>
              {monthKeys.every((k) => monthlyData[k] === 0) ? (
                <p className="text-gray-400 text-sm">No data yet</p>
              ) : (
                <div className="space-y-3">
                  {monthKeys.map((month) => {
                      const amount = monthlyData[month];
                      const max = Math.max(...Object.values(monthlyData), 1);
                      const pct = (amount / max) * 100;
                      return (
                        <div key={month} className="flex items-center gap-3">
                          <div className="text-xs text-gray-500 w-14 shrink-0">{month}</div>
                          <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#1B4F72] to-[#7FB5B5] transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="text-xs font-bold text-[#1B4F72] w-16 text-right">{formatCurrency(amount)}</div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
