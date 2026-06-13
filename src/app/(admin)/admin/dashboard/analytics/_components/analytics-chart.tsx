"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { UmamiTimeseries } from "@/services/visitor/umami"

export default function AnalyticsChart({ series, unit }: { series: UmamiTimeseries; unit: "hour" | "day" }) {
  const map = new Map<string, { date: string; views: number; sessions: number }>()
  series.pageviews.forEach((p) => map.set(p.x, { date: p.x, views: p.y, sessions: 0 }))
  series.sessions.forEach((s) => {
    const e = map.get(s.x) ?? { date: s.x, views: 0, sessions: 0 }
    e.sessions = s.y
    map.set(s.x, e)
  })
  const data = Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date))

  const fmt = (d: string) => {
    const date = new Date(d)
    if (Number.isNaN(date.getTime())) return d
    return unit === "hour"
      ? date.toLocaleTimeString("en-US", { hour: "numeric" })
      : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  if (data.length === 0) {
    return <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">No data for this range</div>
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="grad-views" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="grad-sessions" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
        <XAxis dataKey="date" tickFormatter={fmt} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={24} />
        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={34} allowDecimals={false} />
        <Tooltip
          contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
          labelFormatter={fmt}
        />
        <Area type="monotone" dataKey="views" name="Views" stroke="hsl(var(--primary))" fill="url(#grad-views)" strokeWidth={2} />
        <Area type="monotone" dataKey="sessions" name="Sessions" stroke="#8b5cf6" fill="url(#grad-sessions)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
