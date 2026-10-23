"use client";

import { authLogout } from "@/services/visitor/auth";
import { toast } from "sonner";

/**
 * Sign a visitor out: revoke the server session (best effort) and drop the session cookies on the
 * server, clear local chat state, then go to the auth page. Shared by the profile header and card.
 */
export async function performVisitorLogout(): Promise<void> {
  try {
    await authLogout();
    localStorage.removeItem("chat_user");
    toast.success("Logged out successfully");
    window.location.href = "/auth";
  } catch {
    toast.error("Failed to logout");
  }
}
