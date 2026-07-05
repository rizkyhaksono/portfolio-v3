"use client"

import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSidebar } from "./admin-expandable-sidebar"
import { NotificationBell } from "./notification-bell"
import { cn } from "@/lib/utils"
import { ExternalLink } from "lucide-react"

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/dashboard/analytics": "Analytics",
  "/admin/dashboard/project": "Projects",
  "/admin/dashboard/work": "Work Experience",
  "/admin/dashboard/education": "Education",
  "/admin/dashboard/career": "Career",
  "/admin/dashboard/blog": "Blog",
  "/admin/dashboard/feedback": "Feedback",
  "/admin/dashboard/settings": "Settings",
}

function resolveTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  const match = Object.entries(PAGE_TITLES)
    .filter(([href]) => href !== "/admin/dashboard" && pathname.startsWith(href))
    .sort((a, b) => b[0].length - a[0].length)[0]
  return match ? match[1] : "Dashboard"
}

export function AdminTopHeader() {
  const { setTheme } = useTheme()
  const { isExpanded } = useSidebar()
  const pathname = usePathname()
  const title = resolveTitle(pathname)

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/70 px-4 backdrop-blur-xl transition-all duration-300 sm:px-5",
        isExpanded ? "sm:pl-[276px]" : "sm:pl-[84px]"
      )}
    >
      {/* Single page identity — pages don't repeat their own title */}
      <nav className="flex items-center gap-1.5 pl-12 text-xs text-muted-foreground sm:pl-0" aria-label="Breadcrumb">
        <span>Admin</span>
        <span className="text-muted-foreground/40">/</span>
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      </nav>

      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="sm" className="hidden gap-1.5 text-muted-foreground sm:flex" asChild>
          <Link href="/" target="_blank">
            <ExternalLink className="h-4 w-4" />
            View site
          </Link>
        </Button>

        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
