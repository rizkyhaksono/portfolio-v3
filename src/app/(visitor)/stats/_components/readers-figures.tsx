import { PageSection } from "@/components/ui/page-section"
import { LedgerList, LedgerRow } from "@/components/ui/ledger"
import { InkChart } from "@/components/ui/ink-chart"
import { ReadingNow } from "@/components/ui/reading-now"
import { StatusLine } from "@/components/ui/status-line"
import type { UmamiStats } from "@/commons/types/umami"
import type { UmamiTimeseries } from "@/services/visitor/umami"
import { mostRead } from "@/services/visitor/most-read"

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

/** Umami: a 30-day sparkline, who is here now, and the most read pieces as rows. */
export default async function ReadersFigures({ stats, daily, reads }: Readonly<ReadersFiguresProps>) {
  const top = stats?.pageviews ? await mostRead(reads) : []

  return (
    <PageSection id="readers" heading={{ title: "Readers" }} contentClassName="mt-4">
      {!stats ? (
        <StatusLine kind="failed">The reader figures could not be loaded just now. Try again in a few minutes.</StatusLine>
      ) : !stats.pageviews ? (
        <StatusLine kind="empty">No pages read in the last 30 days.</StatusLine>
      ) : (
        <>
          <p className="text-small text-muted-foreground">
            Pages read each day over the last 30 days, with sessions dashed.{change(stats.comparison?.pageviews)}
          </p>
          <ReadingNow className="mt-1" />
          {daily.pageviews.length > 1 && (
            <InkChart
              className="mt-4"
              compact
              height={72}
              points={daily.pageviews}
              dashed={daily.sessions}
              name="Pages read"
              label="Pages read and sessions each day, the last 30 days"
            />
          )}

          <h3 className="mt-10 text-h4 text-foreground">Most read</h3>
          {top.length > 0 ? (
            <LedgerList className="mt-2">
              {top.map(({ path, readers, title }) => (
                <LedgerRow key={path} href={path} title={title} titleAs="h4" meta={`${readers.toLocaleString("en")} readers`} />
              ))}
            </LedgerList>
          ) : (
            <StatusLine kind="empty" className="mt-1">No post or project has reached ten readers in the last 30 days.</StatusLine>
          )}
        </>
      )}
    </PageSection>
  )
}
