import { cn } from "@/lib/utils"
import { InkLink } from "@/components/ui/ink-link"

interface LedgerListProps {
  /** Group label (a year, a version) in a left column that stays in view while its rows scroll. Pass a heading element when it names the group. */
  marker?: React.ReactNode
  children: React.ReactNode
  className?: string
}

/** Ruled index of rows. With a marker, the 8rem label column sticks below the running head from md up (override with `md:grid-cols-[…]`). */
export function LedgerList({ marker, children, className }: Readonly<LedgerListProps>) {
  const rows = <ul role="list" className="divide-y divide-rule">{children}</ul>

  if (marker == null) return <div className={cn("border-t border-ink", className)}>{rows}</div>

  return (
    <div className={cn("grid border-t border-ink md:grid-cols-[8rem_minmax(0,1fr)] md:gap-x-6", className)}>
      <div className="pt-3 font-display text-h3 tabular-nums text-ink md:sticky md:top-[calc(var(--head-h)+1rem)] md:self-start md:pb-3">
        {marker}
      </div>
      {rows}
    </div>
  )
}

interface LedgerRowProps {
  title: React.ReactNode
  /** The whole row becomes the link target (stretched link). Other controls in the row need `relative z-10`. */
  href?: string
  external?: boolean
  event?: string
  eventData?: Record<string, string | number | boolean>
  /** Right-hand column: a dateline, a count. */
  meta?: React.ReactNode
  titleAs?: "h2" | "h3" | "h4" | "p"
  /** Description and any extra controls under the title. */
  children?: React.ReactNode
  className?: string
}

export function LedgerRow({ title, href, external, event, eventData, meta, titleAs: Title = "h3", children, className }: Readonly<LedgerRowProps>) {
  return (
    <li className={cn("relative grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[minmax(0,1fr)_auto]", href && "transition-colors hover:bg-tint", className)}>
      <div className="min-w-0">
        <Title className="font-display text-h4 text-ink">
          {href ? (
            <InkLink
              href={href}
              external={external}
              event={event}
              eventData={eventData}
              className="no-underline after:absolute after:inset-0 hover:underline"
            >
              {title}
            </InkLink>
          ) : (
            title
          )}
        </Title>
        {children && <div className="mt-1 text-small text-ink-soft">{children}</div>}
      </div>
      {meta != null && <div className="font-display text-small tabular-nums text-ink-soft sm:text-right">{meta}</div>}
    </li>
  )
}
