import { Fragment, type ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface Property {
  label: string
  value: ReactNode
  /** A 16px lucide icon before the name, as in Notion's property list. */
  icon?: ReactNode
}

/** Notion's page properties: a muted name with its icon on the left, the value in ink on the right. */
export function Properties({ items, className }: Readonly<{ items: Property[]; className?: string }>) {
  return (
    <dl className={cn("grid grid-cols-[minmax(6.5rem,10rem)_minmax(0,1fr)] gap-x-2 text-small", className)}>
      {items.map(({ label, value, icon }) => (
        <Fragment key={label}>
          <dt className="flex min-h-8 items-center gap-1.5 text-muted-foreground [&>svg]:size-4 [&>svg]:shrink-0">
            {icon}
            {label}
          </dt>
          <dd className="flex min-h-8 min-w-0 flex-wrap items-center gap-1 break-words py-1 text-foreground">{value}</dd>
        </Fragment>
      ))}
    </dl>
  )
}

export default Properties
