-- Manual booking registration.
--
-- Purely additive: four new columns, every one with a default or nullable, so
-- no existing row changes and nothing has to be backfilled. Bookings already
-- in the table all came through the website, which is exactly what
-- channel's default of 'web' says about them.
--
-- To revert:
--   ALTER TABLE "Booking" DROP COLUMN "channel";
--   ALTER TABLE "Booking" DROP COLUMN "unitSource";
--   ALTER TABLE "Booking" DROP COLUMN "partnerName";
--   ALTER TABLE "Booking" DROP COLUMN "createdBy";
--   ALTER TABLE "Booking" ALTER COLUMN "guestEmail" DROP DEFAULT;
-- Dropping the columns loses the channel/partner history recorded since the
-- migration ran, but touches no pre-existing data.

ALTER TABLE "Booking" ADD COLUMN "channel" TEXT NOT NULL DEFAULT 'web';
ALTER TABLE "Booking" ADD COLUMN "unitSource" TEXT NOT NULL DEFAULT 'own';
ALTER TABLE "Booking" ADD COLUMN "partnerName" TEXT;
ALTER TABLE "Booking" ADD COLUMN "createdBy" TEXT;

-- Lets a manual booking omit the email without the insert failing.
-- Existing rows keep the value they already have.
ALTER TABLE "Booking" ALTER COLUMN "guestEmail" SET DEFAULT '';

-- Reporting reads these columns filtered by month; the index keeps the
-- dashboard's per-channel breakdown cheap as the table grows.
CREATE INDEX IF NOT EXISTS "Booking_channel_rentalDate_idx" ON "Booking" ("channel", "rentalDate");
