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

/** One hatched bar: name, share of the week (45° hatch, ink edge), time. Server-rendered, no motion. */
export function HatchBar({ name, hours, minutes, percent = 0 }: Readonly<WakatimeLanguage>) {
  const width = Math.min(100, Math.max(0, percent))

  return (
    <li className="grid grid-cols-[6.5rem_minmax(0,1fr)_5.5rem] items-center gap-3 py-1.5 text-small sm:grid-cols-[8rem_minmax(0,1fr)_6rem]">
      <span className="truncate text-ink">{name}</span>
      <span aria-hidden className="block h-3 border border-rule-strong">
        <span className="bg-hatch block h-full border-r border-ink" style={{ width: `${width}%` }} />
      </span>
      <span className="text-right tabular-nums text-ink-soft">
        {formatHours(hours, minutes)}
        <span className="sr-only">, {Math.round(width)}% of the week</span>
      </span>
    </li>
  )
}

export default HatchBar
