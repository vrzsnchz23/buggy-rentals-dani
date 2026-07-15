import createMiddleware from "next-intl/middleware";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/customer-session-cookie";

const intlMiddleware = createMiddleware({
  locales: ["en", "es"],
  defaultLocale: "en",
});

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = pathname.startsWith("/es") ? "es" : "en";

  // Protect admin routes
  if (pathname.includes("/admin") && !pathname.includes("/admin/login")) {
    const session = await auth();
    if (!session) {
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
    }
  }

  // Protect customer dashboard
  const isDashboard = /^\/(en|es)\/dashboard(\/|$)/.test(pathname);
  if (isDashboard) {
    const isPublic = /\/(login|verify)(\/|$)/.test(pathname);
    if (!isPublic) {
      const token = request.cookies.get(SESSION_COOKIE)?.value;
      if (!token) {
        return NextResponse.redirect(new URL(`/${locale}/dashboard/login`, request.url));
      }
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
