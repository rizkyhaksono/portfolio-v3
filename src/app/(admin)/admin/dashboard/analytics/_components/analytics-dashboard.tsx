import Link from "next/link"
import { StatStrip } from "@/components/ui/stat-strip"
import { InkChart } from "@/components/ui/ink-chart"
import { StatusLine } from "@/components/ui/status-line"
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

/** One dimension as a ruled list: name, count, and a hatched bar for its share of the top row. */
function MetricLedger({ title, items, format, limit = 8 }: Readonly<{ title: string; items: UmamiMetric[]; format?: (x: string) => string; limit?: number }>) {
  const max = Math.max(1, ...items.map((item) => item.y))

  return (
    <section className="min-w-0">
      <h2 className="font-display text-h4 text-ink">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-2 border-t border-rule pt-2 text-small text-ink-soft">Nothing recorded in this range.</p>
      ) : (
        <ul className="mt-2 border-t border-ink">
          {items.slice(0, limit).map((item, i) => (
            <li key={`${item.x}-${i}`} className="border-b border-rule py-2">
              <div className="flex items-baseline justify-between gap-4 text-small">
                <span className="min-w-0 truncate text-ink">{format ? format(item.x) : item.x || "Unknown"}</span>
                <span className="shrink-0 tabular-nums text-ink-soft">{count(item.y)}</span>
              </div>
              <span aria-hidden className="mt-1 block h-1.5">
                <span className="bg-hatch block h-full border-r border-ink" style={{ width: `${(item.y / max) * 100}%` }} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default function AnalyticsDashboard({ data, range }: Readonly<{ data: FullUmamiAnalytics; range: RangeId }>) {
  const s = data.stats
  const { label, span } = RANGES[range]
  const here = data.activeVisitors

  return (
    <div className="w-full max-w-[60rem]">
      <nav aria-label="Range" className="flex flex-wrap gap-x-6 border-b border-rule">
        {(Object.keys(RANGES) as RangeId[]).map((id) => (
          <Link
            key={id}
            href={`/admin/dashboard/analytics?range=${id}`}
            aria-current={id === range ? "page" : undefined}
            className="-mb-px inline-flex min-h-10 items-center border-b-2 border-transparent pb-1.5 pt-2 text-[15px] font-semibold text-ink-soft transition-colors hover:text-ink aria-[current=page]:border-ink aria-[current=page]:text-ink [@media(pointer:coarse)]:min-h-11"
          >
            Last {RANGES[id].label}
          </Link>
        ))}
      </nav>

      <p className="mt-4 font-display text-caption tabular-nums text-ink-soft">
        {here > 0 ? `${count(here)} ${here === 1 ? "person" : "people"} here in the last five minutes.` : "Nobody here in the last five minutes."}
      </p>

      {s ? (
        <>
          <StatStrip
            className="mt-4"
            items={[
              { label: "Views", value: count(s.pageviews) },
              { label: "Visitors", value: count(s.visitors) },
              { label: "Visits", value: count(s.visits) },
              { label: "Bounce rate", value: s.visits > 0 ? `${Math.round((s.bounces / s.visits) * 100)}%` : "–" },
            ]}
          />
          <p className="mt-3 text-small text-ink-soft">
            {s.visits > 0 && `An average visit lasts ${duration(Math.round(s.totaltime / s.visits))}. `}
            {s.comparison && `${change("Views", s.comparison.pageviews)} and ${change("visitors", s.comparison.visitors).toLowerCase()} on ${span}.`}
          </p>

          <section className="mt-12">
            <h2 className="font-display text-h3 text-ink">Views and sessions</h2>
            <p className="mt-1 font-display text-caption text-ink-soft">Views as the hatched line, sessions dashed.</p>
            <InkChart
              className="mt-2"
              points={data.series.pageviews}
              dashed={data.series.sessions}
              label={`Views and sessions, last ${label}`}
            />
          </section>
        </>
      ) : (
        <StatusLine kind="failed" className="mt-6">
          Umami did not answer. The figures come back on the next load once it is reachable.
        </StatusLine>
      )}

      <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
        <MetricLedger title="Events" items={data.events} limit={50} />
        <MetricLedger title="Pages" items={data.pages} format={(path) => (path === "/" ? "Home" : path)} />
        <MetricLedger title="Referrers" items={data.referrers} format={(host) => host || "Direct"} />
        <MetricLedger title="Countries" items={data.countries} />
        <MetricLedger title="Regions" items={data.regions} />
        <MetricLedger title="Cities" items={data.cities} />
        <MetricLedger title="Browsers" items={data.browsers} />
        <MetricLedger title="Operating systems" items={data.os} />
        <MetricLedger title="Devices" items={data.devices} />
        <MetricLedger title="Screen sizes" items={data.screens} />
        <MetricLedger title="Languages" items={data.languages} />
      </div>
    </div>
  )
}
