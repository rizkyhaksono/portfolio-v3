"use client"

import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Home, PanelLeft, Settings, Laptop, School } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
          <div className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">RH</div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/admin/dashboard"
                  className={
                    pathname === "/admin/dashboard"
                      ? "flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      : "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  }
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/admin/dashboard/career"
                  className={
                    pathname === "/admin/dashboard/career"
                      ? "flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      : "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  }
                >
                  <School className="h-5 w-5" />
                  <span className="sr-only">Career</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Career</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/admin/dashboard/project"
                  className={
                    pathname === "/admin/dashboard/project"
                      ? "flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      : "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  }
                >
                  <Laptop className="h-5 w-5" />
                  <span className="sr-only">Project</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Project</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/admin/dashboard/settings"
                  className={
                    pathname === "/admin/dashboard/settings"
                      ? "flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      : "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  }
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <div className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base">RH</div>
              <Link
                href="/admin/dashboard"
                className={pathname === "/admin/dashboard" ? "flex items-center gap-4 px-2.5 text-accent-foreground hover:text-foreground" : "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"}
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/admin/dashboard/career"
                className={pathname === "/admin/dashboard/career" ? "flex items-center gap-4 px-2.5 text-accent-foreground hover:text-foreground" : "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"}
              >
                <School className="h-5 w-5" />
                Career
              </Link>
              <Link
                href="/admin/dashboard/project"
                className={pathname === "/admin/dashboard/project" ? "flex items-center gap-4 px-2.5 text-accent-foreground hover:text-foreground" : "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"}
              >
                <Laptop className="h-5 w-5" />
                Project
              </Link>
              <Link
                href="/admin/dashboard/settings"
                className={pathname === "/admin/dashboard/settings" ? "flex items-center gap-4 px-2.5 text-accent-foreground hover:text-foreground" : "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"}
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </header>
    </>
  )
}
