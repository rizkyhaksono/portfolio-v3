"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield } from "lucide-react"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { AdminMenu, adminPageFor, type AdminUser } from "./admin-spine"
import { NotificationBell } from "./notification-bell"

const CRUMB =
  "flex min-h-11 min-w-0 items-center gap-1.5 rounded-md px-1.5 text-foreground transition-colors hover:bg-tint lg:min-h-7 [&>svg]:size-4 [&>svg]:shrink-0"

/** Notion's top bar for the admin: the menu below lg, "Admin / page", then notifications and the theme. */
export function AdminTopHeader({ user }: Readonly<{ user?: AdminUser }>) {
  const pathname = usePathname()
  const page = adminPageFor(pathname)
  const Icon = page.icon

  return (
    <header className="sticky top-0 z-30 flex h-[var(--head-h)] shrink-0 items-center gap-1 bg-background px-2 sm:px-3">
      <AdminMenu user={user} className="lg:hidden" />
      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="flex min-w-0 items-center text-small">
          <li className="shrink-0">
            <Link href="/admin/dashboard" className={CRUMB}>
              <Shield aria-hidden strokeWidth={1.5} />
              Admin
            </Link>
          </li>
          <li aria-hidden className="px-0.5 text-muted-foreground">
            /
          </li>
          <li className="min-w-0">
            <Link href={page.href} aria-current={pathname === page.href ? "page" : undefined} className={CRUMB}>
              <Icon aria-hidden strokeWidth={1.5} />
              <span className="truncate">{page.title}</span>
            </Link>
          </li>
        </ol>
      </nav>
      <div className="ml-auto flex shrink-0 items-center">
        <NotificationBell />
        <ThemeToggle />
      </div>
    </header>
  )
}
