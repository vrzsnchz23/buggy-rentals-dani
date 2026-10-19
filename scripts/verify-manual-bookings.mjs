/**
 * Checks the manual-booking logic without touching a database: validation,
 * the mapping onto Booking columns, and the own-fleet-full-days calculation.
 *
 * Run: node scripts/verify-manual-bookings.mjs
 */
import { readFileSync } from "node:fs";
import ts from "typescript";

function load(path) {
  const src = readFileSync(path, "utf8").replace(/@\/lib\/utils/g, "./utils-shim.js");
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  return js;
}

// Minimal stand-in for lib/utils, reading the real prices out of the file so
// the test cannot drift from the config.
const utilsSrc = readFileSync("lib/utils.ts", "utf8");
const priceOf = (k) => +utilsSrc.split(`  ${k}: {`)[1].split("},")[0].match(/price: (\d+)/)[1];
const VEHICLES = {
  compact: { price: priceOf("compact") },
  buggy: { price: priceOf("buggy") },
  jimny: { price: priceOf("jimny") },
};

const shim = `export const VEHICLES = ${JSON.stringify(VEHICLES)};`;
const { default: dataUrl } = { default: (code) => "data:text/javascript;base64," + Buffer.from(code).toString("base64") };

const manualJs = load("lib/bookings/manual.ts").replace("./utils-shim.js", dataUrl(shim));
const mod = await import(dataUrl(manualJs));
const { validateManualBooking, toBookingRow, OWN_FLEET } = mod;

let pass = 0, fail = 0;
function check(name, cond, extra = "") {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name} ${extra}`); }
}

const base = {
  guestName: "Ana", guestPhone: "+1 555 000 0000", rentalDate: "2026-10-18",
  vehicleType: "buggy", qty: 1, days: 1, unitPrice: VEHICLES.buggy.price,
  unitSource: "own", paymentState: "paid", channel: "whatsapp", createdBy: "Dani",
};

console.log("\nValidación");
check("acepta el caso común", validateManualBooking(base).ok);
check("rechaza sin nombre", !validateManualBooking({ ...base, guestName: "" }).ok);
check("rechaza sin teléfono", !validateManualBooking({ ...base, guestPhone: "" }).ok);
check("rechaza vehículo inválido", !validateManualBooking({ ...base, vehicleType: "moto" }).ok);
check("rechaza cantidad 0", !validateManualBooking({ ...base, qty: 0 }).ok);
check("rechaza precio negativo", !validateManualBooking({ ...base, unitPrice: -5 }).ok);
check("acepta precio negociado", validateManualBooking({ ...base, vehicleType: "jimny", unitPrice: 99 }).ok);
check("rechaza anticipo mayor al total", !validateManualBooking({ ...base, paymentState: "deposit", depositAmount: 9999 }).ok);
check("rechaza anticipo sin monto", !validateManualBooking({ ...base, paymentState: "deposit", depositAmount: 0 }).ok);
check("acepta anticipo válido", validateManualBooking({ ...base, paymentState: "deposit", depositAmount: 30 }).ok);
check("email vacío es válido", validateManualBooking({ ...base, guestEmail: "" }).ok);
check("email con formato malo se rechaza", !validateManualBooking({ ...base, guestEmail: "no-es-email" }).ok);
check("rechaza canal 'web'", !validateManualBooking({ ...base, channel: "web" }).ok);

console.log("\nMapeo a columnas de Booking");
const paid = toBookingRow(validateManualBooking(base).value);
check(`pagado -> paymentStatus 'paid'`, paid.paymentStatus === "paid", paid.paymentStatus);
check(`pagado -> depósito = total (${paid.depositAmount})`, paid.depositAmount === paid.totalAmount);
check(`total = ${VEHICLES.buggy.price}`, paid.totalAmount === VEHICLES.buggy.price, String(paid.totalAmount));
check("status 'confirmed'", paid.status === "confirmed");
check("channel se conserva", paid.channel === "whatsapp");

const pend = toBookingRow(validateManualBooking({ ...base, paymentState: "pending" }).value);
check("pendiente -> 'unpaid'", pend.paymentStatus === "unpaid", pend.paymentStatus);
check("pendiente -> nada cobrado", pend.depositAmount === 0, String(pend.depositAmount));

const dep = toBookingRow(validateManualBooking({ ...base, paymentState: "deposit", depositAmount: 30 }).value);
check("anticipo -> 'deposit_paid'", dep.paymentStatus === "deposit_paid", dep.paymentStatus);
check("anticipo -> monto exacto", dep.depositAmount === 30, String(dep.depositAmount));

const multi = toBookingRow(validateManualBooking({ ...base, qty: 2, days: 3 }).value);
check(`2 buggies x 3 días = ${VEHICLES.buggy.price * 6}`, multi.totalAmount === VEHICLES.buggy.price * 6, String(multi.totalAmount));
check("3 días -> returnDate +2", multi.returnDate && (multi.returnDate - multi.rentalDate) / 86400000 === 2);
check("1 día -> sin returnDate", paid.returnDate === null);

const partner = toBookingRow(validateManualBooking({ ...base, unitSource: "partner", partnerName: "Carlos" }).value);
check("socio se guarda", partner.unitSource === "partner" && partner.partnerName === "Carlos");
const ownNoPartner = toBookingRow(validateManualBooking({ ...base, unitSource: "own", partnerName: "Carlos" }).value);
check("propio ignora nombre de socio", ownNoPartner.partnerName === null);

console.log("\nDías con flota propia llena");
function fullFleetDays(bookings) {
  const perDay = new Map();
  for (const b of bookings) {
    if (b.unitSource !== "own") continue;
    const q = JSON.parse(b.items).filter((i) => i.type === "buggy").reduce((s, i) => s + i.qty, 0);
    if (!q) continue;
    const end = b.returnDate ?? b.rentalDate;
    for (let d = new Date(b.rentalDate); d <= end; d.setDate(d.getDate() + 1)) {
      const k = d.toISOString().slice(0, 10);
      perDay.set(k, (perDay.get(k) ?? 0) + q);
    }
  }
  return [...perDay.values()].filter((n) => n >= OWN_FLEET.buggy).length;
}
const mk = (o) => toBookingRow(validateManualBooking({ ...base, ...o }).value);
check(`${OWN_FLEET.buggy} buggies un día = 1 día lleno`, fullFleetDays([mk({ qty: OWN_FLEET.buggy })]) === 1);
check(`${OWN_FLEET.buggy - 1} buggies = 0 días llenos`, fullFleetDays([mk({ qty: OWN_FLEET.buggy - 1 })]) === 0);
check("renta de 3 días llena cuenta 3", fullFleetDays([mk({ qty: OWN_FLEET.buggy, days: 3 })]) === 3);
check("unidades de socio no cuentan", fullFleetDays([mk({ qty: OWN_FLEET.buggy, unitSource: "partner", partnerName: "x" })]) === 0);
check("dos reservas del mismo día se suman", fullFleetDays([mk({ qty: 3 }), mk({ qty: 2 })]) === 1);

console.log(`\n${pass} ok, ${fail} fallidas`);
process.exit(fail ? 1 : 0);
