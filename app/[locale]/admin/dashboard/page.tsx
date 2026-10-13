import { db } from "@/lib/db";
import { formatCurrency, formatDate, parseItems, VEHICLES } from "@/lib/utils";
import { AdminShell, AdminHeader, AdminCard, CardHeader, EmptyState } from "@/components/admin/AdminShell";
import { StatCard } from "@/components/admin/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Car, DollarSign, Calendar, TrendingUp, ArrowRight, Clock, AlertTriangle, Ship, Hotel } from "lucide-react";
import Link from "next/link";
/** Shared by the table and the lists, so a status never renders two ways. */
function statusVariant(s: string): "default" | "success" | "warning" | "danger" | "info" {
  if (s === "confirmed") return "success";
  if (s === "pending") return "warning";
  if (s === "cancelled") return "danger";
  if (s === "completed") return "info";
  return "default";
}

function paymentVariant(s: string): "success" | "info" | "warning" {
  if (s === "paid") return "success";
  if (s === "deposit_paid") return "info";
  return "warning";
}

/** `VEHICLES[i.type].label` is unguarded in a couple of places; an items row
 *  carrying a type that is no longer in the config would throw while
 *  rendering. Falling back to the raw type keeps the page up. */
function vehicleSummary(items: unknown) {
  const list = parseItems(items)
    .filter((i) => i.qty > 0)
    .map((i) => `${i.qty}× ${VEHICLES[i.type]?.label ?? i.type}`);
  return list.length ? list.join(", ") : "—";
}

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [allBookings, todayBookings, upcomingBookings, monthlyBookings, needsAction, recentBookings] =
    await Promise.all([
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
      /* ── New ──
         The dashboard reported totals but never said what needed doing, so
         "which bookings are still unconfirmed?" meant going to the list and
         filtering by hand. These are the ones that are still pending with the
         rental date already in reach. */
      db.booking.findMany({
        where: { status: "pending", rentalDate: { gte: today } },
        orderBy: { rentalDate: "asc" },
        take: 6,
      }),
      db.booking.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    ]);

  const monthlyRevenue = monthlyBookings.reduce((s, b) => s + b.totalAmount, 0);
  const monthlyVehicles = monthlyBookings.reduce(
    (s, b) => s + parseItems(b.items).reduce((si, i) => si + i.qty, 0),
    0
  );
  const unpaidToday = todayBookings.filter((b) => b.paymentStatus === "unpaid").length;
  const monthPaid = monthlyBookings.filter((b) => b.paymentStatus === "paid").length;

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";

  const bookingsHref = (qs: string) => `/${locale}/admin/bookings${qs ? `?${qs}` : ""}`;
  const todayParam = `date=${today.toISOString().slice(0, 10)}`;

  return (
    <AdminShell locale={locale}>
      {/* The waving-hand emoji is gone: a screen reader read the greeting as
          "Good evening, Dani waving hand". */}
      <AdminHeader title="Dashboard" eyebrow={`${greeting}, Dani`} meta={formatDate(new Date())} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-6">
        <StatCard
          label="Rentals today"
          value={todayBookings.length}
          hint={unpaidToday ? `${unpaidToday} still unpaid` : undefined}
          icon={Car}
          tone="coral"
          href={bookingsHref(todayParam)}
        />
        <StatCard
          label="Revenue this month"
          value={formatCurrency(monthlyRevenue)}
          hint={`${monthPaid} of ${monthlyBookings.length} paid`}
          icon={DollarSign}
          tone="teal"
        />
        <StatCard
          label="Vehicles out this month"
          value={monthlyVehicles}
          icon={TrendingUp}
          tone="plum"
        />
        <StatCard
          label="Bookings all time"
          value={allBookings}
          icon={Calendar}
          tone="navy"
          href={bookingsHref("")}
        />
      </div>

      {/* ─── Needs attention ─── */}
      {needsAction.length > 0 && (
        <AdminCard className="mb-6 !ring-[#92400e]/20 !bg-[#FFFBEB]">
          <CardHeader icon={AlertTriangle} title="Waiting on you" tone="coral">
            <Link
              href={bookingsHref("status=pending")}
              className="text-xs font-bold text-[#A8411F] hover:underline whitespace-nowrap"
            >
              See all pending
            </Link>
          </CardHeader>
          <p className="text-sm text-[#55606E] -mt-3 mb-4">
            {needsAction.length === 1
              ? "One upcoming booking is still unconfirmed."
              : `${needsAction.length} upcoming bookings are still unconfirmed.`}
          </p>
          <ul className="grid sm:grid-cols-2 gap-2.5">
            {needsAction.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/${locale}/admin/bookings/${b.id}`}
                  className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-3 ring-1 ring-[#0F2035]/[0.06] hover:ring-[#A8411F]/40 transition-shadow group"
                >
                  <Initial name={b.guestName} tone="coral" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-sm text-[#0F2035] truncate">{b.guestName}</span>
                    <span className="block text-xs text-[#55606E]">{shortDate(b.rentalDate)}</span>
                  </span>
                  <span className="font-display font-black text-sm text-[#0F2035] tabular-nums shrink-0">
                    {formatCurrency(b.totalAmount)}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#55606E] shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </AdminCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* ─── Today ─── */}
        <AdminCard className="lg:col-span-2">
          <CardHeader icon={Car} title="Today's rentals" tone="coral">
            <Link
              href={bookingsHref(todayParam)}
              className="text-xs font-bold bg-[#C05232]/10 text-[#A8411F] px-2.5 py-1 rounded-full hover:bg-[#C05232]/15 transition-colors whitespace-nowrap"
            >
              {todayBookings.length} today
            </Link>
          </CardHeader>

          {todayBookings.length === 0 ? (
            <EmptyState icon={Car}>Nothing going out today.</EmptyState>
          ) : (
            <ul className="space-y-2">
              {todayBookings.map((b) => (
                <li key={b.id}>
                  <Link
                    href={`/${locale}/admin/bookings/${b.id}`}
                    className="flex flex-wrap items-center gap-x-3 gap-y-2 p-3.5 rounded-xl ring-1 ring-[#0F2035]/[0.06] hover:bg-[#1B4F72]/[0.03] hover:ring-[#1B4F72]/20 transition-colors group"
                  >
                    <Initial name={b.guestName} tone="navy" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-sm text-[#0F2035]">{b.guestName}</span>
                      {/* These sub-lines were text-[#55606E]: 2.54:1. */}
                      <span className="flex flex-wrap items-center gap-x-1.5 text-xs text-[#55606E] mt-0.5">
                        <span>{vehicleSummary(b.items)}</span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1">
                          {b.deliveryType === "pickup" ? (
                            <>
                              <Ship className="w-3 h-3" aria-hidden="true" /> Port pickup
                            </>
                          ) : (
                            <>
                              <Hotel className="w-3 h-3" aria-hidden="true" /> {b.hotelName}
                            </>
                          )}
                        </span>
                      </span>
                    </span>
                    <span className="flex items-center gap-2 shrink-0">
                      <Badge variant={statusVariant(b.status)}>{b.status}</Badge>
                      <Badge variant={paymentVariant(b.paymentStatus)}>{b.paymentStatus.replace("_", " ")}</Badge>
                      {/* Money was #E8836A at 2.66:1 — the figure that matters
                          most was the faintest thing in the row. */}
                      <span className="font-display font-black text-sm text-[#0F2035] tabular-nums">
                        {formatCurrency(b.totalAmount)}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#55606E] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        {/* ─── Upcoming ─── */}
        <AdminCard className="flex flex-col">
          <CardHeader icon={Clock} title="Coming up" tone="navy" />
          {upcomingBookings.length === 0 ? (
            <EmptyState icon={Clock}>Nothing on the books yet.</EmptyState>
          ) : (
            <ul className="space-y-1 flex-1">
              {upcomingBookings.map((b) => (
                <li key={b.id}>
                  <Link
                    href={`/${locale}/admin/bookings/${b.id}`}
                    className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-[#1B4F72]/[0.04] transition-colors"
                  >
                    <Initial name={b.guestName} tone="coral" small />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-sm text-[#0F2035] truncate">{b.guestName}</span>
                      <span className="block text-xs text-[#55606E]">{shortDate(b.rentalDate)}</span>
                    </span>
                    <span className="text-xs font-display font-black text-[#0F2035] tabular-nums shrink-0">
                      {formatCurrency(b.totalAmount)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={bookingsHref("")}
            className="flex items-center justify-center gap-1.5 mt-5 pt-4 border-t border-[#0F2035]/[0.07] text-sm text-[#1B4F72] font-bold hover:text-[#A8411F] transition-colors"
          >
            All bookings <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </AdminCard>
      </div>

      {/* ─── Recent ─── */}
      <AdminCard className="mt-6 overflow-hidden" padded={false}>
        <div className="p-5 sm:p-6 pb-4 flex items-center justify-between gap-3">
          <h2 className="font-bold text-[#0F2035]">Latest bookings</h2>
          <Link
            href={bookingsHref("")}
            className="text-xs text-[#1B4F72] font-bold hover:text-[#A8411F] transition-colors flex items-center gap-1 whitespace-nowrap"
          >
            View all <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="pb-6">
            <EmptyState icon={Calendar}>No bookings yet.</EmptyState>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">The six most recently created bookings</caption>
              <thead>
                <tr className="bg-[#0F2035]/[0.03] text-left">
                  {["Guest", "Rental date", "Vehicles", "Total", "Status", "Payment"].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-5 sm:px-6 py-3 text-[#55606E] font-bold text-[0.7rem] uppercase tracking-[0.1em] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0F2035]/[0.05]">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#1B4F72]/[0.03] transition-colors">
                    <td className="px-5 sm:px-6 py-3.5">
                      <Link href={`/${locale}/admin/bookings/${b.id}`} className="group flex items-center gap-3">
                        <Initial name={b.guestName} tone="navy" small />
                        <span className="min-w-0">
                          <span className="block font-semibold text-[#0F2035] group-hover:text-[#1B4F72] transition-colors truncate">
                            {b.guestName}
                          </span>
                          <span className="block text-xs text-[#55606E] truncate">{b.guestEmail}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-[#55606E] whitespace-nowrap">{shortDate(b.rentalDate)}</td>
                    <td className="px-5 sm:px-6 py-3.5 text-[#55606E] text-xs">{vehicleSummary(b.items)}</td>
                    <td className="px-5 sm:px-6 py-3.5 font-display font-black text-[#0F2035] tabular-nums whitespace-nowrap">
                      {formatCurrency(b.totalAmount)}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5">
                      <Badge variant={statusVariant(b.status)}>{b.status}</Badge>
                    </td>
                    <td className="px-5 sm:px-6 py-3.5">
                      <Badge variant={paymentVariant(b.paymentStatus)}>{b.paymentStatus.replace("_", " ")}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </AdminShell>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */

/** The initial tile that stands in for a guest avatar. */
function Initial({ name, tone, small = false }: { name: string; tone: "navy" | "coral"; small?: boolean }) {
  const tones = {
    navy: "bg-[#1B4F72]/10 text-[#1B4F72]",
    coral: "bg-[#C05232]/10 text-[#A8411F]",
  };
  return (
    <span
      aria-hidden="true"
      className={`${small ? "w-8 h-8 text-xs" : "w-9 h-9 text-sm"} rounded-xl flex items-center justify-center font-bold shrink-0 ${tones[tone]}`}
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}

/** A rental date. Pinned to UTC: these are stored as calendar dates, and
 *  formatting them in Cozumel's UTC-5 renders the day before. */
function shortDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
