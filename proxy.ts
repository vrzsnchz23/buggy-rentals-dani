import createMiddleware from "next-intl/middleware";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["en", "es"],
  defaultLocale: "en",
});

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.includes("/admin") && !pathname.includes("/admin/login")) {
    const session = await auth();
    if (!session) {
      const locale = pathname.startsWith("/es") ? "es" : "en";
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
