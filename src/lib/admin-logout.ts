"use client";

import { adminLogout } from "@/app/actions/admin-auth";

function expireClientCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

export async function performAdminLogout(): Promise<void> {
  await adminLogout();

  localStorage.removeItem("chat_user");
  expireClientCookie("NATEE_V3_TOKEN");
  expireClientCookie("ADMIN_SUPABASE_AUTH_COOKIE");
  expireClientCookie("auth_session");

  window.location.href = "/";
}
