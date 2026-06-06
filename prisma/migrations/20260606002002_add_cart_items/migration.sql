/*
  Warnings:

  - You are about to drop the column `buggiesCount` on the `Booking` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT NOT NULL,
    "guestPhone" TEXT NOT NULL,
    "groupSize" INTEGER,
    "cruiseName" TEXT,
    "cruiseArrival" DATETIME,
    "cruiseShip" TEXT,
    "rentalDate" DATETIME NOT NULL,
    "items" TEXT NOT NULL DEFAULT '[]',
    "totalAmount" REAL NOT NULL,
    "depositAmount" REAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "deliveryType" TEXT NOT NULL,
    "hotelName" TEXT,
    "hotelAddress" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "stripePaymentId" TEXT,
    "waiverAccepted" BOOLEAN NOT NULL DEFAULT false,
    "waiverSignedAt" DATETIME,
    "driversLicense" TEXT,
    "notes" TEXT,
    "adminNotes" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'en'
);
INSERT INTO "new_Booking" ("adminNotes", "createdAt", "cruiseArrival", "cruiseName", "cruiseShip", "deliveryType", "depositAmount", "driversLicense", "groupSize", "guestEmail", "guestName", "guestPhone", "hotelAddress", "hotelName", "id", "locale", "notes", "paymentMethod", "paymentStatus", "rentalDate", "status", "stripePaymentId", "totalAmount", "updatedAt", "waiverAccepted", "waiverSignedAt") SELECT "adminNotes", "createdAt", "cruiseArrival", "cruiseName", "cruiseShip", "deliveryType", "depositAmount", "driversLicense", "groupSize", "guestEmail", "guestName", "guestPhone", "hotelAddress", "hotelName", "id", "locale", "notes", "paymentMethod", "paymentStatus", "rentalDate", "status", "stripePaymentId", "totalAmount", "updatedAt", "waiverAccepted", "waiverSignedAt" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
