"use client"

import { useState, lazy, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MonkeyTypeUserData } from "@/commons/types/monkeytype"
import { Keyboard, Target, MousePointerClick, Timer, TrendingUp, Zap, Award, Activity } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

const LazyCharts = lazy(() => import("./lazy-monkeytype-charts").then((mod) => ({ default: () => null })))
const LazyWpmChartComponent = lazy(() => import("./lazy-monkeytype-charts").then((mod) => ({ default: mod.LazyWpmChart })))
const LazyAccuracyChartComponent = lazy(() => import("./lazy-monkeytype-charts").then((mod) => ({ default: mod.LazyAccuracyChart })))

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
    <Card className="relative overflow-hidden group border-white/10 dark:border-white/5 bg-white/5 dark:bg-neutral-900/40 backdrop-blur-md hover:bg-white/10 dark:hover:bg-neutral-800/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-2xl font-bold tracking-tight truncate">{value}</p>
              {trend && (
                <Badge variant="secondary" className="text-xs">
                  {trend}
                </Badge>
              )}
            </div>
            <p className="text-xs font-medium text-muted-foreground truncate">{label}</p>
            {subValue && <p className="text-[10px] text-muted-foreground/80 truncate">{subValue}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function MonkeyTypeStats({ typingStats }: MonkeyTypeStatsProps) {
  const [selectedTest, setSelectedTest] = useState<any>(null)

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

  // Find best stats across all tests
  let bestRaw = 0
  let bestConsistency = 0
  if (Array.isArray(typingStats.personalBests)) {
    typingStats.personalBests.forEach((test) => {
      if (test.raw > bestRaw) bestRaw = Math.round(test.raw)
      if (test.consistency > bestConsistency) bestConsistency = Math.round(test.consistency)
    })
  }

  const chartFallback = <div className="h-[200px] w-full flex items-center justify-center text-muted-foreground text-sm">Loading chart...</div>

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Keyboard className="w-4 h-4" />
          MonkeyType Performance
        </p>
        <Badge variant="outline" className="text-xs px-2 py-0.5 bg-background/50 backdrop-blur-sm">
          <Activity className="w-3 h-3 mr-1 text-primary" />
          Last 10 Tests
        </Badge>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4">
        <StatCard icon={Keyboard} label="Best WPM" value={typingStats.bestWpm || "N/A"} subValue={`Avg: ${typingStats.averageWpm} WPM`} />
        <StatCard icon={Target} label="Best Accuracy" value={typingStats.bestAccuracy ? `${typingStats.bestAccuracy}%` : "N/A"} subValue={bestConsistency ? `Consistency: ${bestConsistency}%` : undefined} />
        <StatCard icon={MousePointerClick} label="Tests Completed" value={formatNumber(typingStats.stats?.completedTests || 0)} subValue={completionRate > 0 ? `${completionRate}% completion` : undefined} />
        <StatCard icon={Timer} label="Time Typing" value={formatTime(typingStats.stats?.timeTyping || 0)} subValue={typingStats.stats?.startedTests ? `${formatNumber(typingStats.stats.startedTests)} started` : undefined} />
      </div>

      {/* Additional Stats */}
      {(bestRaw > 0 || typingStats.averageWpm > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-5">
          {bestRaw > 0 && <StatCard icon={Zap} label="Best Raw WPM" value={bestRaw} subValue="Uncorrected speed" />}
          {typingStats.averageWpm > 0 && <StatCard icon={TrendingUp} label="Average WPM" value={typingStats.averageWpm} subValue="Across all tests" />}
          {bestConsistency > 0 && <StatCard icon={Award} label="Best Consistency" value={`${bestConsistency}%`} subValue="Typing stability" />}
        </div>
      )}

      {/* Charts - Lazy loaded */}
      {wpmChartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border-white/10 dark:border-white/5 bg-white/5 dark:bg-neutral-900/40 backdrop-blur-md transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-3 pt-4 px-5">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                WPM Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <Suspense fallback={chartFallback}>
                <LazyWpmChartComponent wpmChartData={wpmChartData} onDotClick={(data: any) => setSelectedTest(data.payload)} />
              </Suspense>
            </CardContent>
          </Card>

          <Card className="border-white/10 dark:border-white/5 bg-white/5 dark:bg-neutral-900/40 backdrop-blur-md transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-3 pt-4 px-5">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                Accuracy & Consistency
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <Suspense fallback={chartFallback}>
                <LazyAccuracyChartComponent accuracyChartData={accuracyChartData} onBarClick={(data) => setSelectedTest({ ...data, isAccuracyMode: true })} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedTest} onOpenChange={(open) => !open && setSelectedTest(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Test Details - {selectedTest?.test}</DialogTitle>
            <DialogDescription>Detailed performance metrics for this specific typing test.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedTest?.wpm !== undefined && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="col-span-2 text-sm font-medium">WPM:</span>
                <span className="col-span-2 text-2xl font-bold text-primary">{selectedTest.wpm}</span>
              </div>
            )}
            {selectedTest?.raw !== undefined && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="col-span-2 text-sm font-medium">Raw WPM:</span>
                <span className="col-span-2 text-lg font-semibold">{selectedTest.raw}</span>
              </div>
            )}
            {selectedTest?.accuracy !== undefined && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="col-span-2 text-sm font-medium">Accuracy:</span>
                <span className="col-span-2 text-lg font-semibold">{selectedTest.accuracy}%</span>
              </div>
            )}
            {selectedTest?.consistency !== undefined && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="col-span-2 text-sm font-medium">Consistency:</span>
                <span className="col-span-2 text-lg font-semibold">{selectedTest.consistency}%</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
