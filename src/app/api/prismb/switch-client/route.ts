import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { clientId } = await request.json();
  if (!clientId || typeof clientId !== "number") {
    return NextResponse.json({ error: "Invalid clientId" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const session = cookieStore.get("prismb_session")?.value;
  if (session !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("prismb_client_id", String(clientId), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });
  return response;
}
