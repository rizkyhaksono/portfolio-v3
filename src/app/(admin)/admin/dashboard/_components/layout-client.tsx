"use client"

import { cn } from "@/lib/utils"
import { AdminExpandableSidebar, AdminSidebarProvider, useSidebar, type AdminUser } from "@/components/layout/admin/admin-expandable-sidebar"
import { AdminTopHeader } from "@/components/layout/admin/admin-top-header"

function LayoutContent({ children, user }: Readonly<{ children: React.ReactNode; user?: AdminUser }>) {
  const { isExpanded } = useSidebar()

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-muted/20">
      {/* Ambient background — subtle, theme-aware */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent" />
      <AdminExpandableSidebar user={user} />
      <AdminTopHeader />
      {/* Full-width content — the page owns no outer padding, so space is maximized */}
      <main className={cn("flex-1 p-4 transition-all duration-300 sm:p-5", isExpanded ? "sm:pl-[276px]" : "sm:pl-[84px]")}>
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
