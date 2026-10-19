import { cn } from "@/lib/utils"

export interface InkChartPoint {
  x: string
  y: number
}

interface InkChartProps {
  /** Main series: 1.5px ink line over a hatched area. */
  points: InkChartPoint[]
  /** Optional second series, same x order, drawn dashed. */
  dashed?: InkChartPoint[]
  name?: string
  dashedName?: string
  /** Accessible name of the figure, e.g. "Daily pageviews, last 30 days". */
  label: string
  /** Sparkline: no grid, axes or table. */
  compact?: boolean
  height?: number
  formatX?: (x: string) => string
  /** Number format for the scale, titles and table (defaults to plain grouped numbers). */
  formatY?: (y: number) => string
  /** Prices and other series far from zero: scale between the series' own low and high instead of from zero. */
  fromZero?: boolean
  className?: string
}

const formatNumber = (n: number) => n.toLocaleString("en")

/** "2026-10-17" or "2026-10-17 14:00:00" → "17 Oct" / "17 Oct, 14:00" (wall time, no timezone shift). */
export function formatChartDate(x: string) {
  const [date, time] = x.split(/[ T]/)
  const d = new Date(`${date}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return x
  const day = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })
  const hour = time?.slice(0, 5)
  return hour && hour !== "00:00" ? `${day}, ${hour}` : day
}

// Rounds the top of the scale up to 1, 2, 2.5 or 5 × 10^k so the label reads cleanly.
const niceCeil = (v: number) => {
  const p = 10 ** Math.floor(Math.log10(v))
  return [1, 2, 2.5, 5, 10].map((m) => m * p).find((c) => c >= v) ?? v
}

/**
 * Server-rendered one-ink line chart. The SVG stretches (`preserveAspectRatio="none"`) with
 * non-scaling strokes; the hatch is a CSS layer clipped to the area so its 45° lines never distort.
 */
export function InkChart({
  points,
  dashed,
  name = "Views",
  dashedName = "Sessions",
  label,
  compact = false,
  height,
  formatX = formatChartDate,
  formatY = formatNumber,
  fromZero = true,
  className,
}: Readonly<InkChartProps>) {
  if (points.length === 0) return null

  const n = points.length
  const ys = [...points.map((p) => p.y), ...(dashed ?? []).map((p) => p.y)]
  const lowest = Math.min(...ys)
  const highest = Math.max(...ys)
  const pad = (highest - lowest) * 0.08 || Math.abs(highest) * 0.01 || 1
  const bottom = fromZero ? 0 : lowest - pad
  const top = fromZero ? niceCeil(Math.max(1, highest)) : highest + pad
  const px = (i: number) => (n > 1 ? (i / (n - 1)) * 100 : 50)
  const py = (y: number) => 100 - ((y - bottom) / (top - bottom)) * 100
  const line = (series: InkChartPoint[]) => series.map((p, i) => `${px(i).toFixed(2)},${py(p.y).toFixed(2)}`).join(" ")
  const area = `polygon(0% 100%, ${points.map((p, i) => `${px(i).toFixed(2)}% ${py(p.y).toFixed(2)}%`).join(", ")}, 100% 100%)`
  const describe = (i: number) =>
    `${formatX(points[i].x)}: ${formatY(points[i].y)} ${name.toLowerCase()}` +
    (dashed?.[i] ? `, ${formatY(dashed[i].y)} ${dashedName.toLowerCase()}` : "")

  // Compact charts keep the figures for screen readers only; full ones show them in a disclosure.
  const table = (className: string) => (
    <table className={className}>
      <caption className="sr-only">{label}</caption>
      <thead>
        <tr className="border-b border-rule">
          <th scope="col" className="py-1 text-left text-xs font-semibold text-muted-foreground">Date</th>
          <th scope="col" className="py-1 text-right text-xs font-semibold text-muted-foreground">{name}</th>
          {dashed && <th scope="col" className="py-1 text-right text-xs font-semibold text-muted-foreground">{dashedName}</th>}
        </tr>
      </thead>
      <tbody>
        {points.map((p, i) => (
          <tr key={p.x} className="border-b border-rule hover:bg-tint">
            <th scope="row" className="py-1 text-left font-normal">{formatX(p.x)}</th>
            <td className="py-1 text-right">{formatY(p.y)}</td>
            {dashed && <td className="py-1 text-right">{formatY(dashed[i]?.y ?? 0)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <figure className={cn("w-full min-w-0", !compact && "pt-5", className)}>
      <div className="relative" style={{ height: height ?? (compact ? 48 : 176) }}>
        {!compact && (
          <>
            <div aria-hidden className="absolute inset-x-0 top-0 border-t border-dotted border-rule-strong" />
            <div aria-hidden className="absolute inset-x-0 top-1/2 border-t border-dotted border-rule-strong" />
            <span aria-hidden className="absolute left-0 top-0 -translate-y-full pb-0.5 text-caption italic tabular-nums text-muted-foreground">
              {formatY(fromZero ? top : highest)}
            </span>
            {!fromZero && (
              <span aria-hidden className="absolute bottom-1 left-0 z-10 bg-background pr-1 text-caption italic tabular-nums text-muted-foreground">
                {formatY(lowest)}
              </span>
            )}
          </>
        )}
        <div aria-hidden className="bg-hatch absolute inset-0" style={{ clipPath: area }} />
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          role="img"
          aria-label={label}
          className="absolute inset-0 h-full w-full overflow-visible text-ink"
        >
          {!compact && <line x1="0" y1="100" x2="100" y2="100" stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke" />}
          {dashed && dashed.length > 0 && (
            <polyline
              points={line(dashed)}
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              strokeDasharray="4 3"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
          <polyline
            points={line(points)}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {points.map((p, i) => (
            <rect key={p.x} x={(i * 100) / n} y="0" width={100 / n} height="100" data-tip={describe(i)} className="fill-transparent hover:fill-ink/10" />
          ))}
        </svg>
        {/* An HTML square, not an SVG rect: the stretched viewBox would draw a rect as a flat bar. */}
        <span
          aria-hidden
          className="pointer-events-none absolute size-0.5 -translate-x-1/2 -translate-y-1/2 bg-mark"
          style={{ left: `${px(n - 1)}%`, top: `${py(points[n - 1].y)}%` }}
        />
      </div>

      {compact ? (
        table("sr-only")
      ) : (
        <>
          <div aria-hidden className="mt-1.5 flex justify-between text-caption italic tabular-nums text-muted-foreground">
            <span>{formatX(points[0].x)}</span>
            {n > 1 && <span>{formatX(points[n - 1].x)}</span>}
          </div>
          <details className="mt-3 text-small">
            <summary className="cursor-pointer py-3 underline md:py-0 decoration-1 underline-offset-[0.18em] hover:decoration-2">
              Show the figures
            </summary>
            {table("mt-2 w-full border-collapse tabular-nums")}
          </details>
        </>
      )}
    </figure>
  )
}

export default InkChart
