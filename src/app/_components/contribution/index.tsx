import { PageSection } from "@/components/ui/page-section"
import { InkHeatmap, type InkHeatmapWeek } from "@/components/ui/ink-heatmap"
import { StatusLine } from "@/components/ui/status-line"
import { GITHUB_ACCOUNTS } from "@/commons/constants/github"
import { fetchGithubData } from "@/services/visitor/github"
import { getReadStats } from "@/services/visitor/wakatime"
import { getDuolingoProfile } from "@/services/visitor/duolingo"
import { getMonkeyTypeData } from "@/services/visitor/monkeytype"
import { DEFERRED_SECTION } from "../deferred"
import { HatchBar, formatHours, type WakatimeLanguage } from "./wakatime-progress"

const valueOf = <T,>(result: PromiseSettledResult<T>) => (result.status === "fulfilled" ? result.value : undefined)

/** The Coding section on /stats: GitHub year, WakaTime week and a line on Duolingo and MonkeyType, each with its own honest state. */
export default async function ContributionSection() {
  const [github, wakatime, duolingo, monkeytype] = await Promise.allSettled([
    fetchGithubData(GITHUB_ACCOUNTS[0].username, GITHUB_ACCOUNTS[0].token),
    getReadStats(),
    getDuolingoProfile(),
    getMonkeyTypeData(),
  ])

  const calendar = valueOf(github)?.data?.contributionsCollection?.contributionCalendar
  const weeks: InkHeatmapWeek[] = calendar?.weeks ?? []
  const counts = weeks.flatMap((week) => week.contributionDays.map((day) => day.contributionCount))
  const total = counts.reduce((sum, n) => sum + n, 0)
  const busiest = Math.max(0, ...counts)

  const waka = valueOf(wakatime)
  const wakaFailed = !waka || waka.status >= 400
  const languages: WakatimeLanguage[] = (waka?.data?.languages ?? [])
    .filter((language: WakatimeLanguage) => language.name !== "Other")
    .slice(0, 5)
  const hours = languages.reduce((sum, l) => sum + (l.hours || 0), 0)
  const minutes = languages.reduce((sum, l) => sum + (l.minutes || 0), 0)

  const streak = valueOf(duolingo)?.data?.streak ?? 0
  const wpm = valueOf(monkeytype)?.bestWpm ?? 0
  const facts = [
    streak > 0 && `a streak of ${streak.toLocaleString("en")} days on Duolingo`,
    wpm > 0 && `${wpm} words a minute at best on MonkeyType`,
  ].filter(Boolean)

  return (
    <PageSection id="coding" heading={{ title: "Coding" }} className={DEFERRED_SECTION} contentClassName="mt-4 space-y-10">
      <div>
        <h3 className="text-h4 text-foreground">GitHub, the last year</h3>
        {!calendar ? (
          <StatusLine kind="failed" className="mt-3">GitHub did not answer just now, so the contribution calendar is missing.</StatusLine>
        ) : total === 0 ? (
          <StatusLine kind="empty" className="mt-1">No contributions in the last year.</StatusLine>
        ) : (
          <>
            <p className="mt-1 text-small text-muted-foreground">
              {total.toLocaleString("en")} contributions; the busiest day had {busiest.toLocaleString("en")}.
            </p>
            <InkHeatmap weeks={weeks} className="mt-4" />
          </>
        )}
      </div>

      <div>
        <h3 className="text-h4 text-foreground">Coding time, the last seven days</h3>
        {wakaFailed ? (
          <StatusLine kind="failed" className="mt-3">WakaTime did not answer just now, so the coding time is missing.</StatusLine>
        ) : languages.length === 0 ? (
          <StatusLine kind="empty" className="mt-1">No coding time logged in the last seven days.</StatusLine>
        ) : (
          <>
            <p className="mt-1 text-small text-muted-foreground">
              {formatHours(hours, minutes)} across the {languages.length === 1 ? "language" : `${languages.length} languages`} below.
            </p>
            <ul role="list" className="mt-2">
              {languages.map(({ name, hours, minutes, percent = 0 }) => (
                <HatchBar
                  key={name}
                  name={name}
                  percent={percent}
                  value={
                    <>
                      {formatHours(hours, minutes)}
                      <span className="sr-only">, {Math.round(percent)}% of the week</span>
                    </>
                  }
                />
              ))}
            </ul>
          </>
        )}
      </div>

      {facts.length > 0 && (
        <p className="text-body text-muted-foreground">
          Elsewhere, {facts[0]}
          {facts[1] && <> and {facts[1]}</>}.
        </p>
      )}
    </PageSection>
  )
}
