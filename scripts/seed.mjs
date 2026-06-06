import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";
import { createHash } from "crypto";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Use bcryptjs for hashing
const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");

const dbPath = path.resolve(__dirname, "../prisma/dev.db");
const db = new Database(dbPath);

const email = "admin@buggyrentalsdani.com";
const password = bcrypt.hashSync("admin123", 10);
const name = "Dani";
const id = "admin_" + Date.now();

try {
  const existing = db.prepare("SELECT id FROM AdminUser WHERE email = ?").get(email);
  if (existing) {
    console.log("✅ Admin already exists:", email);
  } else {
    db.prepare("INSERT INTO AdminUser (id, email, password, name, createdAt) VALUES (?, ?, ?, ?, ?)").run(
      id, email, password, name, new Date().toISOString()
    );
    console.log("✅ Admin created!");
    console.log("   Email:", email);
    console.log("   Password: admin123");
    console.log("   ⚠️  Change the password after first login!");
  }
} catch (e) {
  console.error("Error:", e.message);
} finally {
  db.close();
}
