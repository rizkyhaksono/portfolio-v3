export type SkyPhase = "dawn" | "day" | "dusk" | "evening"

const MALANG_HOUR = new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Jakarta" })

/** The phase of Malang's sky (WIB, UTC+7) at `date`, whatever the visitor's own time zone. */
export function skyPhase(date: Date): SkyPhase {
  const hour = Number(MALANG_HOUR.format(date))
  if (hour >= 5 && hour < 8) return "dawn"
  if (hour >= 8 && hour < 15) return "day"
  if (hour >= 15 && hour < 18) return "dusk"
  return "evening"
}
