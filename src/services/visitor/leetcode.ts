import { STATS_PROFILES } from "@/commons/constants/stats-profiles"

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
} | null

const QUERY = `
  query userPublicProfile($username: String!) {
    matchedUser(username: $username) {
      submitStats {
        acSubmissionNum { difficulty count submissions }
        totalSubmissionNum { difficulty count submissions }
      }
      profile { ranking reputation contributionPoints }
    }
  }
`

export async function getLeetCodeStats(): Promise<LeetCodeStats | null> {
  const username = STATS_PROFILES.leetcode

  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: QUERY,
        variables: { username },
      }),
      next: { revalidate: 3600 },
    })

    if (!res.ok) return null

    const json = await res.json()
    const user = json?.data?.matchedUser
    if (!user) return null

    const ac = user.submitStats?.acSubmissionNum ?? []
    const total = user.submitStats?.totalSubmissionNum ?? []

    const getCount = (arr: { difficulty: string; count: number }[], diff: string) =>
      arr.find((x: { difficulty: string }) => x.difficulty === diff)?.count ?? 0

    const easySolved = getCount(ac, "Easy")
    const mediumSolved = getCount(ac, "Medium")
    const hardSolved = getCount(ac, "Hard")
    const totalSolved = easySolved + mediumSolved + hardSolved

    // acceptanceRate = accepted submissions / total submissions. Use the pre-aggregated
    // "All" row's `submissions` field — `count` is the number of distinct problems, not
    // submissions, so the old totalSolved/sum(count) produced a near-100% bogus rate.
    const getSubs = (arr: { difficulty: string; submissions?: number }[], diff: string) =>
      arr.find((x: { difficulty: string }) => x.difficulty === diff)?.submissions ?? 0
    const acceptedSubmissions = getSubs(ac, "All")
    const totalSubmissions = getSubs(total, "All")
    const acceptanceRate = totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0

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
    }
  } catch {
    return null
  }
}
