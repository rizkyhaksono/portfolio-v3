"use client"

import { lazy, Suspense } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Eye, Users, MousePointerClick, Activity, Clock, FileText, ExternalLink,
  Globe, MapPin, Building2, Monitor, Smartphone, Languages, MonitorSmartphone, Zap, BarChart3,
} from "lucide-react"
import type { FullUmamiAnalytics } from "@/services/visitor/umami"
import type { UmamiMetric } from "@/commons/types/umami"

const AnalyticsChart = lazy(() => import("./analytics-chart"))

const RANGES = [
  { id: "24h", label: "24h" },
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
]

function formatNumber(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K"
  return String(n)
}

function formatTime(seconds: number) {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m < 60 ? `${m}m ${s}s` : `${Math.floor(m / 60)}h ${m % 60}m`
}

function Kpi({ icon: Icon, label, value, sub, trend }: { icon: React.ElementType; label: string; value: string; sub?: string; trend?: number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="rounded-lg bg-primary/10 p-2 text-primary"><Icon className="h-5 w-5" /></div>
          {trend !== undefined && trend !== 0 && (
            <Badge variant={trend > 0 ? "default" : "secondary"} className="text-[10px]">{trend > 0 ? "+" : ""}{formatNumber(trend)}</Badge>
          )}
        </div>
        <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {sub && <p className="mt-0.5 text-[10px] text-muted-foreground/70">{sub}</p>}
      </CardContent>
    </Card>
  )
}

function MetricList({ title, icon: Icon, items, format }: { title: string; icon: React.ElementType; items: UmamiMetric[]; format?: (x: string) => string }) {
  const max = Math.max(1, ...items.map((i) => i.y))
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {items.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">No data</p>
        ) : (
          items.slice(0, 8).map((item, i) => (
            <div key={`${item.x}-${i}`} className="relative flex items-center justify-between overflow-hidden rounded-md px-2 py-1.5 text-xs">
              <div className="absolute inset-y-0 left-0 rounded-md bg-primary/10" style={{ width: `${(item.y / max) * 100}%` }} />
              <span className="relative z-10 truncate pr-2">{format ? format(item.x) : item.x || "Unknown"}</span>
              <span className="relative z-10 font-medium tabular-nums">{formatNumber(item.y)}</span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

export default function AnalyticsDashboard({ data, range, unit }: { data: FullUmamiAnalytics; range: string; unit: "hour" | "day" }) {
  const s = data.stats
  const bounceRate = s && s.visits > 0 ? Math.round((s.bounces / s.visits) * 100) : 0
  const avgTime = s && s.visits > 0 ? Math.round(s.totaltime / s.visits) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <BarChart3 className="h-6 w-6 text-primary" />
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground">Full Umami statistics for your portfolio</p>
        </div>
        <div className="flex items-center gap-2">
          {data.activeVisitors > 0 && (
            <Badge variant="default" className="animate-pulse gap-1">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              {data.activeVisitors} online
            </Badge>
          )}
          <div className="flex rounded-lg border p-0.5">
            {RANGES.map((r) => (
              <Link
                key={r.id}
                href={`/admin/dashboard/analytics?range=${r.id}`}
                className={cn("rounded-md px-3 py-1 text-xs font-medium transition-colors", range === r.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                {r.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <Kpi icon={Eye} label="Page Views" value={formatNumber(s?.pageviews ?? 0)} trend={s?.comparison?.pageviews} />
        <Kpi icon={Users} label="Visitors" value={formatNumber(s?.visitors ?? 0)} trend={s?.comparison?.visitors} />
        <Kpi icon={MousePointerClick} label="Visits" value={formatNumber(s?.visits ?? 0)} trend={s?.comparison?.visits} />
        <Kpi icon={Activity} label="Bounce Rate" value={`${bounceRate}%`} sub={s?.bounces ? `${formatNumber(s.bounces)} bounces` : undefined} />
        <Kpi icon={Clock} label="Avg. Visit" value={formatTime(avgTime)} sub="per visit" />
      </div>

      {/* Time-series chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Views &amp; Sessions over time</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">Loading chart…</div>}>
            <AnalyticsChart series={data.series} unit={unit} />
          </Suspense>
        </CardContent>
      </Card>

      {/* Dimensions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricList title="Top Pages" icon={FileText} items={data.pages} format={(p) => (p === "/" ? "Home" : p)} />
        <MetricList title="Referrers" icon={ExternalLink} items={data.referrers} format={(r) => r || "Direct / None"} />
        <MetricList title="Countries" icon={Globe} items={data.countries} />
        <MetricList title="Regions" icon={MapPin} items={data.regions} />
        <MetricList title="Cities" icon={Building2} items={data.cities} />
        <MetricList title="Browsers" icon={Globe} items={data.browsers} />
        <MetricList title="Operating Systems" icon={Monitor} items={data.os} />
        <MetricList title="Devices" icon={Smartphone} items={data.devices} />
        <MetricList title="Screen Sizes" icon={MonitorSmartphone} items={data.screens} />
        <MetricList title="Languages" icon={Languages} items={data.languages} />
        <MetricList title="Events" icon={Zap} items={data.events} />
      </div>
    </div>
  )
}
