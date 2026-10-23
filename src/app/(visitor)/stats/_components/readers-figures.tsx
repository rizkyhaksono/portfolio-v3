import { PageSection } from "@/components/ui/page-section"
import { LedgerList, LedgerRow } from "@/components/ui/ledger"
import { InkChart } from "@/components/ui/ink-chart"
import { ReadingNow } from "@/components/ui/reading-now"
import type { UmamiStats } from "@/commons/types/umami"
import type { UmamiTimeseries } from "@/services/visitor/umami"
import { mostRead } from "@/services/visitor/most-read"
import { cn } from "@/lib/utils"

function change(delta: number | undefined) {
  if (delta === undefined) return ""
  if (delta === 0) return " The same as the 30 days before."
  return ` ${delta > 0 ? "Up" : "Down"} ${Math.abs(delta).toLocaleString("en")} on the 30 days before.`
}

interface ReadersFiguresProps {
  stats: UmamiStats | null
  daily: UmamiTimeseries
  reads: Map<string, number>
}

/** Umami: the 30-day chart (sticky beside the list from lg), who is here now, and the most read pieces. */
export default async function ReadersFigures({ stats, daily, reads }: Readonly<ReadersFiguresProps>) {
  if (!stats?.pageviews || daily.pageviews.length < 2) return null

  const top = await mostRead(reads)

  return (
    <PageSection
      id="readers"
      heading={{ title: "Readers" }}
      contentClassName={cn("mt-6 grid gap-12", top.length > 0 && "lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]")}
    >
      <div className="lg:sticky lg:top-[calc(var(--head-h)+1rem)] lg:self-start">
        <p className="text-small text-ink-soft">
          Pages read each day over the last 30 days, with sessions dashed.{change(stats.comparison?.pageviews)}
        </p>
        <ReadingNow className="mt-1" />
        <InkChart
          className="mt-4"
          points={daily.pageviews}
          dashed={daily.sessions}
          name="Pages read"
          label="Pages read and sessions each day, the last 30 days"
        />
      </div>

      {top.length > 0 && (
        <div>
          <h3 className="font-display text-h3 text-ink">Most read</h3>
          <LedgerList className="mt-3">
            {top.map(({ path, readers, title }) => (
              <LedgerRow key={path} href={path} title={title} titleAs="h4" meta={`${readers.toLocaleString("en")} readers`} />
            ))}
          </LedgerList>
        </div>
      )}
    </PageSection>
  )
}
