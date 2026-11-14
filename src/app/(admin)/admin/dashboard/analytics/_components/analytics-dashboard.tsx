import { StatStrip } from "@/components/ui/stat-strip"
import { InkChart } from "@/components/ui/ink-chart"
import { StatusLine } from "@/components/ui/status-line"
import { PageHeader } from "@/components/ui/page-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ViewTabs } from "@/components/layout/admin/view-tabs"
import type { FullUmamiAnalytics } from "@/services/visitor/umami"
import type { UmamiMetric } from "@/commons/types/umami"

export const RANGES = {
  "24h": { label: "24 hours", unit: "hour", points: 24, span: "the 24 hours before" },
  "7d": { label: "7 days", unit: "day", points: 7, span: "the 7 days before" },
  "30d": { label: "30 days", unit: "day", points: 30, span: "the 30 days before" },
} as const

export type RangeId = keyof typeof RANGES

const count = (n: number) => n.toLocaleString("en")

function duration(seconds: number) {
  if (seconds < 60) return `${seconds} s`
  const minutes = Math.floor(seconds / 60)
  return minutes < 60 ? `${minutes} min ${seconds % 60} s` : `${Math.floor(minutes / 60)} h ${minutes % 60} min`
}

const change = (what: string, delta?: number) =>
  delta === undefined || delta === 0 ? `${what} unchanged` : `${what} ${delta > 0 ? "up" : "down"} ${count(Math.abs(delta))}`

/** One dimension as a Notion table: the name with a thin bar for its share of the top row, then the count. */
function MetricTable({ title, column, items, format, limit = 8 }: Readonly<{ title: string; column: string; items: UmamiMetric[]; format?: (x: string) => string; limit?: number }>) {
  const max = Math.max(1, ...items.map((item) => item.y))
  const id = `metric-${title.toLowerCase().replace(/\W+/g, "-")}`

  return (
    <section aria-labelledby={id} className="min-w-0">
      <h2 id={id} className="text-h4 text-foreground">
        {title}
      </h2>
      {items.length === 0 ? (
        <p className="mt-2 text-small text-muted-foreground">Nothing recorded in this range.</p>
      ) : (
        <Table aria-labelledby={id} className="mt-2 table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead>{column}</TableHead>
              <TableHead className="w-24 text-right">Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.slice(0, limit).map((item, i) => {
              const name = format ? format(item.x) : item.x || "Unknown"
              return (
                <TableRow key={`${item.x}-${i}`}>
                  <TableCell className="pb-2">
                    <span className="block truncate text-foreground">{name}</span>
                    <span aria-hidden className="mt-1 block h-0.5 rounded-full bg-tint">
                      <span className="block h-full rounded-full bg-muted-foreground" style={{ width: `${(item.y / max) * 100}%` }} />
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{count(item.y)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </section>
  )
}

export default function AnalyticsDashboard({ data, range }: Readonly<{ data: FullUmamiAnalytics; range: RangeId }>) {
  const s = data.stats
  const { label, span } = RANGES[range]
  const here = data.activeVisitors

  return (
    <>
      <PageHeader

        title="Analytics"
        description={here > 0 ? `${count(here)} ${here === 1 ? "person" : "people"} here in the last five minutes.` : "Nobody here in the last five minutes."}
      />

      <ViewTabs
        label="Range"
        tabs={(Object.keys(RANGES) as RangeId[]).map((id) => ({
          label: `Last ${RANGES[id].label}`,
          href: `/admin/dashboard/analytics?range=${id}`,
          current: id === range,
        }))}
      />

      {s ? (
        <>
          <StatStrip
            className="mt-6"
            items={[
              { label: "Views", value: count(s.pageviews) },
              { label: "Visitors", value: count(s.visitors) },
              { label: "Visits", value: count(s.visits) },
              { label: "Bounce rate", value: s.visits > 0 ? `${Math.round((s.bounces / s.visits) * 100)}%` : "–" },
            ]}
          />
          <p className="mt-3 text-small text-muted-foreground">
            {s.visits > 0 && `An average visit lasts ${duration(Math.round(s.totaltime / s.visits))}. `}
            {s.comparison && `${change("Views", s.comparison.pageviews)} and ${change("visitors", s.comparison.visitors).toLowerCase()} on ${span}.`}
          </p>

          <section aria-labelledby="views-and-sessions" className="mt-12">
            <h2 id="views-and-sessions" className="text-h2 text-foreground">
              Views and sessions
            </h2>
            <p className="mt-1 text-small text-muted-foreground">Views as the solid line, sessions dashed.</p>
            <InkChart className="mt-3" points={data.series.pageviews} dashed={data.series.sessions} label={`Views and sessions, last ${label}`} />
          </section>
        </>
      ) : (
        <StatusLine kind="failed" className="mt-6">
          Umami did not answer. The figures come back on the next load once it is reachable.
        </StatusLine>
      )}

      <div className="mt-12 grid gap-x-12 gap-y-10 lg:grid-cols-2">
        <MetricTable title="Events" column="Event" items={data.events} limit={50} />
        <MetricTable title="Pages" column="Path" items={data.pages} format={(path) => (path === "/" ? "Home" : path)} />
      </div>
      <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2 2xl:grid-cols-3">
        <MetricTable title="Referrers" column="Host" items={data.referrers} format={(host) => host || "Direct"} />
        <MetricTable title="Countries" column="Country" items={data.countries} />
        <MetricTable title="Regions" column="Region" items={data.regions} />
        <MetricTable title="Cities" column="City" items={data.cities} />
        <MetricTable title="Browsers" column="Browser" items={data.browsers} />
        <MetricTable title="Operating systems" column="System" items={data.os} />
        <MetricTable title="Devices" column="Device" items={data.devices} />
        <MetricTable title="Screen sizes" column="Size" items={data.screens} />
        <MetricTable title="Languages" column="Language" items={data.languages} />
      </div>
    </>
  )
}
