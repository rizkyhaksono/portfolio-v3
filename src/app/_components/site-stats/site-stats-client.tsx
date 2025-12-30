"use client"

import BlurFade from "@/components/magicui/blur-fade"
import Typography from "@/components/ui/typography"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Users, MousePointerClick, Globe, Chrome, FileText, Keyboard, Target, Timer, Activity } from "lucide-react"
import { UmamiAnalyticsData } from "@/commons/types/umami"
import { MonkeyTypeUserData } from "@/commons/types/monkeytype"
import { cn } from "@/lib/utils"
import { Area, AreaChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

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

function StatCard({ icon: Icon, label, value, subValue, className }: { icon: React.ElementType; label: string; value: string | number; subValue?: string; className?: string }) {
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
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {items.slice(0, 5).map((item) => (
            <div key={`${item.x}-${item.y}`} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground truncate max-w-[70%]">{labelFormatter ? labelFormatter(item.x) : item.x || "Direct"}</span>
              <Badge variant="secondary" className="text-xs">
                {formatNumber(item.y)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function MetricsChart({ title, icon: Icon, items, labelFormatter }: { title: string; icon: React.ElementType; items: { x: string; y: number }[]; labelFormatter?: (label: string) => string }) {
  if (!items || items.length === 0) return null

  const chartData = items.slice(0, 5).map((item) => ({
    name: labelFormatter ? labelFormatter(item.x) : item.x || "Direct",
    value: item.y,
  }))

  const chartConfig: ChartConfig = {
    value: {
      label: title,
      color: "hsl(var(--foreground))",
    },
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${title.replaceAll(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} tickMargin={8} />
            <YAxis hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area type="natural" dataKey="value" stroke="hsl(var(--foreground))" strokeWidth={2} fill={`url(#gradient-${title.replaceAll(/\s/g, "")})`} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default function SiteStatsClient({ analytics, typingStats }: SiteStatsClientProps) {
  const bounceRate = analytics.stats ? Math.round((analytics.stats.bounces / analytics.stats.visits) * 100) : 0

  return (
    <BlurFade delay={0.25} inView>
      <div className="mt-10">
        <div className="flex items-center gap-2 mb-6">
          <Typography.H4>Site Stats</Typography.H4>
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
              MonkeyType Stats
            </Typography.P>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon={Keyboard} label="Best WPM" value={typingStats.bestWpm || "N/A"} subValue="60s test" />
              <StatCard icon={Target} label="Best Accuracy" value={typingStats.bestAccuracy ? `${typingStats.bestAccuracy}%` : "N/A"} />
              <StatCard icon={MousePointerClick} label="Tests Completed" value={formatNumber(typingStats.stats?.completedTests || 0)} />
              <StatCard icon={Timer} label="Time Typing" value={formatTime(typingStats.stats?.timeTyping || 0)} />
            </div>
          </div>
        )}

        {/* Metrics Grid - Charts for some, Lists for others */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricsList title="Top Pages" icon={FileText} items={analytics.topPages} labelFormatter={(path) => (path === "/" ? "Home" : path.replace(/^\//, ""))} />
          <MetricsChart title="Countries" icon={Globe} items={analytics.countries} />
          <MetricsChart title="Browsers" icon={Chrome} items={analytics.browsers} />
          <MetricsChart title="Devices" icon={Users} items={analytics.devices} />
        </div>
      </div>
    </BlurFade>
  )
}
