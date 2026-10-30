import type { Metadata } from "next"
import { requireAdminPage } from "@/lib/admin-page"
import { AdminSpine } from "@/components/layout/admin/admin-spine"
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
    <div data-private className="min-h-screen [--admin-rail:15rem]">
      <AdminSpine user={user} />
      <div className="md:pl-[var(--admin-rail)]">
        <AdminTopHeader user={user} />
        <main id="main" className="px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  )
}
