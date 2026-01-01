import type { Metadata } from "next"
import { AdminDashboardLayoutClient } from "./_components/layout-client"

export const metadata: Metadata = {
  title: "Admin Dashboard | RH",
  description: "Built by @rizkyhaksono",
}

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AdminDashboardLayoutClient>{children}</AdminDashboardLayoutClient>
}
