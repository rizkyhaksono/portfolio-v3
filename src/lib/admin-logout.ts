"use client";

import { adminLogout } from "@/app/actions/admin-auth";

export async function performAdminLogout(): Promise<void> {
  await adminLogout().catch(() => {});
  localStorage.removeItem("chat_user");
  window.location.href = "/";
}
