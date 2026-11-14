import { Award, ChartColumn, CircleUser, History, House, LayoutGrid, Map, MessagesSquare, PenLine, ScrollText, Shield, Wrench, type LucideIcon } from "lucide-react"

/** One icon per page, shared by the sidebar, the breadcrumb and each page's Notion-style icon above its title. */
export const SECTION_ICONS: Record<string, LucideIcon> = {
  "/": House,
  "/project": LayoutGrid,
  "/blog": PenLine,
  "/roadmap": Map,
  "/tools": Wrench,
  "/stats": ChartColumn,
  "/chat": MessagesSquare,
  "/certificates": Award,
  "/changelog": History,
  "/profile": CircleUser,
  "/legal/privacy": Shield,
  "/legal/terms": ScrollText,
}

/** The icon of a section (`href` as in NAV_SECTIONS). Decorative: the label beside it names the page. */
export function SectionIcon({ href, className }: Readonly<{ href: string; className?: string }>) {
  const Icon = SECTION_ICONS[href] ?? House
  return <Icon aria-hidden className={className} strokeWidth={1.5} />
}
