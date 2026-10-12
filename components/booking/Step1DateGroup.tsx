"use client";
import { useLocale, useTranslations } from "next-intl";
import { type BookingData } from "./BookingWizard";
import { VEHICLES, calcCartDeposit, formatCurrency, type VehicleType, type CartItem } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { DatePicker, DateRangePicker } from "@/components/ui/DatePicker";
import { MapPin, Hotel, Minus, Plus, Ship, Home } from "lucide-react";

interface Props {
  data: BookingData;
  update: (p: Partial<BookingData>) => void;
  onNext: () => void;
}

function daysBetween(start: string, end: string): number {
  if (!start || !end) return 1;
  return Math.max(1, Math.round(
    (new Date(end + "T12:00:00").getTime() - new Date(start + "T12:00:00").getTime()) / 86400000
  ));
}

function buildItems(prev: CartItem[], type: VehicleType, qty: number, days: number): CartItem[] {
  const vehicle = VEHICLES[type];
  const clamped = Math.max(0, Math.min(qty, vehicle.stock));
  const existing = prev.filter((i) => i.type !== type);
  if (clamped === 0) return existing;
  return [...existing, { type, qty: clamped, unitPrice: vehicle.price, subtotal: vehicle.price * clamped * days }];
}

function recalcItems(items: CartItem[], days: number): CartItem[] {
  return items.map((i) => ({ ...i, subtotal: i.unitPrice * i.qty * days }));
}

export function Step1DateGroup({ data, update, onNext }: Props) {
  const t = useTranslations("booking");
  const locale = useLocale();

  const days = data.customerType === "staying"
    ? daysBetween(data.rentalDate, data.returnDate)
    : 1;

  function setCustomerType(type: BookingData["customerType"]) {
    update({
      customerType: type,
      returnDate: "",
      rentalDate: "",
      items: recalcItems(data.items, 1),
      totalAmount: data.items.reduce((s, i) => s + i.unitPrice * i.qty, 0),
      depositAmount: calcCartDeposit(data.items),
      deliveryType: type === "cruise" ? "pickup" : data.deliveryType,
    });
  }

  function setQty(type: VehicleType, qty: number) {
    const updated = buildItems(data.items, type, qty, days);
    update({
      items: updated,
      totalAmount: updated.reduce((s, i) => s + i.subtotal, 0),
      depositAmount: calcCartDeposit(updated),
    });
  }

  function getQty(type: VehicleType): number {
    return data.items.find((i) => i.type === type)?.qty ?? 0;
  }

  function handleStartDate(val: string) {
    const newDays = data.returnDate ? daysBetween(val, data.returnDate) : 1;
    const updated = recalcItems(data.items, newDays);
    update({
      rentalDate: val,
      items: updated,
      totalAmount: updated.reduce((s, i) => s + i.subtotal, 0),
      depositAmount: calcCartDeposit(updated),
    });
  }

  function handleEndDate(val: string) {
    const newDays = val ? daysBetween(data.rentalDate, val) : 1;
    const updated = recalcItems(data.items, newDays);
    update({
      returnDate: val,
      items: updated,
      totalAmount: updated.reduce((s, i) => s + i.subtotal, 0),
      depositAmount: calcCartDeposit(updated),
    });
  }

  const hasVehicles = data.items.some((i) => i.qty > 0);
  const dateReady = data.customerType === "cruise"
    ? !!data.rentalDate
    : !!data.rentalDate && !!data.returnDate;
  const canProceed =
    dateReady &&
    hasVehicles &&
    (data.deliveryType === "pickup" || !!data.hotelName);

  // A disabled button with no reason is a dead end — spell out what's still needed.
  const es = locale === "es";
  const missing: string[] = [];
  if (!hasVehicles) missing.push(es ? "elige al menos un vehículo" : "pick at least one vehicle");
  if (!dateReady) {
    missing.push(
      data.customerType === "cruise"
        ? es ? "elige tu fecha" : "choose your date"
        : es ? "elige fechas de inicio y regreso" : "choose pickup and return dates"
    );
  }
  if (data.deliveryType === "hotel_delivery" && !data.hotelName) {
    missing.push(es ? "escribe el nombre de tu hotel" : "enter your hotel name");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-[#1B4F72] mb-1">{t("step1")}</h2>
        <p className="text-gray-500 text-sm">{es ? "Elige tus vehículos, fechas y punto de entrega" : "Choose your vehicles, dates and pickup preference"}</p>
      </div>

      {/* Customer type */}
      <div>
        <label className="form-label mb-3 block">{es ? "¿Cómo visitas Cozumel?" : "How are you visiting Cozumel?"}</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setCustomerType("cruise")}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              data.customerType === "cruise"
                ? "border-[#1B4F72] bg-[#1B4F72]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Ship className={`w-5 h-5 mb-2 ${data.customerType === "cruise" ? "text-[#1B4F72]" : "text-gray-400"}`} />
            <div className={`font-semibold text-sm ${data.customerType === "cruise" ? "text-[#1B4F72]" : "text-gray-600"}`}>
              {es ? "Crucero" : "Cruise ship"}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{es ? "Visita de un día desde el puerto" : "Day trip from port"}</div>
          </button>
          <button
            type="button"
            onClick={() => setCustomerType("staying")}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              data.customerType === "staying"
                ? "border-[#1B4F72] bg-[#1B4F72]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Home className={`w-5 h-5 mb-2 ${data.customerType === "staying" ? "text-[#1B4F72]" : "text-gray-400"}`} />
            <div className={`font-semibold text-sm ${data.customerType === "staying" ? "text-[#1B4F72]" : "text-gray-600"}`}>
              {es ? "Hospedado en Cozumel" : "Staying in Cozumel"}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{es ? "Hotel, condominio o casa vacacional" : "Hotel, condo or vacation rental"}</div>
          </button>
        </div>
      </div>

      {/* Vehicle selector */}
      <div className="space-y-3">
        <label className="form-label">{es ? "Vehículos" : "Vehicles"}</label>
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
                <div className="text-2xl">{v.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#1B4F72] text-sm">{es ? v.labelEs : v.label}</div>
                  <div className="text-xs text-gray-400">{es ? v.descriptionEs : v.description}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-[#E8836A]">${v.price}</div>
                  <div className="text-xs text-gray-400">{es ? "/día" : "/day"}</div>
                </div>
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
              {selected && (
                <div className="mt-2 pt-2 border-t border-[#1B4F72]/10 flex justify-between text-xs">
                  <span className="text-gray-400">
                    {qty} × ${v.price}{days > 1 ? ` × ${days} ${es ? "días" : "days"}` : ""}
                  </span>
                  <span className="font-bold text-[#1B4F72]">{formatCurrency(v.price * qty * days)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Date picker */}
      <div>
        <label className="form-label mb-3 block">{t("date")}</label>
        {data.customerType === "cruise" ? (
          <DatePicker
            value={data.rentalDate}
            onChange={(val) => update({ rentalDate: val })}
          />
        ) : (
          <DateRangePicker
            startDate={data.rentalDate}
            endDate={data.returnDate}
            onStartChange={handleStartDate}
            onEndChange={handleEndDate}
          />
        )}
      </div>

      {/* Total pill */}
      {hasVehicles && (
        <div className="bg-[#F5F0EB] rounded-xl p-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {data.items
              .filter((i) => i.qty > 0)
              .map((i) => `${i.qty}× ${es ? VEHICLES[i.type].labelEs : VEHICLES[i.type].label}`)
              .join(", ")}
            {days > 1 && <span className="ml-1 text-gray-400">· {days} {es ? "días" : "days"}</span>}
          </div>
          <div className="text-right">
            <div className="font-black text-[#E8836A] text-xl">{formatCurrency(data.totalAmount)}</div>
            <div className="text-xs text-gray-400">total</div>
          </div>
        </div>
      )}

      {/* Delivery type — hide for cruise (always pickup) */}
      {data.customerType === "staying" && (
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
      )}

      {/* Cruise pickup note */}
      {data.customerType === "cruise" && (
        <div>
          <label className="form-label">{t("delivery")}</label>
          <div className="p-4 rounded-xl border-2 border-[#1B4F72] bg-[#1B4F72]/5 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#1B4F72] mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-sm text-[#1B4F72]">{t("pickupOption")}</div>
              <div className="text-xs text-gray-500 mt-0.5">{es ? "Frente a las terminales Puerta Maya y SSA" : "Across the street from Puerta Maya & SSA terminals"}</div>
            </div>
          </div>
        </div>
      )}

      {/* Hotel fields */}
      {data.customerType === "staying" && data.deliveryType === "hotel_delivery" && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="form-label">{t("hotelName")} *</label>
            <input
              type="text"
              className="form-input"
              placeholder={es ? "ej. Iberostar Cozumel" : "e.g. Iberostar Cozumel"}
              value={data.hotelName || ""}
              onChange={(e) => update({ hotelName: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">{es ? "Número de habitación" : "Room Number"} <span className="text-gray-400 font-normal">({es ? "opcional" : "optional"})</span></label>
            <input
              type="text"
              className="form-input"
              placeholder={es ? "ej. 214" : "e.g. 214"}
              value={data.hotelAddress || ""}
              onChange={(e) => update({ hotelAddress: e.target.value })}
            />
            <p className="text-xs text-gray-400 mt-1">{es ? "No te preocupes si aún no lo tienes — confirmamos los detalles por WhatsApp." : "Don't worry if you don't have it yet — we'll confirm details via WhatsApp."}</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {missing.length > 0 && (
          <p className="text-xs text-gray-500 text-center">
            {es ? "Para continuar: " : "To continue: "}
            <span className="font-semibold text-[#1B4F72]">{missing.join(es ? " y " : " and ")}</span>
          </p>
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
    </div>
  );
}
