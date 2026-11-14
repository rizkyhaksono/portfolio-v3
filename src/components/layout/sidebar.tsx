import { SidebarNav } from "./sidebar-nav"

/** The desktop sidebar (lg and up): Notion's grey column with the page tree, fixed while the page scrolls; folds to icons. */
export function Sidebar() {
  return (
    <aside data-print-hide aria-label="Site" className="app-sidebar sticky top-0 hidden h-svh shrink-0 overflow-y-auto overflow-x-hidden bg-muted lg:block">
      <SidebarNav collapsible />
    </aside>
  )
}
