"use client";

import { authLogout } from "@/services/visitor/auth";
import { removeCookie } from "@/app/actions/actions";
import { toast } from "sonner";

/**
 * Sign a visitor out: revoke the server session (best-effort), drop the client
 * session cookie, clear local chat state, then redirect to the auth page.
 * Shared by the profile header and the sidebar profile card.
 */
export async function performVisitorLogout(): Promise<void> {
  try {
    await authLogout().catch(() => {});
    await removeCookie("NATEE_V3_TOKEN");
    if (typeof window !== "undefined") {
      localStorage.removeItem("chat_user");
    }
    toast.success("Logged out successfully");
    window.location.href = "/auth";
  } catch (error) {
    console.error("Logout error:", error);
    toast.error("Failed to logout");
  }
}
