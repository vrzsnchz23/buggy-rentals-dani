import { db } from "@/lib/db";
import { AdminNav } from "@/components/admin/AdminNav";
import { formatCurrency, parseItems, VEHICLES } from "@/lib/utils";
import { Car, Users, DollarSign, BarChart3 } from "lucide-react";

export default async function FleetPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayBookings, allTimeBookings] = await Promise.all([
    db.booking.findMany({
      where: {
        rentalDate: { gte: today, lt: new Date(today.getTime() + 86400000) },
        status: { not: "cancelled" },
      },
    }),
    db.booking.findMany({ where: { status: { not: "cancelled" } } }),
  ]);

  const bookedBuggiesCount = todayBookings.reduce((s: number, b: any) => s + parseItems(b.items).filter((i: any) => i.type === "buggy").reduce((si: number, i: any) => si + i.qty, 0), 0);
  const bookedCompactsCount = todayBookings.reduce((s: number, b: any) => s + parseItems(b.items).filter((i: any) => i.type === "compact").reduce((si: number, i: any) => si + i.qty, 0), 0);
  const bookedToday = bookedBuggiesCount + bookedCompactsCount;
  const availableToday = VEHICLES.buggy.stock + VEHICLES.compact.stock - bookedToday;
  const totalRevenue = allTimeBookings.reduce((s: number, b: any) => s + b.totalAmount, 0);
  const totalRentals = allTimeBookings.length;

  // Revenue by month (last 6 months)
  const monthlyData: Record<string, number> = {};
  for (const b of allTimeBookings) {
    const key = new Date(b.rentalDate).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    monthlyData[key] = (monthlyData[key] || 0) + b.totalAmount;
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
    <div className="min-h-screen bg-gray-50">
      <AdminNav locale={locale} />
      <main className="ml-0 lg:ml-60 p-6 pt-20 lg:pt-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-black text-[#1B4F72] mb-6">Fleet Management</h1>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Vehicles", value: `${VEHICLES.buggy.stock + VEHICLES.compact.stock}`, icon: Car, color: "#1B4F72" },
              { label: "Available Today", value: availableToday.toString(), icon: Car, color: "#10b981" },
              { label: "Total Rentals", value: totalRentals.toString(), icon: Users, color: "#E8836A" },
              { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, color: "#7FB5B5" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: s.color + "15" }}>
                    <Icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                  <div className="text-2xl font-black text-gray-800">{s.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fleet status today */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-[#1B4F72] mb-4 flex items-center gap-2">
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
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-[#1B4F72] mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Revenue by Month
              </h2>
              {Object.keys(monthlyData).length === 0 ? (
                <p className="text-gray-400 text-sm">No data yet</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(monthlyData)
                    .slice(-6)
                    .map(([month, amount]) => {
                      const max = Math.max(...Object.values(monthlyData));
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
