import { getRoadmapCourses } from "@/lib/mdx"
import BaseLayout from "@/components/layout/base-layout"
import { RoadmapClient } from "./roadmap-client"
import SidebarMain from "@/components/layout/sidebar-main"

export default function CourseRoadmap() {
  const courses = getRoadmapCourses()

  return (
    <BaseLayout sidebar={<SidebarMain />} useGridBackground={false} useLightRays={true}>
      {/* Header */}
      <div className="flex flex-col gap-6 mt-20 justify-center relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col gap-2">
            <h1 className="font-medium text-4xl md:text-5xl tracking-tighter">Learning Roadmap</h1>
            <p className="text-muted-foreground text-sm md:text-base lg:text-lg">Structured learning paths with video tutorials and interactive lessons</p>
          </div>
        </div>
      </div>

      {/* Roadmap Content */}
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-0 relative z-10">
        <RoadmapClient courses={courses} />
      </div>
    </BaseLayout>
  )
}
