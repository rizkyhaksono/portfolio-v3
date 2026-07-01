import { STATS_PROFILES } from "@/commons/constants/stats-profiles"

export interface LcCalendarDay {
  date: string
  count: number
}
export interface LcContestPoint {
  name: string
  rating: number
  date: string
}
export interface LcTag {
  tagName: string
  problemsSolved: number
}
export interface LcLanguage {
  languageName: string
  problemsSolved: number
}
export interface LcRecent {
  title: string
  titleSlug: string
  timestamp: number
}
export interface LcBadge {
  displayName: string
  icon: string
}

export type LeetCodeStats = {
  username: string
  ranking: number | null
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  totalSubmissions: number
  acceptanceRate: number
  contributionPoints: number
  reputation: number
  currentRating: number | null
  globalRanking: number | null
  topPercentage: number | null
  streak: number
  totalActiveDays: number
  calendar: LcCalendarDay[]
  contestHistory: LcContestPoint[]
  topTags: LcTag[]
  languages: LcLanguage[]
  recent: LcRecent[]
  badges: LcBadge[]
} | null

const QUERY = `
  query userStats($username: String!) {
    matchedUser(username: $username) {
      submitStats {
        acSubmissionNum { difficulty count submissions }
        totalSubmissionNum { difficulty count submissions }
      }
      profile { ranking reputation }
      userCalendar { streak totalActiveDays submissionCalendar }
      tagProblemCounts {
        advanced { tagName problemsSolved }
        intermediate { tagName problemsSolved }
        fundamental { tagName problemsSolved }
      }
      languageProblemCount { languageName problemsSolved }
      badges { id displayName icon }
    }
    userContestRanking(username: $username) { rating globalRanking topPercentage }
    userContestRankingHistory(username: $username) { attended rating contest { title startTime } }
    recentAcSubmissionList(username: $username, limit: 12) { title titleSlug timestamp }
  }
`

interface RawCount {
  difficulty?: string
  tagName?: string
  languageName?: string
  count?: number
  submissions?: number
  problemsSolved?: number
}

function getCount(arr: RawCount[], diff: string): number {
  return arr.find((x) => x.difficulty === diff)?.count ?? 0
}
function getSubs(arr: RawCount[], diff: string): number {
  return arr.find((x) => x.difficulty === diff)?.submissions ?? 0
}

function parseCalendar(raw: unknown): LcCalendarDay[] {
  if (typeof raw !== "string") return []
  try {
    const obj = JSON.parse(raw) as Record<string, number>
    return Object.entries(obj)
      .map(([epoch, count]) => ({ date: new Date(Number(epoch) * 1000).toISOString().slice(0, 10), count: Number(count) }))
      .sort((a, b) => a.date.localeCompare(b.date))
  } catch {
    return []
  }
}

export async function getLeetCodeStats(): Promise<LeetCodeStats> {
  const username = STATS_PROFILES.leetcode

  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" },
      body: JSON.stringify({ query: QUERY, variables: { username } }),
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null

    const json = await res.json()
    const user = json?.data?.matchedUser
    if (!user) return null

    const ac: RawCount[] = user.submitStats?.acSubmissionNum ?? []
    const total: RawCount[] = user.submitStats?.totalSubmissionNum ?? []

    const easySolved = getCount(ac, "Easy")
    const mediumSolved = getCount(ac, "Medium")
    const hardSolved = getCount(ac, "Hard")
    const totalSolved = easySolved + mediumSolved + hardSolved

    const acceptedSubmissions = getSubs(ac, "All")
    const totalSubmissions = getSubs(total, "All")
    const acceptanceRate = totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0

    const contest = json?.data?.userContestRanking ?? null
    const history: Array<{ attended: boolean; rating: number; contest?: { title?: string; startTime?: number } }> =
      json?.data?.userContestRankingHistory ?? []
    const contestHistory: LcContestPoint[] = history
      .filter((h) => h.attended)
      .map((h) => ({
        name: h.contest?.title ?? "",
        rating: Math.round(h.rating),
        date: h.contest?.startTime ? new Date(h.contest.startTime * 1000).toISOString().slice(0, 10) : "",
      }))

    const tagGroups = user.tagProblemCounts ?? {}
    const allTags: RawCount[] = [
      ...(tagGroups.advanced ?? []),
      ...(tagGroups.intermediate ?? []),
      ...(tagGroups.fundamental ?? []),
    ]
    const topTags: LcTag[] = allTags
      .map((t) => ({ tagName: t.tagName ?? "", problemsSolved: t.problemsSolved ?? 0 }))
      .filter((t) => t.problemsSolved > 0)
      .sort((a, b) => b.problemsSolved - a.problemsSolved)
      .slice(0, 12)

    const languages: LcLanguage[] = ((user.languageProblemCount ?? []) as RawCount[])
      .map((l) => ({ languageName: l.languageName ?? "", problemsSolved: l.problemsSolved ?? 0 }))
      .filter((l) => l.problemsSolved > 0)
      .sort((a, b) => b.problemsSolved - a.problemsSolved)

    const recent: LcRecent[] = ((json?.data?.recentAcSubmissionList ?? []) as Array<{ title: string; titleSlug: string; timestamp: string | number }>)
      .map((r) => ({ title: r.title, titleSlug: r.titleSlug, timestamp: Number(r.timestamp) }))

    const badges: LcBadge[] = ((user.badges ?? []) as Array<{ displayName?: string; icon?: string }>)
      .filter((b) => b.displayName)
      .map((b) => ({
        displayName: b.displayName as string,
        icon: b.icon ? (b.icon.startsWith("http") ? b.icon : `https://leetcode.com${b.icon.startsWith("/") ? "" : "/"}${b.icon}`) : "",
      }))

    return {
      username,
      ranking: user.profile?.ranking ?? null,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      totalSubmissions,
      acceptanceRate,
      contributionPoints: user.profile?.contributionPoints ?? 0,
      reputation: user.profile?.reputation ?? 0,
      currentRating: contest?.rating != null ? Math.round(contest.rating) : null,
      globalRanking: contest?.globalRanking ?? null,
      topPercentage: contest?.topPercentage != null ? Math.round(contest.topPercentage * 10) / 10 : null,
      streak: user.userCalendar?.streak ?? 0,
      totalActiveDays: user.userCalendar?.totalActiveDays ?? 0,
      calendar: parseCalendar(user.userCalendar?.submissionCalendar),
      contestHistory,
      topTags,
      languages,
      recent,
      badges,
    }
  } catch {
    return null
  }
}
