import { requireAdminPage } from "@/lib/admin-page"
import { fillDays, floorTo, getFullUmamiAnalytics, getUmamiMetrics } from "@/services/visitor/umami"
import AnalyticsDashboard, { RANGES, type RangeId } from "./_components/analytics-dashboard"
import { fillHours } from "./_components/fill-hours"

export const dynamic = "force-dynamic"

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export default async function AdminAnalyticsPage({ searchParams }: Readonly<{ searchParams: Promise<{ range?: string }> }>) {
  await requireAdminPage()
  const { range: param } = await searchParams
  const range: RangeId = param && Object.hasOwn(RANGES, param) ? (param as RangeId) : "30d"
  const { unit, points } = RANGES[range]

  // A five-minute floor keeps the cache keys stable; buckets start on a whole hour, or Malang midnight (UTC+7).
  const end = floorTo(Date.now(), 5 * MINUTE)
  const start =
    unit === "hour" ? floorTo(end, HOUR) - (points - 1) * HOUR : floorTo(end + 7 * HOUR, DAY) - 7 * HOUR - (points - 1) * DAY

  const [data, events] = await Promise.all([getFullUmamiAnalytics(start, end, unit), getUmamiMetrics("event", 50, start, end)])
  const fill = unit === "hour" ? fillHours : fillDays
  const series = { pageviews: fill(data.series.pageviews, points, end), sessions: fill(data.series.sessions, points, end) }

  return <AnalyticsDashboard data={{ ...data, series, events }} range={range} />
}
