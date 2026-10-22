import type { ReactNode } from "react"
import { PageSection } from "@/components/ui/page-section"
import { InkHeatmap, type InkHeatmapWeek } from "@/components/ui/ink-heatmap"
import { GITHUB_ACCOUNTS } from "@/commons/constants/github"
import { fetchGithubData } from "@/services/visitor/github"
import { getReadStats } from "@/services/visitor/wakatime"
import { getDuolingoProfile } from "@/services/visitor/duolingo"
import { getMonkeyTypeData } from "@/services/visitor/monkeytype"
import { DEFERRED_SECTION } from "../deferred"
import { HatchBar, formatHours, type WakatimeLanguage } from "./wakatime-progress"

const valueOf = <T,>(result: PromiseSettledResult<T>) => (result.status === "fulfilled" ? result.value : undefined)

function Numeral({ children }: Readonly<{ children: ReactNode }>) {
  return <span className="font-display text-[1.6em] leading-none tabular-nums text-ink">{children}</span>
}

/** GitHub year, WakaTime week and two learning numerals; each part (and the section) hides without data. */
export default async function ContributionSection() {
  const [github, wakatime, duolingo, monkeytype] = await Promise.allSettled([
    fetchGithubData(GITHUB_ACCOUNTS[0].username, GITHUB_ACCOUNTS[0].token),
    getReadStats(),
    getDuolingoProfile(),
    getMonkeyTypeData(),
  ])

  const weeks: InkHeatmapWeek[] = valueOf(github)?.data?.contributionsCollection?.contributionCalendar?.weeks ?? []
  const counts = weeks.flatMap((week) => week.contributionDays.map((day) => day.contributionCount))
  const total = counts.reduce((sum, n) => sum + n, 0)
  const busiest = Math.max(0, ...counts)

  const languages: WakatimeLanguage[] = (valueOf(wakatime)?.data?.languages ?? [])
    .filter((language: WakatimeLanguage) => language.name !== "Other")
    .slice(0, 5)
  const hours = languages.reduce((sum, l) => sum + (l.hours || 0), 0)
  const minutes = languages.reduce((sum, l) => sum + (l.minutes || 0), 0)

  const streak = valueOf(duolingo)?.data?.streak ?? 0
  const wpm = valueOf(monkeytype)?.bestWpm ?? 0
  const facts = [
    streak > 0 && (
      <>
        a streak of <Numeral>{streak.toLocaleString("en")}</Numeral> days on Duolingo
      </>
    ),
    wpm > 0 && (
      <>
        <Numeral>{wpm}</Numeral> words a minute at best on MonkeyType
      </>
    ),
  ].filter(Boolean)

  if (total === 0 && languages.length === 0 && facts.length === 0) return null

  return (
    <PageSection id="activity" heading={{ title: "Activity" }} className={DEFERRED_SECTION} contentClassName="mt-6 space-y-12">
      {total > 0 && (
        <div>
          <h3 className="font-display text-h4 text-ink">GitHub, the last year</h3>
          <p className="mt-1 text-small text-ink-soft">
            {total.toLocaleString("en")} contributions; the busiest day had {busiest.toLocaleString("en")}.
          </p>
          <InkHeatmap weeks={weeks} className="mt-4" />
        </div>
      )}

      {languages.length > 0 && (
        <div>
          <h3 className="font-display text-h4 text-ink">Coding time, the last seven days</h3>
          <p className="mt-1 text-small text-ink-soft">
            {formatHours(hours, minutes)} across the {languages.length === 1 ? "language" : `${languages.length} languages`} below.
          </p>
          <ul role="list" className="mt-4 max-w-[40rem]">
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
        </div>
      )}

      {facts.length > 0 && (
        <p className="max-w-[40ch] text-body text-ink">
          Elsewhere, {facts[0]}
          {facts[1] && <> and {facts[1]}</>}.
        </p>
      )}
    </PageSection>
  )
}
