"use client"

import { useState } from "react"
import BlurFade from "@/components/magicui/blur-fade"
import Typography from "@/components/ui/typography"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Users, MousePointerClick, Globe, Monitor, FileText, Keyboard, Target, Timer, Activity, MapPin, Smartphone } from "lucide-react"
import { UmamiAnalyticsData } from "@/commons/types/umami"
import { MonkeyTypeUserData } from "@/commons/types/monkeytype"
import { cn } from "@/lib/utils"
import { Bar, BarChart, XAxis, YAxis, Cell, Pie, PieChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig, ChartLegend, ChartLegendContent } from "@/components/ui/chart"

interface SiteStatsClientProps {
  analytics: UmamiAnalyticsData
  typingStats: MonkeyTypeUserData
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

function StatCard({ icon: Icon, label, value, subValue, className }: Readonly<{ icon: React.ElementType; label: string; value: string | number; subValue?: string; className?: string }>) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-2xl font-bold truncate">{value}</p>
            <p className="text-xs text-muted-foreground truncate">{label}</p>
            {subValue && <p className="text-xs text-muted-foreground/70 truncate">{subValue}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MetricsList({ title, icon: Icon, items, labelFormatter }: { title: string; icon: React.ElementType; items: { x: string; y: number }[]; labelFormatter?: (label: string) => string }) {
  if (!items || items.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {items.slice(0, 8).map((item, idx) => (
            <div key={`${item.x}-${item.y}-${idx}`} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground truncate max-w-[70%]" title={item.x}>
                {labelFormatter ? labelFormatter(item.x) : item.x || "Direct"}
              </span>
              <Badge variant="secondary" className="text-xs font-mono">
                {formatNumber(item.y)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const CHART_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"]

function BarChartMetrics({ title, icon: Icon, items, labelFormatter }: { title: string; icon: React.ElementType; items: { x: string; y: number }[]; labelFormatter?: (label: string) => string }) {
  if (!items || items.length === 0) return null

  const chartData = items.slice(0, 8).map((item, idx) => ({
    name: labelFormatter ? labelFormatter(item.x) : item.x || "Unknown",
    value: item.y,
    fill: CHART_COLORS[idx % CHART_COLORS.length],
  }))

  const chartConfig: ChartConfig = {
    value: {
      label: title,
    },
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function PieChartMetrics({ title, icon: Icon, items, labelFormatter }: { title: string; icon: React.ElementType; items: { x: string; y: number }[]; labelFormatter?: (label: string) => string }) {
  if (!items || items.length === 0) return null

  const chartData = items.slice(0, 6).map((item, idx) => ({
    name: labelFormatter ? labelFormatter(item.x) : item.x || "Unknown",
    value: item.y,
    fill: CHART_COLORS[idx % CHART_COLORS.length],
  }))

  const chartConfig: ChartConfig = chartData.reduce((acc, item, idx) => {
    acc[item.name] = {
      label: item.name,
      color: CHART_COLORS[idx % CHART_COLORS.length],
    }
    return acc
  }, {} as ChartConfig)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} />
            <ChartLegend content={<ChartLegendContent />} className="flex flex-wrap gap-2 text-xs" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default function SiteStatsClient({ analytics, typingStats }: Readonly<SiteStatsClientProps>) {
  const bounceRate = analytics.stats ? Math.round((analytics.stats.bounces / analytics.stats.visits) * 100) : 0
  const [environmentTab, setEnvironmentTab] = useState("browsers")

  return (
    <BlurFade delay={0.25} inView>
      <div className="mt-10">
        <div className="flex items-center gap-2 mb-6">
          <Typography.H4>Site Statistics</Typography.H4>
          {analytics.activeVisitors > 0 && (
            <Badge variant="default" className="flex items-center gap-1 animate-pulse">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              {analytics.activeVisitors} online
            </Badge>
          )}
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard icon={Eye} label="Page Views" value={formatNumber(analytics.stats?.pageviews || 0)} subValue="Last 30 days" />
          <StatCard icon={Users} label="Unique Visitors" value={formatNumber(analytics.stats?.visitors || 0)} subValue="Last 30 days" />
          <StatCard icon={MousePointerClick} label="Total Visits" value={formatNumber(analytics.stats?.visits || 0)} />
          <StatCard icon={Activity} label="Bounce Rate" value={`${bounceRate}%`} />
        </div>

        {/* Typing Stats */}
        {(typingStats.bestWpm > 0 || typingStats.stats) && (
          <div className="mb-6">
            <Typography.P className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              MonkeyType Performance
            </Typography.P>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon={Keyboard} label="Best WPM" value={typingStats.bestWpm || "N/A"} subValue="60s test" />
              <StatCard icon={Target} label="Best Accuracy" value={typingStats.bestAccuracy ? `${typingStats.bestAccuracy}%` : "N/A"} />
              <StatCard icon={MousePointerClick} label="Tests Completed" value={formatNumber(typingStats.stats?.completedTests || 0)} />
              <StatCard icon={Timer} label="Time Typing" value={formatTime(typingStats.stats?.timeTyping || 0)} />
            </div>
          </div>
        )}

        {/* Top Pages */}
        <div className="mb-6">
          <MetricsList title="Top Pages" icon={FileText} items={analytics.topPages} labelFormatter={(path) => (path === "/" ? "Home" : path.replace(/^\//, ""))} />
        </div>

        {/* Environment Section with Tabs */}
        <div className="mb-6">
          <Typography.P className="text-sm font-medium mb-3 flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Environment
          </Typography.P>
          <Tabs value={environmentTab} onValueChange={setEnvironmentTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="browsers">Browsers</TabsTrigger>
              <TabsTrigger value="os">OS</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
            </TabsList>
            <TabsContent value="browsers" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BarChartMetrics title="Browser Distribution" icon={Globe} items={analytics.browsers} />
                <PieChartMetrics title="Browser Share" icon={Globe} items={analytics.browsers} />
              </div>
            </TabsContent>
            <TabsContent value="os" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BarChartMetrics title="Operating Systems" icon={Monitor} items={analytics.os} />
                <PieChartMetrics title="OS Share" icon={Monitor} items={analytics.os} />
              </div>
            </TabsContent>
            <TabsContent value="devices" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BarChartMetrics title="Device Types" icon={Smartphone} items={analytics.devices} />
                <PieChartMetrics title="Device Share" icon={Smartphone} items={analytics.devices} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Location Section */}
        <div className="mb-6">
          <Typography.P className="text-sm font-medium mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </Typography.P>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BarChartMetrics title="Top Countries" icon={Globe} items={analytics.countries} />
            <PieChartMetrics title="Geographic Distribution" icon={Globe} items={analytics.countries} />
          </div>
        </div>
      </div>
    </BlurFade>
  )
}
