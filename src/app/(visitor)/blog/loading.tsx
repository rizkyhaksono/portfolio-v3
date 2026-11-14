import { SectionIcon } from "@/components/layout/section-icons"
import { GallerySkeleton, GroupLabelSkeleton, ListSkeleton, PageLoading } from "@/components/ui/page-loading"
import { Skeleton } from "@/components/ui/skeleton"

/** Shown while the writing loads: the head and feed link, the "Latest" cards, then a year of list rows. */
export default function Loading() {
  return (
    <PageLoading
      label="Loading the posts…"
      icon={<SectionIcon href="/blog" />}
      title="Writing"
      description
      headerExtra={
        <div aria-hidden className="flex min-h-11 items-center md:min-h-8">
          <Skeleton className="h-3.5 w-32" />
        </div>
      }
    >
      <GroupLabelSkeleton />
      <GallerySkeleton cards={3} className="mb-10" />
      <GroupLabelSkeleton />
      <ListSkeleton rows={6} />
    </PageLoading>
  )
}
