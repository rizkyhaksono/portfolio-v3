import { PageSection } from "@/components/ui/page-section"
import { InkLink } from "@/components/ui/ink-link"
import { StatusLine } from "@/components/ui/status-line"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { STATS_PROFILES, STATS_PROFILE_URLS } from "@/commons/constants/stats-profiles"
import type { ChessStats } from "@/services/visitor/chess"
import type { NpmStats } from "@/services/visitor/npm"

type ProfileKey = "chess" | "npm"
type Figure = [label: string, value: number | null | undefined]

const n = (value: number) => value.toLocaleString("en")

/** A two-column Notion table: what is measured, then the figure. Rows without a figure are left out. */
function Figures({ head, rows }: Readonly<{ head: [string, string]; rows: Figure[] }>) {
  const shown = rows.filter((row): row is [string, number] => row[1] != null)
  if (shown.length === 0) return <StatusLine kind="empty">No figures to show yet.</StatusLine>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">{head[0]}</TableHead>
          <TableHead scope="col" className="w-48 whitespace-nowrap text-right">{head[1]}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shown.map(([label, value]) => (
          <TableRow key={label}>
            <TableCell className="break-words text-foreground">{label}</TableCell>
            <TableCell className="text-right text-foreground">{n(value)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
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
    <PageSection id={platform} heading={{ title, aside: profile }} contentClassName="mt-4 space-y-4">
      {failed ? <StatusLine kind="failed">{title} did not answer just now, so its figures are missing.</StatusLine> : children}
    </PageSection>
  )
}

/** Chess.com ratings and npm downloads as Notion tables, each with a failed line when its source is down. */
export default function PlatformFigures({ chess, npm }: Readonly<{ chess: ChessStats | null; npm: NpmStats | null }>) {
  return (
    <>
      <Platform platform="chess" title="Chess.com" failed={!chess}>
        {chess && (
          <>
            <Figures
              head={["Game", "Rating"]}
              rows={[
                ["Rapid", chess.rapid],
                ["Blitz", chess.blitz],
                ["Bullet", chess.bullet],
                ["Daily", chess.daily],
                ["Tactics, best", chess.tacticsHighest],
              ]}
            />
            {chess.totalGames > 0 && (
              <p className="text-body text-muted-foreground">
                {n(chess.wins)} wins, {n(chess.losses)} losses and {n(chess.draws)} draws across {n(chess.totalGames)} games.
              </p>
            )}
          </>
        )}
      </Platform>

      <Platform platform="npm" title="npm" failed={!npm}>
        {npm && (
          <>
            <p className="text-body text-muted-foreground">
              {n(npm.packageCount)} {npm.packageCount === 1 ? "package" : "packages"} published, with{" "}
              {n(npm.totalDownloadsLastMonth)} downloads last month in all.
            </p>
            {npm.topPackages.length > 0 && (
              <Figures
                head={["Package", "Downloads last month"]}
                rows={npm.topPackages.map((pkg): Figure => [pkg.name, pkg.downloads])}
              />
            )}
          </>
        )}
      </Platform>
    </>
  )
}
