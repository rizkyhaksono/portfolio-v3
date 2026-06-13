import Image from "next/image"
import Link from "next/link"
import BaseLayout from "@/components/layout/base-layout"
import SidebarMain from "@/components/layout/sidebar-main"
import Typography from "@/components/ui/typography"
import { STATS_PROFILES, STATS_PROFILE_URLS } from "@/commons/constants/stats-profiles"
import { getLeetCodeStats } from "@/services/visitor/leetcode"
import { getChessStats } from "@/services/visitor/chess"
import { getNpmStats } from "@/services/visitor/npm"
import { getLetterboxdStats, type LetterboxdFilm } from "@/services/visitor/letterboxd"
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
    <div className="bg-secondary/20 rounded-xl p-5 border border-border/30 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Typography.P className="text-base font-semibold">{title}</Typography.P>
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
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
    </div>
  )
}

function FilmGrid({ films }: { films: LetterboxdFilm[] }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {films.map((film) => (
        <div key={`${film.title}-${film.watchedDate}`} className="flex flex-col gap-1">
          <div className="aspect-[2/3] relative rounded-lg overflow-hidden bg-secondary/40">
            {film.posterUrl ? (
              <Image src={film.posterUrl} alt={film.title} fill className="object-cover" sizes="120px" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground p-2 text-center">{film.title}</div>
            )}
          </div>
          <p className="text-xs font-medium line-clamp-2">{film.title}</p>
          {film.rating != null && <p className="text-xs text-yellow-600 dark:text-yellow-400">★ {film.rating}</p>}
          {film.watchedDate && <p className="text-xs text-muted-foreground">{film.watchedDate}</p>}
        </div>
      ))}
    </div>
  )
}

function formatDownloads(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

export default async function StatsPage() {
  const [lc, ch, np, lb] = await Promise.allSettled([
    getLeetCodeStats(),
    getChessStats(),
    getNpmStats(),
    getLetterboxdStats(),
  ])

  const leetcode = lc.status === "fulfilled" ? lc.value : null
  const chess = ch.status === "fulfilled" ? ch.value : null
  const npm = np.status === "fulfilled" ? np.value : null
  const letterboxd = lb.status === "fulfilled" ? lb.value : null

  return (
    <BaseLayout sidebar={<SidebarMain />} useGridBackground={false}>
      <div className="flex flex-col gap-6 mt-20 max-w-6xl mx-auto w-full px-4 lg:px-0">
        <div className="flex flex-col gap-2">
          <h1 className="font-medium text-4xl md:text-5xl tracking-tighter">Stats & Activity</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            My public data from various platforms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PlatformCard
            title="LeetCode"
            href={STATS_PROFILE_URLS.leetcode(STATS_PROFILES.leetcode)}
            unavailable={!leetcode}
          >
            {leetcode && (
              <div className="space-y-2">
                <StatRow label="Easy" value={leetcode.easySolved} />
                <StatRow label="Medium" value={leetcode.mediumSolved} />
                <StatRow label="Hard" value={leetcode.hardSolved} />
                <StatRow label="Total solved" value={leetcode.totalSolved} />
                {leetcode.ranking != null && (
                  <StatRow label="Ranking" value={`#${leetcode.ranking.toLocaleString()}`} />
                )}
              </div>
            )}
          </PlatformCard>

          <PlatformCard
            title="Chess.com"
            href={STATS_PROFILE_URLS.chess(STATS_PROFILES.chess)}
            unavailable={!chess}
          >
            {chess && (
              <div className="space-y-2">
                {chess.rapid != null && <StatRow label="Rapid" value={chess.rapid} />}
                {chess.blitz != null && <StatRow label="Blitz" value={chess.blitz} />}
                {chess.bullet != null && <StatRow label="Bullet" value={chess.bullet} />}
                {chess.daily != null && <StatRow label="Daily" value={chess.daily} />}
                {chess.tacticsHighest != null && (
                  <StatRow label="Tactics (best)" value={chess.tacticsHighest} />
                )}
                <StatRow label="Record" value={`${chess.wins}W · ${chess.losses}L · ${chess.draws}D`} />
              </div>
            )}
          </PlatformCard>

          <PlatformCard
            title="npm"
            href={STATS_PROFILE_URLS.npm(STATS_PROFILES.npm)}
            unavailable={!npm}
          >
            {npm && (
              <div className="space-y-2">
                <StatRow label="Packages" value={npm.packageCount} />
                <StatRow
                  label="Downloads (30d)"
                  value={formatDownloads(npm.totalDownloadsLastMonth)}
                />
                {npm.topPackages.length > 0 && (
                  <div className="pt-2 border-t border-border/30 space-y-1">
                    <p className="text-xs text-muted-foreground">Top packages</p>
                    {npm.topPackages.map((pkg) => (
                      <div key={pkg.name} className="flex justify-between text-xs">
                        <span className="truncate text-primary/80 max-w-[60%]">{pkg.name}</span>
                        <span className="text-muted-foreground">{formatDownloads(pkg.downloads)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </PlatformCard>

        </div>

        <PlatformCard
          title="Letterboxd"
          href={STATS_PROFILE_URLS.letterboxd(STATS_PROFILES.letterboxd)}
          unavailable={!letterboxd || letterboxd.films.length === 0}
        >
          {letterboxd && letterboxd.films.length > 0 && (() => {
            const latest = letterboxd.films.slice(0, 8)
            const topRated = [...letterboxd.films]
              .filter((f) => f.rating != null)
              .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
              .slice(0, 8)

            return (
              <div className="space-y-6">
                <div>
                  <p className="mb-3 text-sm font-medium text-muted-foreground">Latest Activity</p>
                  <FilmGrid films={latest} />
                </div>
                {topRated.length > 0 && (
                  <div>
                    <p className="mb-3 text-sm font-medium text-muted-foreground">Highest Rated</p>
                    <FilmGrid films={topRated} />
                  </div>
                )}
              </div>
            )
          })()}
        </PlatformCard>
      </div>
    </BaseLayout>
  )
}
