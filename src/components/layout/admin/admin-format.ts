const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
const dateline = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" })

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
]

/** "3 hours ago", "yesterday", "just now"; empty for an unreadable date. */
export function timeAgo(iso: string, now = Date.now()) {
  const seconds = (new Date(iso).getTime() - now) / 1000
  if (Number.isNaN(seconds)) return ""
  const unit = UNITS.find(([, size]) => Math.abs(seconds) >= size)
  return unit ? rtf.format(Math.round(seconds / unit[1]), unit[0]) : "just now"
}

/** "19 October 2026" in Malang time; empty for a missing or unreadable date. */
export function formatDay(iso?: string | null) {
  const date = iso ? new Date(iso) : null
  return date && !Number.isNaN(date.getTime()) ? dateline.format(date) : ""
}

const ENTITIES: Record<string, string> = { nbsp: " ", lt: "<", gt: ">", quot: '"', "#39": "'", amp: "&" }

/** Editor HTML as one line of plain text for ledger cells. React escapes the result, so this is display only. */
export function stripHtml(html?: string | null) {
  return (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(nbsp|lt|gt|quot|#39|amp);/g, (_, name: string) => ENTITIES[name])
    .replace(/\s+/g, " ")
    .trim()
}

export { httpUrl } from "@/lib/utils"
