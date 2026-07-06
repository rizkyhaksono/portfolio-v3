import Link from "next/link"
import { cn } from "@/lib/utils"
import type { LeetCodeStats } from "@/services/visitor/leetcode"
import LeetCodeContestChart from "./leetcode-contest-chart"
import { Flame, CalendarDays, Trophy } from "lucide-react"

type Stats = NonNullable<LeetCodeStats>

function cellClass(count: number): string {
  if (count <= 0) return "bg-muted/40"
  if (count < 3) return "bg-green-500/30 dark:bg-green-500/25"
  if (count < 6) return "bg-green-500/55 dark:bg-green-500/45"
  if (count < 10) return "bg-green-500/75 dark:bg-green-500/70"
  return "bg-green-500 dark:bg-green-400"
}

/** Build ~53 weekly columns (Sun→Sat) covering the last year from the submission calendar. */
function buildWeeks(calendar: { date: string; count: number }[]): { date: string; count: number }[][] {
  const map = new Map(calendar.map((d) => [d.date, d.count]))
  const today = new Date()
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
  const start = new Date(end)
  start.setUTCDate(end.getUTCDate() - 363)
  start.setUTCDate(start.getUTCDate() - start.getUTCDay()) // back to Sunday

  const weeks: { date: string; count: number }[][] = []
  const cur = new Date(start)
  while (cur <= end) {
    const week: { date: string; count: number }[] = []
    for (let d = 0; d < 7; d++) {
      const iso = cur.toISOString().slice(0, 10)
      week.push({ date: iso, count: map.get(iso) ?? 0 })
      cur.setUTCDate(cur.getUTCDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border/30 bg-secondary/20 px-3 py-2">
      <span className="text-primary/70">{icon}</span>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-primary">{value}</p>
        <p className="text-[11px] text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

export default function LeetCodeSection({ stats }: { stats: Stats }) {
  const weeks = buildWeeks(stats.calendar)
  const maxTag = Math.max(1, ...stats.topTags.map((t) => t.problemsSolved))
  const totalSubmissionsInYear = stats.calendar.reduce((a, b) => a + b.count, 0)

  return (
    <div className="space-y-6 rounded-xl border border-border/30 bg-secondary/10 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Flame className="h-5 w-5 text-primary" />
        <p className="text-base font-semibold">LeetCode activity</p>
      </div>

      {/* Top metrics */}
      <div className="flex flex-wrap gap-2">
        <StatPill icon={<Flame className="h-4 w-4" />} label="Current streak" value={`${stats.streak}d`} />
        <StatPill icon={<CalendarDays className="h-4 w-4" />} label="Active days" value={stats.totalActiveDays} />
        {stats.currentRating != null && <StatPill icon={<Trophy className="h-4 w-4" />} label="Contest rating" value={stats.currentRating} />}
        {stats.topPercentage != null && <StatPill icon={<Trophy className="h-4 w-4" />} label="Top" value={`${stats.topPercentage}%`} />}
      </div>

      {/* Heatmap */}
      {weeks.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-muted-foreground">{totalSubmissionsInYear} submissions in the last year</p>
          <div className="overflow-x-auto pb-1">
            <div className="flex gap-[3px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day) => (
                    <div key={day.date} title={`${day.date}: ${day.count}`} className={cn("h-[10px] w-[10px] rounded-[2px]", cellClass(day.count))} />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span>Less</span>
            <span className="h-[10px] w-[10px] rounded-[2px] bg-muted/40" />
            <span className="h-[10px] w-[10px] rounded-[2px] bg-green-500/30 dark:bg-green-500/25" />
            <span className="h-[10px] w-[10px] rounded-[2px] bg-green-500/55 dark:bg-green-500/45" />
            <span className="h-[10px] w-[10px] rounded-[2px] bg-green-500/75 dark:bg-green-500/70" />
            <span className="h-[10px] w-[10px] rounded-[2px] bg-green-500 dark:bg-green-400" />
            <span>More</span>
          </div>
        </div>
      )}

      {/* Contest rating chart */}
      {stats.contestHistory.length >= 2 && (
        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">Contest rating</p>
          <LeetCodeContestChart data={stats.contestHistory} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Topics */}
        {stats.topTags.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Solved by topic</p>
            <div className="space-y-1.5">
              {stats.topTags.slice(0, 8).map((t) => (
                <div key={t.tagName} className="flex items-center gap-2">
                  <span className="w-28 shrink-0 truncate text-xs text-primary/80">{t.tagName}</span>
                  <div className="h-2 flex-1 overflow-hidden bg-secondary">
                    <div className="h-full bg-primary/70" style={{ width: `${(t.problemsSolved / maxTag) * 100}%` }} />
                  </div>
                  <span className="w-8 shrink-0 text-right text-xs text-muted-foreground">{t.problemsSolved}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages + recent */}
        <div className="space-y-5">
          {stats.languages.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">Languages</p>
              <div className="flex flex-wrap gap-1.5">
                {stats.languages.slice(0, 8).map((l) => (
                  <span key={l.languageName} className="rounded-md border border-border/40 bg-secondary/30 px-2.5 py-1 text-xs">
                    {l.languageName} · {l.problemsSolved}
                  </span>
                ))}
              </div>
            </div>
          )}

          {stats.recent.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">Recently solved</p>
              <div className="space-y-1">
                {stats.recent.slice(0, 6).map((r, i) => (
                  <Link
                    key={`${r.titleSlug}-${i}`}
                    href={`https://leetcode.com/problems/${r.titleSlug}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 text-xs text-primary/80 hover:text-primary"
                  >
                    <span className="truncate">{r.title}</span>
                    <span className="shrink-0 text-muted-foreground">{new Date(r.timestamp * 1000).toLocaleDateString()}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Badges */}
      {stats.badges.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">Badges</p>
          <div className="flex flex-wrap gap-3">
            {stats.badges.map((b, i) => (
              <div key={`${b.displayName}-${i}`} className="flex items-center gap-2" title={b.displayName}>
                {b.icon && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.icon} alt={b.displayName} className="h-7 w-7 object-contain" loading="lazy" />
                )}
                <span className="text-xs text-muted-foreground">{b.displayName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
