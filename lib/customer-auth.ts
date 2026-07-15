import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { randomBytes } from "crypto";
import { SESSION_COOKIE } from "./customer-session-cookie";
export { SESSION_COOKIE };

export const SESSION_DAYS = 30;

export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function getCustomerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await db.userSession.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) return null;
  return session;
}

export async function requireCustomerSession() {
  const session = await getCustomerSession();
  if (!session) return null;
  return session;
}

export function sessionCookieOptions(token: string) {
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_DAYS);
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires,
  };
}
