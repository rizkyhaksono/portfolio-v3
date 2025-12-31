"use client"

import { useState } from "react"
import BlurFade from "@/components/magicui/blur-fade"
import Typography from "@/components/ui/typography"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Users, MousePointerClick, Globe, Monitor, FileText, Activity, Smartphone, Clock, ExternalLink, TrendingUp } from "lucide-react"
import { UmamiAnalyticsData } from "@/commons/types/umami"
import { cn } from "@/lib/utils"
import { Bar, BarChart, XAxis, YAxis, Line, LineChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

interface SiteStatsClientProps {
  analytics: UmamiAnalyticsData
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
  if (seconds < 60) {
    return `${seconds}s`
  }
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m ${seconds % 60}s`
}

function StatCard({ icon: Icon, label, value, subValue, className, trend }: Readonly<{ icon: React.ElementType; label: string; value: string | number; subValue?: string; className?: string; trend?: number }>) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-primary/10">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            {trend !== undefined && trend !== 0 && (
              <Badge variant={trend > 0 ? "default" : "secondary"} className="text-xs">
                {trend > 0 ? "+" : ""}
                {trend}
              </Badge>
            )}
          </div>
          <div>
            <p className="text-3xl font-bold mb-1">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
            {subValue && <p className="text-xs text-muted-foreground/70 mt-1">{subValue}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BarChartMetrics({ title, icon: Icon, items, labelFormatter }: { title: string; icon: React.ElementType; items: { x: string; y: number }[]; labelFormatter?: (label: string) => string }) {
  if (!items || items.length === 0) return null

  const chartData = items.slice(0, 8).map((item) => ({
    name: labelFormatter ? labelFormatter(item.x) : item.x || "Unknown",
    value: item.y,
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
            <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="hsl(var(--primary))" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default function SiteStatsClient({ analytics }: Readonly<SiteStatsClientProps>) {
  console.log("Umami Analytics Data:", analytics)

  const bounceRate = analytics.stats ? Math.round((analytics.stats.bounces / analytics.stats.visits) * 100) : 0
  const avgSessionDuration = analytics.stats && analytics.stats.visits > 0 ? Math.round(analytics.stats.totaltime / analytics.stats.visits) : 0

  const [environmentTab, setEnvironmentTab] = useState("browsers")
  const [trafficTab, setTrafficTab] = useState("pages")

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          <StatCard icon={Eye} label="Page Views" value={formatNumber(analytics.stats?.pageviews || 0)} subValue="Last 30 days" trend={analytics.stats?.comparison?.pageviews} />
          <StatCard icon={Users} label="Unique Visitors" value={formatNumber(analytics.stats?.visitors || 0)} subValue="Last 30 days" trend={analytics.stats?.comparison?.visitors} />
          <StatCard icon={MousePointerClick} label="Total Visits" value={formatNumber(analytics.stats?.visits || 0)} trend={analytics.stats?.comparison?.visits} />
          <StatCard icon={Activity} label="Bounce Rate" value={`${bounceRate}%`} subValue={analytics.stats?.bounces ? `${formatNumber(analytics.stats.bounces)} bounces` : undefined} />
          <StatCard icon={Clock} label="Avg. Session" value={formatTime(avgSessionDuration)} subValue="Per visit" />
        </div>

        {/* Traffic Sources Section with Tabs */}
        <div className="mb-6">
          <Typography.P className="text-sm font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Traffic & Content
          </Typography.P>
          <Tabs value={trafficTab} onValueChange={setTrafficTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="pages">Top Pages</TabsTrigger>
              <TabsTrigger value="referrers">Referrers</TabsTrigger>
            </TabsList>
            <TabsContent value="pages" className="mt-4">
              <BarChartMetrics title="Most Visited Pages" icon={FileText} items={analytics.topPages} labelFormatter={(path) => (path === "/" ? "Home" : path.replace(/^\//, ""))} />
            </TabsContent>
            <TabsContent value="referrers" className="mt-4">
              <BarChartMetrics title="Top Referrers" icon={ExternalLink} items={analytics.topReferrers} labelFormatter={(domain) => domain || "Direct / None"} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Environment Section with Tabs */}
        <div className="mb-6">
          <Typography.P className="text-sm font-medium mb-3 flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Environment
          </Typography.P>
          <Tabs value={environmentTab} onValueChange={setEnvironmentTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="browsers">Browsers & Countries</TabsTrigger>
              <TabsTrigger value="os-device">OS & Device</TabsTrigger>
            </TabsList>
            <TabsContent value="browsers" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BarChartMetrics title="Browser Distribution" icon={Globe} items={analytics.browsers} />
                <BarChartMetrics title="Top Countries" icon={Globe} items={analytics.countries} />
              </div>
            </TabsContent>
            <TabsContent value="os-device" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BarChartMetrics title="Operating Systems" icon={Monitor} items={analytics.os} />
                <BarChartMetrics title="Device Types" icon={Smartphone} items={analytics.devices} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </BlurFade>
  )
}
