"use client";

import { DuolingoApiResponse } from "@/commons/types/duolingo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NumberTicker from "@/components/magicui/number-ticker";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, BookOpen } from "lucide-react";
import { Highlighter } from "@/components/ui/highlighter";

interface DuolingoStatsProps {
  duolingo: DuolingoApiResponse;
}

/**
 * Format number with comma separators (e.g., 70822 -> "70,822")
 * Using a consistent server/client formatting to avoid hydration errors
 */
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function DuolingoStats({ duolingo }: DuolingoStatsProps) {
  if (!duolingo?.data) {
    return null;
  }

  const { streak, totalXp, courses } = duolingo.data;

  // Get top 3 courses by XP (excluding courses with 0 XP)
  const topCourses = courses
    .filter((course) => course.xp > 0)
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 3);

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
  ];

  return (
    <div className="mt-5">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-semibold text-foreground">
          <Highlighter action="underline" color="#4ade80">
            Duolingo Progress
          </Highlighter>
        </h3>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mt-2">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className={stat.bgColor}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {stat.label}
                </span>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <NumberTicker
                  className={`text-2xl font-bold ${stat.color}`}
                  value={stat.value}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Top Courses */}
      {topCourses.length > 0 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 mt-2">
          {topCourses.map((course, index) => (
            <Card key={`${course.language}-${index}`}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{course.language}</span>
                </div>
                <Badge variant="secondary" className="font-mono">
                  {formatNumber(course.xp)} XP
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}