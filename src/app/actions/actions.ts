"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const revalidateByTag = async (path: string) => {
  revalidatePath(path);
};

const getAuthorizationHeader = async () => {
  const cookieStore = await cookies();
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${cookieStore.get("NATEE_V3_TOKEN")?.value}`,
  };
};

const getCookie = async (key: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(key);
}

const storeCookie = async (key: string, value: string) => {
  const cookieStore = await cookies();
  // Not httpOnly: the client reads this token to build the Authorization header.
  // Hardened with Secure (prod) + SameSite=Lax + a 7-day lifetime to limit exposure.
  cookieStore.set(key, value, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
};

const removeCookie = async (key: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(key);
}

const isHaveValidToken = async () => {
  const cookieStore = await cookies();
  return !!cookieStore.get("NATEE_V3_TOKEN");
};

export {
  revalidateByTag,
  getAuthorizationHeader,
  storeCookie,
  isHaveValidToken,
  getCookie,
  removeCookie,
}