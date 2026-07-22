"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Check, X, CheckCircle, Trash2, AlertTriangle, CalendarDays, Mail } from "lucide-react";

interface Booking {
  id: string;
  status: string;
  paymentStatus: string;
  adminNotes: string | null;
  rentalDate: Date | string;
  returnDate?: Date | string | null;
}

interface Props {
  booking: Booking;
  locale: string;
}

export function BookingActions({ booking, locale }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState(booking.adminNotes || "");
  const [notesSaved, setNotesSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editingDate, setEditingDate] = useState(false);
  const toDateInput = (d: Date | string | null | undefined) => {
    if (!d) return "";
    const dt = typeof d === "string" ? new Date(d) : d;
    return dt.toISOString().split("T")[0];
  };
  const [newRentalDate, setNewRentalDate] = useState(toDateInput(booking.rentalDate));
  const [newReturnDate, setNewReturnDate] = useState(toDateInput(booking.returnDate));
  const [dateSaved, setDateSaved] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function resendEmail() {
    setEmailStatus("sending");
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}/resend-email`, { method: "POST" });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed");
      }
      setEmailStatus("sent");
      setTimeout(() => setEmailStatus("idle"), 3000);
    } catch (err) {
      setEmailStatus("error");
      setTimeout(() => setEmailStatus("idle"), 4000);
    }
  }

  async function saveDates() {
    setLoading("dates");
    const body: Record<string, string> = { rentalDate: newRentalDate };
    if (newReturnDate) body.returnDate = newReturnDate;
    await fetch(`/api/admin/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(null);
    setDateSaved(true);
    setEditingDate(false);
    setTimeout(() => setDateSaved(false), 2500);
    router.refresh();
  }

  async function updateBooking(data: Record<string, string>) {
    const key = Object.keys(data)[0];
    setLoading(key);
    await fetch(`/api/admin/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    router.refresh();
    setLoading(null);
  }

  async function saveNotes() {
    setLoading("adminNotes");
    await fetch(`/api/admin/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminNotes }),
    });
    setLoading(null);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2500);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
      <h2 className="font-bold text-[#0F2035] text-sm flex items-center gap-2 border-b border-gray-100 pb-3">
        <span className="w-7 h-7 rounded-lg bg-[#1B4F72]/10 flex items-center justify-center text-[#1B4F72]">
          <Check className="w-3.5 h-3.5" />
        </span>
        Actions
      </h2>

      <div className="space-y-2">
        {booking.status === "pending" && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-center"
            onClick={() => updateBooking({ status: "confirmed" })}
            loading={loading === "status"}
          >
            <Check className="w-4 h-4" /> Confirm Booking
          </Button>
        )}

        {booking.status === "confirmed" && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center bg-green-50 text-green-700 hover:bg-green-100"
            onClick={() => updateBooking({ status: "completed" })}
            loading={loading === "status"}
          >
            <CheckCircle className="w-4 h-4" /> Mark Completed
          </Button>
        )}

        {booking.paymentStatus !== "paid" && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={() => updateBooking({ paymentStatus: "paid" })}
            loading={loading === "paymentStatus"}
          >
            <Check className="w-4 h-4" /> Mark as Paid
          </Button>
        )}

        {booking.status !== "cancelled" && (
          <Button
            variant="danger"
            size="sm"
            className="w-full justify-center"
            onClick={() => {
              if (confirm("Cancel this booking?")) updateBooking({ status: "cancelled" });
            }}
            loading={loading === "status"}
          >
            <X className="w-4 h-4" /> Cancel Booking
          </Button>
        )}

        {booking.status === "cancelled" && (
          <div className="pt-2 border-t border-gray-100">
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete booking permanently
              </button>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-red-700">
                  <AlertTriangle className="w-3.5 h-3.5" /> This cannot be undone
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    Keep
                  </button>
                  <button
                    onClick={async () => {
                      setLoading("delete");
                      await fetch(`/api/admin/bookings/${booking.id}`, { method: "DELETE" });
                      router.push(`/${locale}/admin/bookings`);
                    }}
                    disabled={loading === "delete"}
                    className="flex-1 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading === "delete" ? "Deleting…" : "Yes, delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit date */}
      <div className="border-t border-gray-100 pt-4">
        {!editingDate ? (
          <button
            onClick={() => setEditingDate(true)}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs text-gray-500 hover:text-[#1B4F72] hover:bg-[#1B4F72]/5 rounded-lg transition-colors font-semibold"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            {dateSaved ? "✓ Date updated" : "Edit Rental Date"}
          </button>
        ) : (
          <div className="space-y-2">
            <div className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" /> Edit Rental Date
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Rental date</label>
              <input
                type="date"
                className="form-input text-sm"
                value={newRentalDate}
                onChange={(e) => setNewRentalDate(e.target.value)}
              />
            </div>
            {booking.returnDate && (
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Return date</label>
                <input
                  type="date"
                  className="form-input text-sm"
                  value={newReturnDate}
                  onChange={(e) => setNewReturnDate(e.target.value)}
                />
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setEditingDate(false)}
                className="flex-1 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveDates}
                disabled={!newRentalDate || loading === "dates"}
                className="flex-1 py-1.5 text-xs font-semibold bg-[#1B4F72] text-white rounded-lg hover:bg-[#154060] disabled:opacity-50"
              >
                {loading === "dates" ? "Saving…" : "Save Date"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Resend confirmation email */}
      <div className="border-t border-gray-100 pt-4">
        <button
          onClick={resendEmail}
          disabled={emailStatus === "sending"}
          className={`w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-colors ${
            emailStatus === "sent"
              ? "text-green-600 bg-green-50"
              : emailStatus === "error"
              ? "text-red-500 bg-red-50"
              : "text-gray-500 hover:text-[#1B4F72] hover:bg-[#1B4F72]/5"
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          {emailStatus === "sending" ? "Sending…"
            : emailStatus === "sent" ? "✓ Email sent!"
            : emailStatus === "error" ? "Error — try again"
            : "Resend Confirmation Email"}
        </button>
      </div>

      {/* Admin notes */}
      <div>
        <label className="form-label text-xs">Admin Notes</label>
        <textarea
          className="form-input h-16 resize-none text-sm"
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Internal notes..."
        />
        <Button size="sm" variant="ghost" className="mt-1 w-full" onClick={saveNotes} loading={loading === "adminNotes"}>
          {notesSaved ? "✓ Saved" : "Save Notes"}
        </Button>
      </div>
    </div>
  );
}
