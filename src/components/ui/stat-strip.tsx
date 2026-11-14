import { cn } from "@/lib/utils"

export interface StatItem {
  label: string
  value: React.ReactNode
}

interface StatStripProps {
  items: StatItem[]
  className?: string
}

/** A quiet grid of figures: a tabular numeral over its small muted label, with no boxes or rules. */
export function StatStrip({ items, className }: Readonly<StatStripProps>) {
  return (
    <dl className={cn("grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4", className)}>
      {items.map((item) => (
        // dt stays first for screen readers; the column is reversed so the numeral reads first on screen.
        <div key={item.label} className="flex min-w-0 flex-col-reverse gap-1">
          <dt className="text-pretty text-small text-muted-foreground">{item.label}</dt>
          <dd className="break-words text-numeral tabular-nums text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default StatStrip
