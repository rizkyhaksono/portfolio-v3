import type { UmamiPageviewData } from "@/commons/types/umami"

const HOUR = 3_600_000

// "2026-10-19 14:05:00" in Malang time; sv-SE prints ISO-like wall time.
const jakartaHour = (ms: number) => new Date(ms).toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" }).slice(0, 13)

/**
 * Zero-fills an hourly series to exactly `hours` points ending at `now`'s hour, oldest first, so the
 * chart's x spacing is real time. Umami answers in Malang wall time ("2026-10-19 14:00:00"); if its
 * keys ever stop matching, the raw series is returned rather than a chart of zeros.
 */
export function fillHours(series: UmamiPageviewData[], hours: number, now = Date.now()): UmamiPageviewData[] {
  const key = (x: string) => String(x).replace("T", " ").slice(0, 13)
  const totals = new Map<string, number>()
  for (const point of series) totals.set(key(point.x), (totals.get(key(point.x)) ?? 0) + (Number(point.y) || 0))

  const filled = Array.from({ length: hours }, (_, i) => {
    const hour = jakartaHour(now - (hours - 1 - i) * HOUR)
    return { x: `${hour}:00:00`, y: totals.get(hour) ?? 0 }
  })
  const sum = (points: UmamiPageviewData[]) => points.reduce((total, point) => total + (Number(point.y) || 0), 0)
  return sum(filled) === sum(series) ? filled : series
}
