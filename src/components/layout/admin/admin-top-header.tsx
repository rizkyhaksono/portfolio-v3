"use client"

import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSidebar } from "./admin-expandable-sidebar"
import { cn } from "@/lib/utils"
import { Bell, ExternalLink } from "lucide-react"

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/dashboard/analytics": "Analytics",
  "/admin/dashboard/project": "Projects",
  "/admin/dashboard/work": "Work Experience",
  "/admin/dashboard/education": "Education",
  "/admin/dashboard/career": "Career",
  "/admin/dashboard/blog": "Blog",
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
        "sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/70 px-4 backdrop-blur-xl transition-all duration-300 sm:px-6",
        isExpanded ? "sm:pl-[272px]" : "sm:pl-[80px]"
      )}
    >
      <div className="flex flex-col pl-12 sm:pl-0">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Admin</span>
          <span className="text-muted-foreground/40">/</span>
          <span className="font-medium text-foreground">{title}</span>
        </nav>
        <h1 className="text-base font-semibold leading-tight sm:text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="sm" className="hidden gap-1.5 text-muted-foreground sm:flex" asChild>
          <Link href="/" target="_blank">
            <ExternalLink className="h-4 w-4" />
            View site
          </Link>
        </Button>

        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
          <span className="sr-only">Notifications</span>
        </Button>

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
