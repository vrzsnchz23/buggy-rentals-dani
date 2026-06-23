-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "customerType" TEXT NOT NULL DEFAULT 'cruise',
ADD COLUMN     "returnDate" TIMESTAMP(3);
