import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/prismb")) {
    return NextResponse.next();
  }

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

  if (pathname.startsWith("/prismb/admin") && session !== "admin") {
    return NextResponse.redirect(new URL("/prismb/dashboard", request.url));
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/prismb/:path*"],
};
