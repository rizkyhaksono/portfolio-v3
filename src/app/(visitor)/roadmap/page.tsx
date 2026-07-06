import { Suspense } from "react"
import { getRoadmapCourses } from "@/lib/mdx"
import BaseLayout from "@/components/layout/base-layout"
import { RoadmapClient } from "./roadmap-client"
import SidebarMain from "@/components/layout/sidebar-main"
import { MacWindow } from "@/components/ui/mac-window"

export const dynamic = "force-dynamic"

function RoadmapSkeleton() {
  return (
    <div className="py-8 space-y-6">
      <div className="flex gap-2 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-24 animate-pulse bg-muted rounded-full shrink-0" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-72 animate-pulse bg-muted rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

export default function CourseRoadmap() {
  const courses = getRoadmapCourses()

  return (
    <BaseLayout sidebar={<SidebarMain />} useGridBackground={false} useInteractiveGrid={true}>
      {/* Header */}
      <div className="flex flex-col gap-6 justify-center relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Learning Roadmap</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Structured learning paths from beginner to advanced.
            </p>
          </div>
        </div>
      </div>

      {/* Roadmap Content */}
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-0 relative z-10">
        <MacWindow title="~/roadmap">
          <Suspense fallback={<RoadmapSkeleton />}>
            <RoadmapClient courses={courses} />
          </Suspense>
        </MacWindow>
      </div>
    </BaseLayout>
  )
}
