-- Creates the BlogPost table: the one database change the blog editor needs.
--
-- Run it once against the production database, in Neon's SQL editor
-- (Neon console -> your project -> SQL Editor -> paste -> Run).
--
-- Why a .sql file and not `prisma db push`: push compares the whole schema
-- against the whole database and resolves the difference however it decides
-- to, which on a database holding real bookings is a far bigger instrument
-- than "add one table" — it can drop a column it does not recognise, and it
-- asks for --accept-data-loss when it wants to.
--
-- Everything below is CREATE ... IF NOT EXISTS. There is no DROP, no ALTER and
-- no DELETE in this file, so it cannot touch the bookings or any other table,
-- and running it twice does nothing the second time.
--
-- The column names, types and constraint names are exactly what Prisma
-- generates for the model in schema.prisma, so there is no drift afterwards.
--
-- Local development needs none of this: `node scripts/dev-db-seed.mjs` pushes
-- the schema to the throwaway database and the table appears with it.

CREATE TABLE IF NOT EXISTS "BlogPost" (
  "id"         TEXT NOT NULL,
  "slug"       TEXT NOT NULL,
  "title"      TEXT NOT NULL,
  "titleEs"    TEXT NOT NULL,
  "excerpt"    TEXT NOT NULL,
  "excerptEs"  TEXT NOT NULL,
  "content"    TEXT NOT NULL,
  "contentEs"  TEXT NOT NULL,
  "category"   TEXT NOT NULL,
  "categoryEs" TEXT NOT NULL,
  "coverImage" TEXT NOT NULL,
  "date"       TIMESTAMP(3) NOT NULL,
  "readTime"   INTEGER NOT NULL DEFAULT 5,
  "published"  BOOLEAN NOT NULL DEFAULT false,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"  TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "BlogPost_slug_key" ON "BlogPost"("slug");

-- ──────────────────────────────────────────────────────────────────────────
-- Cover photos uploaded from the admin panel.
--
-- The bytes live in the database because Vercel's filesystem is read-only: a
-- file uploaded at runtime cannot be written next to the ones in the
-- repository. The browser shrinks each photo before it is sent, so a cover is
-- a few hundred kilobytes.
-- ──────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "BlogImage" (
  "id"          TEXT NOT NULL,
  "filename"    TEXT NOT NULL,
  "mimeType"    TEXT NOT NULL,
  "bytes"       BYTEA NOT NULL,
  "width"       INTEGER NOT NULL,
  "height"      INTEGER NOT NULL,
  "blurDataURL" TEXT NOT NULL,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BlogImage_pkey" PRIMARY KEY ("id")
);

-- Optional check, which changes nothing: confirms the table is there and that
-- the bookings are untouched.
--
--   SELECT count(*) AS blog_posts FROM "BlogPost";
--   SELECT count(*) AS bookings   FROM "Booking";
