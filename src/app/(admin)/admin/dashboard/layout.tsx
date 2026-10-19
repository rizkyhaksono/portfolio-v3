import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getProfile } from "@/services/user/profile"
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
  const profile = await getProfile().catch(() => null)
  if (profile?.data?.role !== "ADMIN") {
    redirect("/")
  }

  const user = {
    name: profile.data.name ?? "Admin",
    email: profile.data.email ?? "",
    avatarUrl: profile.data.avatarUrl ?? profile.data.iconUrl ?? undefined,
  }

  // data-private: Umami's block selector keeps the admin out of session replays.
  return (
    <div data-private className="min-h-screen [--admin-rail:15rem]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-2 focus:z-50 focus:border focus:border-ink focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
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
