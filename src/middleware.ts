import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle /prismb/* routes
  if (!pathname.startsWith("/prismb")) {
    return NextResponse.next();
  }

  // Public routes — login page and API auth/logout
  if (
    pathname === "/prismb/login" ||
    pathname.startsWith("/api/prismb/auth") ||
    pathname.startsWith("/api/prismb/logout")
  ) {
    return NextResponse.next();
  }

  const session = request.cookies.get("prismb_session")?.value;
  const isValidSession = session === "demo" || session === "admin";

  if (!isValidSession) {
    const loginUrl = new URL("/prismb/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin-only route
  if (pathname.startsWith("/prismb/admin") && session !== "admin") {
    return NextResponse.redirect(new URL("/prismb/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/prismb/:path*"],
};
