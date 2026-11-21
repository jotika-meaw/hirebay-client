import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Reload-safe route protection: cookie check only (fast, no DB).
// Logged-out visits to private routes land on /login?redirect=<path>.
export function proxy(request) {
  const { pathname, search } = request.nextUrl;
  if (!getSessionCookie(request)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/equipment/:id", "/payment/:path*"],
};
