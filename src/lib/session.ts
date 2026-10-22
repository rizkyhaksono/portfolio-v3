import { cookies } from "next/headers"

export const SESSION_COOKIE = "NATEE_V3_TOKEN"
export const SIGNED_IN_COOKIE = "NATEE_SIGNED_IN"

const STALE_COOKIES = ["ADMIN_SUPABASE_AUTH_COOKIE", "auth_session"]

const cookieOptions = {
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 7,
}

export async function getSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value
}

export async function hasSession(): Promise<boolean> {
  return Boolean(await getSessionToken())
}

/** The token cookie is httpOnly; the marker cookie only tells client code that someone is signed in. */
export async function setSession(token: string): Promise<void> {
  const store = await cookies()
  store.set(SESSION_COOKIE, token, { ...cookieOptions, httpOnly: true })
  store.set(SIGNED_IN_COOKIE, "1", cookieOptions)
}

export async function clearSession(): Promise<void> {
  const store = await cookies()
  for (const name of [SESSION_COOKIE, SIGNED_IN_COOKIE, ...STALE_COOKIES]) store.delete(name)
}

export async function authHeaders(): Promise<Record<string, string>> {
  const token = await getSessionToken()
  return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }
}
