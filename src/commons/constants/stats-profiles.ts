export const STATS_PROFILES = {
  leetcode: process.env.NEXT_PUBLIC_LEETCODE_USERNAME ?? "rizkyhaksono",
  anilist: process.env.NEXT_PUBLIC_ANILIST_USERNAME ?? "rizkyhaksono",
  chess: process.env.NEXT_PUBLIC_CHESS_USERNAME ?? "rizkyhaksono",
  npm: process.env.NEXT_PUBLIC_NPM_USERNAME ?? "rizkyhaksono",
  letterboxd: process.env.NEXT_PUBLIC_LETTERBOXD_USERNAME ?? "rizkyhaksono",
  steamId: process.env.STEAM_ID ?? "",
  steamApiKey: process.env.STEAM_API_KEY ?? "",
} as const

export const STATS_PROFILE_URLS = {
  leetcode: (u: string) => `https://leetcode.com/u/${u}/`,
  anilist: (u: string) => `https://anilist.co/user/${u}/`,
  chess: (u: string) => `https://www.chess.com/member/${u}`,
  npm: (u: string) => `https://www.npmjs.com/~${u}`,
  letterboxd: (u: string) => `https://letterboxd.com/${u}/`,
  steam: (id: string) => (id ? `https://steamcommunity.com/profiles/${id}` : "#"),
} as const
