import type { ReactNode } from "react"

export interface WakatimeLanguage {
  name: string
  hours: number
  minutes: number
  percent?: number
}

/** "26 h 5 min" from hours plus minutes that may run past 60 (sums of several languages do). */
export function formatHours(hours: number, minutes: number) {
  const h = hours + Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h} h ${m} min` : `${m} min`
}

interface HatchBarProps {
  name: string
  /** Bar length, 0 to 100 (a share of the week, or of the largest row). */
  percent: number
  /** Right-hand figure; add an sr-only note when the bar's share matters to the reader. */
  value: ReactNode
}

/** One row in a `<ul>`: name and figure on a line, a solid rounded share bar under them. Server-rendered, no motion. */
export function HatchBar({ name, percent, value }: Readonly<HatchBarProps>) {
  const width = Math.min(100, Math.max(0, percent))

  return (
    <li className="py-2">
      <div className="flex items-baseline justify-between gap-4 text-small">
        <span className="min-w-0 break-words text-foreground">{name}</span>
        <span className="shrink-0 tabular-nums text-muted-foreground">{value}</span>
      </div>
      <span aria-hidden className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-muted">
        <span className="block h-full rounded-full bg-foreground" style={{ width: `${width}%` }} />
      </span>
    </li>
  )
}

export default HatchBar
