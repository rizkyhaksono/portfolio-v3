"use client"

import { cn } from "@/lib/utils"
import { AdminExpandableSidebar, AdminSidebarProvider, useSidebar } from "@/components/layout/admin/admin-expandable-sidebar"
import { AdminTopHeader } from "@/components/layout/admin/admin-top-header"

function LayoutContent({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isExpanded } = useSidebar()

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-muted/20">
      {/* Ambient background — subtle, theme-aware */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent" />
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,theme(colors.primary/8%),transparent)]" />
      <AdminExpandableSidebar />
      <AdminTopHeader />
      <main className={cn("flex-1 transition-all duration-300 p-4 sm:p-6", isExpanded ? "sm:pl-[272px]" : "sm:pl-[80px]")}>
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
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
