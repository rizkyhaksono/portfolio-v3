const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/** "Aug 2026 - Present" → months since year 0 of the start date (0 when unparseable, so it sorts last). */
export const startOf = (duration: string) => {
  const match = /([A-Za-z]{3})[a-z]* (\d{4})/.exec(duration)
  return match ? Number(match[2]) * 12 + Math.max(0, MONTHS.indexOf(match[1])) : 0
}
