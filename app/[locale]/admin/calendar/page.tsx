import { db } from "@/lib/db";
import { AdminShell, AdminHeader } from "@/components/admin/AdminShell";
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
    <AdminShell locale={locale}>
      <AdminHeader title="Fleet calendar" eyebrow="Availability" meta="Rental schedule for the next three months" />
      <CalendarView bookings={bookings} blockedDates={blockedDates} locale={locale} />
    </AdminShell>
  );
}
