"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Check, X, CheckCircle, Trash2 } from "lucide-react";

interface Booking {
  id: string;
  status: string;
  paymentStatus: string;
  adminNotes: string | null;
}

interface Props {
  booking: Booking;
  locale: string;
}

export function BookingActions({ booking, locale }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState(booking.adminNotes || "");

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
    await updateBooking({ adminNotes });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
      <h2 className="font-bold text-[#1B4F72] text-sm border-b border-gray-100 pb-3">Actions</h2>

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
        <Button size="sm" variant="ghost" className="mt-1 w-full" onClick={saveNotes}>
          Save Notes
        </Button>
      </div>
    </div>
  );
}
