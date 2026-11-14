"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"
import { LEGAL_LINKS, NAV_SECTIONS, isCurrentPath, navTrack } from "@/commons/constants/navigation-menu"
import { SectionIcon } from "@/components/layout/section-icons"

const PAGES = [...NAV_SECTIONS, ...LEGAL_LINKS, { href: "/profile", label: "Account" }]

/** Notion's top-bar path: the home page, then the section this page belongs to. */
export function Breadcrumb() {
  const pathname = usePathname()
  const section = PAGES.find(({ href }) => isCurrentPath(pathname, href))
  const crumbs = [{ href: "/", label: "Rizky Haksono" }, ...(section ? [section] : [])]

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center text-small">
        {crumbs.map(({ href, label }, i) => (
          <Fragment key={href}>
            {i > 0 && (
              <li aria-hidden className="px-0.5 text-muted-foreground">
                /
              </li>
            )}
            <li className="min-w-0">
              <Link
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                className="flex min-h-11 min-w-0 items-center gap-1.5 rounded-md px-1.5 text-foreground transition-colors hover:bg-tint lg:min-h-7"
                {...navTrack(href, "head")}
              >
                <SectionIcon href={href} className="size-4 shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
