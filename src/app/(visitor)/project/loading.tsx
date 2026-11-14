import { GallerySkeleton, GroupLabelSkeleton, PageLoading } from "@/components/ui/page-loading"

/** Shown while the projects load: the page head, then the "Hand-picked" group as grey gallery cards. */
export default function Loading() {
  return (
    <PageLoading label="Loading the projects…" title="Projects" description>
      <GroupLabelSkeleton />
      <GallerySkeleton cards={6} />
    </PageLoading>
  )
}
