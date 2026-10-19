"use client"

import { usePathname } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { cn } from "@/lib/utils"
import { ADMIN_PAGES, AdminMenu, type AdminUser } from "./admin-spine"
import { NotificationBell } from "./notification-bell"

// Longest matching href wins, so /admin/dashboard/blog is "Blog", not "Dashboard".
const titleFor = (pathname: string) =>
  [...ADMIN_PAGES].sort((a, b) => b.href.length - a.href.length).find((page) => pathname.startsWith(page.href))?.title ??
  "Dashboard"

/** The page's one heading, plus the site link, notifications and the theme. Pages do not repeat their title. */
export function AdminTopHeader({ user }: Readonly<{ user?: AdminUser }>) {
  const pathname = usePathname()

  return (
    <header className="bg-paper sticky top-0 z-30 border-b border-rule">
      <div className="flex min-h-[var(--head-h)] items-center gap-3 px-4 sm:px-6 lg:px-10">
        <AdminMenu user={user} />
        <h1 className="min-w-0 truncate font-display text-h3 text-ink">{titleFor(pathname)}</h1>
        <div className="ml-auto flex items-center gap-1">
          <a
            href="/"
            target="_blank"
            rel="noopener"
            aria-label="View site (opens in a new tab)"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex")}
          >
            View site
          </a>
          <NotificationBell />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
