import { STATS_PROFILES } from "@/commons/constants/stats-profiles"

export type AniListStats = {
  username: string
  animeCount: number
  mangaCount: number
  minutesWatched: number
  chaptersRead: number
  meanScore: number
  favouriteAnime: { title: string; coverImage?: string }[]
} | null

const QUERY = `
  query ($username: String) {
    User(name: $username) {
      statistics {
        anime { count meanScore minutesWatched }
        manga { count meanScore chaptersRead }
      }
      favourites {
        anime { nodes { title { romaji } coverImage { medium } } }
      }
    }
  }
`

export async function getAniListStats(): Promise<AniListStats | null> {
  const username = STATS_PROFILES.anilist

  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query: QUERY, variables: { username } }),
      next: { revalidate: 3600 },
    })

    if (!res.ok) return null

    const json = await res.json()
    const user = json?.data?.User
    if (!user) return null

    const animeStats = user.statistics?.anime
    const mangaStats = user.statistics?.manga
    const favNodes = user.favourites?.anime?.nodes ?? []

    return {
      username,
      animeCount: animeStats?.count ?? 0,
      mangaCount: mangaStats?.count ?? 0,
      minutesWatched: animeStats?.minutesWatched ?? 0,
      chaptersRead: mangaStats?.chaptersRead ?? 0,
      meanScore: animeStats?.meanScore ?? 0,
      favouriteAnime: favNodes.slice(0, 3).map((n: { title?: { romaji?: string }; coverImage?: { medium?: string } }) => ({
        title: n.title?.romaji ?? "Unknown",
        coverImage: n.coverImage?.medium,
      })),
    }
  } catch {
    return null
  }
}
