"use client"

import { LineChart, Line, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts"
import type { LcContestPoint } from "@/services/visitor/leetcode"

export default function LeetCodeContestChart({ data }: { data: LcContestPoint[] }) {
  if (data.length < 2) return null
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d: string) => d.slice(2, 7)} minTickGap={24} stroke="hsl(var(--muted-foreground))" />
        <YAxis tick={{ fontSize: 10 }} width={40} domain={["dataMin - 50", "dataMax + 50"]} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
        <Tooltip
          contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "hsl(var(--muted-foreground))" }}
          formatter={(value: number | string) => [value, "Rating"]}
        />
        <Line type="monotone" dataKey="rating" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
