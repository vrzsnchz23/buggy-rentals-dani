import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * SSL was switched on unconditionally, which made a local database impossible
 * to connect to: a Postgres on loopback answers the TLS handshake with "the
 * server does not support SSL connections" and every query fails. Hosted
 * Postgres still gets exactly the same settings as before — only loopback is
 * treated differently.
 */
function sslFor(url: string | undefined) {
  if (!url) return undefined;
  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {
    return { rejectUnauthorized: false };
  }
  const loopback = host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]";
  return loopback ? false : { rejectUnauthorized: false };
}

function createClient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    ssl: sslFor(process.env.DATABASE_URL),
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
