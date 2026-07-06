import { cn } from "@/lib/utils"

export interface StatItem {
  label: string
  value: React.ReactNode
}

interface StatStripProps {
  items: StatItem[]
  className?: string
}

/**
 * Row of stats — monospace uppercase label + large display value, split by
 * vertical hairlines. Mirrors the Sapa hero stat strip (CHANNELS / AVAILABILITY…).
 */
export function StatStrip({ items, className }: Readonly<StatStripProps>) {
  return (
    <dl className={cn("grid grid-cols-2 border-y border-border sm:grid-cols-4", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1 border-border px-4 py-5 [&:not(:last-child)]:border-r">
          <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{item.label}</dt>
          <dd className="font-display text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default StatStrip
