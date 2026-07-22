"use client";
import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Step1DateGroup } from "./Step1DateGroup";
import { Step2GuestInfo } from "./Step2GuestInfo";
import { Step3Payment } from "./Step3Payment";
import { Check } from "lucide-react";
import { cn, VEHICLES, calcCartTotal, calcCartDeposit } from "@/lib/utils";
import type { CartItem, VehicleType } from "@/lib/utils";

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
  const [data, setData] = useState<BookingData>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved) as BookingData;
      } catch {}
    }
    return makeInitial(initialDate, initialType);
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Persist draft to sessionStorage on every change
  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  }, [data]);

  const [paymentCancelled, setPaymentCancelled] = useState(false);

  // If user returned from Stripe without paying, cancel that pending booking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cancelledId = params.get("cancelled");
    if (cancelledId) {
      fetch(`/api/bookings/${cancelledId}/cancel`, { method: "POST" }).catch(() => {});
      window.history.replaceState({}, "", window.location.pathname);
      setPaymentCancelled(true);
    }
  }, []);

  const steps = [t("step1"), t("step2"), t("step3")];

  function update(partial: Partial<BookingData>) {
    setData((prev) => ({ ...prev, ...partial }));
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
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all",
                    done && "bg-[#7FB5B5] text-white",
                    active && "bg-[#E8836A] text-white shadow-lg shadow-[#E8836A]/30",
                    !done && !active && "bg-gray-200 text-gray-400"
                  )}
                >
                  {done ? <Check className="w-4 h-4" strokeWidth={3} /> : num}
                </div>
                <span
                  className={cn(
                    "text-xs mt-1.5 font-medium hidden sm:block",
                    active ? "text-[#E8836A]" : done ? "text-[#7FB5B5]" : "text-gray-400"
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
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <Step2GuestInfo
            data={data}
            update={update}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <Step3Payment
            data={data}
            update={update}
            onBack={() => setStep(2)}
            onSubmit={submit}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  );
}
