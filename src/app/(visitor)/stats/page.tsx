import type { Metadata } from "next"
import BaseLayout from "@/components/layout/base-layout"
import { StatStrip, type StatItem } from "@/components/ui/stat-strip"
import { getDailyPageviews, getPathReads, getUmamiStats } from "@/services/visitor/umami"
import { getLeetCodeStats } from "@/services/visitor/leetcode"
import { getMonkeyTypeData } from "@/services/visitor/monkeytype"
import { getChessStats } from "@/services/visitor/chess"
import { getNpmStats } from "@/services/visitor/npm"
import ReadersFigures from "./_components/readers-figures"
import SystemStatus from "./_components/system-status"
import LeetCodeSection from "./_components/leetcode-section"
import TypingSection from "./_components/typing-section"
import PlatformFigures from "./_components/platform-figures"

export const revalidate = 900

export const metadata: Metadata = {
  title: "Stats | Rizky Haksono",
  description: "Who reads this site, whether its API is up, and practice figures from LeetCode, MonkeyType, Chess.com and npm.",
  alternates: { canonical: "/stats" },
}

// shortcut: the render stops waiting after 5 s but the source fetch runs on; give leetcode.ts, chess.ts and npm.ts
// their own AbortSignal.timeout(5000) when those services are next touched.
const within5s = <T,>(promise: Promise<T>) =>
  Promise.race([promise, new Promise<null>((resolve) => setTimeout(resolve, 5000, null))])

export default async function StatsPage() {
  const [stats, daily, reads, leetcode, typing, chess, npm] = await Promise.all([
    getUmamiStats(),
    getDailyPageviews(30),
    getPathReads(),
    within5s(getLeetCodeStats()),
    getMonkeyTypeData(),
    within5s(getChessStats()),
    within5s(getNpmStats()),
  ])

  const strip: StatItem[] = [
    { label: "Pages read, last 30 days", value: stats?.pageviews ?? 0 },
    { label: "Readers, last 30 days", value: stats?.visitors ?? 0 },
    { label: "Problems solved on LeetCode", value: leetcode?.totalSolved ?? 0 },
    { label: "Best typing speed, words a minute", value: typing.bestWpm },
  ]
    .filter((item) => item.value > 0)
    .map((item) => ({ ...item, value: item.value.toLocaleString("en") }))

  return (
    <BaseLayout>
      <header className="pb-8">
        <h1 className="font-display text-h1 text-balance text-ink">Stats</h1>
      </header>
      <div aria-hidden className="border-t border-ink" />

      {strip.length > 0 && <StatStrip items={strip} className="mt-8 border-t-0" />}
      <ReadersFigures stats={stats} daily={daily} reads={reads} />
      <SystemStatus />
      {leetcode && <LeetCodeSection stats={leetcode} />}
      <TypingSection data={typing} />
      <PlatformFigures chess={chess} npm={npm} />
    </BaseLayout>
  )
}
