import { cookies } from "next/headers";

/** Returns cookie store in server context, null during static prerendering. */
export async function safeCookies() {
  try {
    return await cookies();
  } catch {
    return null;
  }
}
