import Link from "next/link"
import { Search } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { navTrack } from "@/commons/constants/navigation-menu"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"
import { NavLinks } from "./nav-links"
import { ThemeToggle } from "./theme-toggle"
import { ContentsTrigger } from "./contents-trigger"

export const SHELL_WIDTH = "mx-auto w-full max-w-[76rem] px-[clamp(20px,4vw,48px)]"

/** Sticky running head: wordmark, sections, search, theme, account; Contents below 1024px. */
export function RunningHead() {
  return (
    <header data-print-hide className="bg-paper sticky top-0 z-40 border-b border-rule">
      <div className={cn(SHELL_WIDTH, "flex h-[var(--head-h)] items-center gap-4 xl:gap-6")}>
        <Link
          href="/"
          className="inline-flex min-h-11 shrink-0 items-center gap-2.5 font-display text-[1.25rem] leading-none text-ink"
          {...navTrack("/", "head")}
        >
          <Logo variant="mini" className="size-8" />
          Rizky Haksono
        </Link>

        <nav aria-label="Sections" className="hidden md:block">
          <NavLinks />
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            data-open-search="head"
            aria-keyshortcuts="Meta+K Control+K"
            className="hidden h-9 items-center gap-2 border border-input px-3 text-small text-ink-soft hover:border-ink hover:text-ink md:inline-flex [@media(pointer:coarse)]:min-h-11"
          >
            <Search className="size-4" strokeWidth={1.5} aria-hidden />
            Search
            <kbd className="text-caption" aria-hidden>
              ⌘K
            </kbd>
          </button>
          <ThemeToggle className="hidden lg:inline-flex" />
          <Link
            href="/profile"
            className={cn(buttonVariants({ variant: "ghost" }), "hidden px-2 lg:inline-flex")}
            {...navTrack("/profile", "head")}
          >
            Account
          </Link>
          <ContentsTrigger className="lg:hidden" />
        </div>
      </div>
    </header>
  )
}
