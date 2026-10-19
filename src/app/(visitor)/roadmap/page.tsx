import { getRoadmapIndex } from "@/lib/mdx"
import { PAGE_WIDTH } from "@/lib/design-system"
import { RoadmapClient } from "./roadmap-client"

export default function CourseRoadmap() {
  return (
    <div className={PAGE_WIDTH.ledger}>
      <header className="pb-8">
        <h1 className="font-display text-h1 text-balance text-ink">Roadmap</h1>
        <p className="mt-4 max-w-[46ch] font-display text-lead text-ink-soft">
          Learning paths, from first principles to advanced practice. Your progress stays in this browser.
        </p>
      </header>
      <div aria-hidden className="h-[5px] border-y border-b-rule border-t-ink" />
      <RoadmapClient courses={getRoadmapIndex()} />
    </div>
  )
}
