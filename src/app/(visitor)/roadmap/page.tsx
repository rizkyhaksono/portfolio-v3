import { getRoadmapIndex } from "@/lib/mdx"
import { SectionIcon } from "@/components/layout/section-icons"
import { PageHeader } from "@/components/ui/page-header"
import { RoadmapClient } from "./roadmap-client"

export default function CourseRoadmap() {
  return (
    <>
      <PageHeader
        icon={<SectionIcon href="/roadmap" />}
        title="Roadmap"
        description="Learning paths from first principles to advanced practice. Your progress stays in this browser."
      />
      <RoadmapClient courses={getRoadmapIndex()} />
    </>
  )
}
