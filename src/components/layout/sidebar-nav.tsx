"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react"
import { useTheme } from "next-themes"
import * as RadioGroup from "@radix-ui/react-radio-group"
import { Mail, MessageSquareText, Monitor, Moon, PanelLeftClose, PanelLeftOpen, Rss, Sun } from "lucide-react"
import { Github, Linkedin } from "@/components/ui/brand-icons"
import { EMAIL, media_socials } from "@/commons/constants/contact"
import { LEGAL_LINKS, NAV_SECTIONS, isCurrentPath, navTrack, type NavArea } from "@/commons/constants/navigation-menu"
import { SectionIcon } from "@/components/layout/section-icons"
import { switchTheme } from "@/components/layout/theme-toggle"
import { track } from "@/lib/analytics"
import { cn } from "@/lib/utils"

// Notion's sidebar row: 28px from lg, 36px on phones (denser than 44px by the owner's choice; full-width rows keep
// the WCAG 2.5.8 spacing), a 16px icon, grey text that inks and tints on hover and when current.
// `data-tip-rail` names the icon on hover only while the sidebar is folded (hover-tip.tsx).
const ROW =
  "sidebar-row flex min-h-9 w-full items-center gap-2 rounded-md px-2 text-left text-small text-muted-foreground transition-colors duration-75 ease-out hover:bg-tint hover:text-foreground aria-[current=page]:bg-tint aria-[current=page]:font-medium aria-[current=page]:text-foreground lg:min-h-7 [&>svg]:size-4 [&>svg]:shrink-0"

const GITHUB = media_socials.find(({ title }) => title === "GitHub")!.href
const LINKEDIN = media_socials.find(({ title }) => title === "LinkedIn")!.href

function PageRow({ href, label, area, pathname }: Readonly<{ href: string; label: string; area: NavArea; pathname: string }>) {
  const current = href === "/" ? pathname === "/" : isCurrentPath(pathname, href)
  return (
    <li>
      <Link href={href} aria-current={current ? "page" : undefined} data-tip={label} data-tip-rail className={ROW} {...navTrack(href, area)}>
        <SectionIcon href={href} />
        <span className="sidebar-label truncate">{label}</span>
      </Link>
    </li>
  )
}

const SIGNED_IN_COOKIE = "NATEE_SIGNED_IN"
const SIGN_IN_HREF = `/auth?redirect=${encodeURIComponent("/profile")}`

type SidebarAccount = { name: string; avatarUrl: string | null }
type AccountResult = { kind: "named"; account: SidebarAccount } | { kind: "signed-out" } | { kind: "unknown" }

let accountLoad: Promise<AccountResult> | null = null

function subscribeToSignedIn() {
  return () => {}
}

function readSignedInMarker() {
  return new RegExp(`(?:^|; )${SIGNED_IN_COOKIE}=`).test(document.cookie)
}

function finishAccount(request: Promise<AccountResult>, result: AccountResult): AccountResult {
  if (accountLoad === request) accountLoad = null
  return result
}

/** Shares one in-flight /me read between the sidebar and the phone menu, then drops it so the next page can read again. */
function loadAccount(): Promise<AccountResult> {
  if (accountLoad) return accountLoad
  const request = fetch("/api/v3/me", { cache: "no-store" })
    .then(async (response): Promise<AccountResult> => {
      if (response.status === 401) return finishAccount(request, { kind: "signed-out" })
      if (!response.ok) return finishAccount(request, { kind: "unknown" })
      const json = (await response.json().catch(() => null)) as { data?: { name?: unknown; avatarUrl?: unknown } } | null
      const name = typeof json?.data?.name === "string" ? json.data.name.trim() : ""
      if (!name) return finishAccount(request, { kind: "unknown" })
      const avatarUrl = json?.data?.avatarUrl
      return finishAccount(request, {
        kind: "named",
        account: { name, avatarUrl: typeof avatarUrl === "string" && avatarUrl ? avatarUrl : null },
      })
    })
    .catch((): AccountResult => finishAccount(request, { kind: "unknown" }))
  accountLoad = request
  return request
}

function OutRow({ href, icon, network, children }: Readonly<{ href: string; icon: ReactNode; network: string; children: string }>) {
  return (
    <li>
      <a href={href} target="_blank" rel="noopener noreferrer" data-umami-event="social-click" data-umami-event-network={network} data-umami-event-area="sidebar" data-tip={children} data-tip-rail className={ROW}>
        {icon}
        <span className="sidebar-label truncate">{children}</span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </li>
  )
}

const THEMES = [
  { value: "light", label: "Light theme", Icon: Sun },
  { value: "dark", label: "Dark theme", Icon: Moon },
  { value: "system", label: "Theme from the device", Icon: Monitor },
] as const

/** Notion's appearance setting, small: three icon buttons for light, dark and the device's choice. 36px on phones, 28px from lg. */
function ThemeChoice() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <RadioGroup.Root
      aria-label="Theme"
      orientation="horizontal"
      value={mounted ? theme : undefined}
      onValueChange={(to) => {
        switchTheme(setTheme, to)
        track("theme-toggle", { to })
      }}
      className="flex items-center gap-0.5"
    >
      {THEMES.map(({ value, label, Icon }) => (
        <RadioGroup.Item
          key={value}
          value={value}
          aria-label={label}
          data-tip={label}
          className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-75 hover:bg-tint hover:text-foreground data-[state=checked]:bg-tint-strong data-[state=checked]:text-foreground lg:size-7"
        >
          <Icon aria-hidden className="size-4" strokeWidth={1.5} />
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  )
}

/** Folds the desktop sidebar to its icons and back. The button stays visible; the choice is kept for the next visit. */
function CollapseToggle() {
  const [collapsed, setCollapsed] = useState(false)
  useEffect(() => setCollapsed(document.documentElement.dataset.sidebar === "collapsed"), [])

  const toggle = () => {
    const next = !collapsed
    setCollapsed(next)
    if (next) document.documentElement.dataset.sidebar = "collapsed"
    else delete document.documentElement.dataset.sidebar
    try {
      localStorage.setItem("sidebar", next ? "collapsed" : "open")
    } catch {}
    track("sidebar-toggle", { to: next ? "collapsed" : "open" })
  }

  const label = collapsed ? "Expand the sidebar" : "Collapse the sidebar"
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-expanded={!collapsed}
      data-tip={label}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition duration-75 hover:bg-tint hover:text-foreground lg:size-7"
    >
      {collapsed ? <PanelLeftOpen aria-hidden className="size-4" strokeWidth={1.5} /> : <PanelLeftClose aria-hidden className="size-4" strokeWidth={1.5} />}
    </button>
  )
}

/** The rail's break between groups, where the expanded sidebar has a heading or space. */
function RailDivider() {
  return <div aria-hidden className="sidebar-collapsed-only mx-auto my-2 h-px w-4 bg-border" />
}

function GroupLabel({ children }: Readonly<{ children: ReactNode }>) {
  return <p className="sidebar-expanded-only mb-0.5 mt-3 px-2 text-caption font-medium text-muted-foreground">{children}</p>
}

/** Sign in, or the signed-in person. The marker cookie has no name, so /me fills that in after the first paint. */
function AccountRow({ area, pathname }: Readonly<{ area: NavArea; pathname: string }>) {
  const signedIn = useSyncExternalStore(subscribeToSignedIn, readSignedInMarker, () => false)
  const [account, setAccount] = useState<AccountResult | null>(null)

  useEffect(() => {
    if (!signedIn) {
      accountLoad = null
      setAccount(null)
      return
    }
    let current = true
    loadAccount().then((result) => {
      if (current) setAccount(result)
    })
    return () => {
      current = false
    }
  }, [signedIn, pathname])

  if (!signedIn || account?.kind === "signed-out") {
    return (
      <li>
        <Link href={SIGN_IN_HREF} data-tip="Sign in" data-tip-rail className={ROW} {...navTrack("/auth", area)}>
          <SectionIcon href="/profile" />
          <span className="sidebar-label truncate">Sign in</span>
        </Link>
      </li>
    )
  }

  const named = account?.kind === "named" ? account.account : null
  const label = named?.name ?? "Signed in"
  const current = isCurrentPath(pathname, "/profile")
  return (
    <li>
      <Link href="/profile" aria-current={current ? "page" : undefined} data-tip={label} data-tip-rail className={ROW} {...navTrack("/profile", area)}>
        {named?.avatarUrl ? (
          <img src={named.avatarUrl} alt="" width={16} height={16} referrerPolicy="no-referrer" className="size-4 shrink-0 rounded-full object-cover" />
        ) : (
          <SectionIcon href="/profile" />
        )}
        <span className="sidebar-label truncate">{label}</span>
      </Link>
    </li>
  )
}

/**
 * The Notion-style page tree: the owner's row, the main pages, the rest under "More", then the ways to reach
 * out and the legal pages beside the theme. Used by the desktop sidebar and the menu sheet on smaller screens.
 */
export function SidebarNav({ area = "sidebar", collapsible = false, className }: Readonly<{ area?: NavArea; collapsible?: boolean; className?: string }>) {
  const pathname = usePathname()

  return (
    <div className={cn("flex min-h-full flex-col px-2 pb-3 pt-2", className)}>
      {/* In the sheet the head leaves room for the sheet's close button. */}
      <div className={cn("sidebar-head flex items-center gap-1", !collapsible && "pr-11")}>
        <Link
          href="/"
          className="sidebar-expanded-only flex min-h-9 min-w-0 flex-1 items-center gap-2 rounded-md px-2 text-small font-medium text-foreground transition-colors duration-75 hover:bg-tint lg:min-h-8"
          {...navTrack("/", area)}
        >
          <Image src="/rizky.jpg" alt="" width={20} height={20} className="size-5 shrink-0 rounded object-cover" />
          <span className="sidebar-label truncate">Rizky Haksono</span>
        </Link>
        {collapsible && <CollapseToggle />}
      </div>

      <nav aria-label="Sections" className="mt-1">
        <ul role="list">
          <PageRow href="/" label="Home" area={area} pathname={pathname} />
          {NAV_SECTIONS.filter((section) => section.head).map(({ href, label }) => (
            <PageRow key={href} href={href} label={label} area={area} pathname={pathname} />
          ))}
        </ul>
        <RailDivider />
        <GroupLabel>More</GroupLabel>
        <ul role="list">
          {NAV_SECTIONS.filter((section) => !section.head).map(({ href, label }) => (
            <PageRow key={href} href={href} label={label} area={area} pathname={pathname} />
          ))}
          <AccountRow area={area} pathname={pathname} />
          <li>
            <a href="/feed.xml" data-track="rss-subscribe" data-track-feed="blog" data-track-area={area} data-tip="RSS feed" data-tip-rail className={ROW}>
              <Rss aria-hidden strokeWidth={1.5} />
              <span className="sidebar-label">RSS feed</span>
            </a>
          </li>
        </ul>
      </nav>

      <div className="mt-auto pt-4">
        <RailDivider />
        <ul role="list" aria-label="Contact">
          <li>
            <button type="button" data-open-feedback={area} aria-haspopup="dialog" data-tip="Send feedback" data-tip-rail className={ROW}>
              <MessageSquareText aria-hidden strokeWidth={1.5} />
              <span className="sidebar-label">Send feedback</span>
            </button>
          </li>
          <li>
            <a href={`mailto:${EMAIL}`} data-track="email-click" data-track-area={area} data-tip="Email" data-tip-rail className={ROW}>
              <Mail aria-hidden strokeWidth={1.5} />
              <span className="sidebar-label truncate">Email</span>
            </a>
          </li>
          <OutRow href={GITHUB} network="github" icon={<Github aria-hidden strokeWidth={1.5} />}>
            GitHub
          </OutRow>
          <OutRow href={LINKEDIN} network="linkedin" icon={<Linkedin aria-hidden strokeWidth={1.5} />}>
            LinkedIn
          </OutRow>
        </ul>
        <div className="sidebar-expanded-only mt-3 flex items-center justify-between gap-2 border-t border-border pt-2">
          <ul role="list" aria-label="Legal" className="flex gap-1">
            {LEGAL_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isCurrentPath(pathname, href) ? "page" : undefined}
                  className="inline-flex min-h-9 items-center rounded-md px-1.5 text-caption text-muted-foreground transition-colors hover:bg-tint hover:text-foreground aria-[current=page]:text-foreground lg:min-h-6"
                  {...navTrack(href, area)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeChoice />
        </div>
      </div>
    </div>
  )
}
