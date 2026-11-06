-- Tracks when Dani sent his personal welcome note for a booking.
--
-- Additive and idempotent: one nullable column, no backfill. NULL means the
-- note has not been sent, which is correct for every booking already in the
-- table. Safe to run twice.
--
-- To revert:
--   ALTER TABLE "Booking" DROP COLUMN "personalNoteSentAt";
-- Dropping it loses the record of which guests were already written to, so
-- the next click would send some of them a duplicate.

ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "personalNoteSentAt" TIMESTAMP(3);
