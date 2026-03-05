"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

interface LazyBarChartProps {
  chartData: { name: string; value: number }[]
  title: string
  onBarClick?: (data: any) => void
}

export default function LazyBarChart({ chartData, title, onBarClick }: LazyBarChartProps) {
  const chartConfig: ChartConfig = {
    value: {
      label: title,
    },
  }

  return (
    <ChartContainer config={chartConfig} className="h-[220px] md:h-[240px] w-full">
      <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="hsl(var(--primary))" onClick={onBarClick} cursor="pointer" />
      </BarChart>
    </ChartContainer>
  )
}
