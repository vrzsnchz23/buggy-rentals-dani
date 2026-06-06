import { createRequire } from "module";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");

const dbPath = path.resolve(__dirname, "../prisma/dev.db");
const sqlPath = path.resolve(__dirname, "../prisma/migrations/20260605164633_init/migration.sql");

const db = new Database(dbPath);

// Apply migration
const sql = readFileSync(sqlPath, "utf-8");
try {
  db.exec(sql);
  console.log("✅ Tables created");
} catch (e) {
  if (e.message.includes("already exists")) {
    console.log("ℹ️  Tables already exist");
  } else {
    throw e;
  }
}

// Seed admin user
const email = "admin@buggyrentalsdani.com";
const existing = db.prepare("SELECT id FROM AdminUser WHERE email = ?").get(email);
if (existing) {
  console.log("ℹ️  Admin already exists:", email);
} else {
  const password = bcrypt.hashSync("admin123", 10);
  const id = "admin_" + Date.now();
  db.prepare("INSERT INTO AdminUser (id, email, password, name, createdAt) VALUES (?, ?, ?, ?, ?)").run(
    id, email, password, "Dani", new Date().toISOString()
  );
  console.log("✅ Admin created!");
  console.log("   Email:", email);
  console.log("   Password: admin123");
  console.log("   ⚠️  Change password after first login!");
}

db.close();
console.log("\n🚀 Database ready!");
