"use server";

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

const authLogout = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/auth/logout`, {
    method: "POST",
    credentials: "include",
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