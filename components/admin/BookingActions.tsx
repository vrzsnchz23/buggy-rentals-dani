"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  X,
  CheckCircle,
  Trash2,
  AlertTriangle,
  CalendarDays,
  Mail,
  CreditCard,
  Loader2,
  Settings2,
} from "lucide-react";

interface Booking {
  id: string;
  status: string;
  paymentStatus: string;
  adminNotes: string | null;
  rentalDate: Date | string;
  returnDate?: Date | string | null;
  /** Shown in the confirmation before an email is sent to them. */
  guestEmail?: string;
}

interface Props {
  booking: Booking;
  locale: string;
}

/** A date input wants YYYY-MM-DD in the calendar the date was written in.
 *  toISOString() renders UTC, which is the right frame here — the API stores
 *  these as noon UTC — but it has to be sliced before any local conversion. */
function toDateInput(d: Date | string | null | undefined) {
  if (!d) return "";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(+dt)) return "";
  return dt.toISOString().slice(0, 10);
}

export function BookingActions({ booking, locale }: Props) {
  const router = useRouter();

  /** The key of the action in flight. Each button has its own, so confirming
   *  no longer puts the cancel and complete buttons into a spinner too — they
   *  all shared `loading === "status"` before. */
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const [adminNotes, setAdminNotes] = useState(booking.adminNotes || "");
  const [confirmKind, setConfirmKind] = useState<"cancel" | "delete" | "email" | null>(null);
  const [editingDate, setEditingDate] = useState(false);
  const [newRentalDate, setNewRentalDate] = useState(toDateInput(booking.rentalDate));
  const [newReturnDate, setNewReturnDate] = useState(toDateInput(booking.returnDate));

  const flash = (key: string) => {
    setDone(key);
    setTimeout(() => setDone((d) => (d === key ? null : d)), 2500);
  };

  /**
   * Every mutation went through `await fetch(...)` with no check on the
   * response. A failed PATCH — expired session, 500, offline — left the UI
   * showing "✓ Saved" while `router.refresh()` quietly put the old value
   * back. You could cancel a booking, see it succeed, and have it still be
   * live. Now nothing reports success unless the server said so.
   */
  async function send(key: string, body: Record<string, unknown>, successKey = key) {
    setBusy(key);
    setError(null);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        let detail = `${res.status} ${res.statusText}`;
        try {
          const json = await res.json();
          if (json?.error) detail = String(json.error);
        } catch {
          /* a non-JSON error body is still an error */
        }
        throw new Error(detail);
      }
      flash(successKey);
      router.refresh();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Nothing was saved.");
      return false;
    } finally {
      setBusy(null);
    }
  }

  async function resendEmail() {
    setBusy("email");
    setError(null);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}/resend-email`, { method: "POST" });
      if (!res.ok) {
        let detail = `${res.status} ${res.statusText}`;
        try {
          const json = await res.json();
          if (json?.error) detail = String(json.error);
        } catch {
          /* ignore */
        }
        throw new Error(detail);
      }
      setConfirmKind(null);
      flash("email");
    } catch (e) {
      setError(e instanceof Error ? e.message : "The email could not be sent.");
    } finally {
      setBusy(null);
    }
  }

  async function saveDates() {
    // The return-date field used to render only when one already existed, so
    // a one-day booking could never be extended. Clearing it has to send null:
    // an empty string reaches Prisma as "" for a DateTime? column and fails the
    // whole update, which would take the rentalDate edit in the same request
    // down with it.
    const body: Record<string, unknown> = {
      rentalDate: newRentalDate,
      returnDate: newReturnDate || null,
    };
    if (await send("dates", body)) setEditingDate(false);
  }

  async function remove() {
    setBusy("delete");
    setError(null);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      router.push(`/${locale}/admin/bookings`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The booking could not be deleted.");
      setBusy(null);
    }
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm ring-1 ring-[#0F2035]/[0.05] p-5 space-y-4">
      <h2 className="font-bold text-[#0F2035] text-sm flex items-center gap-2 border-b border-[#0F2035]/[0.07] pb-3">
        <span className="w-7 h-7 rounded-lg bg-[#1B4F72]/10 flex items-center justify-center text-[#1B4F72]">
          <Settings2 className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
        Actions
      </h2>

      {/* The only place a failure could ever be reported. */}
      {error && (
        <p
          role="alert"
          className="flex items-start gap-2 bg-red-50 ring-1 ring-red-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#b91c1c]"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-px" aria-hidden="true" />
          <span>
            Nothing was saved — {error}
          </span>
        </p>
      )}

      <div className="space-y-2">
        {booking.status === "pending" && (
          <ActionButton
            tone="primary"
            icon={Check}
            busy={busy === "confirm"}
            onClick={() => send("confirm", { status: "confirmed" })}
          >
            Confirm booking
          </ActionButton>
        )}

        {booking.status === "confirmed" && (
          <ActionButton
            tone="success"
            icon={CheckCircle}
            busy={busy === "complete"}
            onClick={() => send("complete", { status: "completed" })}
          >
            Mark completed
          </ActionButton>
        )}

        {booking.paymentStatus !== "paid" && (
          <ActionButton
            tone="quiet"
            icon={CreditCard}
            busy={busy === "paid"}
            onClick={() => send("paid", { paymentStatus: "paid" })}
          >
            {done === "paid" ? "Marked as paid" : "Mark as paid"}
          </ActionButton>
        )}

        {/* Cancelling used to go through window.confirm(), while deleting had
            a proper inline confirmation. Both are inline now. */}
        {booking.status !== "cancelled" && confirmKind !== "cancel" && (
          <ActionButton tone="danger" icon={X} busy={false} onClick={() => setConfirmKind("cancel")}>
            Cancel booking
          </ActionButton>
        )}

        {confirmKind === "cancel" && (
          <ConfirmBox
            title="Cancel this booking?"
            note="The guest is not emailed automatically."
            confirmLabel="Yes, cancel it"
            busy={busy === "cancel"}
            onCancel={() => setConfirmKind(null)}
            onConfirm={async () => {
              if (await send("cancel", { status: "cancelled" })) setConfirmKind(null);
            }}
          />
        )}

        {booking.status === "cancelled" && (
          <div className="pt-2 border-t border-[#0F2035]/[0.07]">
            {confirmKind !== "delete" ? (
              <button
                onClick={() => setConfirmKind("delete")}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-[#55606E] hover:text-[#b91c1c] hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" /> Delete permanently
              </button>
            ) : (
              <ConfirmBox
                title="Delete this booking?"
                note="This cannot be undone."
                confirmLabel="Yes, delete"
                busy={busy === "delete"}
                onCancel={() => setConfirmKind(null)}
                onConfirm={remove}
              />
            )}
          </div>
        )}
      </div>

      {/* ── Dates ── */}
      <div className="border-t border-[#0F2035]/[0.07] pt-4">
        {!editingDate ? (
          <button
            onClick={() => setEditingDate(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs text-[#55606E] hover:text-[#1B4F72] hover:bg-[#1B4F72]/5 rounded-lg transition-colors font-bold"
          >
            <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
            {done === "dates" ? "Dates updated" : "Edit dates"}
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-xs font-bold text-[#0F2035] flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" /> Edit dates
            </p>
            <div>
              <label htmlFor="rentalDate" className="text-xs font-semibold text-[#55606E] mb-1 block">
                Rental date
              </label>
              <input
                id="rentalDate"
                type="date"
                className="form-input text-sm"
                value={newRentalDate}
                onChange={(e) => setNewRentalDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="returnDate" className="text-xs font-semibold text-[#55606E] mb-1 block">
                Return date <span className="font-normal">(leave empty for a one-day rental)</span>
              </label>
              <input
                id="returnDate"
                type="date"
                className="form-input text-sm"
                min={newRentalDate || undefined}
                value={newReturnDate}
                onChange={(e) => setNewReturnDate(e.target.value)}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setEditingDate(false)}
                className="flex-1 py-2 text-xs font-bold border border-[#0F2035]/15 rounded-lg text-[#55606E] hover:bg-[#0F2035]/[0.04] min-h-11"
              >
                Cancel
              </button>
              <button
                onClick={saveDates}
                disabled={!newRentalDate || busy === "dates"}
                className="flex-1 py-2 text-xs font-bold bg-[#1B4F72] text-white rounded-lg hover:bg-[#164463] disabled:opacity-50 min-h-11 inline-flex items-center justify-center gap-1.5"
              >
                {busy === "dates" && <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />}
                {busy === "dates" ? "Saving…" : "Save dates"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Resend the confirmation ──
          One click used to send a real email to a real guest with no
          confirmation step and no way to undo it. */}
      <div className="border-t border-[#0F2035]/[0.07] pt-4">
        {confirmKind === "email" ? (
          <ConfirmBox
            tone="navy"
            title="Resend the confirmation email?"
            note={booking.guestEmail ? `It goes to ${booking.guestEmail}.` : "It goes to the guest's email."}
            confirmLabel="Send it"
            busy={busy === "email"}
            onCancel={() => setConfirmKind(null)}
            onConfirm={resendEmail}
          />
        ) : (
          <button
            onClick={() => setConfirmKind("email")}
            className={`w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-colors ${
              done === "email"
                ? "text-[#047857] bg-emerald-50"
                : "text-[#55606E] hover:text-[#1B4F72] hover:bg-[#1B4F72]/5"
            }`}
          >
            <Mail className="w-3.5 h-3.5" aria-hidden="true" />
            {done === "email" ? "Email sent" : "Resend confirmation email"}
          </button>
        )}
      </div>

      {/* ── Notes ── */}
      <div className="border-t border-[#0F2035]/[0.07] pt-4">
        <label htmlFor="adminNotes" className="text-xs font-bold text-[#0F2035] mb-1.5 block">
          Internal notes
        </label>
        <textarea
          id="adminNotes"
          className="form-input h-20 resize-none text-sm"
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Only you can see these."
        />
        <button
          onClick={() => send("notes", { adminNotes })}
          disabled={busy === "notes"}
          className="mt-2 w-full py-2 text-xs font-bold rounded-lg bg-[#0F2035]/[0.05] text-[#0F2035] hover:bg-[#0F2035]/[0.09] disabled:opacity-50 min-h-11 inline-flex items-center justify-center gap-1.5"
        >
          {busy === "notes" && <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />}
          {done === "notes" ? "Notes saved" : "Save notes"}
        </button>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */

function ActionButton({
  children,
  icon: Glyph,
  tone,
  busy,
  onClick,
}: {
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  tone: "primary" | "success" | "danger" | "quiet";
  busy: boolean;
  onClick: () => void;
}) {
  const tones = {
    primary: "bg-[#1B4F72] text-white hover:bg-[#164463]",
    success: "bg-emerald-50 text-[#047857] hover:bg-emerald-100",
    danger: "bg-red-50 text-[#b91c1c] hover:bg-red-100",
    quiet: "bg-[#0F2035]/[0.05] text-[#0F2035] hover:bg-[#0F2035]/[0.09]",
  };
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className={`w-full min-h-11 px-4 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-60 ${tones[tone]}`}
    >
      {busy ? (
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
      ) : (
        <Glyph className="w-4 h-4" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}

function ConfirmBox({
  title,
  note,
  confirmLabel,
  busy,
  onCancel,
  onConfirm,
  tone = "danger",
}: {
  title: string;
  note: string;
  confirmLabel: string;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  tone?: "danger" | "navy";
}) {
  const danger = tone === "danger";
  return (
    <div
      className={`rounded-xl p-3 space-y-2.5 ring-1 ${danger ? "bg-red-50 ring-red-200" : "bg-[#1B4F72]/[0.06] ring-[#1B4F72]/20"}`}
    >
      <p className={`flex items-start gap-1.5 text-xs font-bold ${danger ? "text-[#b91c1c]" : "text-[#1B4F72]"}`}>
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" aria-hidden="true" />
        <span>
          {title} <span className="font-semibold block mt-0.5 text-[#55606E]">{note}</span>
        </span>
      </p>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          disabled={busy}
          className="flex-1 min-h-11 text-xs font-bold border border-[#0F2035]/15 bg-white rounded-lg text-[#55606E] hover:bg-[#0F2035]/[0.04] disabled:opacity-50"
        >
          Keep as is
        </button>
        <button
          onClick={onConfirm}
          disabled={busy}
          className={`flex-1 min-h-11 text-xs font-bold text-white rounded-lg disabled:opacity-50 inline-flex items-center justify-center gap-1.5 ${
            danger ? "bg-[#b91c1c] hover:bg-[#991b1b]" : "bg-[#1B4F72] hover:bg-[#164463]"
          }`}
        >
          {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />}
          {busy ? "Working…" : confirmLabel}
        </button>
      </div>
    </div>
  );
}
