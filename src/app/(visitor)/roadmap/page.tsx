import { Suspense } from "react"
import { getRoadmapCourses } from "@/lib/mdx"
import BaseLayout from "@/components/layout/base-layout"
import { RoadmapClient } from "./roadmap-client"
import SidebarMain from "@/components/layout/sidebar-main"
import { MacWindow } from "@/components/ui/mac-window"
import { PageBody } from "@/components/ui/page-body"
import { SectionHeading } from "@/components/ui/section-heading"

export const dynamic = "force-dynamic"

function RoadmapSkeleton() {
  return (
    <div className="space-y-6 py-8">
      <div className="flex gap-2 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-24 shrink-0 animate-pulse bg-muted" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-72 animate-pulse bg-muted" />
        ))}
      </div>
    </div>
  )
}

export default function CourseRoadmap() {
  const courses = getRoadmapCourses()

  return (
    <BaseLayout sidebar={<SidebarMain />}>
      <PageBody width="wide">
        <SectionHeading
          as="h1"
          eyebrow="Learning"
          title="Roadmap"
          description="Focused learning paths, arranged from first principles to advanced practice."
        />
        <MacWindow title="~/roadmap">
          <Suspense fallback={<RoadmapSkeleton />}>
            <RoadmapClient courses={courses} />
          </Suspense>
        </MacWindow>
      </PageBody>
    </BaseLayout>
  )
}
