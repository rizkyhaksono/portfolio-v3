"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NAV_SECTIONS, isCurrentPath, navTrack } from "@/commons/constants/navigation-menu"
import { cn } from "@/lib/utils"

/** Head links as quiet text; the current section is full ink with `aria-current`. */
export function NavLinks() {
  const pathname = usePathname()

  return (
    <ul className="mr-1 flex items-center gap-x-3">
      {NAV_SECTIONS.filter((section) => section.head).map(({ href, label, head }) => (
        <li key={href} className={cn(head === "lg" && "hidden lg:block")}>
          <Link
            href={href}
            aria-current={isCurrentPath(pathname, href) ? "page" : undefined}
            className="inline-flex min-h-11 items-center whitespace-nowrap text-small text-muted-foreground transition-colors duration-ui ease-out decoration-1 underline-offset-4 hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:underline"
            {...navTrack(href, "head")}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  )
}
