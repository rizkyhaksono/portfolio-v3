"use server";

import { fetchFromAPI } from "@/lib/fetch-utils";

const authLogin = async (email: string, password: string) => {
  return fetchFromAPI("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

const authSignup = async (email: string, password: string, name: string) => {
  return fetchFromAPI("/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      name,
    }),
  });
};

const authLogout = async () => {
  return fetchFromAPI("/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export {
  authLogin,
  authSignup,
  authLogout,
}