import Image from "next/image"
import Link from "next/link"
import BaseLayout from "@/components/layout/base-layout"
import SidebarMain from "@/components/layout/sidebar-main"
import Typography from "@/components/ui/typography"
import { STATS_PROFILES, STATS_PROFILE_URLS } from "@/commons/constants/stats-profiles"
import { getLeetCodeStats } from "@/services/visitor/leetcode"
import { getAniListStats } from "@/services/visitor/anilist"
import { getChessStats } from "@/services/visitor/chess"
import { getNpmStats } from "@/services/visitor/npm"
import { getLetterboxdStats } from "@/services/visitor/letterboxd"
import { getSteamStats } from "@/services/visitor/steam"
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

function formatHours(minutes: number) {
  const h = Math.floor(minutes / 60)
  return h >= 1000 ? `${(h / 1000).toFixed(1)}k h` : `${h}h`
}

function formatDownloads(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

export default async function StatsPage() {
  const [lc, al, ch, np, lb, st] = await Promise.allSettled([
    getLeetCodeStats(),
    getAniListStats(),
    getChessStats(),
    getNpmStats(),
    getLetterboxdStats(),
    getSteamStats(),
  ])

  const leetcode = lc.status === "fulfilled" ? lc.value : null
  const anilist = al.status === "fulfilled" ? al.value : null
  const chess = ch.status === "fulfilled" ? ch.value : null
  const npm = np.status === "fulfilled" ? np.value : null
  const letterboxd = lb.status === "fulfilled" ? lb.value : null
  const steam = st.status === "fulfilled" ? st.value : null

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
            title="AniList"
            href={STATS_PROFILE_URLS.anilist(STATS_PROFILES.anilist)}
            unavailable={!anilist}
          >
            {anilist && (
              <div className="space-y-2">
                <StatRow label="Anime" value={anilist.animeCount} />
                <StatRow label="Watched" value={formatHours(anilist.minutesWatched)} />
                <StatRow label="Manga" value={anilist.mangaCount} />
                <StatRow label="Chapters" value={anilist.chaptersRead.toLocaleString()} />
                {anilist.meanScore > 0 && <StatRow label="Mean score" value={anilist.meanScore} />}
                {anilist.favouriteAnime.length > 0 && (
                  <div className="pt-2 border-t border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">Favourites</p>
                    <p className="text-xs text-primary/80 line-clamp-2">
                      {anilist.favouriteAnime.map((a) => a.title).join(" · ")}
                    </p>
                  </div>
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

          <PlatformCard
            title="Steam"
            href={STATS_PROFILE_URLS.steam(STATS_PROFILES.steamId)}
            unavailable={false}
          >
            {steam && !steam.configured ? (
              <Typography.P className="text-sm text-muted-foreground">
                Not configured — add STEAM_API_KEY and STEAM_ID to .env
              </Typography.P>
            ) : steam ? (
              <div className="space-y-2">
                <StatRow label="Games owned" value={steam.totalGames} />
                {steam.recentGames.length > 0 ? (
                  <div className="pt-2 border-t border-border/30 space-y-2">
                    <p className="text-xs text-muted-foreground">Recently played</p>
                    {steam.recentGames.map((g) => (
                      <div key={g.name} className="flex items-center gap-2">
                        {g.iconUrl ? (
                          <Image
                            src={g.iconUrl}
                            alt=""
                            width={24}
                            height={24}
                            className="rounded"
                            unoptimized
                          />
                        ) : null}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{g.name}</p>
                          {g.playtime2Weeks > 0 && (
                            <p className="text-xs text-muted-foreground">{g.playtime2Weeks}h (2w)</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography.P className="text-xs text-muted-foreground">No recent activity</Typography.P>
                )}
              </div>
            ) : (
              <Typography.P className="text-sm text-muted-foreground">Data unavailable</Typography.P>
            )}
          </PlatformCard>
        </div>

        <PlatformCard
          title="Letterboxd"
          href={STATS_PROFILE_URLS.letterboxd(STATS_PROFILES.letterboxd)}
          unavailable={!letterboxd || letterboxd.films.length === 0}
        >
          {letterboxd && letterboxd.films.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {letterboxd.films.map((film) => (
                <div key={`${film.title}-${film.watchedDate}`} className="flex flex-col gap-1">
                  <div className="aspect-[2/3] relative rounded-lg overflow-hidden bg-secondary/40">
                    {film.posterUrl ? (
                      <Image
                        src={film.posterUrl}
                        alt={film.title}
                        fill
                        className="object-cover"
                        sizes="120px"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground p-2 text-center">
                        {film.title}
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-medium line-clamp-2">{film.title}</p>
                  {film.rating != null && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">★ {film.rating}</p>
                  )}
                  {film.watchedDate && (
                    <p className="text-xs text-muted-foreground">{film.watchedDate}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </PlatformCard>
      </div>
    </BaseLayout>
  )
}
