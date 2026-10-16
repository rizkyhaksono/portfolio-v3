"use server";

import { cookies } from "next/headers";

const authLogin = async (email: string, password: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })
  return await response.json();
};

const authSignup = async (email: string, password: string, name: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      name,
    }),
  })
  return await response.json();
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

const requestPasswordReset = async (email: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v3/auth/password-reset/request`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }
  );
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message ?? json.error?.message ?? "Request failed");
  }
  return json;
};

const confirmPasswordReset = async (token: string, password: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v3/auth/password-reset/confirm`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    }
  );
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message ?? json.error?.message ?? "Reset failed");
  }
  return json;
};

export {
  authLogin,
  authSignup,
  authLogout,
  requestPasswordReset,
  confirmPasswordReset,
}