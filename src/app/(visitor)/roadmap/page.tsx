import { getRoadmapIndex } from "@/lib/mdx"
import { RoadmapClient } from "./roadmap-client"

export default function CourseRoadmap() {
  return (
    <div>
      <header className="pb-8">
        <h1 className="font-display text-h1 text-balance text-ink">Roadmap</h1>
        <p className="mt-4 font-display text-caption text-ink-soft">Your progress stays in this browser.</p>
      </header>
      <div aria-hidden className="h-[5px] border-y border-b-rule border-t-ink" />
      <RoadmapClient courses={getRoadmapIndex()} />
    </div>
  )
}
