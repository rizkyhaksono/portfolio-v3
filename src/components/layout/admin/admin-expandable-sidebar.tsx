"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { ChevronLeft, ChevronRight, Home, Laptop, School, Briefcase, GraduationCap, Settings, LogOut, Menu, User, type LucideIcon } from "lucide-react"
import { removeCookieValue } from "@/commons/helpers/cookies"

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: string
}

const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: Home },
  { title: "Projects", href: "/admin/dashboard/project", icon: Laptop },
  { title: "Work Experience", href: "/admin/dashboard/work", icon: Briefcase },
  { title: "Education", href: "/admin/dashboard/education", icon: GraduationCap },
  { title: "Career", href: "/admin/dashboard/career", icon: School },
]

const bottomNavItems: NavItem[] = [{ title: "Settings", href: "/admin/dashboard/settings", icon: Settings }]

interface SidebarContextType {
  isExpanded: boolean
  setIsExpanded: (value: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextType>({
  isExpanded: true,
  setIsExpanded: () => {},
})

export function useSidebar() {
  return React.useContext(SidebarContext)
}

interface AdminSidebarProviderProps {
  children: React.ReactNode
}

export function AdminSidebarProvider({ children }: Readonly<AdminSidebarProviderProps>) {
  const [isExpanded, setIsExpanded] = React.useState(true)

  const contextValue = React.useMemo(() => ({ isExpanded, setIsExpanded }), [isExpanded])

  return <SidebarContext.Provider value={contextValue}>{children}</SidebarContext.Provider>
}

interface NavLinkProps {
  item: NavItem
  isExpanded: boolean
}

function NavLink({ item, isExpanded }: Readonly<NavLinkProps>) {
  const pathname = usePathname()
  const isActive = pathname === item.href
  const Icon = item.icon

  const linkContent = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
        !isExpanded && "justify-center px-2"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {isExpanded && <span className="truncate">{item.title}</span>}
      {isExpanded && item.badge && <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">{item.badge}</span>}
    </Link>
  )

  if (!isExpanded) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-4">
            {item.title}
            {item.badge && <span className="ml-auto text-muted-foreground">{item.badge}</span>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return linkContent
}

interface AdminExpandableSidebarProps {
  user?: {
    name: string
    email: string
    avatarUrl?: string
  }
}

export function AdminExpandableSidebar({ user }: Readonly<AdminExpandableSidebarProps>) {
  const router = useRouter()
  const { isExpanded, setIsExpanded } = useSidebar()
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false)

  const handleLogout = () => {
    removeCookieValue("ADMIN_SUPABASE_AUTH_COOKIE")
    removeCookieValue("NATEE_V3_TOKEN")
    router.push("/")
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn("fixed inset-y-0 left-0 z-50 hidden flex-col border-r bg-background transition-all duration-300 sm:flex", isExpanded ? "w-64" : "w-16")}>
        {/* Header */}
        <div className={cn("flex h-14 items-center border-b px-3", isExpanded ? "justify-between" : "justify-center")}>
          {isExpanded && (
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">RH</div>
              <span className="font-semibold">Admin Panel</span>
            </Link>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
            {mainNavItems.map((item) => (
              <NavLink key={item.href} item={item} isExpanded={isExpanded} />
            ))}
          </nav>
        </ScrollArea>

        {/* Bottom Navigation */}
        <div className="border-t py-4">
          <nav className="grid gap-1 px-2">
            {bottomNavItems.map((item) => (
              <NavLink key={item.href} item={item} isExpanded={isExpanded} />
            ))}
          </nav>

          {/* User Menu */}
          <div className="mt-4 px-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent", !isExpanded && "justify-center px-2")}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                  {isExpanded && (
                    <div className="flex flex-col items-start truncate">
                      <span className="truncate font-medium">{user?.name || "Admin"}</span>
                      <span className="truncate text-xs text-muted-foreground">{user?.email || "admin@example.com"}</span>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isExpanded ? "end" : "center"} side={isExpanded ? "top" : "right"} className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setShowLogoutDialog(true)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40 sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">RH</div>
              <span className="font-semibold">Admin Panel</span>
            </Link>
          </div>
          <ScrollArea className="flex-1 py-4">
            <nav className="grid gap-1 px-2">
              {mainNavItems.map((item) => (
                <NavLink key={item.href} item={item} isExpanded={true} />
              ))}
            </nav>
          </ScrollArea>
          <div className="border-t py-4">
            <nav className="grid gap-1 px-2">
              {bottomNavItems.map((item) => (
                <NavLink key={item.href} item={item} isExpanded={true} />
              ))}
            </nav>
            <div className="mt-4 px-2">
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-all hover:bg-accent" onClick={() => setShowLogoutDialog(true)}>
                <LogOut className="h-5 w-5" />
                Log out
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Logout Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>You will be redirected to the home page.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Log out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
