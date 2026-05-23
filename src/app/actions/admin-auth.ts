"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

const SESSION_COOKIE = "auth_session";
const TOKEN_COOKIE = "NATEE_V3_TOKEN";
const ADMIN_COOKIE = "ADMIN_SUPABASE_AUTH_COOKIE";

export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  const sessionId = token ?? cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionId && API_URL) {
    try {
      await fetch(`${API_URL}/v3/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          Cookie: `${SESSION_COOKIE}=${sessionId}`,
        },
      });
    } catch {
      // Still clear local cookies if API is unreachable
    }
  }

  cookieStore.delete(TOKEN_COOKIE);
  cookieStore.delete(ADMIN_COOKIE);
  cookieStore.delete(SESSION_COOKIE);

  revalidatePath("/", "layout");
}
