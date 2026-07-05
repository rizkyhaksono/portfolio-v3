import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getProfile } from "@/services/user/profile"
import { AdminDashboardLayoutClient } from "./_components/layout-client"

export const metadata: Metadata = {
  title: "Admin Dashboard | RH",
  description: "Built by @rizkyhaksono",
}

export const dynamic = "force-dynamic"

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Only ADMIN users may access the dashboard (works with the main SSO/email session).
  const profile = await getProfile().catch(() => null)
  if (profile?.data?.role !== "ADMIN") {
    redirect("/")
  }

  // Real signed-in user for the sidebar footer — never dummy data.
  const user = {
    name: profile.data.name ?? "Admin",
    email: profile.data.email ?? "",
    avatarUrl: profile.data.avatarUrl ?? profile.data.iconUrl ?? undefined,
  }

  return <AdminDashboardLayoutClient user={user}>{children}</AdminDashboardLayoutClient>
}
