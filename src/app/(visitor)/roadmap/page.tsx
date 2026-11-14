import { getRoadmapIndex } from "@/lib/mdx"
import { RoadmapClient } from "./roadmap-client"

export default function CourseRoadmap() {
  return (
    <div>
      <header className="pb-8">
        <h1 className="text-h1 text-balance text-foreground">Roadmap</h1>
        <p className="mt-4 text-caption text-muted-foreground">Your progress stays in this browser.</p>
      </header>
      <div aria-hidden className="border-t border-foreground" />
      <RoadmapClient courses={getRoadmapIndex()} />
    </div>
  )
}
