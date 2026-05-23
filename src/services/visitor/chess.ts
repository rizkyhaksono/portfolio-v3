import { STATS_PROFILES } from "@/commons/constants/stats-profiles"

export type ChessStats = {
  username: string
  rapid: number | null
  blitz: number | null
  bullet: number | null
  daily: number | null
  tacticsHighest: number | null
  totalGames: number
  wins: number
  losses: number
  draws: number
} | null

type ChessRecord = { win?: number; loss?: number; draw?: number }

function sumRecord(records: ChessRecord[]): { wins: number; losses: number; draws: number } {
  return records.reduce(
    (acc, r) => ({
      wins: acc.wins + (r.win ?? 0),
      losses: acc.losses + (r.loss ?? 0),
      draws: acc.draws + (r.draw ?? 0),
    }),
    { wins: 0, losses: 0, draws: 0 },
  )
}

export async function getChessStats(): Promise<ChessStats | null> {
  const username = STATS_PROFILES.chess

  try {
    const res = await fetch(`https://api.chess.com/pub/player/${username}/stats`, {
      next: { revalidate: 1800 },
    })

    if (!res.ok) return null

    const data = await res.json()

    const records: ChessRecord[] = []
    for (const mode of ["chess_rapid", "chess_blitz", "chess_bullet", "chess_daily"]) {
      if (data[mode]?.record) records.push(data[mode].record)
    }

    const { wins, losses, draws } = sumRecord(records)

    return {
      username,
      rapid: data.chess_rapid?.last?.rating ?? null,
      blitz: data.chess_blitz?.last?.rating ?? null,
      bullet: data.chess_bullet?.last?.rating ?? null,
      daily: data.chess_daily?.last?.rating ?? null,
      tacticsHighest: data.tactics?.highest?.rating ?? null,
      totalGames: wins + losses + draws,
      wins,
      losses,
      draws,
    }
  } catch {
    return null
  }
}
