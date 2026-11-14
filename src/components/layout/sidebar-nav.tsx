"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"
import { useTheme } from "next-themes"
import * as RadioGroup from "@radix-ui/react-radio-group"
import { Github, Linkedin, Mail, MessageSquareText, Rss } from "lucide-react"
import { EMAIL, media_socials } from "@/commons/constants/contact"
import { LEGAL_LINKS, NAV_SECTIONS, isCurrentPath, navTrack, type NavArea } from "@/commons/constants/navigation-menu"
import { SectionIcon } from "@/components/layout/section-icons"
import { switchTheme } from "@/components/layout/theme-toggle"
import { track } from "@/lib/analytics"
import { cn } from "@/lib/utils"

// Notion's sidebar row: 28px (44px on touch), a 16px icon, grey text that inks and tints on hover and when current.
const ROW =
  "flex min-h-11 w-full items-center gap-2 rounded-md px-2 text-left text-small text-muted-foreground transition-colors duration-ui ease-out hover:bg-tint hover:text-foreground aria-[current=page]:bg-tint aria-[current=page]:font-medium aria-[current=page]:text-foreground lg:min-h-7 [&>svg]:size-4 [&>svg]:shrink-0"

const GITHUB = media_socials.find(({ title }) => title === "GitHub")!.href
const LINKEDIN = media_socials.find(({ title }) => title === "LinkedIn")!.href

function PageRow({ href, label, area, pathname }: Readonly<{ href: string; label: string; area: NavArea; pathname: string }>) {
  const current = href === "/" ? pathname === "/" : isCurrentPath(pathname, href)
  return (
    <li>
      <Link href={href} aria-current={current ? "page" : undefined} className={ROW} {...navTrack(href, area)}>
        <SectionIcon href={href} />
        <span className="truncate">{label}</span>
      </Link>
    </li>
  )
}

function OutRow({ href, icon, network, children }: Readonly<{ href: string; icon: ReactNode; network: string; children: ReactNode }>) {
  return (
    <li>
      <a href={href} target="_blank" rel="noopener noreferrer" data-umami-event="social-click" data-umami-event-network={network} data-umami-event-area="sidebar" className={ROW}>
        {icon}
        <span className="truncate">{children}</span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </li>
  )
}

const THEMES = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const

/** Notion's appearance setting as a small segmented control: Light, Dark or the device's choice. */
function ThemeChoice() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <RadioGroup.Root
      aria-label="Theme"
      value={mounted ? theme : undefined}
      onValueChange={(to) => {
        switchTheme(setTheme, to)
        track("theme-toggle", { to })
      }}
      className="mx-2 mt-3 grid grid-cols-3 gap-0.5 rounded-md bg-tint p-0.5"
    >
      {THEMES.map(({ value, label }) => (
        <RadioGroup.Item
          key={value}
          value={value}
          className="min-h-11 rounded text-caption font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=checked]:bg-background data-[state=checked]:text-foreground lg:min-h-6"
        >
          {label}
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  )
}

function GroupLabel({ children }: Readonly<{ children: ReactNode }>) {
  return <p className="mb-0.5 mt-5 px-2 text-caption font-medium text-muted-foreground">{children}</p>
}

/**
 * The Notion-style page tree: the owner's row, the main pages, the rest under "More", then the ways to reach
 * out and the legal pages. Used by the desktop sidebar and the menu sheet on smaller screens.
 */
export function SidebarNav({ area = "sidebar", className }: Readonly<{ area?: NavArea; className?: string }>) {
  const pathname = usePathname()

  return (
    <div className={cn("flex min-h-full flex-col px-2 pb-3 pt-2", className)}>
      <Link
        href="/"
        className="flex min-h-11 items-center gap-2 rounded-md px-2 text-small font-medium text-foreground transition-colors hover:bg-tint lg:min-h-9"
        {...navTrack("/", area)}
      >
        <Image src="/rizky.jpg" alt="" width={20} height={20} className="size-5 rounded object-cover" />
        Rizky Haksono
      </Link>

      <nav aria-label="Sections" className="mt-2">
        <ul role="list">
          <PageRow href="/" label="Home" area={area} pathname={pathname} />
          {NAV_SECTIONS.filter((section) => section.head).map(({ href, label }) => (
            <PageRow key={href} href={href} label={label} area={area} pathname={pathname} />
          ))}
        </ul>
        <GroupLabel>More</GroupLabel>
        <ul role="list">
          {NAV_SECTIONS.filter((section) => !section.head).map(({ href, label }) => (
            <PageRow key={href} href={href} label={label} area={area} pathname={pathname} />
          ))}
          <PageRow href="/profile" label="Account" area={area} pathname={pathname} />
          <li>
            <a href="/feed.xml" data-track="rss-subscribe" data-track-feed="blog" data-track-area={area} className={ROW}>
              <Rss aria-hidden strokeWidth={1.5} />
              RSS feed
            </a>
          </li>
        </ul>
      </nav>

      <div className="mt-auto pt-6">
        <ul role="list" aria-label="Contact">
          <li>
            <button type="button" data-open-feedback={area} aria-haspopup="dialog" className={ROW}>
              <MessageSquareText aria-hidden strokeWidth={1.5} />
              Send feedback
            </button>
          </li>
          <li>
            <a href={`mailto:${EMAIL}`} data-track="email-click" data-track-area={area} className={ROW}>
              <Mail aria-hidden strokeWidth={1.5} />
              <span className="truncate">Email</span>
            </a>
          </li>
          <OutRow href={GITHUB} network="github" icon={<Github aria-hidden strokeWidth={1.5} />}>
            GitHub
          </OutRow>
          <OutRow href={LINKEDIN} network="linkedin" icon={<Linkedin aria-hidden strokeWidth={1.5} />}>
            LinkedIn
          </OutRow>
        </ul>
        <ThemeChoice />
        <ul role="list" aria-label="Legal" className="mt-2 flex gap-1 px-0.5">
          {LEGAL_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={isCurrentPath(pathname, href) ? "page" : undefined}
                className="inline-flex min-h-11 items-center rounded-md px-1.5 text-caption text-muted-foreground transition-colors hover:bg-tint hover:text-foreground aria-[current=page]:text-foreground lg:min-h-6"
                {...navTrack(href, area)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
