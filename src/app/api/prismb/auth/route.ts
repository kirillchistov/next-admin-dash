import { NextResponse, type NextRequest } from "next/server";

import { validateCredentials } from "@/lib/prismb-auth";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { login?: string; password?: string };
    const { login, password } = body;

    if (!login || !password) {
      return NextResponse.json({ error: "Логин и пароль обязательны" }, { status: 400 });
    }

    const role = validateCredentials(login, password);

    if (!role) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, role });
    response.cookies.set("prismb_session", role, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
