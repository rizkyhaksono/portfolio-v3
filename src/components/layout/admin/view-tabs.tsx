import Link from "next/link"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

// The look of ui/tabs.tsx's trigger for tabs that are links (?range=) or filter buttons, not Radix panels.
const TAB =
  "relative inline-flex min-h-9 shrink-0 items-center gap-1.5 whitespace-nowrap px-2 text-small font-medium text-muted-foreground transition-colors duration-ui ease-out after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:after:bg-foreground aria-pressed:text-foreground aria-pressed:after:bg-foreground [@media(pointer:coarse)]:min-h-11"

export interface ViewTab {
  label: string
  /** A count after the label, in grey. */
  count?: number
  current: boolean
  /** A link tab (state in the URL); without it the tab is a filter button. */
  href?: string
  onSelect?: () => void
}

/** Notion's view tabs over a hairline, with room on the right for the view's actions (New, Export). */
export function ViewTabs({ label, tabs, actions, className }: Readonly<{ label: string; tabs: ViewTab[]; actions?: ReactNode; className?: string }>) {
  const links = Boolean(tabs[0]?.href)
  const Group = links ? "nav" : "div"
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-b border-border", className)}>
      <Group role={links ? undefined : "group"} aria-label={label} className="-mb-px flex min-w-0 max-w-full gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const body = (
            <>
              {tab.label}
              {tab.count !== undefined && <span className="font-normal tabular-nums text-muted-foreground">{tab.count}</span>}
            </>
          )
          return tab.href ? (
            <Link key={tab.label} href={tab.href} scroll={false} aria-current={tab.current ? "page" : undefined} className={TAB}>
              {body}
            </Link>
          ) : (
            <button key={tab.label} type="button" aria-pressed={tab.current} onClick={tab.onSelect} className={TAB}>
              {body}
            </button>
          )
        })}
      </Group>
      {actions && <div className="flex items-center gap-1.5 pb-1.5">{actions}</div>}
    </div>
  )
}
