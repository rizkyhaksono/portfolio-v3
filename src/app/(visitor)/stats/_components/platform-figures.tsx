import { PageSection } from "@/components/ui/page-section"
import { InkLink } from "@/components/ui/ink-link"
import { StatusLine } from "@/components/ui/status-line"
import { STATS_PROFILES, STATS_PROFILE_URLS } from "@/commons/constants/stats-profiles"
import type { ChessStats } from "@/services/visitor/chess"
import type { NpmStats } from "@/services/visitor/npm"

type ProfileKey = "chess" | "npm"
type Figure = [label: string, value: number | null | undefined]

const n = (value: number) => value.toLocaleString("en")

function Figures({ rows }: Readonly<{ rows: Figure[] }>) {
  const shown = rows.filter((row): row is [string, number] => row[1] != null)
  if (shown.length === 0) return <StatusLine kind="empty">No figures to show yet.</StatusLine>

  return (
    <dl>
      {shown.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 py-1">
          <dt className="text-body text-muted-foreground">{label}</dt>
          <dd className="text-body tabular-nums text-foreground">{n(value)}</dd>
        </div>
      ))}
    </dl>
  )
}

interface PlatformProps {
  platform: ProfileKey
  title: string
  /** True when the source did not answer. */
  failed: boolean
  children: React.ReactNode
}

function Platform({ platform, title, failed, children }: Readonly<PlatformProps>) {
  const profile = (
    <InkLink
      href={STATS_PROFILE_URLS[platform](STATS_PROFILES[platform])}
      external
      event="stats-profile-open"
      eventData={{ platform }}
      className="inline-flex min-h-11 items-center md:min-h-0"
    >
      Profile
    </InkLink>
  )

  return (
    <PageSection id={platform} heading={{ title, aside: profile }}>
      {failed ? <StatusLine kind="failed">{title} did not answer just now, so its figures are missing.</StatusLine> : children}
    </PageSection>
  )
}

/** Chess.com ratings and npm downloads as plain figure rows, each with a failed line when its source is down. */
export default function PlatformFigures({ chess, npm }: Readonly<{ chess: ChessStats | null; npm: NpmStats | null }>) {
  return (
    <>
      <Platform platform="chess" title="Chess.com" failed={!chess}>
        {chess && (
          <>
            <Figures
              rows={[
                ["Rapid rating", chess.rapid],
                ["Blitz rating", chess.blitz],
                ["Bullet rating", chess.bullet],
                ["Daily rating", chess.daily],
                ["Best tactics rating", chess.tacticsHighest],
              ]}
            />
            {chess.totalGames > 0 && (
              <p className="mt-3 text-body text-muted-foreground">
                {n(chess.wins)} wins, {n(chess.losses)} losses and {n(chess.draws)} draws across {n(chess.totalGames)} games.
              </p>
            )}
          </>
        )}
      </Platform>

      <Platform platform="npm" title="npm" failed={!npm}>
        {npm && (
          <Figures
            rows={[
              ["Packages published", npm.packageCount],
              ["Downloads last month", npm.totalDownloadsLastMonth],
              ...npm.topPackages.map((pkg): Figure => [`${pkg.name}, last month`, pkg.downloads]),
            ]}
          />
        )}
      </Platform>
    </>
  )
}
