import { PageSection } from "@/components/ui/page-section"
import { InkLink } from "@/components/ui/ink-link"
import { STATS_PROFILES, STATS_PROFILE_URLS } from "@/commons/constants/stats-profiles"
import type { ChessStats } from "@/services/visitor/chess"
import type { NpmStats } from "@/services/visitor/npm"

type ProfileKey = "chess" | "npm"
type Figure = [label: string, value: number | null | undefined]

const n = (value: number) => value.toLocaleString("en")

function Figures({ rows }: Readonly<{ rows: Figure[] }>) {
  return (
    <dl className="mt-3 divide-y divide-rule border-y border-rule">
      {rows
        .filter((row): row is [string, number] => row[1] != null)
        .map(([label, value]) => (
          <div key={label} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 py-2">
            <dt className="text-small text-ink-soft">{label}</dt>
            <dd className="font-display text-body tabular-nums text-ink">{n(value)}</dd>
          </div>
        ))}
    </dl>
  )
}

function Platform({ platform, title, children }: Readonly<{ platform: ProfileKey; title: string; children: React.ReactNode }>) {
  return (
    <div>
      <h3 className="font-display text-h3 text-ink">{title}</h3>
      {children}
      <p className="mt-3 text-body">
        <InkLink
          href={STATS_PROFILE_URLS[platform](STATS_PROFILES[platform])}
          external
          event="stats-profile-open"
          eventData={{ platform }}
          className="inline-flex min-h-11 items-center md:min-h-0"
        >
          The profile on {title}
        </InkLink>
      </p>
    </div>
  )
}

/** Chess.com ratings and npm downloads, each a short definition list; either hides without data. */
export default function PlatformFigures({ chess, npm }: Readonly<{ chess: ChessStats | null; npm: NpmStats | null }>) {
  if (!chess && !npm) return null

  return (
    <PageSection id="elsewhere" heading={{ title: "Elsewhere" }} contentClassName="mt-6 grid gap-12 md:grid-cols-2">
      {chess && (
        <Platform platform="chess" title="Chess.com">
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
            <p className="mt-3 text-small text-ink-soft">
              {n(chess.wins)} wins, {n(chess.losses)} losses and {n(chess.draws)} draws across {n(chess.totalGames)} games.
            </p>
          )}
        </Platform>
      )}

      {npm && (
        <Platform platform="npm" title="npm">
          <Figures
            rows={[
              ["Packages published", npm.packageCount],
              ["Downloads last month", npm.totalDownloadsLastMonth],
              ...npm.topPackages.map((pkg): Figure => [`${pkg.name}, last month`, pkg.downloads]),
            ]}
          />
        </Platform>
      )}
    </PageSection>
  )
}
