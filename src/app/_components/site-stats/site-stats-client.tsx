"use client"

import { useState } from "react"
import BlurFade from "@/components/magicui/blur-fade"
import Typography from "@/components/ui/typography"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Users, MousePointerClick, Globe, Monitor, FileText, Activity, Smartphone, ExternalLink, TrendingUp, Clock } from "lucide-react"
import { UmamiAnalyticsData } from "@/commons/types/umami"
import { cn } from "@/lib/utils"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

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
    <Card
      className={cn(
        "relative overflow-hidden group border-white/10 dark:border-white/5 bg-white/5 dark:bg-neutral-900/40 backdrop-blur-md hover:bg-white/10 dark:hover:bg-neutral-800/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        className,
      )}
    >
      <CardContent className="p-4 md:p-5 flex flex-col justify-between h-full">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
              <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            {trend !== undefined && trend !== 0 && (
              <Badge variant={trend > 0 ? "default" : "secondary"} className="text-xs">
                {trend > 0 ? "+" : ""}
                {trend}
              </Badge>
            )}
          </div>
          <div className="pt-1 md:pt-2">
            <p className="text-2xl md:text-3xl font-bold tracking-tight mb-0.5 text-foreground">{value}</p>
            <p className="text-xs md:text-sm font-medium text-muted-foreground">{label}</p>
            {subValue && <p className="text-[10px] md:text-xs text-muted-foreground/80 mt-1">{subValue}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BarChartMetrics({
  title,
  icon: Icon,
  items,
  labelFormatter,
  onBarClick,
}: {
  title: string
  icon: React.ElementType
  items: { x: string; y: number }[]
  labelFormatter?: (label: string) => string
  onBarClick?: (data: any) => void
}) {
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
    <Card className="border-white/10 dark:border-white/5 bg-white/5 dark:bg-neutral-900/40 backdrop-blur-md transition-all duration-300 hover:shadow-lg h-full">
      <CardHeader className="pb-3 pt-4 px-4 md:px-5">
        <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-1 px-4 pb-4 md:px-5 md:pb-5">
        <ChartContainer config={chartConfig} className="h-[220px] md:h-[240px] w-full">
          <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="hsl(var(--primary))" onClick={onBarClick} cursor="pointer" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default function SiteStatsClient({ analytics }: Readonly<SiteStatsClientProps>) {
  const [selectedAnalytic, setSelectedAnalytic] = useState<any>(null)

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
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4 mb-8">
          <StatCard icon={Eye} label="Page Views" value={formatNumber(analytics.stats?.pageviews || 0)} subValue="Last 30 days" trend={analytics.stats?.comparison?.pageviews} />
          <StatCard icon={Users} label="Unique Visitors" value={formatNumber(analytics.stats?.visitors || 0)} subValue="Last 30 days" trend={analytics.stats?.comparison?.visitors} />
          <StatCard icon={MousePointerClick} label="Total Visits" value={formatNumber(analytics.stats?.visits || 0)} trend={analytics.stats?.comparison?.visits} />
          <StatCard icon={Activity} label="Bounce Rate" value={`${bounceRate}%`} subValue={analytics.stats?.bounces ? `${formatNumber(analytics.stats.bounces)} bounces` : undefined} />
          <StatCard icon={Clock} label="Avg. Session" value={formatTime(avgSessionDuration)} subValue="Per visit" />
        </div>

        {/* Traffic Sources Section with Tabs */}
        <div className="mb-8">
          <Typography.P className="text-sm md:text-base font-semibold mb-4 flex items-center gap-2 text-foreground">
            <div className="p-1.5 rounded-md bg-primary/10 inline-flex">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            Traffic & Content
          </Typography.P>
          <Tabs value={trafficTab} onValueChange={setTrafficTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="pages">Top Pages</TabsTrigger>
              <TabsTrigger value="referrers">Referrers</TabsTrigger>
            </TabsList>
            <div className="mt-4">
              <TabsContent value="pages" className="mt-0 focus-visible:outline-none">
                <BarChartMetrics
                  title="Most Visited Pages"
                  icon={FileText}
                  items={analytics.topPages}
                  labelFormatter={(path) => (path === "/" ? "Home" : path.replace(/^\//, ""))}
                  onBarClick={(data) => setSelectedAnalytic({ ...data, type: "Page Views" })}
                />
              </TabsContent>
              <TabsContent value="referrers" className="mt-0 focus-visible:outline-none">
                <BarChartMetrics
                  title="Top Referrers"
                  icon={ExternalLink}
                  items={analytics.topReferrers}
                  labelFormatter={(domain) => domain || "Direct / None"}
                  onBarClick={(data) => setSelectedAnalytic({ ...data, type: "Referrer Traffic" })}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Environment Section with Tabs */}
        <div className="mb-8">
          <Typography.P className="text-sm md:text-base font-semibold mb-4 flex items-center gap-2 text-foreground">
            <div className="p-1.5 rounded-md bg-primary/10 inline-flex">
              <Monitor className="w-4 h-4 text-primary" />
            </div>
            Environment
          </Typography.P>
          <Tabs value={environmentTab} onValueChange={setEnvironmentTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="browsers">Browsers & Countries</TabsTrigger>
              <TabsTrigger value="os-device">OS & Device</TabsTrigger>
            </TabsList>
            <div className="mt-4">
              <TabsContent value="browsers" className="mt-0 focus-visible:outline-none">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <BarChartMetrics title="Browser Distribution" icon={Globe} items={analytics.browsers} onBarClick={(data) => setSelectedAnalytic({ ...data, type: "Browser Usage" })} />
                  <BarChartMetrics title="Top Countries" icon={Globe} items={analytics.countries} onBarClick={(data) => setSelectedAnalytic({ ...data, type: "Visitors by Country" })} />
                </div>
              </TabsContent>
              <TabsContent value="os-device" className="mt-0 focus-visible:outline-none">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <BarChartMetrics title="Operating Systems" icon={Monitor} items={analytics.os} onBarClick={(data) => setSelectedAnalytic({ ...data, type: "Operating System" })} />
                  <BarChartMetrics title="Device Types" icon={Smartphone} items={analytics.devices} onBarClick={(data) => setSelectedAnalytic({ ...data, type: "Device Type" })} />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedAnalytic} onOpenChange={(open) => !open && setSelectedAnalytic(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Analytics Details</DialogTitle>
            <DialogDescription>Detailed breakdown for the selected item.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedAnalytic?.name && (
              <div className="grid grid-cols-4 items-start gap-4">
                <span className="col-span-1 text-sm font-medium">Metric:</span>
                <span className="col-span-3 text-sm break-all font-semibold bg-primary/10 p-2 rounded-md">{selectedAnalytic.name}</span>
              </div>
            )}
            {selectedAnalytic?.type && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="col-span-1 text-sm font-medium">Category:</span>
                <span className="col-span-3 text-sm text-muted-foreground">{selectedAnalytic.type}</span>
              </div>
            )}
            {selectedAnalytic?.value !== undefined && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="col-span-1 text-sm font-medium">Visits:</span>
                <div className="col-span-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary">{formatNumber(selectedAnalytic.value)}</span>
                  {analytics.stats?.visits && <span className="text-xs text-muted-foreground">({((selectedAnalytic.value / analytics.stats.visits) * 100).toFixed(1)}% of total)</span>}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </BlurFade>
  )
}
