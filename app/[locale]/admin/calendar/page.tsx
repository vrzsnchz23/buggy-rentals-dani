import { db } from "@/lib/db";
import { AdminNav } from "@/components/admin/AdminNav";
import { CalendarView } from "@/components/admin/CalendarView";

export default async function CalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 3, 0);

  const [bookings, blockedDates] = await Promise.all([
    db.booking.findMany({
      where: {
        rentalDate: { gte: start, lte: end },
        status: { not: "cancelled" },
      },
      select: { id: true, rentalDate: true, items: true, guestName: true, status: true },
    }),
    db.blockedDate.findMany({
      where: { date: { gte: start, lte: end } },
    }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav locale={locale} />
      <main className="ml-0 lg:ml-60 p-6 pt-20 lg:pt-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-black text-[#1B4F72] mb-6">Fleet Calendar</h1>
          <CalendarView bookings={bookings} blockedDates={blockedDates} locale={locale} />
        </div>
      </main>
    </div>
  );
}
