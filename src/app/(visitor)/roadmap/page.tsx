import { Suspense } from "react"
import { getRoadmapCourses } from "@/lib/mdx"
import BaseLayout from "@/components/layout/base-layout"
import { RoadmapClient } from "./roadmap-client"
import SidebarMain from "@/components/layout/sidebar-main"

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
      <div className="flex flex-col gap-6 mt-20 justify-center relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col gap-2">
            <h1 className="font-medium text-3xl sm:text-4xl md:text-5xl tracking-tighter">Learning Roadmap</h1>
            <p className="text-muted-foreground text-sm md:text-base lg:text-lg">
              Structured learning paths from beginner to advanced — like Dicoding
            </p>
          </div>
        </div>
      </div>

      {/* Roadmap Content */}
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-0 relative z-10">
        <Suspense fallback={<RoadmapSkeleton />}>
          <RoadmapClient courses={courses} />
        </Suspense>
      </div>
    </BaseLayout>
  )
}
