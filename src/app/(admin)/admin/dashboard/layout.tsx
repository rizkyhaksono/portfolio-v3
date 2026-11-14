import type { Metadata } from "next"
import { requireAdminPage } from "@/lib/admin-page"
import { AdminSidebar } from "@/components/layout/admin/admin-spine"
import { AdminTopHeader } from "@/components/layout/admin/admin-top-header"

export const metadata: Metadata = {
  title: "Admin | RH",
  description: "Built by @rizkyhaksono",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function AdminDashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Only ADMIN users may access the dashboard (works with the main SSO/email session).
  const profile = await requireAdminPage()

  const user = {
    name: profile.name ?? "Admin",
    email: profile.email ?? "",
    avatarUrl: profile.avatarUrl ?? profile.iconUrl ?? undefined,
  }

  // data-private: Umami's block selector keeps the admin out of session replays.
  return (
    <div data-private className="flex min-h-svh">
      <AdminSidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopHeader user={user} />
        <main id="main" className="min-w-0 flex-1 px-6 pb-24 pt-10 sm:pt-16 xl:px-12">
          {children}
        </main>
      </div>
    </div>
  )
}
