import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { navTrack } from "@/commons/constants/navigation-menu"
import { cn } from "@/lib/utils"
import { SHELL_WIDTH } from "@/lib/design-system"
import { Logo } from "@/components/ui/logo"
import { NavLinks } from "./nav-links"
import { ThemeToggle } from "./theme-toggle"
import { ContentsTrigger } from "./contents-trigger"

export { SHELL_WIDTH }

/** Sticky running head: wordmark, sections, theme, account; Contents below 1024px. */
export function RunningHead() {
  return (
    <header data-print-hide className="bg-paper-grain sticky top-0 z-40 border-b border-rule">
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
