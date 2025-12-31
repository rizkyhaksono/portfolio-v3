import { getUmamiAnalytics } from "@/services/visitor/umami"
import SiteStatsClient from "./site-stats-client"

export default async function SiteStatsSection() {
  const analyticsData = await getUmamiAnalytics()

  return <SiteStatsClient analytics={analyticsData} />
}
