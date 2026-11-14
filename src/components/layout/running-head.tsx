import Link from "next/link"
import { navTrack } from "@/commons/constants/navigation-menu"
import { cn } from "@/lib/utils"
import { PROSE_WIDTH, WIDE_WIDTH } from "@/lib/design-system"
import { NavLinks } from "./nav-links"
import { ThemeToggle } from "./theme-toggle"
import { ContentsTrigger } from "./contents-trigger"

/** The top of every page: the handle with a short rule under it, quiet section links and the theme switch. */
export function RunningHead({ wide = false }: Readonly<{ wide?: boolean }>) {
  return (
    <header data-print-hide style={{ viewTransitionName: "site-header" }} className={cn(wide ? WIDE_WIDTH : PROSE_WIDTH, "pt-12 sm:pt-20")}>
      <div className="flex items-start justify-between gap-6">
        <div>
          <Link href="/" className="inline-flex min-h-11 items-center text-h1 text-foreground md:min-h-0" {...navTrack("/", "head")}>
            @rizkyhaksono
          </Link>
          <div aria-hidden className="mt-4 h-px w-10 bg-foreground" />
        </div>
        <div className="-mr-2 flex items-center gap-1">
          <nav aria-label="Sections" className="hidden md:block">
            <NavLinks />
          </nav>
          <ThemeToggle />
          <ContentsTrigger className="lg:hidden" />
        </div>
      </div>
    </header>
  )
}
