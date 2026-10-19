"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { QuickBookingForm } from "./QuickBookingForm";

/** Opens the quick-entry sheet. Kept separate so the dashboard page itself
 *  stays a server component and only this button ships client JS. */
export function NewBookingButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-[#C05232] hover:bg-[#A8411F] text-white font-black text-sm px-5 py-3 rounded-full transition-colors shadow-sm"
      >
        <Plus className="w-4 h-4" strokeWidth={3} />
        Nueva reserva
      </button>
      {open && <QuickBookingForm onClose={() => setOpen(false)} />}
    </>
  );
}
