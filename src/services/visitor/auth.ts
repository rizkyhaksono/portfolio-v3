"use server";

import { cookies } from "next/headers";
import { storeCookie } from "@/app/actions/actions";

interface AuthResult {
  ok: boolean;
  /** Copy meant for people, when the API has some. */
  message?: string;
  /** Signup only: the email already has an account. */
  exists?: boolean;
}

// Only these API errors carry sentences written for people; anything else gets the form's own line.
const READABLE_ERRORS = ["BAD_REQUEST", "UNAUTHORIZED", "TOO_MANY_REQUESTS"];

const readable = (json: { name?: string; message?: string } | null) =>
  json?.name && READABLE_ERRORS.includes(json.name) ? json.message : undefined;

// The session cookie is set here, so the token never travels back to the browser in a response body.
const authLogin = async (email: string, password: string): Promise<AuthResult> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  const json = await response.json().catch(() => null);
  if (!response.ok || typeof json?.token !== "string") return { ok: false, message: readable(json) };

  await storeCookie("NATEE_V3_TOKEN", json.token);
  return { ok: true };
};

// The API echoes the new user row (hash and salt included), so only the outcome crosses to the browser.
const authSignup = async (email: string, password: string, name: string): Promise<AuthResult> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
    cache: "no-store",
  });
  if (response.ok) return { ok: true };

  const json = await response.json().catch(() => null);
  return { ok: false, exists: response.status === 409, message: readable(json) };
};

// OAuth hands the session token to /auth/callback in the URL; keep it only if the API accepts it.
const completeOAuthSignin = async (token: string): Promise<boolean> => {
  if (!token) return false;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  }).catch(() => null);
  if (!response?.ok) return false;

  await storeCookie("NATEE_V3_TOKEN", token);
  return true;
};

// Server-to-server call: the API's Lucia logout reads the session id from its `auth_session` cookie.
// The token is read here, not passed in, so no client-callable action returns cookie values.
const authLogout = async () => {
  const token = (await cookies()).get("NATEE_V3_TOKEN")?.value
  if (!token) return
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/auth/logout`, {
    method: "POST",
    headers: { Cookie: `auth_session=${token}` },
  })
  return await response.json();
}

export {
  authLogin,
  authSignup,
  completeOAuthSignin,
  authLogout,
}
