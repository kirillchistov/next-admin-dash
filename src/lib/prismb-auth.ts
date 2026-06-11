import { cookies } from "next/headers";

export type PriSMBRole = "demo" | "admin";

function getCredentials(): Record<string, { password: string; role: PriSMBRole }> {
  return {
    demo: { password: process.env.PRISMB_DEMO_PASSWORD ?? "Demo.2026", role: "demo" },
    admin: { password: process.env.PRISMB_ADMIN_PASSWORD ?? "Admin.2026.PriSMB", role: "admin" },
  };
}

export function validateCredentials(login: string, password: string): PriSMBRole | null {
  const entry = getCredentials()[login];
  if (!entry) return null;
  if (entry.password !== password) return null;
  return entry.role;
}

export async function getSession(): Promise<PriSMBRole | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("prismb_session")?.value;
  if (session === "demo" || session === "admin") return session;
  return null;
}

export async function requireSession(): Promise<PriSMBRole> {
  const role = await getSession();
  if (!role) throw new Error("Unauthorized");
  return role;
}
