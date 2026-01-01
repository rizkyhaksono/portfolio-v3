"use client"

import { cn } from "@/lib/utils"
import { AdminExpandableSidebar, AdminSidebarProvider, useSidebar } from "@/components/layout/admin/admin-expandable-sidebar"
import { AdminTopHeader } from "@/components/layout/admin/admin-top-header"

function LayoutContent({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isExpanded } = useSidebar()

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AdminExpandableSidebar />
      <AdminTopHeader />
      <main className={cn("flex-1 transition-all duration-300 p-4 sm:p-6", isExpanded ? "sm:pl-[272px]" : "sm:pl-[80px]")}>{children}</main>
    </div>
  )
}

export function AdminDashboardLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AdminSidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </AdminSidebarProvider>
  )
}
