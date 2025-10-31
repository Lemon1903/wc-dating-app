import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

const publicRoutes = ["/login", "/signup"];
const authRoutes = ["/login", "/signup"];

export default async function proxy(request: NextRequest) {
  const { nextUrl } = request;

  const session = await auth();
  const isLoggedIn = !!session;

  // Handle page routes
  const isPublic = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isPublic) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
}

/**
 * This is a regular expression that matches any URL path
 * that does not start with /_next/static, /_next/image, or /favicon.ico
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
