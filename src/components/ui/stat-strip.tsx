import { cn } from "@/lib/utils"

export interface StatItem {
  label: string
  value: React.ReactNode
}

interface StatStripProps {
  items: StatItem[]
  className?: string
}

/** Row of figures: caption above a tabular numeral, split by hairlines. */
export function StatStrip({ items, className }: Readonly<StatStripProps>) {
  return (
    <dl className={cn("grid grid-cols-2 border-y border-rule sm:grid-cols-4", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-col justify-between gap-1 border-rule px-3 py-5 sm:px-4 [&:not(:last-child)]:border-r [&:nth-child(even)]:border-r-0 sm:[&:nth-child(even):not(:last-child)]:border-r">
          <dt className="text-pretty font-display text-caption text-ink-soft">{item.label}</dt>
          <dd className="break-words font-display text-numeral tabular-nums text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default StatStrip
