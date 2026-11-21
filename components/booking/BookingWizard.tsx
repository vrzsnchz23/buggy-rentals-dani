"use client";
import { useState, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Step1DateGroup } from "./Step1DateGroup";
import { Step2GuestInfo } from "./Step2GuestInfo";
import { Step3Payment } from "./Step3Payment";
import { Check, MessageCircle } from "lucide-react";
import { cn, VEHICLES, calcCartTotal, calcCartDeposit } from "@/lib/utils";
import type { CartItem, VehicleType } from "@/lib/utils";
import { BUSINESS } from "@/lib/business";

/** Digits only, the form wa.me wants. */
const WHATSAPP_NUMBER = BUSINESS.telephoneE164.replace(/\D/g, "");

export type { CartItem };

export type BookingData = {
  customerType: "cruise" | "staying";
  rentalDate: string;
  returnDate: string;
  items: CartItem[];
  totalAmount: number;
  depositAmount: number;
  deliveryType: "pickup" | "hotel_delivery";
  hotelName?: string;
  hotelAddress?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  driversLicense: string;
  cruiseName?: string;
  cruiseShip?: string;
  cruiseArrival?: string;
  notes?: string;
  paymentMethod: "online_full" | "online_deposit" | "cash";
  waiverAccepted: boolean;
};

function makeInitial(initialDate?: string, initialType?: string): BookingData {
  const items: CartItem[] = [];
  if (initialType && initialType in VEHICLES) {
    const vType = initialType as VehicleType;
    const v = VEHICLES[vType];
    items.push({ type: vType, qty: 1, unitPrice: v.price, subtotal: v.price });
  }
  return {
    customerType: "cruise",
    rentalDate: initialDate || "",
    returnDate: "",
    items,
    totalAmount: calcCartTotal(items),
    depositAmount: calcCartDeposit(items),
    deliveryType: "pickup",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    driversLicense: "",
    paymentMethod: "online_deposit",
    waiverAccepted: false,
  };
}

const STORAGE_KEY = "buggy_booking_draft";

export function BookingWizard({ initialDate, initialType }: { initialDate?: string; initialType?: string }) {
  const t = useTranslations("booking");
  const locale = useLocale();
  const router = useRouter();
  const [step, setStep] = useState(1);
  // The first render is the same on the server and in the browser, every
  // time. Reading sessionStorage in the initialiser instead — which is what
  // this did — made the two disagree whenever a draft existed: the server sent
  // "0 buggies", the browser rendered "1", and React threw the whole
  // server-rendered form away and rebuilt it client-side. The guest saw the
  // page flicker and the phone did the work twice. The draft is restored just
  // below, after mount, where differing from the server is allowed.
  const [data, setData] = useState<BookingData>(() => makeInitial(initialDate, initialType));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const draftLoaded = useRef(false);
  const persistedOnce = useRef(false);

  // Restore a draft left by an earlier visit in this tab.
  //
  // react-hooks/set-state-in-effect is disabled here deliberately. The rule
  // exists to stop cascading renders, and it is right nearly everywhere — but
  // sessionStorage is exactly the "external system the effect subscribes to"
  // that the rule's own documentation carves out, and the only alternative is
  // to read it during render, which is the hydration mismatch this replaced.
  // It runs once, on mount, and costs one extra render.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (draftLoaded.current) return;
    draftLoaded.current = true;
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const draft = JSON.parse(saved) as BookingData;
      // A date or vehicle picked just now (hero, fleet) must win over an old
      // draft, or the guest's fresh choice silently disappears.
      if (initialDate || initialType) {
        const fresh = makeInitial(initialDate, initialType);
        setData({
          ...draft,
          rentalDate: initialDate || draft.rentalDate,
          returnDate: initialDate ? "" : draft.returnDate,
          items: initialType ? fresh.items : draft.items,
          totalAmount: initialType ? fresh.totalAmount : draft.totalAmount,
          depositAmount: initialType ? fresh.depositAmount : draft.depositAmount,
        });
      } else {
        setData(draft);
      }
    } catch {}
    // Mount only: a draft is restored once, never re-applied over live edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist the draft on every change — but skip the mount pass. On that pass
  // `data` is still the empty initial state even when the effect above has
  // already queued the restore, so writing it would erase the draft a
  // moment before it is read back.
  useEffect(() => {
    if (!persistedOnce.current) {
      persistedOnce.current = true;
      return;
    }
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  }, [data]);

  const searchParams = useSearchParams();
  const cancelledId = searchParams.get("cancelled");
  const paymentCancelled = !!cancelledId;

  // If user returned from Stripe without paying, cancel that pending booking
  useEffect(() => {
    if (cancelledId) {
      fetch(`/api/bookings/${cancelledId}/cancel`, { method: "POST" }).catch(() => {});
    }
  }, [cancelledId]);

  const steps = [t("step1"), t("step2"), t("step3")];

  // Each step is a new "page" — start it at the top so the heading is visible,
  // instead of leaving the user mid-form where the previous button was.
  function goToStep(next: number) {
    setStep(next);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function update(partial: Partial<BookingData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  /**
   * Like `update`, but the new values are derived from the state as it is at
   * the moment the update applies rather than at the moment of the click.
   *
   * `update` takes an object the caller has already computed, so two taps
   * landing in the same React batch both compute from the same old state and
   * the second overwrites the first. On the quantity steppers that meant a
   * guest double-tapping "+" ended up with one buggy instead of two — and
   * only noticed at the summary, if at all.
   */
  function updateWith(fn: (prev: BookingData) => Partial<BookingData>) {
    setData((prev) => ({ ...prev, ...fn(prev) }));
  }

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");

      if (json.stripeUrl) {
        // Keep draft in sessionStorage so user can return if they cancel Stripe
        window.location.href = json.stripeUrl;
      } else {
        try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
        router.push(`/${locale}/book/confirmation?id=${json.id}`);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {paymentCancelled && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-semibold mb-1">
            {locale === "es" ? "No se completó el pago en línea" : "Online payment was not completed"}
          </p>
          <p>
            {locale === "es"
              ? "Si tu tarjeta no fue aceptada, puedes hacer tu reserva eligiendo pago en efectivo al momento de la renta. Tu reserva quedará guardada y confirmada de igual manera."
              : "If your card wasn't accepted, you can still book by choosing cash payment at pickup. Your reservation will be saved and confirmed regardless."}
          </p>
        </div>
      )}
      {/* Step indicator */}
      <div className="flex items-center justify-center mb-10">
        {steps.map((label, i) => {
          const num = i + 1;
          const done = step > num;
          const active = step === num;
          return (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => done && !loading && goToStep(num)}
                  disabled={!done || loading}
                  aria-label={done ? `${locale === "es" ? "Volver a" : "Back to"} ${label}` : label}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    // 44px: completed steps are tappable, and these are how
                    // someone goes back to change a date or fix a typo.
                    "w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all",
                    done && "bg-[#7FB5B5] text-white cursor-pointer hover:bg-[#6ca3a3]",
                    active && "bg-[#C05232] text-white shadow-lg shadow-[#E8836A]/30",
                    !done && !active && "bg-gray-200 text-[#5A616B]"
                  )}
                >
                  {done ? <Check className="w-4 h-4" strokeWidth={3} /> : num}
                </button>
                <span
                  className={cn(
                    "text-xs mt-1.5 font-medium hidden sm:block",
                    active ? "text-[#C05232]" : done ? "text-[#7FB5B5]" : "text-[#5A616B]"
                  )}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-16 sm:w-24 mx-2 transition-all",
                    step > i + 1 ? "bg-[#7FB5B5]" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 animate-fade-in">
        {step === 1 && (
          <Step1DateGroup
            data={data}
            update={update}
            updateWith={updateWith}
            onNext={() => goToStep(2)}
          />
        )}
        {step === 2 && (
          <Step2GuestInfo
            data={data}
            update={update}
            onBack={() => goToStep(1)}
            onNext={() => goToStep(3)}
          />
        )}
        {step === 3 && (
          <Step3Payment
            data={data}
            update={update}
            onBack={() => goToStep(2)}
            onSubmit={submit}
            loading={loading}
            error={error}
          />
        )}
      </div>

      {/* Help, in the page rather than floating over it.
          The floating WhatsApp bubble used to sit on this page too, and on a
          375px screen it landed exactly on top of the first vehicle's "+"
          button: tapping to add a sedan opened a chat instead. A bubble
          pinned to a corner will always cover whatever is in that corner, and
          on a form that is a control. Here it is always findable, never in
          the way, and it reads as part of the booking rather than an ad. */}
      <p className="mt-5 text-center text-sm text-[#5A616B]">
        {locale === "es" ? "¿Alguna duda antes de reservar? " : "Any questions before you book? "}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            locale === "es"
              ? "¡Hola! Tengo una pregunta sobre mi reserva 🚗"
              : "Hi! I have a question about my booking 🚗"
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-bold text-[#157038] underline underline-offset-2 hover:text-[#0F5F2B] min-h-11 align-middle"
        >
          <MessageCircle className="w-4 h-4 fill-current stroke-none" aria-hidden="true" />
          {locale === "es" ? "Escríbele a Dani por WhatsApp" : "Message Dani on WhatsApp"}
        </a>
      </p>
    </div>
  );
}
