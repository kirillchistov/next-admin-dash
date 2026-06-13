export const dynamic = "force-static";

import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const basePath = process.env.NEXT_EXPORT === "true" ? "/next-admin-dash" : "";
  const origin = new URL(request.url).origin;
  const response = NextResponse.redirect(`${origin}${basePath}/prismb/dashboard/`);
  response.cookies.set("prismb_session", "demo", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });
  return response;
}
