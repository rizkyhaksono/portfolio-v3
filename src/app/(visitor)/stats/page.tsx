import Link from "next/link"
import BaseLayout from "@/components/layout/base-layout"
import SidebarMain from "@/components/layout/sidebar-main"
import Typography from "@/components/ui/typography"
import { MacWindow } from "@/components/ui/mac-window"
import { PageBody } from "@/components/ui/page-body"
import { SectionHeading } from "@/components/ui/section-heading"
import { Surface } from "@/components/ui/surface"
import { StatStrip } from "@/components/ui/stat-strip"
import { Eyebrow } from "@/components/ui/eyebrow"
import { STATS_PROFILES, STATS_PROFILE_URLS } from "@/commons/constants/stats-profiles"
import { getLeetCodeStats } from "@/services/visitor/leetcode"
import LeetCodeSection from "./_components/leetcode-section"
import SystemStatus from "./_components/system-status"
import { getChessStats } from "@/services/visitor/chess"
import { getNpmStats } from "@/services/visitor/npm"
import { ExternalLink } from "lucide-react"

export const dynamic = "force-dynamic"

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-primary">{value}</span>
    </div>
  )
}

function PlatformCard({
  title,
  href,
  children,
  unavailable,
}: {
  title: string
  href: string
  children: React.ReactNode
  unavailable?: boolean
}) {
  return (
    <Surface variant="solid" padding="cozy" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Typography.P className="font-display text-base font-semibold tracking-tight">{title}</Typography.P>
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground transition-colors hover:text-primary"
          aria-label={`Open ${title} profile`}
        >
          <ExternalLink size={16} />
        </Link>
      </div>
      {unavailable ? (
        <Typography.P className="text-sm text-muted-foreground">Data unavailable</Typography.P>
      ) : (
        children
      )}
    </Surface>
  )
}

type LeetCodeData = NonNullable<Awaited<ReturnType<typeof getLeetCodeStats>>>
type ChessData = NonNullable<Awaited<ReturnType<typeof getChessStats>>>
type NpmData = NonNullable<Awaited<ReturnType<typeof getNpmStats>>>

/** Displays the available LeetCode problem and contest metrics. */
function LeetCodeCard({ data }: Readonly<{ data: LeetCodeData | null }>) {
  return (
    <PlatformCard
      title="LeetCode"
      href={STATS_PROFILE_URLS.leetcode(STATS_PROFILES.leetcode)}
      unavailable={!data}
    >
      {data ? (
        <div className="space-y-2">
          <StatRow label="Easy" value={data.easySolved} />
          <StatRow label="Medium" value={data.mediumSolved} />
          <StatRow label="Hard" value={data.hardSolved} />
          <StatRow label="Total solved" value={data.totalSolved} />
          {data.ranking != null ? (
            <StatRow label="Ranking" value={`#${data.ranking.toLocaleString()}`} />
          ) : null}
          {data.currentRating != null ? (
            <StatRow label="Contest rating" value={data.currentRating} />
          ) : null}
        </div>
      ) : null}
    </PlatformCard>
  )
}

/** Displays the available Chess.com ratings and match record. */
function ChessCard({ data }: Readonly<{ data: ChessData | null }>) {
  return (
    <PlatformCard
      title="Chess.com"
      href={STATS_PROFILE_URLS.chess(STATS_PROFILES.chess)}
      unavailable={!data}
    >
      {data ? (
        <div className="space-y-2">
          {data.rapid != null ? <StatRow label="Rapid" value={data.rapid} /> : null}
          {data.blitz != null ? <StatRow label="Blitz" value={data.blitz} /> : null}
          {data.bullet != null ? <StatRow label="Bullet" value={data.bullet} /> : null}
          {data.daily != null ? <StatRow label="Daily" value={data.daily} /> : null}
          {data.tacticsHighest != null ? (
            <StatRow label="Tactics (best)" value={data.tacticsHighest} />
          ) : null}
          <StatRow label="Record" value={`${data.wins}W · ${data.losses}L · ${data.draws}D`} />
        </div>
      ) : null}
    </PlatformCard>
  )
}

/** Displays npm package and recent download metrics. */
function NpmCard({ data }: Readonly<{ data: NpmData | null }>) {
  const topPackages = data?.topPackages ?? []

  return (
    <PlatformCard
      title="npm"
      href={STATS_PROFILE_URLS.npm(STATS_PROFILES.npm)}
      unavailable={!data}
    >
      {data ? (
        <div className="space-y-2">
          <StatRow label="Packages" value={data.packageCount} />
          <StatRow label="Downloads (30d)" value={formatDownloads(data.totalDownloadsLastMonth)} />
          {topPackages.length > 0 ? <NpmTopPackages packages={topPackages} /> : null}
        </div>
      ) : null}
    </PlatformCard>
  )
}

/** Lists the most-downloaded packages in descending order. */
function NpmTopPackages({ packages }: Readonly<{ packages: NpmData["topPackages"] }>) {
  return (
    <div className="space-y-1 border-t border-border pt-2">
      <Eyebrow>Top packages</Eyebrow>
      {packages.map((pkg) => (
        <div key={pkg.name} className="flex justify-between text-xs">
          <span className="max-w-[60%] truncate text-primary/80">{pkg.name}</span>
          <span className="text-muted-foreground">{formatDownloads(pkg.downloads)}</span>
        </div>
      ))}
    </div>
  )
}

interface StatsContentProps {
  overviewStats: { label: string; value: React.ReactNode }[]
  leetcode: LeetCodeData | null
  chess: ChessData | null
  npm: NpmData | null
}

/** Composes the public statistics overview, platform panels, and system health. */
function StatsContent({
  overviewStats,
  leetcode,
  chess,
  npm,
}: Readonly<StatsContentProps>) {
  return (
    <>
      <SectionHeading
        as="h1"
        eyebrow="Activity"
        title="Stats &"
        accent="Activity"
        description="My public data from various platforms, plus live API health."
      />
      {overviewStats.length > 0 ? <StatStrip items={overviewStats} className="border-x-0" /> : null}
      <MacWindow title="~/stats" bodyClassName="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <LeetCodeCard data={leetcode} />
          <ChessCard data={chess} />
          <NpmCard data={npm} />
        </div>
        {leetcode ? <LeetCodeSection stats={leetcode} /> : null}
      </MacWindow>
      <SystemStatus />
    </>
  )
}

function formatDownloads(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

export default async function StatsPage() {
  const [lc, ch, np] = await Promise.allSettled([
    getLeetCodeStats(),
    getChessStats(),
    getNpmStats(),
  ])

  const leetcode = lc.status === "fulfilled" ? lc.value : null
  const chess = ch.status === "fulfilled" ? ch.value : null
  const npm = np.status === "fulfilled" ? np.value : null

  const overviewStats: { label: string; value: React.ReactNode }[] = []
  if (leetcode) overviewStats.push({ label: "Problems Solved", value: leetcode.totalSolved })
  if (chess?.rapid != null) overviewStats.push({ label: "Chess Rapid", value: chess.rapid })
  if (npm) overviewStats.push({ label: "npm Downloads", value: formatDownloads(npm.totalDownloadsLastMonth) })

  return (
    <BaseLayout sidebar={<SidebarMain />}>
      <PageBody width="wide">
        <StatsContent
          overviewStats={overviewStats}
          leetcode={leetcode}
          chess={chess}
          npm={npm}
        />
      </PageBody>
    </BaseLayout>
  )
}
