import { cn } from "@/lib/utils"

export interface StatItem {
  label: string
  value: React.ReactNode
}

interface StatStripProps {
  items: StatItem[]
  className?: string
}

/** Notion-style number blocks: a hairline box per figure, the small muted label over a tabular numeral. */
export function StatStrip({ items, className }: Readonly<StatStripProps>) {
  return (
    <dl className={cn("grid grid-cols-2 gap-2 sm:grid-cols-4", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-col gap-1 rounded-lg border border-border p-4">
          <dt className="text-pretty text-small text-muted-foreground">{item.label}</dt>
          <dd className="break-words text-numeral tabular-nums text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default StatStrip
