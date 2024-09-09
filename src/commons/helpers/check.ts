"use client"

import { useRouter } from "next/navigation";
import { getCookieValue } from "@/commons/helpers/cookies";

export const useCheckAdmin = async () => {
  const router = useRouter();
  const cookie = await getCookieValue("ADMIN_SUPABASE_AUTH_COOKIE");
  if (cookie) {
    router.push("/admin/dashboard");
  }
};