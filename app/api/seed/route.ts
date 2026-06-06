import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// Only allow in development
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }

  const existing = await db.adminUser.findUnique({ where: { email: "admin@buggyrentalsdani.com" } });
  if (existing) {
    return NextResponse.json({ message: "Admin already exists", email: existing.email });
  }

  const password = await bcrypt.hash("admin123", 10);
  const admin = await db.adminUser.create({
    data: {
      email: "admin@buggyrentalsdani.com",
      password,
      name: "Dani",
    },
  });

  return NextResponse.json({
    message: "Admin created! Change the password immediately.",
    email: admin.email,
    defaultPassword: "admin123",
  });
}
