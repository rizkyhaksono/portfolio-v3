import { getFullUmamiAnalytics } from "@/services/visitor/umami"
import AnalyticsDashboard from "./_components/analytics-dashboard"

export const dynamic = "force-dynamic"

const RANGES: Record<string, { ms: number; unit: "hour" | "day" }> = {
  "24h": { ms: 24 * 60 * 60 * 1000, unit: "hour" },
  "7d": { ms: 7 * 24 * 60 * 60 * 1000, unit: "day" },
  "30d": { ms: 30 * 24 * 60 * 60 * 1000, unit: "day" },
}

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>
}) {
  const { range: rangeParam } = await searchParams
  const range = rangeParam && rangeParam in RANGES ? rangeParam : "30d"
  const { ms, unit } = RANGES[range]

  const end = Date.now()
  const start = end - ms
  const data = await getFullUmamiAnalytics(start, end, unit)

  return <AnalyticsDashboard data={data} range={range} unit={unit} />
}
