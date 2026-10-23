import { PageSection } from "@/components/ui/page-section"
import { LedgerList, LedgerRow } from "@/components/ui/ledger"
import { InkChart } from "@/components/ui/ink-chart"
import { InkLink } from "@/components/ui/ink-link"
import { ReadingNow } from "@/components/ui/reading-now"
import { getDailyPageviews, getPathReads, getUmamiStats } from "@/services/visitor/umami"
import { mostRead } from "@/services/visitor/most-read"
import { DEFERRED_SECTION } from "../deferred"

function change(delta: number | undefined) {
  if (delta === undefined) return null
  if (delta === 0) return "The same as the 30 days before."
  return `${delta > 0 ? "Up" : "Down"} ${Math.abs(delta).toLocaleString("en")} on the 30 days before.`
}

/** Umami figures: 30-day pageviews and change, who is here now, a sparkline and the most read pieces. */
export default async function ReadersSection() {
  const [statsResult, dailyResult, readsResult] = await Promise.allSettled([getUmamiStats(), getDailyPageviews(30), getPathReads()])
  const stats = statsResult.status === "fulfilled" ? statsResult.value : null
  const daily = dailyResult.status === "fulfilled" ? dailyResult.value.pageviews : []
  const views = stats?.pageviews ?? 0
  if (views === 0) return null

  const top = readsResult.status === "fulfilled" ? await mostRead(readsResult.value) : []

  return (
    <PageSection id="readers" heading={{ title: "Readers" }} className={DEFERRED_SECTION} contentClassName="mt-6">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:items-end md:gap-12">
        <div>
          <p className="speckle font-display text-numeral tabular-nums text-ink">{views.toLocaleString("en")}</p>
          <p className="mt-2 text-small text-ink-soft">
            Pages read in the last 30 days. {change(stats?.comparison?.pageviews)}
          </p>
          <ReadingNow className="mt-1" />
        </div>
        {daily.length > 1 && <InkChart points={daily} compact height={72} label="Daily pageviews, last 30 days" />}
      </div>

      {top.length > 0 && (
        <>
          <h3 className="mt-12 font-display text-h3 text-ink">Most read</h3>
          <LedgerList className="mt-3">
            {top.map(({ path, readers, title }) => (
              <LedgerRow key={path} href={path} title={title} titleAs="h4" meta={`${readers.toLocaleString("en")} readers`} />
            ))}
          </LedgerList>
        </>
      )}

      <p className="mt-6 text-body">
        <InkLink href="/stats" className="inline-flex min-h-11 items-center md:min-h-0">More figures on the stats page</InkLink>
      </p>
    </PageSection>
  )
}
