/**
 * Prints one booking from the LOCAL dev database. Used to prove a date edit in
 * the admin leaves every other field alone.
 *
 *   node scripts/dev-db-peek.mjs            # pick a booking with no returnDate
 *   node scripts/dev-db-peek.mjs <id>
 *
 * Loopback only — see the guard. Nothing here can reach a hosted database.
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const URL_ = `postgres://postgres:postgres@127.0.0.1:${process.env.DEV_DB_PORT || 5433}/postgres`;
if (!/@(127\.0\.0\.1|localhost)/.test(URL_)) throw new Error("refusing: not loopback");

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: URL_ }) });
const id = process.argv[2];
const b = id
  ? await db.booking.findUnique({ where: { id } })
  : await db.booking.findFirst({ where: { returnDate: null }, orderBy: { rentalDate: "desc" } });

if (!b) {
  console.log("no booking found");
} else {
  console.log(
    JSON.stringify(
      {
        id: b.id,
        guestName: b.guestName,
        guestEmail: b.guestEmail,
        rentalDate: b.rentalDate?.toISOString(),
        returnDate: b.returnDate?.toISOString() ?? null,
        totalAmount: b.totalAmount,
        depositAmount: b.depositAmount,
        items: b.items,
        status: b.status,
        paymentStatus: b.paymentStatus,
        notes: b.notes,
        adminNotes: b.adminNotes,
        hotelName: b.hotelName,
        updatedAt: b.updatedAt?.toISOString(),
      },
      null,
      1
    )
  );
}
await db.$disconnect();
