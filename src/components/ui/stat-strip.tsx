import { cn } from "@/lib/utils"

export interface StatItem {
  label: string
  value: React.ReactNode
}

interface StatStripProps {
  items: StatItem[]
  className?: string
}

/** Row of figures: italic caption above a tabular italic numeral, split by hairlines. */
export function StatStrip({ items, className }: Readonly<StatStripProps>) {
  return (
    <dl className={cn("grid grid-cols-2 border-y border-border sm:grid-cols-4", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-col justify-between gap-1 border-border px-3 py-5 sm:px-4 max-sm:[&:nth-child(odd)]:pl-0 sm:first:pl-0 [&:not(:last-child)]:border-r [&:nth-child(even)]:border-r-0 sm:[&:nth-child(even):not(:last-child)]:border-r">
          <dt className="text-pretty text-caption text-muted-foreground">{item.label}</dt>
          <dd className="break-words text-numeral tabular-nums text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default StatStrip
