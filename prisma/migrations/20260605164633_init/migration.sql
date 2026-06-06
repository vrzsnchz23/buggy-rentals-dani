-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT NOT NULL,
    "guestPhone" TEXT NOT NULL,
    "groupSize" INTEGER NOT NULL,
    "cruiseName" TEXT,
    "cruiseArrival" DATETIME,
    "cruiseShip" TEXT,
    "rentalDate" DATETIME NOT NULL,
    "buggiesCount" INTEGER NOT NULL DEFAULT 1,
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

-- CreateTable
CREATE TABLE "BlockedDate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
