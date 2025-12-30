import { getUmamiAnalytics } from "@/services/visitor/umami"
import { getMonkeyTypeData } from "@/services/visitor/monkeytype"
import SiteStatsClient from "./site-stats-client"

export default async function SiteStatsSection() {
  const [analyticsData, typingData] = await Promise.all([getUmamiAnalytics(), getMonkeyTypeData()])

  return <SiteStatsClient analytics={analyticsData} typingStats={typingData} />
}
