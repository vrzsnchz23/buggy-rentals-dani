"use client";
import { useTranslations } from "next-intl";
import { type BookingData } from "./BookingWizard";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate, VEHICLES } from "@/lib/utils";
import { ChevronLeft, CreditCard, Banknote, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  data: BookingData;
  update: (p: Partial<BookingData>) => void;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
  error: string;
}

const WAIVER_TEXT = `By renting a buggy from Buggy Rentals with Dani, you agree to:

1. ELIGIBILITY: You must hold a valid driver's license and be at least 18 years old.
2. SAFE OPERATION: Operate the vehicle safely, following all Mexican traffic laws and road signs.
3. RESPONSIBILITY: You are responsible for any traffic violations, fines, or tickets incurred during your rental period.
4. VEHICLE CONDITION: Return the buggy in the same condition as received. You are liable for any damages caused by negligence or accidents not covered by liability insurance.
5. INSURANCE: Liability insurance is included and covers third-party property damage and bodily injury. It does NOT cover damage to the rental vehicle itself.
6. FUEL: Vehicles are delivered with a full tank of gas. The customer is responsible for returning the vehicle with a full tank. A fueling fee will apply if the tank is not full upon return.
7. NO-SHOW POLICY: Deposits are non-refundable in the event of a no-show. Cancellations made more than 48 hours in advance will receive a full refund.
8. PROHIBITION: No off-road driving, no driving under the influence of alcohol or substances.
9. JURISDICTION: This agreement is subject to the laws of Mexico.`;

export function Step3Payment({ data, update, onBack, onSubmit, loading, error }: Props) {
  const t = useTranslations("booking");

  const payMethods: Array<{
    id: BookingData["paymentMethod"];
    label: string;
    desc: string;
    icon: React.ReactNode;
    amount: number;
  }> = [
    {
      id: "online_deposit",
      label: t("payDeposit"),
      desc: `Pay ${formatCurrency(data.depositAmount)} now, ${formatCurrency(data.totalAmount - data.depositAmount)} on pickup`,
      icon: <CreditCard className="w-5 h-5" />,
      amount: data.depositAmount,
    },
    {
      id: "online_full",
      label: t("payOnline"),
      desc: `Pay full ${formatCurrency(data.totalAmount)} now via card`,
      icon: <CreditCard className="w-5 h-5" />,
      amount: data.totalAmount,
    },
    {
      id: "cash",
      label: t("payCash"),
      desc: `Pay ${formatCurrency(data.totalAmount)} cash on pickup — no online payment needed`,
      icon: <Banknote className="w-5 h-5" />,
      amount: 0,
    },
  ];

  const canSubmit = data.waiverAccepted && data.paymentMethod;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-[#1B4F72] mb-1">{t("step3")}</h2>
        <p className="text-gray-500 text-sm">Review your booking and choose how to pay</p>
      </div>

      {/* Booking summary */}
      <div className="bg-[#F5F0EB] rounded-xl p-4 space-y-2 text-sm">
        <div className="font-bold text-[#1B4F72] text-base mb-3">Booking Summary</div>
        <Row
          label="Date"
          value={data.returnDate ? `${formatDate(data.rentalDate)} → ${formatDate(data.returnDate)}` : formatDate(data.rentalDate)}
        />
        {data.items.filter((i) => i.qty > 0).map((item, idx) => (
          <Row
            key={idx}
            label={`${item.qty}× ${VEHICLES[item.type].label}`}
            value={formatCurrency(item.subtotal)}
          />
        ))}
        <Row label="Pickup" value={data.deliveryType === "pickup" ? "Port meeting point" : `Hotel: ${data.hotelName}`} />
        <Row label="Name" value={data.guestName} />
        <Row label="Contact" value={data.guestPhone} />
        {data.cruiseShip && <Row label="Cruise" value={`${data.cruiseName} · ${data.cruiseShip}`} />}
        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-black text-[#1B4F72]">
          <span>Total</span>
          <span className="text-[#E8836A]">{formatCurrency(data.totalAmount)}</span>
        </div>
      </div>

      {/* Payment method */}
      <div>
        <label className="form-label">{t("paymentMethod")}</label>
        <div className="space-y-3">
          {payMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => update({ paymentMethod: method.id })}
              className={cn(
                "w-full p-4 rounded-xl border-2 text-left flex items-start gap-3 transition-all",
                data.paymentMethod === method.id
                  ? "border-[#1B4F72] bg-[#1B4F72]/5"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                data.paymentMethod === method.id ? "bg-[#1B4F72] text-white" : "bg-gray-100 text-gray-500"
              )}>
                {method.icon}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-[#1B4F72]">{method.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{method.desc}</div>
              </div>
              {method.amount > 0 && (
                <div className="font-bold text-[#E8836A] text-sm shrink-0">
                  {formatCurrency(method.amount)}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Waiver */}
      <div>
        <label className="form-label">{t("waiver")}</label>
        <div className="border-2 border-gray-200 rounded-xl p-4 h-40 overflow-y-auto text-xs text-gray-600 leading-relaxed mb-3 font-mono whitespace-pre-line">
          {WAIVER_TEXT}
        </div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.waiverAccepted}
            onChange={(e) => update({ waiverAccepted: e.target.checked })}
            className="mt-0.5 w-4 h-4 accent-[#1B4F72]"
          />
          <span className="text-sm text-gray-700 font-medium">{t("waiverAccept")}</span>
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={onBack} disabled={loading} className="flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> {t("back")}
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!canSubmit}
          loading={loading}
          size="lg"
          className="flex-1"
        >
          {loading
            ? t("processing")
            : (data.paymentMethod === "online_full" || data.paymentMethod === "online_deposit")
            ? "Continue to Payment →"
            : t("confirm")}
        </Button>
      </div>

      <p className="text-xs text-center text-gray-400">
        🔒 Secure payment via Stripe. Your data is encrypted.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 text-right">{value}</span>
    </div>
  );
}
