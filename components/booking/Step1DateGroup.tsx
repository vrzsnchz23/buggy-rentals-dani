"use client";
import { useLocale, useTranslations } from "next-intl";
import { type BookingData } from "./BookingWizard";
import { VEHICLES, VEHICLE_ORDER, calcCartDeposit, formatCurrency, type VehicleType, type CartItem } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { DatePicker, DateRangePicker } from "@/components/ui/DatePicker";
import { MapPin, Hotel, Minus, Plus, Ship, Home } from "lucide-react";

interface Props {
  data: BookingData;
  update: (p: Partial<BookingData>) => void;
  /** Derives the patch from the state at apply time — see BookingWizard. */
  updateWith: (fn: (prev: BookingData) => Partial<BookingData>) => void;
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

export function Step1DateGroup({ data, update, updateWith, onNext }: Props) {
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

  /**
   * One tap on a stepper, counted from whatever the quantity is when the tap
   * lands rather than from what it was when the button was rendered.
   *
   * It used to take an absolute quantity computed in the click handler from
   * the rendered `qty`. Two taps close enough together to land in one React
   * batch therefore both computed "0 + 1", and the guest who wanted two
   * buggies got one.
   */
  function changeQty(type: VehicleType, delta: number) {
    updateWith((prev) => {
      const prevDays = prev.customerType === "staying"
        ? daysBetween(prev.rentalDate, prev.returnDate)
        : 1;
      const current = prev.items.find((i) => i.type === type)?.qty ?? 0;
      const updated = buildItems(prev.items, type, current + delta, prevDays);
      return {
        items: updated,
        totalAmount: updated.reduce((s, i) => s + i.subtotal, 0),
        depositAmount: calcCartDeposit(updated),
      };
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
        <p className="text-[#5A616B] text-sm">{es ? "Elige tus vehículos, fechas y punto de entrega" : "Choose your vehicles, dates and pickup preference"}</p>
      </div>

      {/* Customer type */}
      <div>
        {/* A heading for a pair of buttons, so <p> + role="group" rather than
            a <label> with nothing to point at. */}
        <p className="form-label mb-3 block" id="visit-type">{es ? "¿Cómo visitas Cozumel?" : "How are you visiting Cozumel?"}</p>
        <div className="grid grid-cols-2 gap-3" role="group" aria-labelledby="visit-type">
          <button
            type="button"
            onClick={() => setCustomerType("cruise")}
            aria-pressed={data.customerType === "cruise"}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              data.customerType === "cruise"
                ? "border-[#1B4F72] bg-[#1B4F72]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Ship className={`w-5 h-5 mb-2 ${data.customerType === "cruise" ? "text-[#1B4F72]" : "text-[#5A616B]"}`} />
            <div className={`font-semibold text-sm ${data.customerType === "cruise" ? "text-[#1B4F72]" : "text-[#44505E]"}`}>
              {es ? "Crucero" : "Cruise ship"}
            </div>
            <div className="text-xs text-[#5A616B] mt-0.5">{es ? "Visita de un día desde el puerto" : "Day trip from port"}</div>
          </button>
          <button
            type="button"
            onClick={() => setCustomerType("staying")}
            aria-pressed={data.customerType === "staying"}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              data.customerType === "staying"
                ? "border-[#1B4F72] bg-[#1B4F72]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Home className={`w-5 h-5 mb-2 ${data.customerType === "staying" ? "text-[#1B4F72]" : "text-[#5A616B]"}`} />
            <div className={`font-semibold text-sm ${data.customerType === "staying" ? "text-[#1B4F72]" : "text-[#44505E]"}`}>
              {es ? "Hospedado en Cozumel" : "Staying in Cozumel"}
            </div>
            <div className="text-xs text-[#5A616B] mt-0.5">{es ? "Hotel, condominio o casa vacacional" : "Hotel, condo or vacation rental"}</div>
          </button>
        </div>
      </div>

      {/* Vehicle selector */}
      <div className="space-y-3" role="group" aria-labelledby="vehicle-picker">
        <p className="form-label" id="vehicle-picker">{es ? "Vehículos" : "Vehicles"}</p>
        {/* VEHICLE_ORDER, not Object.entries: the order a visitor sees the
            vehicles in is a decision (cheapest first, buggy in the middle
            carrying the "most popular" flag), and it is made once in
            lib/utils so the fleet section and this form cannot drift apart.
            Object key order happened to match — until someone reorders the
            object. */}
        {VEHICLE_ORDER.map((type) => {
          const v = VEHICLES[type];
          const qty = getQty(type);
          const selected = qty > 0;
          const name = es ? v.labelEs : v.label;
          return (
            <div
              key={type}
              className={`relative rounded-xl border-2 p-4 transition-all ${
                selected ? "border-[#1B4F72] bg-[#1B4F72]/5" : "border-gray-200"
              }`}
            >
              {/* The same badge the fleet section shows. Someone who came here
                  from the home page having decided on the buggy should not
                  have to re-identify it in a list of three. */}
              {v.popular && (
                <span className="absolute -top-2 left-4 bg-[#C05232] text-white text-[0.6rem] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                  {es ? "Más popular" : "Most popular"}
                </span>
              )}
              {/* Two rows on a phone, one from sm up.
                  Four columns — emoji, name, price, stepper — left the name
                  about 90px wide on a 375px screen, so "Up to 5 people · Air
                  conditioning" broke across three lines and collided with the
                  price. Stacking gives the description the full width and the
                  stepper a row of its own. */}
              <div className="sm:flex sm:items-center sm:gap-4">
                <div className="flex items-start gap-3 sm:flex-1 sm:min-w-0 sm:items-center">
                  <div className="text-2xl leading-none mt-0.5 sm:mt-0" aria-hidden="true">{v.emoji}</div>
                  <div className="min-w-0">
                    <div className="font-bold text-[#1B4F72] text-sm">{name}</div>
                    <div className="text-xs text-[#5A616B]">{es ? v.descriptionEs : v.description}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-4 sm:mt-0 sm:gap-4">
                  <div className="text-left shrink-0 sm:text-right">
                    <div className="font-black text-[#A8411F]">${v.price}</div>
                    <div className="text-xs text-[#5A616B]">{es ? "/día" : "/day"}</div>
                  </div>
                  {/* 44px targets, not 32px. These are the controls the whole
                      booking runs through and they are used with a thumb. */}
                  <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => changeQty(type, -1)}
                    disabled={qty === 0}
                    aria-label={es ? `Quitar un ${name}` : `Remove one ${name}`}
                    className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center text-[#44505E] hover:border-[#1B4F72] hover:text-[#1B4F72] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <span
                    className="w-6 text-center font-black text-[#1B4F72] text-lg tabular-nums"
                    aria-live="polite"
                    aria-label={es ? `${qty} × ${name}` : `${qty} × ${name}`}
                  >
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => changeQty(type, 1)}
                    disabled={qty >= v.stock}
                    aria-label={es ? `Agregar un ${name}` : `Add one ${name}`}
                    className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center text-[#44505E] hover:border-[#1B4F72] hover:text-[#1B4F72] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </button>
                  </div>
                </div>
              </div>
              {selected && (
                <div className="mt-2 pt-2 border-t border-[#1B4F72]/10 flex justify-between text-xs">
                  <span className="text-[#5A616B]">
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
        <p className="form-label mb-3 block">{t("date")}</p>
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
          <div className="text-sm text-[#5A616B]">
            {data.items
              .filter((i) => i.qty > 0)
              .map((i) => `${i.qty}× ${es ? VEHICLES[i.type].labelEs : VEHICLES[i.type].label}`)
              .join(", ")}
            {days > 1 && <span className="ml-1 text-[#5A616B]">· {days} {es ? "días" : "days"}</span>}
          </div>
          <div className="text-right">
            <div className="font-black text-[#C05232] text-xl">{formatCurrency(data.totalAmount)}</div>
            <div className="text-xs text-[#5A616B]">total</div>
          </div>
        </div>
      )}

      {/* Delivery type — hide for cruise (always pickup) */}
      {data.customerType === "staying" && (
        <div>
          <p className="form-label" id="delivery-type">{t("delivery")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="group" aria-labelledby="delivery-type">
            <button
              type="button"
              onClick={() => update({ deliveryType: "pickup" })}
              aria-pressed={data.deliveryType === "pickup"}
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
              aria-pressed={data.deliveryType === "hotel_delivery"}
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
          <p className="form-label">{t("delivery")}</p>
          <div className="p-4 rounded-xl border-2 border-[#1B4F72] bg-[#1B4F72]/5 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#1B4F72] mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-sm text-[#1B4F72]">{t("pickupOption")}</div>
              <div className="text-xs text-[#5A616B] mt-0.5">{es ? "Frente a las terminales Puerta Maya y SSA" : "Across the street from Puerta Maya & SSA terminals"}</div>
            </div>
          </div>
        </div>
      )}

      {/* Hotel fields */}
      {data.customerType === "staying" && data.deliveryType === "hotel_delivery" && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="form-label" htmlFor="hotel-name">{t("hotelName")} *</label>
            <input
              id="hotel-name"
              type="text"
              autoComplete="off"
              className="form-input"
              placeholder={es ? "ej. Iberostar Cozumel" : "e.g. Iberostar Cozumel"}
              value={data.hotelName || ""}
              onChange={(e) => update({ hotelName: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="hotel-room">{es ? "Número de habitación" : "Room Number"} <span className="text-[#5A616B] font-normal">({es ? "opcional" : "optional"})</span></label>
            <input
              id="hotel-room"
              type="text"
              className="form-input"
              placeholder={es ? "ej. 214" : "e.g. 214"}
              value={data.hotelAddress || ""}
              onChange={(e) => update({ hotelAddress: e.target.value })}
            />
            <p className="text-xs text-[#5A616B] mt-1">{es ? "No te preocupes si aún no lo tienes — confirmamos los detalles por WhatsApp." : "Don't worry if you don't have it yet — we'll confirm details via WhatsApp."}</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {missing.length > 0 && (
          <p className="text-xs text-[#5A616B] text-center">
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
