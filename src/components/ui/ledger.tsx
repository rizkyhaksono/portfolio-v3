import { cn } from "@/lib/utils"
import { InkLink } from "@/components/ui/ink-link"

interface LedgerListProps {
  /** Small label above the group's rows (a year, a version). Pass a heading element when it names the group. */
  marker?: React.ReactNode
  children: React.ReactNode
  className?: string
}

/** A quiet list of rows with no rules; a small muted label above each group. */
export function LedgerList({ marker, children, className }: Readonly<LedgerListProps>) {
  return (
    <div className={cn("mt-8 first:mt-0", className)}>
      {marker != null && <div className="mb-1 text-small tabular-nums text-muted-foreground">{marker}</div>}
      <ul role="list">{children}</ul>
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
    <li className={cn("group relative grid gap-x-6 py-2 sm:grid-cols-[minmax(0,1fr)_auto]", className)}>
      <div className="min-w-0">
        <Title className="text-body text-balance text-foreground">
          {href ? (
            <InkLink
              href={href}
              external={external}
              event={event}
              eventData={eventData}
              className="decoration-transparent after:absolute after:inset-0 group-hover:decoration-foreground/40"
            >
              {title}
            </InkLink>
          ) : (
            title
          )}
        </Title>
        {children && <div className="text-body text-muted-foreground">{children}</div>}
      </div>
      {meta != null && <div className="text-small tabular-nums text-muted-foreground sm:text-right">{meta}</div>}
    </li>
  )
}
