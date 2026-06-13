export const STATS_PROFILES = {
  leetcode: process.env.NEXT_PUBLIC_LEETCODE_USERNAME ?? "rizkyhaksono",
  chess: process.env.NEXT_PUBLIC_CHESS_USERNAME ?? "rizkyhaksono",
  npm: process.env.NEXT_PUBLIC_NPM_USERNAME ?? "rizkyhaksono",
  letterboxd: process.env.NEXT_PUBLIC_LETTERBOXD_USERNAME ?? "rizkyhaksono",
} as const

export const STATS_PROFILE_URLS = {
  leetcode: (u: string) => `https://leetcode.com/u/${u}/`,
  chess: (u: string) => `https://www.chess.com/member/${u}`,
  npm: (u: string) => `https://www.npmjs.com/~${u}`,
  letterboxd: (u: string) => `https://letterboxd.com/${u}/`,
} as const
