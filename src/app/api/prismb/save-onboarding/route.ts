import { type NextRequest, NextResponse } from "next/server";

export interface OnboardingCookie {
  companyName: string;
  industry: string;
  goal: string;
  budget: number;
  channels: string[];
}

export async function POST(request: NextRequest) {
  const session = request.cookies.get("prismb_session")?.value;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Partial<OnboardingCookie>;
  if (!body.companyName) return NextResponse.json({ error: "companyName required" }, { status: 400 });

  const payload: OnboardingCookie = {
    companyName: body.companyName,
    industry: body.industry ?? "",
    goal: body.goal ?? "",
    budget: body.budget ?? 100000,
    channels: body.channels ?? [],
  };

  const response = NextResponse.json({ success: true });
  response.cookies.set("prismb_onboarding", JSON.stringify(payload), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
    sameSite: "lax",
  });
  return response;
}
