"use client"

import { useRef, useState, type MouseEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Briefcase,
  ChartColumn,
  ExternalLink,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  PanelLeft,
  PenLine,
  Route,
  Settings,
  type LucideIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { performAdminLogout } from "@/lib/admin-logout"
import { cn } from "@/lib/utils"

export interface AdminUser {
  name: string
  email: string
  avatarUrl?: string
}

export interface AdminPage {
  title: string
  href: string
  icon: LucideIcon
}

const HOME = "/admin/dashboard"

const GROUPS: { label: string; items: AdminPage[] }[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: HOME, icon: LayoutDashboard },
      { title: "Analytics", href: `${HOME}/analytics`, icon: ChartColumn },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Projects", href: `${HOME}/project`, icon: LayoutGrid },
      { title: "Work experience", href: `${HOME}/work`, icon: Briefcase },
      { title: "Education", href: `${HOME}/education`, icon: GraduationCap },
      { title: "Career", href: `${HOME}/career`, icon: Route },
      { title: "Blog", href: `${HOME}/blog`, icon: PenLine },
    ],
  },
  { label: "Inbox", items: [{ title: "Feedback", href: `${HOME}/feedback`, icon: Inbox }] },
  { label: "Account", items: [{ title: "Settings", href: `${HOME}/settings`, icon: Settings }] },
]

export const ADMIN_PAGES: AdminPage[] = GROUPS.flatMap((group) => group.items)

// Longest matching href wins, so /admin/dashboard/blog is "Blog", not "Dashboard".
export const adminPageFor = (pathname: string) =>
  [...ADMIN_PAGES].sort((a, b) => b.href.length - a.href.length).find((page) => pathname.startsWith(page.href)) ?? ADMIN_PAGES[0]

const isCurrent = (pathname: string, href: string) => (href === HOME ? pathname === HOME : pathname.startsWith(href))

// The visitor sidebar's row: 28px from lg (44px below), a 16px icon, grey text that inks and tints on hover and when current.
const ROW =
  "flex min-h-11 w-full items-center gap-2 rounded-md px-2 text-left text-small text-muted-foreground transition-colors duration-ui ease-out hover:bg-tint hover:text-foreground aria-[current=page]:bg-tint aria-[current=page]:font-medium aria-[current=page]:text-foreground lg:min-h-7 [&>svg]:size-4 [&>svg]:shrink-0"

function LogoutRow() {
  const [pending, setPending] = useState(false)

  const logout = async (event: MouseEvent) => {
    // Keep the dialog open while the request runs, so "Logging out…" and any failure are seen.
    event.preventDefault()
    setPending(true)
    try {
      await performAdminLogout()
    } catch {
      setPending(false)
      toast.error("Could not log out. Try again.")
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button type="button" className={ROW}>
          <LogOut aria-hidden strokeWidth={1.5} />
          Log out
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Log out of the admin?</AlertDialogTitle>
          <AlertDialogDescription>Your session ends on this device and you go back to the home page.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay signed in</AlertDialogCancel>
          <AlertDialogAction onClick={logout} disabled={pending}>
            {pending ? "Logging out…" : "Log out"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/** The admin page tree: workspace row, grouped pages, the site link, then the signed-in user and Log out. */
export function AdminSidebarNav({ user, className }: Readonly<{ user?: AdminUser; className?: string }>) {
  const pathname = usePathname()
  const name = user?.name || "Admin"

  return (
    <div className={cn("flex min-h-full flex-col px-2 pb-3 pt-2", className)}>
      <Link href={HOME} className="flex min-h-11 items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-tint lg:min-h-9">
        <Image src="/rizky.jpg" alt="" width={20} height={20} className="size-5 shrink-0 rounded object-cover" />
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-small font-medium text-foreground">Rizky Haksono</span>
          <span className="block text-caption text-muted-foreground">Admin</span>
        </span>
      </Link>

      <nav aria-label="Admin" className="mt-1">
        {GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-0.5 mt-5 px-2 text-caption font-medium text-muted-foreground">{group.label}</p>
            <ul role="list">
              {group.items.map(({ title, href, icon: Icon }) => (
                <li key={href}>
                  <Link href={href} aria-current={isCurrent(pathname, href) ? "page" : undefined} className={ROW}>
                    <Icon aria-hidden strokeWidth={1.5} />
                    <span className="truncate">{title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <ul role="list" className="mt-5">
          <li>
            <a href="/" target="_blank" rel="noopener" className={ROW}>
              <ExternalLink aria-hidden strokeWidth={1.5} />
              Open the site
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </nav>

      <div className="mt-auto pt-6">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Avatar className="size-6">
            {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" referrerPolicy="no-referrer" />}
            <AvatarFallback className="bg-tint-strong text-caption">{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-small font-medium text-foreground">{name}</p>
            {user?.email && <p className="truncate text-caption text-muted-foreground">{user.email}</p>}
          </div>
        </div>
        <LogoutRow />
      </div>
    </div>
  )
}

/** The grey sidebar from lg, sticky at full height. */
export function AdminSidebar({ user }: Readonly<{ user?: AdminUser }>) {
  return (
    <aside aria-label="Admin" className="sticky top-0 hidden h-svh w-60 shrink-0 overflow-y-auto bg-muted lg:block">
      <AdminSidebarNav user={user} />
    </aside>
  )
}

/** Below lg: the "Menu" button opens the same tree in a left sheet, which closes once a page is chosen. */
export function AdminMenu({ user, className }: Readonly<{ user?: AdminUser; className?: string }>) {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button
        ref={trigger}
        type="button"
        aria-label="Menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cn("inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-tint hover:text-foreground", className)}
      >
        <PanelLeft aria-hidden className="size-5" strokeWidth={1.5} />
      </button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            trigger.current?.focus({ preventScroll: true })
          }}
          onClickCapture={(event) => {
            if ((event.target as HTMLElement).closest("a")) setOpen(false)
          }}
          className="flex w-72 max-w-[85vw] flex-col gap-0 overflow-y-auto bg-muted p-0 pt-12 sm:max-w-72"
        >
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <AdminSidebarNav user={user} className="flex-1" />
        </SheetContent>
      </Sheet>
    </>
  )
}
