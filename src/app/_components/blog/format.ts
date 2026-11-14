import { plainText } from "@/app/(visitor)/project/safe-html"

const TIME_ZONE = "Asia/Jakarta"
const DAY = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: TIME_ZONE })
const DAY_MONTH = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", timeZone: TIME_ZONE })
const YEAR = new Intl.DateTimeFormat("en-GB", { year: "numeric", timeZone: TIME_ZONE })

export function toDate(value?: string | null): Date | null {
  const date = value ? new Date(value) : null
  return date && !Number.isNaN(date.getTime()) ? date : null
}

/** "3 March 2026" */
export const formatDay = (date: Date) => DAY.format(date)
/** "3 March", for rows under a year marker. */
export const formatDayMonth = (date: Date) => DAY_MONTH.format(date)
export const yearOf = (date: Date) => YEAR.format(date)

/** Plain text cut at a word boundary, at most `max` characters including the ellipsis. */
export function excerpt(html: string, max = 160): string {
  // DEV sends some descriptions already cut, as "design,..." or "promise:...": keep one clean ellipsis.
  const text = plainText(html).replace(/[\s,;:–—-]*(?:\.{3}|…)\s*$/u, "…")
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const end = cut.lastIndexOf(" ")
  return `${cut.slice(0, end > 0 ? end : max - 1).replace(/[\s.,;:!?–—-]+$/u, "")}…`
}

export const minutesToRead = (html: string) => Math.max(1, Math.round(plainText(html).split(" ").length / 200))

/** "6 minutes", for the Reading time property. */
export const minutesLabel = (minutes: number) => `${minutes} ${minutes === 1 ? "minute" : "minutes"}`
