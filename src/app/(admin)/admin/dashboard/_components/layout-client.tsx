"use client"

import { cn } from "@/lib/utils"
import { AdminExpandableSidebar, AdminSidebarProvider, useSidebar, type AdminUser } from "@/components/layout/admin/admin-expandable-sidebar"
import { AdminTopHeader } from "@/components/layout/admin/admin-top-header"

function LayoutContent({ children, user }: Readonly<{ children: React.ReactNode; user?: AdminUser }>) {
  const { isExpanded } = useSidebar()

  return (
    <div className="admin-shell relative flex min-h-screen w-full flex-col bg-background">
      <AdminExpandableSidebar user={user} />
      <AdminTopHeader />
      <main className={cn("flex-1 px-4 pb-10 pt-3 sm:px-6", isExpanded ? "sm:pl-[248px]" : "sm:pl-[88px]")}>
        {children}
      </main>
    </div>
  )
}

export function AdminDashboardLayoutClient({
  children,
  user,
}: Readonly<{
  children: React.ReactNode
  user?: AdminUser
}>) {
  return (
    <AdminSidebarProvider>
      <LayoutContent user={user}>{children}</LayoutContent>
    </AdminSidebarProvider>
  )
}
