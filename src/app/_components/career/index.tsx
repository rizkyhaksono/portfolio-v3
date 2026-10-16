import { PageSection } from "@/components/ui/page-section"
import { LedgerList, LedgerRow } from "@/components/ui/ledger"
import { getAllCarrer } from "@/services/visitor/career"
import { getAllEducation } from "@/services/visitor/education"

interface Entry {
  id: string
  title: string
  subtitle: string
  duration: string
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/** "Aug 2026 - Present" → months since year 0 of the start date (0 when unparseable). */
const startOf = (duration: string) => {
  const match = /([A-Za-z]{3})[a-z]* (\d{4})/.exec(duration)
  return match ? Number(match[2]) * 12 + Math.max(0, MONTHS.indexOf(match[1])) : 0
}

const fulfilled = <T,>(result: PromiseSettledResult<T[] | null>) =>
  result.status === "fulfilled" ? (result.value ?? []) : []

/** Work and education in one ledger, newest first, grouped under a sticky start year. */
export default async function CareerSection() {
  const [career, education] = await Promise.allSettled([getAllCarrer(), getAllEducation()])
  const entries: Entry[] = [...fulfilled(career), ...fulfilled(education)].sort((a, b) => startOf(b.duration) - startOf(a.duration))
  if (entries.length === 0) return null

  const years = new Map<string, Entry[]>()
  for (const entry of entries) {
    const year = String(Math.floor(startOf(entry.duration) / 12) || "Undated")
    years.set(year, [...(years.get(year) ?? []), entry])
  }

  return (
    <PageSection id="career" heading={{ title: "Career" }} contentClassName="mt-6">
      {[...years].map(([year, rows]) => (
        <LedgerList key={year} marker={year}>
          {rows.map((row) => (
            <LedgerRow key={row.id} title={row.title} meta={row.duration.replace(" - ", " – ")}>
              {row.subtitle.trim()}
            </LedgerRow>
          ))}
        </LedgerList>
      ))}
    </PageSection>
  )
}
