import { type NextRequest, NextResponse } from "next/server";

import type { ChannelItem } from "@/data/prismb";

export interface ImportedChannelsCookie {
  channels: ChannelItem[];
  importedAt: string;
  source: string;
}

export async function POST(request: NextRequest) {
  const session = request.cookies.get("prismb_session")?.value;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { channels?: ChannelItem[]; source?: string };
  if (!body.channels?.length) return NextResponse.json({ error: "channels required" }, { status: 400 });

  const payload: ImportedChannelsCookie = {
    channels: body.channels,
    importedAt: new Date().toISOString(),
    source: body.source ?? "CSV",
  };

  const response = NextResponse.json({ success: true, count: body.channels.length });
  response.cookies.set("prismb_imported_channels", JSON.stringify(payload), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("prismb_imported_channels");
  return response;
}
