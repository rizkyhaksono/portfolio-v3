import { cn } from "@/lib/utils"

export interface InkHeatmapWeek {
  contributionDays: { date: string; contributionCount: number }[]
}

interface InkHeatmapProps {
  /** Oldest week first, each week Sunday → Saturday (GitHub contribution calendar shape). */
  weeks: InkHeatmapWeek[]
  /** Accessible summary; defaults to "N contributions in the last year". */
  label?: string
  /** Word used in each cell's tooltip. */
  unit?: [singular: string, plural: string]
  className?: string
}

const CELL = 11
const STEP = 14
const MONTH_ROW = 18
// Level 0 is the muted ground; levels 1 to 4 step the foreground up to solid.
const LEVEL_FILL = ["hsl(var(--muted))", ...[0.3, 0.5, 0.75, 1].map((alpha) => `hsl(var(--foreground) / ${alpha})`)]

const formatDay = (date: string, options: Intl.DateTimeFormatOptions) =>
  new Date(`${date.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-GB", { ...options, timeZone: "UTC" })

/**
 * Level 0 for empty days, 1–4 by quartile of the non-zero days (GitHub's scheme), so one very busy
 * day does not flatten the rest of the year into level 1.
 */
export function heatLevels(counts: number[]): (count: number) => number {
  const busy = counts.filter((c) => c > 0).sort((a, b) => a - b)
  const cuts = [0.25, 0.5, 0.75].map((p) => busy[Math.floor(p * (busy.length - 1))] ?? 0)
  return (count) => (count > 0 ? 1 + cuts.filter((cut) => count > cut).length : 0)
}

const Swatch = ({ level }: { level: number }) => (
  <span className="inline-block size-2.5 rounded-sm" style={{ backgroundColor: LEVEL_FILL[level] }} />
)

/**
 * Server-rendered year heatmap: five quartile levels from muted to solid foreground on rounded cells,
 * a `data-tip` per day. The scroller is `row-reverse`, so narrow screens open on the newest weeks without a layout effect.
 */
export function InkHeatmap({ weeks, label, unit = ["contribution", "contributions"], className }: Readonly<InkHeatmapProps>) {
  if (weeks.length === 0) return null

  const days = weeks.flatMap((w) => w.contributionDays)
  const total = days.reduce((sum, d) => sum + d.contributionCount, 0)
  const level = heatLevels(days.map((d) => d.contributionCount))
  const width = weeks.length * STEP
  const height = MONTH_ROW + 7 * STEP
  const summary = label ?? `${total.toLocaleString("en")} ${total === 1 ? unit[0] : unit[1]} in the last year`

  return (
    <figure className={cn("w-full min-w-0", className)}>
      <div className="flex flex-row-reverse overflow-x-auto overscroll-x-contain pb-1" tabIndex={0} role="group" aria-label={summary}>
        {/* min-w-full keeps a narrow year left-aligned; a wide one overflows left and opens on the newest weeks. */}
        <div className="min-w-full shrink-0">
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden className="block text-foreground">
            {weeks.map((week, col) => {
              const first = week.contributionDays[0]?.date
              const prev = weeks[col - 1]?.contributionDays[0]?.date
              const showMonth = first && prev && first.slice(5, 7) !== prev.slice(5, 7)
              // A partial first week is missing its early days, so it hangs from the bottom.
              const offset = col === 0 ? 7 - week.contributionDays.length : 0
              return (
                <g key={first ?? col}>
                  {showMonth && (
                    <text x={col * STEP} y={12} fill="currentColor" className="text-caption text-muted-foreground">
                      {formatDay(first, { month: "short" })}
                    </text>
                  )}
                  {week.contributionDays.map((day, row) => {
                    const count = day.contributionCount
                    return (
                      <rect
                        key={day.date}
                        x={col * STEP}
                        y={MONTH_ROW + (row + offset) * STEP}
                        width={CELL}
                        height={CELL}
                        rx={2}
                        fill={LEVEL_FILL[level(count)]}
                        className="hover:stroke-foreground"
                        data-tip={`${count.toLocaleString("en")} ${count === 1 ? unit[0] : unit[1]} on ${formatDay(day.date, { day: "numeric", month: "short", year: "numeric" })}`}
                      />
                    )
                  })}
                </g>
              )
            })}
          </svg>
        </div>
      </div>
      <figcaption className="mt-2 flex items-center gap-1.5 text-small text-muted-foreground">
        <span className="mr-1">Less</span>
        {LEVEL_FILL.map((_, i) => (
          <Swatch key={i} level={i} />
        ))}
        <span className="ml-1">More</span>
        <span className="ml-auto md:hidden">Swipe for earlier weeks</span>
      </figcaption>
    </figure>
  )
}

export default InkHeatmap
