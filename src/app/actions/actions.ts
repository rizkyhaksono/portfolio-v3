"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const revalidateByTag = (path: string) => {
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
  cookieStore.set(key, value);
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