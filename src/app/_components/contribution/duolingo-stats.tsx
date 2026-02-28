"use client"

import { DuolingoApiResponse } from "@/commons/types/duolingo"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import NumberTicker from "@/components/magicui/number-ticker"
import { Badge } from "@/components/ui/badge"
import { Flame, Trophy, BookOpen } from "lucide-react"

interface DuolingoStatsProps {
  duolingo: DuolingoApiResponse
}

/**
 * Format number with comma separators (e.g., 70822 -> "70,822")
 * Using a consistent server/client formatting to avoid hydration errors
 */
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export default function DuolingoStats({ duolingo }: DuolingoStatsProps) {
  if (!duolingo?.data) {
    return null
  }

  const { streak, totalXp, courses } = duolingo.data

  // Get top 3 courses by XP (excluding courses with 0 XP)
  const topCourses = courses
    .filter((course) => course.xp > 0)
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 3)

  const stats = [
    {
      icon: Flame,
      label: "Day Streak",
      value: streak,
      color: "text-orange-600 dark:text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
    {
      icon: Trophy,
      label: "Total XP",
      value: totalXp,
      color: "text-yellow-600 dark:text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
    },
    {
      icon: BookOpen,
      label: "Active Courses",
      value: topCourses.length,
      color: "text-blue-600 dark:text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
  ]

  return (
    <div className="mt-5">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-semibold text-foreground">Duolingo Progress</h3>
      </div>

      {/* Stats Overview */}
      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 mt-4 mb-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.label}
              className="relative overflow-hidden group border-white/10 dark:border-white/5 bg-white/5 dark:bg-neutral-900/40 backdrop-blur-md hover:bg-white/10 dark:hover:bg-neutral-800/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <NumberTicker className={`text-2xl font-bold tracking-tight truncate ${stat.color}`} value={stat.value} />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground truncate">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Top Courses */}
      {topCourses.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {topCourses.map((course, index) => (
            <Card key={`${course.language}-${index}`} className="border-white/10 dark:border-white/5 bg-white/5 dark:bg-neutral-900/40 backdrop-blur-md transition-all duration-300">
              <CardContent className="flex items-center justify-between p-3">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">{course.language}</span>
                </div>
                <Badge variant="secondary" className="font-mono text-[10px] px-1.5 py-0 h-4">
                  {formatNumber(course.xp)} XP
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
