"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NAV_SECTIONS, isCurrentPath, navTrack } from "@/commons/constants/navigation-menu"
import { cn } from "@/lib/utils"

/** Running-head links; the current section carries `aria-current` and a 2px underline. */
export function NavLinks() {
  const pathname = usePathname()

  return (
    <ul className="flex items-center gap-x-4 xl:gap-x-5">
      {NAV_SECTIONS.filter((section) => section.head).map(({ href, label, head }) => (
        <li key={href} className={cn(head === "lg" && "hidden lg:block")}>
          <Link
            href={href}
            aria-current={isCurrentPath(pathname, href) ? "page" : undefined}
            className="inline-flex min-h-11 items-center whitespace-nowrap text-[15px] text-ink decoration-1 underline-offset-[0.35em] hover:underline aria-[current=page]:underline aria-[current=page]:decoration-2"
            {...navTrack(href, "head")}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  )
}
