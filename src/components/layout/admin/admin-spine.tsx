"use client"

import { useState, type MouseEvent } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
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

export interface AdminUser {
  name: string
  email: string
  avatarUrl?: string
}

const HOME = "/admin/dashboard"

const SECTIONS = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: HOME },
      { title: "Analytics", href: `${HOME}/analytics` },
    ],
  },
  {
    label: "Manage",
    items: [
      { title: "Projects", href: `${HOME}/project` },
      { title: "Work experience", href: `${HOME}/work` },
      { title: "Education", href: `${HOME}/education` },
      { title: "Career", href: `${HOME}/career` },
      { title: "Blog", href: `${HOME}/blog` },
      { title: "Feedback", href: `${HOME}/feedback` },
    ],
  },
  { label: "Account", items: [{ title: "Settings", href: `${HOME}/settings` }] },
] as const

export const ADMIN_PAGES: { title: string; href: string }[] = SECTIONS.flatMap((section) => [...section.items])

const isCurrent = (pathname: string, href: string) => (href === HOME ? pathname === HOME : pathname.startsWith(href))

/** Section lists; the current page is the inverted row (ink ground, paper text). */
function SpineNav({ onNavigate }: Readonly<{ onNavigate?: () => void }>) {
  const pathname = usePathname()

  return (
    <nav aria-label="Admin" className="flex flex-col gap-6 px-3 py-5">
      {SECTIONS.map((section) => (
        <div key={section.label}>
          <p className="px-3 pb-1 font-display text-caption text-ink-soft">{section.label}</p>
          <ul className="border-t border-rule">
            {section.items.map((item) => (
              <li key={item.href} className="border-b border-rule">
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                  className="flex min-h-10 items-center px-3 text-[15px] text-ink transition-colors hover:bg-tint aria-[current=page]:bg-ink aria-[current=page]:font-semibold aria-[current=page]:text-paper [@media(pointer:coarse)]:min-h-11"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function LogoutButton() {
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
        <Button variant="outline" size="sm" className="w-full">
          Log out
        </Button>
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

function SpineAccount({ user }: Readonly<{ user?: AdminUser }>) {
  const name = user?.name || "Admin"
  return (
    <div className="border-t border-ink px-6 py-4">
      <div className="flex items-center gap-3">
        <Avatar className="size-9">
          {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" referrerPolicy="no-referrer" />}
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-small font-semibold text-ink">{name}</p>
          {user?.email && <p className="truncate text-caption text-ink-soft">{user.email}</p>}
        </div>
      </div>
      <div className="mt-3">
        <LogoutButton />
      </div>
    </div>
  )
}

function Masthead() {
  return (
    <Link href={HOME} className="flex min-h-[var(--head-h)] items-center gap-2.5 border-b border-ink px-6 text-ink">
      <Logo variant="mini" className="size-8" />
      <span className="leading-tight">
        <span className="block font-display text-[1.125rem]">Rizky Haksono</span>
        <span className="block text-caption text-ink-soft">Admin</span>
      </span>
    </Link>
  )
}

/** Desktop spine: fixed to the left edge, `--admin-rail` wide, ruled in ink. */
export function AdminSpine({ user }: Readonly<{ user?: AdminUser }>) {
  return (
    <aside className="bg-paper fixed inset-y-0 left-0 z-40 hidden w-[var(--admin-rail)] flex-col border-r border-ink md:flex">
      <Masthead />
      <div className="flex-1 overflow-y-auto">
        <SpineNav />
      </div>
      <SpineAccount user={user} />
    </aside>
  )
}

/** Phones and small tablets: the same spine in a sheet that closes as soon as a page is chosen. */
export function AdminMenu({ user }: Readonly<{ user?: AdminUser }>) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="-ml-2 md:hidden">
          <Menu strokeWidth={1.5} aria-hidden />
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent side="left" aria-describedby={undefined} className="flex w-[min(18rem,85vw)] flex-col gap-0 p-0">
        <SheetTitle className="sr-only">Admin menu</SheetTitle>
        <Masthead />
        <div className="flex-1 overflow-y-auto">
          <SpineNav onNavigate={() => setOpen(false)} />
        </div>
        <SpineAccount user={user} />
      </SheetContent>
    </Sheet>
  )
}
