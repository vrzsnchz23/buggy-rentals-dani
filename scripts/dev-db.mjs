/**
 * A throwaway local Postgres for development.
 *
 * Why this exists: the only .env in this repo points DATABASE_URL at the live
 * Neon database, so `npm run dev` develops against production — and the same
 * file holds the live Stripe and Resend keys, which means a stray click in the
 * admin panel can cancel a real booking or email a real customer. Nobody
 * should have to be careful about that while building a UI.
 *
 * PGlite is real Postgres compiled to WebAssembly, so this needs no server
 * install and no binaries to download, and pglite-socket puts it behind a TCP
 * port speaking the normal Postgres wire protocol. That means `pg` — the driver
 * lib/db.ts already uses — connects to it unchanged.
 *
 *   node scripts/dev-db.mjs            # start it, keep it running
 *   node scripts/dev-db.mjs --reset    # throw the data away and start clean
 *
 * Data lives in .pglite/ (gitignored). Nothing here can reach Neon.
 */
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import { rmSync, existsSync } from "node:fs";

const PORT = Number(process.env.DEV_DB_PORT || 5433);
const DIR = ".pglite";

if (process.argv.includes("--reset") && existsSync(DIR)) {
  rmSync(DIR, { recursive: true, force: true });
  console.log(`· removed ${DIR}`);
}

const db = await PGlite.create({ dataDir: DIR });
/* The default is 1, and one slot is not enough: Next's `pg` pool holds
   connections open, so a Prisma CLI command alongside a running dev server
   gets P1001. Concurrency is multiplexed over the single WASM instance. */
const server = new PGLiteSocketServer({ db, port: PORT, host: "127.0.0.1", maxConnections: 10 });
await server.start();

console.log(`local postgres listening on 127.0.0.1:${PORT}`);
console.log(`  DATABASE_URL="postgres://postgres:postgres@127.0.0.1:${PORT}/postgres"`);
console.log("  (bound to loopback only · data in .pglite/ · Ctrl-C to stop)");

const shutdown = async () => {
  await server.stop();
  await db.close();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
