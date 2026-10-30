import "server-only"
import { redirect } from "next/navigation"
import { getProfile } from "@/services/user/profile"

/**
 * The ADMIN check for server-rendered dashboard pages. The layout runs it too, but a client-side
 * navigation (or a crafted RSC request) can render a page without re-running its layout, so any page
 * that reads server-side data calls this itself.
 */
export async function requireAdminPage() {
  const profile = await getProfile().catch(() => null)
  if (profile?.data?.role !== "ADMIN") redirect("/")
  return profile.data
}
