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
  // Metadata routes must bypass the locale rewrite. Anything with an extension
  // (icon.png, robots.txt, sitemap.xml, manifest.webmanifest) is already
  // excluded by the dot rule; opengraph-image has none, and without it listed
  // here the social preview URL redirects to /en/opengraph-image and 404s.
  //
  // `review` is deliberately locale-free: it is a short URL printed on QR codes
  // and business cards, so it must not be rewritten to /en/review (which does
  // not exist). llms.txt and the IndexNow key file are covered by the dot rule.
  matcher: ["/((?!api|_next|opengraph-image|twitter-image|review|.*\\..*).*)"],
};
