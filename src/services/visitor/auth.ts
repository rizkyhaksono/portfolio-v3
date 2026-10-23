"use server";

import { headers } from "next/headers";
import { serverApiUrl } from "@/lib/api-base";
import { clearSession, getSessionToken, setSession } from "@/lib/session";
import { apiProxyHeaders } from "@/lib/trusted-client-ip";

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

/** The API rate-limits sign-in by visitor, so it must see the visitor's address, not this server's. */
const visitorHeaders = async () => ({ "Content-Type": "application/json", ...apiProxyHeaders(await headers()) });

/** Whether this session belongs to an administrator. */
const isAdminToken = async (token: string): Promise<boolean> => {
  const response = await fetch(`${serverApiUrl()}/v3/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  }).catch(() => null);
  const json = response?.ok ? await response.json().catch(() => null) : null;
  return json?.data?.role === "ADMIN";
};

// The session cookie is set here, so the token never travels back to the browser in a response body.
const authLogin = async (email: string, password: string): Promise<AuthResult> => {
  const response = await fetch(`${serverApiUrl()}/v3/auth/login`, {
    method: "POST",
    headers: await visitorHeaders(),
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  const json = await response.json().catch(() => null);
  if (!response.ok || typeof json?.token !== "string") return { ok: false, message: readable(json) };

  await setSession(json.token);
  return { ok: true };
};

/** Same as authLogin, but only an ADMIN account keeps its session. */
const adminSignIn = async (email: string, password: string): Promise<AuthResult> => {
  const response = await fetch(`${serverApiUrl()}/v3/auth/login`, {
    method: "POST",
    headers: await visitorHeaders(),
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  }).catch(() => null);
  if (!response) return { ok: false };
  const json = await response.json().catch(() => null);
  if (!response.ok || typeof json?.token !== "string") return { ok: false, message: readable(json) ?? "Those details did not match an account." };

  if (!(await isAdminToken(json.token))) {
    await revoke(json.token);
    return { ok: false, message: "This account is not an administrator." };
  }
  await setSession(json.token);
  return { ok: true };
};

// The API echoes the new user row, so only the outcome crosses to the browser.
const authSignup = async (email: string, password: string, name: string): Promise<AuthResult> => {
  const response = await fetch(`${serverApiUrl()}/v3/auth/signup`, {
    method: "POST",
    headers: await visitorHeaders(),
    body: JSON.stringify({ email, password, name }),
    cache: "no-store",
  });
  if (response.ok) return { ok: true };

  const json = await response.json().catch(() => null);
  return { ok: false, exists: response.status === 409, message: readable(json) };
};

/**
 * Finishes Google sign-in. The API hands over a one-time `code`, exchanged here for the session;
 * `token` is the older hand-over that put the session itself in the URL, kept until that API is gone.
 */
const completeOAuthSignin = async ({ code, token }: { code?: string; token?: string }): Promise<boolean> => {
  let session = token;
  if (code) {
    const response = await fetch(`${serverApiUrl()}/v3/auth/oauth/exchange`, {
      method: "POST",
      headers: await visitorHeaders(),
      body: JSON.stringify({ code }),
      cache: "no-store",
    }).catch(() => null);
    const json = response?.ok ? await response.json().catch(() => null) : null;
    session = typeof json?.token === "string" ? json.token : undefined;
  }
  if (!session) return false;

  const response = await fetch(`${serverApiUrl()}/v3/me`, {
    headers: { Authorization: `Bearer ${session}` },
    cache: "no-store",
  }).catch(() => null);
  if (!response?.ok) return false;

  await setSession(session);
  return true;
};

// Lucia's logout reads the session id from its `auth_session` cookie.
const revoke = async (token: string) => {
  await fetch(`${serverApiUrl()}/v3/auth/logout`, {
    method: "POST",
    headers: { Cookie: `auth_session=${token}` },
    cache: "no-store",
  }).catch(() => null);
};

/** Ends the API session (best effort) and always drops the cookies. */
const authLogout = async (): Promise<void> => {
  const token = await getSessionToken();
  if (token) await revoke(token);
  await clearSession();
};

export {
  authLogin,
  adminSignIn,
  authSignup,
  completeOAuthSignin,
  authLogout,
}
