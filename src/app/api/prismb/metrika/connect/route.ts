import { type NextRequest, NextResponse } from "next/server";

export interface MetrikaCookie {
  token: string;
  counterId: string;
  counterName: string;
}

export async function POST(request: NextRequest) {
  const session = request.cookies.get("prismb_session")?.value;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { token?: string; counterId?: string };
  if (!body.token || !body.counterId) {
    return NextResponse.json({ error: "token and counterId required" }, { status: 400 });
  }

  // Validate token by fetching counter info
  const res = await fetch(`https://api-metrika.yandex.net/management/v1/counter/${body.counterId}`, {
    headers: { Authorization: `OAuth ${body.token}` },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Неверный токен или ID счётчика" }, { status: 400 });
  }

  const json = (await res.json()) as { counter?: { name?: string } };
  const counterName = json.counter?.name ?? `Счётчик ${body.counterId}`;

  const payload: MetrikaCookie = { token: body.token, counterId: body.counterId, counterName };
  const response = NextResponse.json({ success: true, counterName });
  response.cookies.set("prismb_metrika", JSON.stringify(payload), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });
  return response;
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("prismb_metrika");
  return response;
}
