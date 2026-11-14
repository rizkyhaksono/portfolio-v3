import { Breadcrumb } from "./breadcrumb"
import { ContentsTrigger } from "./contents-trigger"
import { ThemeToggle } from "./theme-toggle"

/** Notion's top bar: the menu below lg, the page's path, and the theme switch on the right. */
export function TopBar() {
  return (
    <header
      data-print-hide
      style={{ viewTransitionName: "site-header" }}
      className="sticky top-0 z-30 flex h-[var(--head-h)] shrink-0 items-center gap-1 bg-background px-2 sm:px-3"
    >
      <ContentsTrigger className="lg:hidden" />
      <Breadcrumb />
      <ThemeToggle className="ml-auto shrink-0" />
    </header>
  )
}
