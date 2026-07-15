import createMiddleware from "next-intl/middleware";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

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
    if (!session || !(session.user as any)?.isAdmin) {
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
    }
  }

  // Protect customer dashboard
  const isDashboard = /^\/(en|es)\/dashboard(\/|$)/.test(pathname);
  if (isDashboard) {
    const isPublic = /\/(login)(\/|$)/.test(pathname);
    if (!isPublic) {
      const session = await auth();
      if (!session?.user) {
        return NextResponse.redirect(new URL(`/${locale}/dashboard/login`, request.url));
      }
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
