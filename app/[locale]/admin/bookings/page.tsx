import { db } from "@/lib/db";
import { formatCurrency, parseItems, VEHICLES } from "@/lib/utils";
import { AdminShell, AdminHeader, AdminCard, EmptyState } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { BookingsSearch } from "@/components/admin/BookingsSearch";
import { ArrowRight, List, CalendarDays, X, Ship, Hotel, ChevronLeft, ChevronRight } from "lucide-react";
import { ClickableRow } from "@/components/admin/ClickableRow";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string; date?: string; q?: string; unpaid?: string; page?: string }>;
}

/** The list used to render every row in one page. At 180 bookings that is 180
 *  rows of markup on every visit, and it only ever grows. */
const PER_PAGE = 25;

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

export default async function BookingsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const { status, q, date, unpaid } = sp;
  const page = Math.max(1, Number(sp.page) || 1);

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (unpaid) where.paymentStatus = { not: "paid" };
  if (q) {
    where.OR = [
      { guestName: { contains: q, mode: "insensitive" } },
      { guestEmail: { contains: q, mode: "insensitive" } },
      { guestPhone: { contains: q } },
    ];
  }
  if (date) {
    const d = new Date(`${date}T00:00:00.000Z`);
    const next = new Date(+d + 86400000);
    where.rentalDate = { gte: d, lt: next };
  }

  const [total, bookings] = await Promise.all([
    db.booking.count({ where }),
    db.booking.findMany({
      where,
      orderBy: { rentalDate: "desc" },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    }),
  ]);

  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const from = total === 0 ? 0 : (page - 1) * PER_PAGE + 1;
  const to = Math.min(page * PER_PAGE, total);

  /* ── The filter bug ──
     This used to rebuild the query string from `status` and `q` only, so
     picking a status silently threw away the date filter — you would click
     "Pending" while looking at one day and land on every pending booking
     ever, with no indication anything had been dropped. Every link now starts
     from the current parameters and changes one of them. */
  function href(changes: Record<string, string | undefined>) {
    const next = new URLSearchParams();
    const merged = { status, q, date, unpaid, ...changes };
    for (const [k, v] of Object.entries(merged)) if (v) next.set(k, String(v));
    // Any change to the filters invalidates the page number.
    if (!("page" in changes)) next.delete("page");
    const qs = next.toString();
    return `/${locale}/admin/bookings${qs ? `?${qs}` : ""}`;
  }

  const statusFilters = [
    { value: undefined, label: "All" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const activeDateLabel = date
    ? new Date(`${date}T00:00:00.000Z`).toLocaleDateString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;

  const hasFilters = Boolean(status || q || date || unpaid);

  return (
    <AdminShell locale={locale}>
      <AdminHeader
        title="Bookings"
        eyebrow="Reservations"
        meta={total === 0 ? "No results" : `Showing ${from}–${to} of ${total}`}
      >
        <span className="w-10 h-10 bg-white rounded-xl shadow-sm ring-1 ring-[#0F2035]/[0.05] flex items-center justify-center">
          <List className="w-5 h-5 text-[#1B4F72]" aria-hidden="true" />
        </span>
      </AdminHeader>

      {activeDateLabel && (
        <div className="flex flex-wrap items-center gap-2 mb-4 bg-[#1B4F72]/[0.06] ring-1 ring-[#1B4F72]/20 rounded-xl px-4 py-2.5">
          <CalendarDays className="w-4 h-4 text-[#1B4F72] shrink-0" aria-hidden="true" />
          <span className="text-sm text-[#1B4F72] flex-1 min-w-0">
            Rentals on <span className="font-bold">{activeDateLabel}</span>
          </span>
          <Link
            href={href({ date: undefined })}
            className="flex items-center gap-1 text-xs text-[#1B4F72] hover:text-[#A8411F] font-bold transition-colors"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" /> Clear date
          </Link>
        </div>
      )}

      <AdminCard className="mb-5" padded={false}>
        <div className="p-4 flex flex-col lg:flex-row gap-3">
          <div className="flex-1 min-w-0">
            <BookingsSearch defaultValue={q} />
          </div>

          <div className="flex flex-wrap gap-2">
            {statusFilters.map((f) => {
              const active = status === f.value || (!status && !f.value);
              return (
                <Link
                  key={f.label}
                  href={href({ status: f.value })}
                  aria-current={active ? "page" : undefined}
                  className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors min-h-11 flex items-center ${
                    active
                      ? "bg-[#1B4F72] text-white"
                      : "bg-[#0F2035]/[0.05] text-[#55606E] hover:bg-[#0F2035]/[0.09]"
                  }`}
                >
                  {f.label}
                </Link>
              );
            })}

            {/* "Who still owes me money" is a daily question that previously
                meant reading the Payment column by eye. */}
            <Link
              href={href({ unpaid: unpaid ? undefined : "1" })}
              aria-pressed={Boolean(unpaid)}
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors min-h-11 flex items-center gap-1.5 ${
                unpaid
                  ? "bg-[#92400e] text-white"
                  : "bg-[#0F2035]/[0.05] text-[#55606E] hover:bg-[#0F2035]/[0.09]"
              }`}
            >
              Not fully paid
            </Link>
          </div>
        </div>

        {hasFilters && (
          <div className="px-4 pb-4 -mt-1">
            <Link
              href={`/${locale}/admin/bookings`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A8411F] hover:underline"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" /> Clear all filters
            </Link>
          </div>
        )}
      </AdminCard>

      <AdminCard padded={false} className="overflow-hidden">
        {bookings.length === 0 ? (
          <div className="py-6">
            <EmptyState icon={List}>
              {hasFilters ? "Nothing matches those filters." : "No bookings yet."}
            </EmptyState>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Bookings{status ? ` with status ${status}` : ""}, newest rental date first
              </caption>
              <thead>
                <tr className="bg-[#0F2035]/[0.03] text-left">
                  {["Guest", "Rental date", "Vehicles", "Pickup", "Total", "Status", "Payment"].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-5 sm:px-6 py-3.5 text-[#55606E] font-bold text-[0.7rem] uppercase tracking-[0.1em] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                  <th className="px-5 sm:px-6 py-3.5">
                    <span className="sr-only">Open</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0F2035]/[0.05]">
                {bookings.map((b) => (
                  <ClickableRow
                    key={b.id}
                    href={`/${locale}/admin/bookings/${b.id}`}
                    className="hover:bg-[#1B4F72]/[0.03] transition-colors group"
                  >
                    <td className="px-5 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="w-9 h-9 rounded-xl bg-[#1B4F72]/10 flex items-center justify-center text-[#1B4F72] font-bold text-sm shrink-0"
                        >
                          {b.guestName.trim().charAt(0).toUpperCase() || "?"}
                        </span>
                        <div className="min-w-0">
                          {/* A real link, so the row has an href for the
                              keyboard, for middle-click and for "copy link".
                              The row's own click handler only adds the
                              convenience of clicking anywhere in it. */}
                          <Link
                            href={`/${locale}/admin/bookings/${b.id}`}
                            className="font-semibold text-[#0F2035] group-hover:text-[#1B4F72] transition-colors hover:underline"
                          >
                            {b.guestName}
                          </Link>
                          {/* Both of these were text-[#55606E] at 2.54:1. */}
                          <div className="text-xs text-[#55606E] truncate">{b.guestEmail}</div>
                          <div className="text-xs text-[#55606E]">{b.guestPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 sm:px-6 py-4 text-[#55606E] whitespace-nowrap">
                      {new Date(b.rentalDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        timeZone: "UTC",
                      })}
                    </td>
                    <td className="px-5 sm:px-6 py-4 text-[#55606E] text-xs">
                      {parseItems(b.items)
                        .filter((i) => i.qty > 0)
                        /* Unguarded before: `VEHICLES[i.type].label` throws
                           and takes the whole page down if a booking carries a
                           vehicle type that is no longer in the config. */
                        .map((i) => `${i.qty}× ${VEHICLES[i.type]?.label ?? i.type}`)
                        .join(", ") || "—"}
                    </td>
                    <td className="px-5 sm:px-6 py-4 text-[#55606E] text-xs">
                      <span className="inline-flex items-center gap-1.5">
                        {b.deliveryType === "pickup" ? (
                          <>
                            <Ship className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> Port pickup
                          </>
                        ) : (
                          <>
                            <Hotel className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> {b.hotelName ?? "Hotel"}
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-5 sm:px-6 py-4 font-display font-black text-[#0F2035] tabular-nums whitespace-nowrap">
                      {formatCurrency(b.totalAmount)}
                    </td>
                    <td className="px-5 sm:px-6 py-4">
                      <Badge variant={statusVariant(b.status)}>{b.status}</Badge>
                    </td>
                    <td className="px-5 sm:px-6 py-4">
                      <Badge variant={paymentVariant(b.paymentStatus)}>{b.paymentStatus.replace("_", " ")}</Badge>
                    </td>
                    <td className="px-5 sm:px-6 py-4">
                      <ArrowRight
                        className="w-4 h-4 text-[#55606E] transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </td>
                  </ClickableRow>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <nav
            aria-label="Pagination"
            className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t border-[#0F2035]/[0.06]"
          >
            <p className="text-xs text-[#55606E]">
              Page {page} of {pages}
            </p>
            <div className="flex items-center gap-2">
              <PageLink href={href({ page: String(page - 1) })} disabled={page <= 1} label="Previous">
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                Previous
              </PageLink>
              <PageLink href={href({ page: String(page + 1) })} disabled={page >= pages} label="Next">
                Next
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </PageLink>
            </div>
          </nav>
        )}
      </AdminCard>
    </AdminShell>
  );
}

function PageLink({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const shell =
    "inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-bold min-h-11 transition-colors";
  if (disabled) {
    return (
      <span aria-disabled="true" className={`${shell} text-[#55606E]/50 bg-[#0F2035]/[0.03] cursor-default`}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} aria-label={label} className={`${shell} text-[#1B4F72] bg-[#1B4F72]/[0.07] hover:bg-[#1B4F72]/[0.12]`}>
      {children}
    </Link>
  );
}
