"use client"

import { Line, LineChart, Bar, BarChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

interface LazyWpmChartProps {
  wpmChartData: { test: string; wpm: number; raw: number }[]
  onDotClick?: (data: any) => void
}

interface LazyAccuracyChartProps {
  accuracyChartData: { test: string; accuracy: number; consistency: number }[]
  onBarClick?: (data: any) => void
}

const wpmChartConfig: ChartConfig = {
  wpm: { label: "WPM" },
  raw: { label: "Raw WPM" },
}

const accuracyChartConfig: ChartConfig = {
  accuracy: { label: "Accuracy" },
  consistency: { label: "Consistency" },
}

export function LazyWpmChart({ wpmChartData, onDotClick }: LazyWpmChartProps) {
  return (
    <ChartContainer config={wpmChartConfig} className="h-[200px] w-full">
      <LineChart data={wpmChartData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
        <XAxis dataKey="test" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="wpm" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 4 }} activeDot={{ r: 6, onClick: onDotClick }} />
        <Line type="monotone" dataKey="raw" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "hsl(var(--muted-foreground))", r: 3 }} activeDot={{ r: 5, onClick: onDotClick }} />
      </LineChart>
    </ChartContainer>
  )
}

export function LazyAccuracyChart({ accuracyChartData, onBarClick }: LazyAccuracyChartProps) {
  return (
    <ChartContainer config={accuracyChartConfig} className="h-[200px] w-full">
      <BarChart data={accuracyChartData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
        <XAxis dataKey="test" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="accuracy" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} onClick={onBarClick} cursor="pointer" />
        <Bar dataKey="consistency" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} onClick={onBarClick} cursor="pointer" />
      </BarChart>
    </ChartContainer>
  )
}
