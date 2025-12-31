"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MonkeyTypeUserData } from "@/commons/types/monkeytype"
import { Keyboard, Target, MousePointerClick, Timer, TrendingUp, Zap, Award, Activity } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, Line, LineChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"

interface MonkeyTypeStatsProps {
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

function StatCard({ icon: Icon, label, value, subValue, trend }: { icon: React.ElementType; label: string; value: string | number; subValue?: string; trend?: string }) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold truncate">{value}</p>
              {trend && (
                <Badge variant="secondary" className="text-xs">
                  {trend}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{label}</p>
            {subValue && <p className="text-xs text-muted-foreground/70 truncate">{subValue}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function MonkeyTypeStats({ typingStats }: MonkeyTypeStatsProps) {
  if (!typingStats.bestWpm && !typingStats.stats) {
    return null
  }

  // Calculate additional stats
  const completionRate = typingStats.stats ? Math.round((typingStats.stats.completedTests / typingStats.stats.startedTests) * 100) : 0

  // Get recent test data for charts (from personalBests array)
  const recentTests = Array.isArray(typingStats.personalBests)
    ? typingStats.personalBests
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10)
        .reverse()
    : []

  const wpmChartData = recentTests.map((test, idx) => ({
    test: `T${idx + 1}`,
    wpm: Math.round(test.wpm),
    raw: Math.round(test.raw),
  }))

  const accuracyChartData = recentTests.map((test, idx) => ({
    test: `T${idx + 1}`,
    accuracy: Math.round(test.acc),
    consistency: Math.round(test.consistency),
  }))

  const wpmChartConfig: ChartConfig = {
    wpm: { label: "WPM" },
    raw: { label: "Raw WPM" },
  }

  const accuracyChartConfig: ChartConfig = {
    accuracy: { label: "Accuracy" },
    consistency: { label: "Consistency" },
  }

  // Find best stats across all tests
  let bestRaw = 0
  let bestConsistency = 0
  if (Array.isArray(typingStats.personalBests)) {
    typingStats.personalBests.forEach((test) => {
      if (test.raw > bestRaw) bestRaw = Math.round(test.raw)
      if (test.consistency > bestConsistency) bestConsistency = Math.round(test.consistency)
    })
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Keyboard className="w-4 h-4" />
          MonkeyType Performance
        </p>
        <Badge variant="outline" className="text-xs">
          <Activity className="w-3 h-3 mr-1" />
          Last 10 Tests
        </Badge>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard icon={Keyboard} label="Best WPM" value={typingStats.bestWpm || "N/A"} subValue={`Avg: ${typingStats.averageWpm} WPM`} />
        <StatCard icon={Target} label="Best Accuracy" value={typingStats.bestAccuracy ? `${typingStats.bestAccuracy}%` : "N/A"} subValue={bestConsistency ? `Consistency: ${bestConsistency}%` : undefined} />
        <StatCard icon={MousePointerClick} label="Tests Completed" value={formatNumber(typingStats.stats?.completedTests || 0)} subValue={completionRate > 0 ? `${completionRate}% completion` : undefined} />
        <StatCard icon={Timer} label="Time Typing" value={formatTime(typingStats.stats?.timeTyping || 0)} subValue={typingStats.stats?.startedTests ? `${formatNumber(typingStats.stats.startedTests)} started` : undefined} />
      </div>

      {/* Additional Stats */}
      {(bestRaw > 0 || typingStats.averageWpm > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {bestRaw > 0 && <StatCard icon={Zap} label="Best Raw WPM" value={bestRaw} subValue="Uncorrected speed" />}
          {typingStats.averageWpm > 0 && <StatCard icon={TrendingUp} label="Average WPM" value={typingStats.averageWpm} subValue="Across all tests" />}
          {bestConsistency > 0 && <StatCard icon={Award} label="Best Consistency" value={`${bestConsistency}%`} subValue="Typing stability" />}
        </div>
      )}

      {/* Charts */}
      {wpmChartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                WPM Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ChartContainer config={wpmChartConfig} className="h-[200px] w-full">
                <LineChart data={wpmChartData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                  <XAxis dataKey="test" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="wpm" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
                  <Line type="monotone" dataKey="raw" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "hsl(var(--muted-foreground))", r: 3 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4" />
                Accuracy & Consistency
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ChartContainer config={accuracyChartConfig} className="h-[200px] w-full">
                <BarChart data={accuracyChartData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                  <XAxis dataKey="test" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="accuracy" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="consistency" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
