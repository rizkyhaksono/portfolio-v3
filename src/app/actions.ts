"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const revalidateByTag = (path: string) => {
  revalidatePath(path);
};

const getAuthorizationHeader = async () => {
  const cookieStore = await cookies();
  return {
    Authorization: `Bearer ${cookieStore.get("auth_session")?.value}`,
  };
};

const isHaveValidToken = async () => {
  const cookieStore = await cookies();
  return !!cookieStore.get("auth_session");
};

export {
  revalidateByTag,
  getAuthorizationHeader,
  isHaveValidToken,
}