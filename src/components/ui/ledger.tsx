import { cn } from "@/lib/utils"
import { InkLink } from "@/components/ui/ink-link"

interface LedgerListProps {
  /** Notion's group header above the rows (a year, a version). Pass a heading element when it names the group. */
  marker?: React.ReactNode
  children: React.ReactNode
  className?: string
}

/** Notion's list view: rows that tint on hover, grouped under a small muted label. */
export function LedgerList({ marker, children, className }: Readonly<LedgerListProps>) {
  return (
    <div className={cn("mt-6 first:mt-0", className)}>
      {marker != null && <div className="mb-1 text-small font-medium tabular-nums text-muted-foreground">{marker}</div>}
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
  /** Notion's page icon before the title (16px lucide icon). */
  icon?: React.ReactNode
  titleAs?: "h2" | "h3" | "h4" | "p"
  /** Description and any extra controls under the title. */
  children?: React.ReactNode
  className?: string
}

export function LedgerRow({ title, href, external, event, eventData, meta, icon, titleAs: Title = "h3", children, className }: Readonly<LedgerRowProps>) {
  return (
    <li
      className={cn(
        "group relative -mx-2 flex gap-2.5 rounded-md px-2 py-1.5 transition-colors duration-ui ease-out",
        href && "hover:bg-tint has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring",
        className,
      )}
    >
      {icon && (
        <span aria-hidden className="mt-1 shrink-0 text-muted-foreground [&>svg]:size-4 [&>svg]:stroke-[1.5]">
          {icon}
        </span>
      )}
      <div className="grid min-w-0 flex-1 gap-x-6 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <Title className="text-body font-medium text-balance text-foreground">
            {href ? (
              <InkLink
                href={href}
                external={external}
                event={event}
                eventData={eventData}
                className="no-underline after:absolute after:inset-0 after:rounded-md focus-visible:outline-none"
              >
                {title}
              </InkLink>
            ) : (
              title
            )}
          </Title>
          {children && <div className="text-small text-muted-foreground">{children}</div>}
        </div>
        {meta != null && <div className="text-small tabular-nums text-muted-foreground sm:pt-0.5 sm:text-right">{meta}</div>}
      </div>
    </li>
  )
}
