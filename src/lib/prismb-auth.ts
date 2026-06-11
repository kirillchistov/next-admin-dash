import { cookies } from "next/headers";

export type PriSMBRole = "demo" | "admin";

const CREDENTIALS: Record<string, { password: string; role: PriSMBRole }> = {
  demo: { password: "Demo.2026", role: "demo" },
  admin: { password: "Admin.2026.PriSMB", role: "admin" },
};

export function validateCredentials(login: string, password: string): PriSMBRole | null {
  const entry = CREDENTIALS[login];
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
