import { STATS_PROFILES } from "@/commons/constants/stats-profiles"

export type SteamGame = {
  name: string
  playtime2Weeks: number
  iconUrl: string
}

export type SteamStats = {
  configured: boolean
  totalGames: number
  recentGames: SteamGame[]
} | null

export async function getSteamStats(): Promise<SteamStats | null> {
  const steamId = STATS_PROFILES.steamId
  const apiKey = STATS_PROFILES.steamApiKey

  if (!steamId || !apiKey) {
    return { configured: false, totalGames: 0, recentGames: [] }
  }

  try {
    const base = "https://api.steampowered.com"
    const params = `key=${apiKey}&steamid=${steamId}&format=json`

    const [recentRes, ownedRes] = await Promise.all([
      fetch(`${base}/IPlayerService/GetRecentlyPlayedGames/v0001/?${params}&count=4`, {
        next: { revalidate: 3600 },
      }),
      fetch(`${base}/IPlayerService/GetOwnedGames/v0001/?${params}&include_appinfo=1`, {
        next: { revalidate: 3600 },
      }),
    ])

    const recentGames: SteamGame[] = []
    if (recentRes.ok) {
      const recentData = await recentRes.json()
      const games = recentData.response?.games ?? []
      recentGames.push(
        ...games.map((g: { appid?: number; name?: string; playtime_2weeks?: number; img_icon_url?: string }) => ({
          name: g.name ?? "Unknown",
          playtime2Weeks: Math.round((g.playtime_2weeks ?? 0) / 60),
          iconUrl:
            g.appid && g.img_icon_url
              ? `https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg`
              : "",
        })),
      )
    }

    let totalGames = 0
    if (ownedRes.ok) {
      const ownedData = await ownedRes.json()
      totalGames = ownedData.response?.game_count ?? 0
    }

    return { configured: true, totalGames, recentGames }
  } catch {
    return { configured: true, totalGames: 0, recentGames: [] }
  }
}
