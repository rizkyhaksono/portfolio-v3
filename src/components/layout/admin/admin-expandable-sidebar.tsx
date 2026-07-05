"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { ChevronsLeft, ChevronsRight, Home, Laptop, School, Briefcase, GraduationCap, Settings, LogOut, Menu, User, NotebookPen, BarChart3, Sparkles, ChevronUp, MessageSquare, type LucideIcon } from "lucide-react"
import { performAdminLogout } from "@/lib/admin-logout"

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: string
}

interface NavSection {
  label: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/admin/dashboard", icon: Home },
      { title: "Analytics", href: "/admin/dashboard/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Manage",
    items: [
      { title: "Projects", href: "/admin/dashboard/project", icon: Laptop },
      { title: "Work Experience", href: "/admin/dashboard/work", icon: Briefcase },
      { title: "Education", href: "/admin/dashboard/education", icon: GraduationCap },
      { title: "Career", href: "/admin/dashboard/career", icon: School },
      { title: "Blog", href: "/admin/dashboard/blog", icon: NotebookPen },
      { title: "Feedback", href: "/admin/dashboard/feedback", icon: MessageSquare },
    ],
  },
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
  const isActive = item.href === "/admin/dashboard" ? pathname === item.href : pathname.startsWith(item.href)
  const Icon = item.icon

  const linkContent = (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
        isActive
          ? "bg-gradient-to-r from-primary/15 to-primary/5 text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        !isExpanded && "justify-center px-2"
      )}
    >
      {isActive && <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />}
      <Icon className={cn("h-[18px] w-[18px] shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
      {isExpanded && <span className="truncate">{item.title}</span>}
      {isExpanded && item.badge && <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">{item.badge}</span>}
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

function Brand({ isExpanded }: { isExpanded: boolean }) {
  return (
    <Link href="/admin/dashboard" className="flex items-center gap-2.5">
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-sm font-bold text-primary-foreground shadow-sm">
        RH
        <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 text-primary" />
      </div>
      {isExpanded && (
        <div className="flex flex-col leading-none">
          <span className="text-sm font-semibold">Admin Panel</span>
          <span className="mt-0.5 text-[11px] text-muted-foreground">Portfolio v3</span>
        </div>
      )}
    </Link>
  )
}

export interface AdminUser {
  name: string
  email: string
  avatarUrl?: string
}

interface UserMenuProps {
  user?: AdminUser
  isExpanded: boolean
  onLogout: () => void
}

function UserMenu({ user, isExpanded, onLogout }: Readonly<UserMenuProps>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("flex w-full items-center gap-2.5 rounded-lg border border-transparent p-2 text-sm transition-all hover:border-border hover:bg-muted", !isExpanded && "justify-center")}>
          {user?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatarUrl} alt={user.name} referrerPolicy="no-referrer" className="h-8 w-8 shrink-0 rounded-full object-cover" />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
              <User className="h-4 w-4" />
            </div>
          )}
          {isExpanded && (
            <>
              <div className="flex min-w-0 flex-col items-start">
                <span className="w-full truncate text-left text-xs font-medium">{user?.name || "Admin"}</span>
                {user?.email && <span className="w-full truncate text-left text-[11px] text-muted-foreground">{user.email}</span>}
              </div>
              <ChevronUp className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
            </>
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
        <DropdownMenuItem asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            View site
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface AdminExpandableSidebarProps {
  user?: AdminUser
}

export function AdminExpandableSidebar({ user }: Readonly<AdminExpandableSidebarProps>) {
  const { isExpanded, setIsExpanded } = useSidebar()
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false)
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await performAdminLogout()
    } catch {
      setIsLoggingOut(false)
      setShowLogoutDialog(false)
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn("fixed inset-y-0 left-0 z-50 hidden flex-col border-r bg-background/80 backdrop-blur-xl transition-all duration-300 sm:flex", isExpanded ? "w-64" : "w-16")}>
        {/* Header */}
        <div className={cn("flex h-16 items-center border-b px-3", isExpanded ? "justify-between" : "justify-center")}>
          <Brand isExpanded={isExpanded} />
          {isExpanded && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setIsExpanded(false)}>
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">Collapse sidebar</span>
            </Button>
          )}
        </div>

        {!isExpanded && (
          <div className="flex justify-center border-b py-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setIsExpanded(true)}>
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Expand sidebar</span>
            </Button>
          </div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1 py-3">
          <nav className="flex flex-col gap-4 px-2">
            {navSections.map((section) => (
              <div key={section.label} className="flex flex-col gap-1">
                {isExpanded && <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{section.label}</p>}
                {section.items.map((item) => (
                  <NavLink key={item.href} item={item} isExpanded={isExpanded} />
                ))}
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Bottom Navigation */}
        <div className="space-y-2 border-t p-2">
          <nav className="flex flex-col gap-1">
            {bottomNavItems.map((item) => (
              <NavLink key={item.href} item={item} isExpanded={isExpanded} />
            ))}
          </nav>
          <UserMenu user={user} isExpanded={isExpanded} onLogout={() => setShowLogoutDialog(true)} />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed left-4 top-3 z-40 sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <div className="flex h-16 items-center border-b px-4">
            <Brand isExpanded />
          </div>
          <ScrollArea className="flex-1 py-3">
            <nav className="flex flex-col gap-4 px-2">
              {navSections.map((section) => (
                <div key={section.label} className="flex flex-col gap-1">
                  <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{section.label}</p>
                  {section.items.map((item) => (
                    <NavLink key={item.href} item={item} isExpanded={true} />
                  ))}
                </div>
              ))}
            </nav>
          </ScrollArea>
          <div className="space-y-2 border-t p-2">
            <nav className="flex flex-col gap-1">
              {bottomNavItems.map((item) => (
                <NavLink key={item.href} item={item} isExpanded={true} />
              ))}
            </nav>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-all hover:bg-destructive/10" onClick={() => setShowLogoutDialog(true)}>
              <LogOut className="h-[18px] w-[18px]" />
              Log out
            </button>
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
            <AlertDialogAction onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? "Logging out…" : "Log out"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
