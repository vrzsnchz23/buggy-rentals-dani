import { db } from "@/lib/db";
import { AdminShell, AdminHeader } from "@/components/admin/AdminShell";
import { StatCard } from "@/components/admin/StatCard";
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

  /* Six `any` annotations across two lines, all of them inferable:
     todayBookings is typed by the Prisma query and parseItems returns
     CartItem[]. Counting both vehicle types in one pass as well. */
  const bookedByType = (type: string) =>
    todayBookings.reduce(
      (s, b) => s + parseItems(b.items).filter((i) => i.type === type).reduce((si, i) => si + i.qty, 0),
      0
    );
  const bookedBuggiesCount = bookedByType("buggy");
  const bookedCompactsCount = bookedByType("compact");
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

  const bookingsHref = `/${locale}/admin/bookings`;

  return (
    <AdminShell locale={locale}>
      <AdminHeader title="Fleet" eyebrow="Vehicles" meta="Availability today and revenue to date" />

      {/* The same four gradient cards the dashboard carried, with the same
          problem: white on the light end of each measured 5.30, 2.29, 2.17 and
          4.67 to one, and every label was white/70 and failed. */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-6">
        <StatCard label="Vehicles in the fleet" value={VEHICLES.buggy.stock + VEHICLES.compact.stock} icon={Car} tone="navy" />
        <StatCard label="Free today" value={availableToday} icon={Car} tone="teal" />
        <StatCard label="Rentals all time" value={totalRentals} icon={Users} tone="coral" href={bookingsHref} />
        <StatCard label="Revenue all time" value={formatCurrency(totalRevenue)} icon={DollarSign} tone="plum" />
      </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fleet status today */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-[#0F2035] mb-4 flex items-center gap-2">
                <Car className="w-4 h-4" /> Fleet Status Today
              </h2>
              <p className="text-xs font-bold text-[#55606E] uppercase tracking-widest mb-2">Open-Air Buggies</p>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {buggies.map((v) => (
                  <div key={v.num} className={`aspect-square rounded-xl flex flex-col items-center justify-center text-white font-bold text-sm ${v.available ? "bg-[#047857]" : "bg-[#A8411F]"}`}>
                    <Car className="w-5 h-5 mb-0.5" />
                    <span className="text-xs">#{v.num}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-[#55606E] uppercase tracking-widest mb-2">Compact Cars (A/C)</p>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {compacts.map((v) => (
                  <div key={v.num} className={`aspect-square rounded-xl flex flex-col items-center justify-center text-white font-bold text-sm ${v.available ? "bg-[#047857]" : "bg-[#2F6060]"}`}>
                    <Car className="w-5 h-5 mb-0.5" />
                    <span className="text-xs">#{v.num}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-2 text-xs text-[#55606E]">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#047857]" /> Available ({availableToday})</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#A8411F]" /> Rented ({bookedToday})</span>
              </div>
            </div>

            {/* Revenue by month */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-[#0F2035] mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Revenue by Month
              </h2>
              {monthKeys.every((k) => monthlyData[k] === 0) ? (
                <p className="text-[#55606E] text-sm">No data yet</p>
              ) : (
                <div className="space-y-3">
                  {monthKeys.map((month) => {
                      const amount = monthlyData[month];
                      const max = Math.max(...Object.values(monthlyData), 1);
                      const pct = (amount / max) * 100;
                      return (
                        <div key={month} className="flex items-center gap-3">
                          <div className="text-xs text-[#55606E] w-14 shrink-0">{month}</div>
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
    </AdminShell>
  );
}
