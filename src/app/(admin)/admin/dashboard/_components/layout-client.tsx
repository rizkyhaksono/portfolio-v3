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
      {/* Full-width content — the page owns no outer padding, so space is maximized */}
      <main className={cn("flex-1 p-3 transition-all duration-300 sm:p-4", isExpanded ? "sm:pl-[272px]" : "sm:pl-[80px]")}>
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
