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
  favorites: LetterboxdFilm[]
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
    const watched = pubDate ? new Date(pubDate) : null
    const watchedDate = watched && !Number.isNaN(watched.getTime())
      ? watched.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : ""

    return {
      title,
      rating: Number.isFinite(rating) ? rating : null,
      watchedDate,
      posterUrl: extractPoster(description),
    }
  })
}

const LB_HEADERS = { "User-Agent": "Mozilla/5.0 (compatible; portfolio-v3-stats/1.0)" }

/** One film's poster + display title from its Letterboxd page's Open Graph tags. */
async function fetchFilmMeta(slug: string): Promise<LetterboxdFilm | null> {
  try {
    const res = await fetch(`https://letterboxd.com/film/${slug}/`, {
      next: { revalidate: 86400 },
      headers: LB_HEADERS,
    })
    if (!res.ok) return null
    const html = await res.text()
    const poster = /<meta property="og:image" content="([^"]+)"/i.exec(html)?.[1] ?? null
    const ogTitle = /<meta property="og:title" content="([^"]+)"/i.exec(html)?.[1]
    const title = (ogTitle ?? slug.replace(/-/g, " ")).replace(/&#0?39;|&#x27;/g, "'").replace(/&amp;/g, "&")
    return { title, rating: null, watchedDate: "", posterUrl: poster }
  } catch {
    return null
  }
}

/** The 4 curated "favorite films" shown on the profile — the real "top films". */
async function getFavorites(username: string): Promise<LetterboxdFilm[]> {
  try {
    const res = await fetch(`https://letterboxd.com/${username}/`, {
      next: { revalidate: 86400 },
      headers: LB_HEADERS,
    })
    if (!res.ok) return []
    const html = await res.text()
    const favBlock = html.split('id="favourites"')[1] ?? ""
    const slugs = [...favBlock.matchAll(/data-item-slug="([^"]+)"/g)].slice(0, 4).map((m) => m[1])
    const films = await Promise.all(slugs.map(fetchFilmMeta))
    return films.filter((f): f is LetterboxdFilm => f !== null)
  } catch {
    return []
  }
}

export async function getLetterboxdStats(): Promise<LetterboxdStats | null> {
  const username = STATS_PROFILES.letterboxd

  try {
    const [rssRes, favorites] = await Promise.all([
      fetch(`https://letterboxd.com/${username}/rss/`, {
        next: { revalidate: 3600 },
        headers: LB_HEADERS,
      }),
      getFavorites(username),
    ])

    if (!rssRes.ok) return favorites.length ? { username, films: [], favorites } : null

    const xml = await rssRes.text()
    const films = parseRssItems(xml)

    return { username, films, favorites }
  } catch {
    return null
  }
}
