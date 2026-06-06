"use client";
import { useTranslations } from "next-intl";
import { type BookingData } from "./BookingWizard";
import { VEHICLES, calcCartTotal, calcCartDeposit, formatCurrency, type VehicleType, type CartItem } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { MapPin, Hotel, Minus, Plus } from "lucide-react";

interface Props {
  data: BookingData;
  update: (p: Partial<BookingData>) => void;
  onNext: () => void;
}

export function Step1DateGroup({ data, update, onNext }: Props) {
  const t = useTranslations("booking");

  function setQty(type: VehicleType, qty: number) {
    const vehicle = VEHICLES[type];
    const clamped = Math.max(0, Math.min(qty, vehicle.stock));

    const existing = data.items.filter((i) => i.type !== type);
    const updated: CartItem[] = clamped > 0
      ? [...existing, { type, qty: clamped, unitPrice: vehicle.price, subtotal: vehicle.price * clamped }]
      : existing;

    update({
      items: updated,
      totalAmount: calcCartTotal(updated),
      depositAmount: calcCartDeposit(updated),
    });
  }

  function getQty(type: VehicleType): number {
    return data.items.find((i) => i.type === type)?.qty ?? 0;
  }

  const hasVehicles = data.items.some((i) => i.qty > 0);
  const canProceed =
    data.rentalDate &&
    hasVehicles &&
    (data.deliveryType === "pickup" || (!!data.hotelName && !!data.hotelAddress));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-[#1B4F72] mb-1">{t("step1")}</h2>
        <p className="text-gray-500 text-sm">Choose your vehicles, date and pickup preference</p>
      </div>

      {/* Vehicle selector */}
      <div className="space-y-3">
        <label className="form-label">Vehicles</label>
        {(Object.entries(VEHICLES) as [VehicleType, typeof VEHICLES[VehicleType]][]).map(([type, v]) => {
          const qty = getQty(type);
          const selected = qty > 0;
          return (
            <div
              key={type}
              className={`rounded-xl border-2 p-4 transition-all ${
                selected ? "border-[#1B4F72] bg-[#1B4F72]/5" : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Info */}
                <div className="text-2xl">{v.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#1B4F72] text-sm">{v.label}</div>
                  <div className="text-xs text-gray-400">{v.description}</div>
                </div>
                {/* Price */}
                <div className="text-right shrink-0">
                  <div className="font-black text-[#E8836A]">${v.price}</div>
                  <div className="text-xs text-gray-400">/day</div>
                </div>
                {/* Counter */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQty(type, qty - 1)}
                    disabled={qty === 0}
                    className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#1B4F72] hover:text-[#1B4F72] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-black text-[#1B4F72] text-lg">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(type, qty + 1)}
                    disabled={qty >= v.stock}
                    className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#1B4F72] hover:text-[#1B4F72] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {/* Subtotal row */}
              {selected && (
                <div className="mt-2 pt-2 border-t border-[#1B4F72]/10 flex justify-between text-xs">
                  <span className="text-gray-400">{qty} × ${v.price}</span>
                  <span className="font-bold text-[#1B4F72]">{formatCurrency(v.price * qty)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Date picker */}
      <div>
        <label className="form-label mb-3 block">{t("date")}</label>
        <DatePicker
          value={data.rentalDate}
          onChange={(val) => update({ rentalDate: val })}
        />
      </div>

      {/* Total pill */}
      {hasVehicles && (
        <div className="bg-[#F5F0EB] rounded-xl p-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {data.items
              .filter((i) => i.qty > 0)
              .map((i) => `${i.qty}× ${VEHICLES[i.type].label}`)
              .join(", ")}
          </div>
          <div className="text-right">
            <div className="font-black text-[#E8836A] text-xl">{formatCurrency(data.totalAmount)}</div>
            <div className="text-xs text-gray-400">total</div>
          </div>
        </div>
      )}

      {/* Delivery type */}
      <div>
        <label className="form-label">{t("delivery")}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => update({ deliveryType: "pickup" })}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              data.deliveryType === "pickup"
                ? "border-[#1B4F72] bg-[#1B4F72]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <MapPin className="w-5 h-5 text-[#1B4F72] mb-2" />
            <div className="font-semibold text-sm text-[#1B4F72]">{t("pickupOption")}</div>
          </button>
          <button
            type="button"
            onClick={() => update({ deliveryType: "hotel_delivery" })}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              data.deliveryType === "hotel_delivery"
                ? "border-[#1B4F72] bg-[#1B4F72]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Hotel className="w-5 h-5 text-[#1B4F72] mb-2" />
            <div className="font-semibold text-sm text-[#1B4F72]">{t("deliveryOption")}</div>
          </button>
        </div>
      </div>

      {/* Hotel fields */}
      {data.deliveryType === "hotel_delivery" && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="form-label">{t("hotelName")}</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Iberostar Cozumel"
              value={data.hotelName || ""}
              onChange={(e) => update({ hotelName: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">{t("hotelAddress")}</label>
            <input
              type="text"
              className="form-input"
              placeholder="Hotel address or zone"
              value={data.hotelAddress || ""}
              onChange={(e) => update({ hotelAddress: e.target.value })}
            />
          </div>
        </div>
      )}

      <Button
        onClick={onNext}
        disabled={!canProceed}
        size="lg"
        className="w-full"
      >
        {t("next")} →
      </Button>
    </div>
  );
}
