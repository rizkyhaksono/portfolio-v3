import { SidebarNav } from "./sidebar-nav"

/** The desktop sidebar (lg and up): Notion's grey column with the page tree, fixed while the page scrolls. */
export function Sidebar() {
  return (
    <aside data-print-hide aria-label="Site" className="sticky top-0 hidden h-svh w-60 shrink-0 overflow-y-auto bg-muted lg:block">
      <SidebarNav />
    </aside>
  )
}
