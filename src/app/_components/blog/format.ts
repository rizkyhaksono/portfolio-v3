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
  const text = plainText(html).replace(/[\s,;:–—-]*(?:\.{3}|…)\s*$/, "…")
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const end = cut.lastIndexOf(" ")
  return `${cut.slice(0, end > 0 ? end : max - 1).replace(/[\s.,;:!?–—-]+$/, "")}…`
}

export const minutesToRead = (html: string) => Math.max(1, Math.round(plainText(html).split(" ").length / 200))

/** A dateline sentence: "Published 3 March 2026. 6 minutes to read." */
export function dateline(published?: string | null, minutes?: number): string | undefined {
  const date = toDate(published)
  const parts = [
    date && `Published ${formatDay(date)}.`,
    minutes && `${minutes} ${minutes === 1 ? "minute" : "minutes"} to read.`,
  ]
  return parts.filter(Boolean).join(" ") || undefined
}
