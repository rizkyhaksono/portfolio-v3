import { SectionIcon } from "@/components/layout/section-icons"
import { GroupLabelSkeleton, ListSkeleton, PageLoading, TextSkeleton } from "@/components/ui/page-loading"
import { Skeleton } from "@/components/ui/skeleton"

/** Shown while the roadmap loads: the head, the course rows, then the open course's heading and lessons. */
export default function Loading() {
  return (
    <PageLoading
      label="Loading the roadmap…"
      icon={<SectionIcon href="/roadmap" />}
      title="Roadmap"
      description="Learning paths from first principles to advanced practice. Your progress stays in this browser."
    >
      <GroupLabelSkeleton className="mb-1" />
      <ListSkeleton rows={5} />
      <div className="mt-12 flex h-8 items-center gap-2">
        <Skeleton className="size-6 shrink-0 rounded" />
        <Skeleton className="h-6 w-1/2" />
      </div>
      <TextSkeleton lines={2} className="mt-2" />
      <ListSkeleton rows={5} className="mt-6" />
    </PageLoading>
  )
}
