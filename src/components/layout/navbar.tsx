"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { mainNavData } from "@/commons/constants/navigation-menu"
import MobileNavbarExpand from "./mobile-navbar-expand"

interface NavbarProps {
  isHaveToken: boolean
}

/** Provides compact mobile navigation without continuous dock or spring animations. */
export default function Navbar({ isHaveToken }: Readonly<NavbarProps>) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      {isExpanded ? (
        <div className="pointer-events-auto fixed inset-0 z-40 bg-background/95 sm:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0"
            onClick={() => setIsExpanded(false)}
          />
          <div className="absolute inset-x-3 bottom-20 max-h-[70vh] overflow-y-auto border border-border bg-background p-3">
            <MobileNavbarExpand onItemClick={() => setIsExpanded(false)} />
          </div>
        </div>
      ) : null}

      <nav
        aria-label="Mobile navigation"
        className="pointer-events-auto fixed inset-x-3 bottom-4 z-50 mx-auto flex h-14 max-w-sm items-center justify-center border border-border bg-background px-2 shadow-sm md:hidden"
      >
        {mainNavData(isHaveToken).map((item) => (
          <Link
            key={item.label}
            href={item.href}
            aria-label={item.label}
            title={item.label}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-10 w-10 shrink-0")}
          >
            <item.icon className="size-4" />
          </Link>
        ))}
        <span className="mx-1 h-6 w-px bg-border" aria-hidden="true" />
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Close navigation" : "More navigation"}
          onClick={() => setIsExpanded((current) => !current)}
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-10 w-10 shrink-0")}
        >
          {isExpanded ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
        </button>
      </nav>
    </>
  )
}
