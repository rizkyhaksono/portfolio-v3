import { STATS_PROFILES } from "@/commons/constants/stats-profiles"

export type LetterboxdFilm = {
  title: string
  rating: number | null
  watchedDate: string
  posterUrl: string | null
}

export type LetterboxdStats = {
  username: string
  films: LetterboxdFilm[]
} | null

function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i")
  const m = xml.match(re)
  return m ? m[1].trim() : ""
}

function extractPoster(description: string): string | null {
  const m = description.match(/src="([^"]+)"/i)
  return m ? m[1] : null
}

function parseRssItems(xml: string): LetterboxdFilm[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/gi) ?? []

  return items.slice(0, 20).map((itemXml) => {
    const title = extractTag(itemXml, "title").replace(/<!\[CDATA\[|\]\]>/g, "")
    const ratingStr = extractTag(itemXml, "letterboxd:memberRating")
    const rating = ratingStr ? parseFloat(ratingStr) : null
    const pubDate = extractTag(itemXml, "pubDate")
    const description = extractTag(itemXml, "description")

    return {
      title,
      rating: Number.isFinite(rating) ? rating : null,
      watchedDate: pubDate ? new Date(pubDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
      posterUrl: extractPoster(description),
    }
  })
}

export async function getLetterboxdStats(): Promise<LetterboxdStats | null> {
  const username = STATS_PROFILES.letterboxd

  try {
    const res = await fetch(`https://letterboxd.com/${username}/rss/`, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "portfolio-v3-stats/1.0" },
    })

    if (!res.ok) return null

    const xml = await res.text()
    const films = parseRssItems(xml)

    return { username, films }
  } catch {
    return null
  }
}
