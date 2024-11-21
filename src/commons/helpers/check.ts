"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getCookieValue } from "@/commons/helpers/cookies";

export const useCheckAdmin = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const cookie = await getCookieValue("ADMIN_SUPABASE_AUTH_COOKIE");
      if (cookie) {
        router.push("/admin/dashboard");
      }
    };

    checkAdmin();
  }, [router]);
};
