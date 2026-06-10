"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Lock, Unlock } from "lucide-react";
import { cn, parseItems, VEHICLES } from "@/lib/utils";

interface Booking {
  id: string;
  rentalDate: Date;
  items: string;
  guestName: string;
  status: string;
}

interface BlockedDate {
  id: string;
  date: Date;
  reason: string | null;
}

interface Props {
  bookings: Booking[];
  blockedDates: BlockedDate[];
  locale: string;
}

const MAX_VEHICLES = Object.values(VEHICLES).reduce((s, v) => s + v.stock, 0);
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export function CalendarView({ bookings, blockedDates, locale }: Props) {
  const router = useRouter();
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [blockingDate, setBlockingDate] = useState<string | null>(null);
  const [blockReason, setBlockReason] = useState("");

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function dateKey(d: Date) {
    return d.toISOString().split("T")[0];
  }

  // Group bookings by date
  const bookingsByDate = new Map<string, Booking[]>();
  for (const b of bookings) {
    const k = dateKey(new Date(b.rentalDate));
    bookingsByDate.set(k, [...(bookingsByDate.get(k) || []), b]);
  }

  const blockedSet = new Set(blockedDates.map((b) => dateKey(new Date(b.date))));

  async function toggleBlock(dateStr: string) {
    if (blockedSet.has(dateStr)) {
      const bd = blockedDates.find((b) => dateKey(new Date(b.date)) === dateStr);
      if (!bd) return;
      await fetch(`/api/admin/blocked-dates/${bd.id}`, { method: "DELETE" });
      router.refresh();
    } else {
      setBlockingDate(dateStr);
    }
  }

  async function confirmBlock() {
    if (!blockingDate) return;
    await fetch("/api/admin/blocked-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: blockingDate, reason: blockReason }),
    });
    setBlockingDate(null);
    setBlockReason("");
    router.refresh();
  }

  return (
    <div>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-[#1B4F72]">{MONTHS[month]} {year}</h2>
        <button
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-200" /> Available</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-yellow-200" /> Partial</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-200" /> Full ({MAX_VEHICLES} vehicles)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-gray-300" /> Blocked</span>
      </div>

      {/* Calendar grid */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-100">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-bold text-gray-400 py-3">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {/* Empty cells before month starts */}
          {[...Array(firstDay)].map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[80px] border-b border-r border-gray-50" />
          ))}

          {/* Days */}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const date = new Date(year, month, day);
            const dateStr = dateKey(date);
            const dayBookings = bookingsByDate.get(dateStr) || [];
            const bookedVehicles = dayBookings.reduce((s: number, b: any) => s + parseItems(b.items).reduce((si: number, i: any) => si + i.qty, 0), 0);
            const isBlocked = blockedSet.has(dateStr);
            const isPast = date < today && dateKey(date) !== dateKey(today);
            const isFull = bookedVehicles >= MAX_VEHICLES;
            const isPartial = bookedVehicles > 0 && bookedVehicles < MAX_VEHICLES;
            const isToday = dateKey(date) === dateKey(today);

            return (
              <div
                key={day}
                className={cn(
                  "min-h-[80px] border-b border-r border-gray-50 p-1.5 relative group",
                  isBlocked && "bg-gray-100",
                  isFull && !isBlocked && "bg-red-50",
                  isPartial && !isBlocked && "bg-yellow-50",
                  !isFull && !isPartial && !isBlocked && !isPast && "bg-green-50",
                  isPast && "opacity-40"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full",
                    isToday ? "bg-[#1B4F72] text-white text-xs" : "text-gray-700"
                  )}>
                    {day}
                  </span>
                  {!isPast && (
                    <button
                      onClick={() => toggleBlock(dateStr)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-200 text-gray-400"
                      title={isBlocked ? "Unblock" : "Block date"}
                    >
                      {isBlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    </button>
                  )}
                </div>

                {/* Availability bar */}
                {bookedVehicles > 0 && (
                  <div className="mt-1 text-xs font-semibold text-gray-600">
                    {bookedVehicles}/{MAX_VEHICLES} 🚗
                  </div>
                )}

                {/* Bookings */}
                <div className="space-y-0.5 mt-1">
                  {dayBookings.slice(0, 2).map((b) => (
                    <a
                      key={b.id}
                      href={`/${locale}/admin/bookings/${b.id}`}
                      className="block text-xs px-1 py-0.5 rounded truncate bg-[#1B4F72]/10 text-[#1B4F72] hover:bg-[#1B4F72]/20 transition-colors"
                    >
                      {b.guestName}
                    </a>
                  ))}
                  {dayBookings.length > 2 && (
                    <a
                      href={`/${locale}/admin/bookings?date=${dateStr}`}
                      className="block text-xs text-[#1B4F72] font-semibold px-1 hover:underline"
                    >
                      +{dayBookings.length - 2} more
                    </a>
                  )}
                </div>

                {isBlocked && (
                  <div className="text-xs text-gray-400 mt-1 px-1">🔒 Blocked</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Block date modal */}
      {blockingDate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-[#1B4F72] mb-4">Block {blockingDate}</h3>
            <div className="mb-4">
              <label className="form-label">Reason (optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Maintenance, Holiday..."
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setBlockingDate(null)}
                className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl font-semibold text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmBlock}
                className="flex-1 py-2.5 bg-[#1B4F72] text-white rounded-xl font-semibold text-sm hover:bg-[#154060]"
              >
                Block Date
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
