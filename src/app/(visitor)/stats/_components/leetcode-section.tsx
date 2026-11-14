import { SquareCode } from "lucide-react"
import { PageSection } from "@/components/ui/page-section"
import { InkChart } from "@/components/ui/ink-chart"
import { InkHeatmap, type InkHeatmapWeek } from "@/components/ui/ink-heatmap"
import { InkLink } from "@/components/ui/ink-link"
import { LedgerList, LedgerRow } from "@/components/ui/ledger"
import { StatusLine } from "@/components/ui/status-line"
import { HatchBar } from "@/app/_components/contribution/wakatime-progress"
import { STATS_PROFILES, STATS_PROFILE_URLS } from "@/commons/constants/stats-profiles"
import type { LcCalendarDay, LeetCodeStats } from "@/services/visitor/leetcode"

const DAY = 86_400_000
const list = new Intl.ListFormat("en", { style: "long", type: "conjunction" })
const n = (value: number) => value.toLocaleString("en")

/** The last year of submissions as heatmap weeks: oldest Sunday first, ending today (a partial last week). */
export function calendarWeeks(calendar: LcCalendarDay[], today = new Date()): InkHeatmapWeek[] {
  const counts = new Map(calendar.map((d) => [d.date, d.count]))
  const end = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  const first = end - 363 * DAY
  const start = first - new Date(first).getUTCDay() * DAY

  const weeks: InkHeatmapWeek[] = []
  for (let t = start; t <= end; t += DAY) {
    if ((t - start) % (7 * DAY) === 0) weeks.push({ contributionDays: [] })
    const date = new Date(t).toISOString().slice(0, 10)
    weeks[weeks.length - 1].contributionDays.push({ date, contributionCount: counts.get(date) ?? 0 })
  }
  return weeks
}

const solvedOn = (seconds: number) =>
  new Date(seconds * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" })

function Summary({ stats }: Readonly<{ stats: NonNullable<LeetCodeStats> }>) {
  return (
    <>
      {n(stats.totalSolved)} problems solved: {n(stats.easySolved)} easy, {n(stats.mediumSolved)} medium and{" "}
      {n(stats.hardSolved)} hard.
      {stats.ranking != null && <> Ranked {n(stats.ranking)} on the site.</>}
      {stats.currentRating != null && (
        <>
          {" "}A contest rating of {n(stats.currentRating)}
          {stats.topPercentage != null ? <>, in the top {stats.topPercentage}% of contestants.</> : "."}
        </>
      )}
    </>
  )
}

/** LeetCode figures: submissions heatmap, contest rating, topics as share bars, recent solves; a failed line without data. */
export default function LeetCodeSection({ stats }: Readonly<{ stats: LeetCodeStats }>) {
  const profile = (
    <InkLink
      href={STATS_PROFILE_URLS.leetcode(STATS_PROFILES.leetcode)}
      external
      event="stats-profile-open"
      eventData={{ platform: "leetcode" }}
      className="inline-flex min-h-11 items-center md:min-h-0"
    >
      Profile
    </InkLink>
  )

  if (!stats) {
    return (
      <PageSection id="leetcode" heading={{ title: "LeetCode", aside: profile }}>
        <StatusLine kind="failed">LeetCode did not answer just now, so its figures are missing.</StatusLine>
      </PageSection>
    )
  }

  const weeks = calendarWeeks(stats.calendar)
  const submissions = stats.calendar.reduce((sum, day) => sum + day.count, 0)
  const contest = stats.contestHistory.filter((c) => c.date).map((c) => ({ x: c.date, y: c.rating }))
  const tags = stats.topTags.slice(0, 8)
  const maxTag = Math.max(1, ...tags.map((t) => t.problemsSolved))
  const languages = stats.languages.slice(0, 5).map((l) => `${l.languageName} (${n(l.problemsSolved)})`)
  const badges = stats.badges.map((b) => b.displayName)

  return (
    <PageSection
      id="leetcode"
      heading={{ title: "LeetCode", description: <Summary stats={stats} />, aside: profile }}
      contentClassName="mt-6 space-y-10"
    >
      <div>
        <h3 className="text-h4 text-foreground">Submissions, the last year</h3>
        {submissions > 0 ? (
          <>
            <p className="mt-1 text-small text-muted-foreground">
              A streak of {n(stats.streak)} {stats.streak === 1 ? "day" : "days"} and {n(stats.totalActiveDays)} active days in all.
            </p>
            <InkHeatmap weeks={weeks} unit={["submission", "submissions"]} className="mt-4" />
          </>
        ) : (
          <StatusLine kind="empty" className="mt-1">No submissions in the last year.</StatusLine>
        )}
      </div>

      {contest.length > 1 && (
        <div>
          <h3 className="text-h4 text-foreground">Contest rating</h3>
          <InkChart points={contest} name="Rating" label="LeetCode contest rating after each contest" />
        </div>
      )}

      {tags.length > 0 && (
        <div>
          <h3 className="text-h4 text-foreground">Solved by topic</h3>
          <ul role="list" className="mt-2">
            {tags.map((t) => (
              <HatchBar key={t.tagName} name={t.tagName} percent={(t.problemsSolved / maxTag) * 100} value={n(t.problemsSolved)} />
            ))}
          </ul>
          {languages.length > 0 && <p className="mt-3 text-small text-muted-foreground">Written in {list.format(languages)}.</p>}
        </div>
      )}

      <div>
        <h3 className="text-h4 text-foreground">Recently solved</h3>
        {stats.recent.length > 0 ? (
          <LedgerList className="mt-2">
            {stats.recent.slice(0, 6).map((r, i) => (
              <LedgerRow
                key={`${r.titleSlug}-${i}`}
                href={`https://leetcode.com/problems/${r.titleSlug}/`}
                external
                icon={<SquareCode />}
                title={r.title}
                titleAs="h4"
                meta={solvedOn(r.timestamp)}
              />
            ))}
          </LedgerList>
        ) : (
          <StatusLine kind="empty" className="mt-1">No accepted solutions to show yet.</StatusLine>
        )}
      </div>

      {badges.length > 0 && <p className="text-small text-muted-foreground">Badges earned: {list.format(badges)}.</p>}
    </PageSection>
  )
}
