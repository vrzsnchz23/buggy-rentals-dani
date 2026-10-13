/**
 * Creates the schema in the local dev database and fills it with invented data.
 *
 * Run `node scripts/dev-db.mjs` first, in another terminal.
 *
 *   node scripts/dev-db-seed.mjs
 *
 * Every name, email and phone number below is made up. Nothing here reads from
 * or writes to the live database — the guard at the top refuses to run against
 * anything that is not loopback, because the repo's only .env points at Neon
 * and a Prisma CLI command picks that up by default.
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const LOCAL_URL = `postgres://postgres:postgres@127.0.0.1:${process.env.DEV_DB_PORT || 5433}/postgres`;

/* ── The guard ──
   A typo here would run migrations against production. Loopback only, and no
   known hosted-Postgres hostname, or we stop. */
function assertLocal(url) {
  const bad = ["neon.tech", "supabase", "amazonaws", "render.com", "railway", "vercel-storage", "planetscale"];
  const hit = bad.find((h) => url.includes(h));
  if (hit) throw new Error(`refusing to touch a hosted database (${hit}) — this script is local-only`);
  if (!/@(127\.0\.0\.1|localhost|\[::1\])[:/]/.test(url)) {
    throw new Error(`refusing: ${url.replace(/:[^:@]*@/, ":***@")} is not loopback`);
  }
}
assertLocal(LOCAL_URL);
console.log("· target is loopback, proceeding\n");

/* Prisma's CLI reads .env, which holds the production URL. Point it at a file
   of our own instead so neither this run nor a later one can drift. */
const ENV_FILE = ".env.development.local";
writeFileSync(ENV_FILE, `# Written by scripts/dev-db-seed.mjs — local throwaway database.\n# Next.js and the Prisma CLI both prefer this over .env.\nDATABASE_URL="${LOCAL_URL}"\n`);
console.log(`· wrote ${ENV_FILE} (gitignored by .env*)`);

const { PrismaClient } = await import("@prisma/client");
const { PrismaPg } = await import("@prisma/adapter-pg");
const { Pool } = await import("pg");

const db = new PrismaClient({
  adapter: new PrismaPg(new Pool({ connectionString: LOCAL_URL })),
});

/* ── The second guard, and it runs first ──
   The guard above checks the URL. This one checks the data, which is what
   actually matters: a database holding bookings without this script's own
   marker is not the throwaway fixture, and nothing — not the delete below, and
   not the `db push --accept-data-loss` that follows — is allowed to touch it.
   This has to come before the push, because the push is itself destructive.

   The marker lives in its own schema: `db push` manages `public` and would
   drop a stray table there, which is exactly what happened the first time —
   the marker was wiped on every run, so the second run always refused. */
const MARKER = "dev-fixture";
await db.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS dev_guard`);
await db.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS dev_guard.marker (id text PRIMARY KEY)`);
const marked = await db.$queryRawUnsafe(`SELECT id FROM dev_guard.marker WHERE id = $1`, MARKER);

let existing = 0;
try {
  existing = await db.booking.count();
} catch {
  // No Booking table yet: a brand-new database, which is the normal first run.
}

if (existing > 0 && marked.length === 0) {
  throw new Error(
    `refusing to touch a database holding ${existing} bookings: it carries no ` +
      `dev-fixture marker, so it is not the throwaway one.`
  );
}
await db.$executeRawUnsafe(`INSERT INTO dev_guard.marker (id) VALUES ($1) ON CONFLICT DO NOTHING`, MARKER);
console.log(`· marker ok (${existing} existing booking(s), all this fixture's own)`);

/* --url, not the environment. prisma.config.ts does `import "dotenv/config"`
   and reads process.env.DATABASE_URL, so a bare `prisma db push` or
   `prisma migrate` in this repo targets the live Neon database. Passing the
   URL explicitly is the only way to be sure which database is being written. */
execSync(`npx prisma db push --schema=prisma/schema.prisma --url="${LOCAL_URL}" --accept-data-loss`, {
  stdio: "inherit",
});

/* ── Invented people ── */
const FIRST = ["Megan", "Tyler", "Priya", "Jonas", "Camila", "Derek", "Noor", "Liam", "Sofía", "Hank", "Yuki", "Marcus", "Elena", "Omar", "Brittany", "Thiago", "Ingrid", "Caleb", "Rosa", "Dmitri"];
const LAST = ["Hollis", "Brandt", "Raman", "Vogel", "Ortega", "Whitfield", "Haddad", "Doyle", "Cabrera", "Mueller", "Tanaka", "Okafor", "Petrov", "Nasser", "Kowalski", "Almeida", "Lindqvist", "Hartley", "Jimenez", "Volkov"];
const HOTELS = ["Grand Park Royal", "Allegro Cozumel", "Cozumel Palace", "Secrets Aura", "Iberostar Cozumel", "Hotel B Cozumel", "Casa Mexicana", "Villa Las Anclas"];
const SHIPS = ["Carnival Vista", "Allure of the Seas", "Norwegian Joy", "Disney Fantasy", "MSC Seaside"];

const pick = (a, r) => a[Math.floor(r * a.length) % a.length];

/* A tiny deterministic PRNG, so re-seeding gives the same fixture and a visual
   diff of the admin is a diff of the design, not of the data. */
let seed = 20261012;
const rnd = () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
};

const DAY = 86400000;
const today = new Date();
today.setHours(0, 0, 0, 0);

const VEHICLE_PRICES = { buggy: 75, compact: 65 };

function makeBooking() {
  const first = pick(FIRST, rnd());
  const last = pick(LAST, rnd());
  const name = `${first} ${last}`;

  // Spread across four months either side of today so the dashboard's
  // "today", "upcoming" and "this month" panels all have something in them.
  const offset = Math.floor(rnd() * 130) - 95;
  const rentalDate = new Date(+today + offset * DAY);

  const days = rnd() < 0.78 ? 1 : 1 + Math.floor(rnd() * 4);
  const returnDate = days > 1 ? new Date(+rentalDate + (days - 1) * DAY) : null;

  const buggies = rnd() < 0.72 ? 1 + Math.floor(rnd() * 3) : 0;
  const compacts = buggies === 0 || rnd() < 0.18 ? 1 + Math.floor(rnd() * 2) : 0;
  /* CartItem is { type, qty, unitPrice, subtotal } — the first version of
     this fixture wrote only type and qty, which rendered "$NaN" on the
     booking detail page. */
  const items = [];
  if (buggies) items.push({ type: "buggy", qty: buggies, unitPrice: VEHICLE_PRICES.buggy, subtotal: VEHICLE_PRICES.buggy * buggies * days });
  if (compacts) items.push({ type: "compact", qty: compacts, unitPrice: VEHICLE_PRICES.compact, subtotal: VEHICLE_PRICES.compact * compacts * days });

  const base = items.reduce((s, it) => s + it.subtotal, 0);
  const totalAmount = base;
  // $25 a vehicle, which is what the public pages quote.
  const depositAmount = items.reduce((s, it) => s + 25 * it.qty, 0);

  // Past rentals are mostly done, future ones mostly still pending.
  const past = rentalDate < today;
  const r = rnd();
  let status;
  if (past) status = r < 0.82 ? "completed" : r < 0.93 ? "cancelled" : "confirmed";
  else status = r < 0.46 ? "confirmed" : r < 0.88 ? "pending" : "cancelled";

  const p = rnd();
  const paymentStatus =
    status === "cancelled" ? "unpaid" : status === "completed" ? "paid" : p < 0.4 ? "deposit_paid" : p < 0.72 ? "paid" : "unpaid";

  const cruise = rnd() < 0.45;
  const customerType = cruise ? "cruise" : "hotel";
  const deliveryType = cruise ? "pickup" : "hotel";

  return {
    guestName: name,
    guestEmail: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
    guestPhone: `+1 ${200 + Math.floor(rnd() * 700)} ${100 + Math.floor(rnd() * 899)} ${1000 + Math.floor(rnd() * 8999)}`,
    rentalDate,
    returnDate,
    items: JSON.stringify(items),
    totalAmount,
    status,
    paymentStatus,
    deliveryType,
    customerType,
    depositAmount,
    paymentMethod: paymentStatus === "unpaid" ? "cash" : rnd() < 0.7 ? "card" : "cash",
    groupSize: items.reduce((s, it) => s + it.qty * (it.type === "buggy" ? 5 : 4), 0) - Math.floor(rnd() * 3),
    hotelName: deliveryType === "hotel" ? pick(HOTELS, rnd()) : null,
    hotelAddress: deliveryType === "hotel" ? "Carretera Costera Sur km 4.5" : null,
    cruiseShip: cruise ? pick(SHIPS, rnd()) : null,
    cruiseName: cruise ? pick(SHIPS, rnd()) : null,
    cruiseArrival: cruise ? new Date(+rentalDate + 8 * 3600000) : null,
    waiverAccepted: status !== "pending",
    locale: rnd() < 0.25 ? "es" : "en",
    notes: rnd() < 0.22 ? pick(["Arriving on the early tender.", "Two car seats if possible.", "Celebrating an anniversary.", "Please call before delivery."], rnd()) : null,
    adminNotes: rnd() < 0.12 ? pick(["Called to confirm pickup time.", "Repeat guest.", "Asked about the east coast route."], rnd()) : null,
    createdAt: new Date(+rentalDate - (1 + Math.floor(rnd() * 25)) * DAY),
  };
}

/* ── Write ── */
const fields = Object.keys((await db.booking.findFirst()) ?? {});
console.log("\n· clearing local tables");
await db.booking.deleteMany({});
await db.blockedDate.deleteMany({});

const COUNT = 64;
const rows = [];
for (let i = 0; i < COUNT; i++) rows.push(makeBooking());

// Guarantee a few rentals land on today, so the dashboard's main panel is not
// empty by luck of the draw.
for (let i = 0; i < 3; i++) {
  const b = makeBooking();
  b.rentalDate = new Date(+today);
  b.returnDate = null;
  b.status = i === 0 ? "confirmed" : i === 1 ? "pending" : "confirmed";
  b.paymentStatus = i === 1 ? "unpaid" : "deposit_paid";
  rows.push(b);
}

for (const r of rows) await db.booking.create({ data: r });
console.log(`· ${rows.length} bookings`);

const blocked = [];
for (let i = 0; i < 6; i++) {
  blocked.push({
    date: new Date(+today + (3 + i * 9) * DAY),
    reason: pick(["Maintenance day", "Fully booked", "Tropical storm watch", "Staff holiday"], rnd()),
  });
}
for (const b of blocked) await db.blockedDate.create({ data: b });
console.log(`· ${blocked.length} blocked dates`);

await db.coupon.deleteMany({});
/* Coupon here is the partner-perks list the customer dashboard shows, not a
   discount-code table — partnerName/title/description/imageEmoji. */
for (const c of [
  { partnerName: "Banana Beach Club", title: "Entrada a mitad de precio", description: "$10 en vez de $20 por persona. Incluye esnórquel, kayak y camastros.", code: "DANI-BANANA", imageEmoji: "🏖️", sortOrder: 1 },
  { partnerName: "Hacienda Antigua", title: "Tour de tequila gratis", description: "Recorrido completo y margarita de bienvenida sin costo.", code: "DANI-TEQUILA", imageEmoji: "🥃", sortOrder: 2 },
  { partnerName: "Sabores de Cozumel", title: "Taller de chocolate gratis", description: "Historia del cacao maya, haz tu propio chocolate y maridaje con tequila.", code: "DANI-CACAO", imageEmoji: "🍫", sortOrder: 3 },
  { partnerName: "Playa San Francisco", title: "Entrada libre", description: "Acceso a la alberca y camastros frente al mar con $20 de consumo.", code: null, imageEmoji: "🏊", active: false, sortOrder: 4 },
]) {
  try { await db.coupon.create({ data: c }); } catch (e) { console.log("  coupon skipped:", String(e.message).split("\n")[0].slice(0, 70)); }
}
console.log("· coupons");

await db.message.deleteMany({});
await db.resource.deleteMany({});
for (const r of [
  { title: "Cómo manejar en Cozumel", description: "Reglas de tránsito y topes en 4 minutos.", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "driving", sortOrder: 1 },
  { title: "Qué llevar a la costa este", description: "Agua, mapas sin conexión y protector solar.", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "tips", sortOrder: 2 },
  { title: "Recoger el buggy paso a paso", description: "Dónde estamos y qué traer.", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "pickup", sortOrder: 3 },
]) {
  try { await db.resource.create({ data: r }); } catch (e) { console.log("  resource skipped:", String(e.message).slice(0, 70)); }
}
console.log("· resources");

/* A local admin to sign in with. Same default the repo's own seed scripts
   use, and it only ever exists in this throwaway database. */
const bcrypt = (await import("bcryptjs")).default;
await db.adminUser.deleteMany({});
await db.adminUser.create({
  data: {
    email: "admin@buggyrentalsdani.com",
    password: bcrypt.hashSync("admin123", 10),
    name: "Dani",
  },
});
console.log("· admin user admin@buggyrentalsdani.com / admin123 (local only)");

console.log("\nlocal dev database ready.");
console.log("Restart the dev server so it picks up .env.development.local.");
if (existsSync(".env")) {
  const real = readFileSync(".env", "utf8").includes("neon.tech");
  console.log(real ? "(.env still points at Neon and was not modified)" : "");
}
console.log("booking fields on the model:", fields.length ? fields.join(", ") : "(table was empty before seeding)");

await db.$disconnect();
