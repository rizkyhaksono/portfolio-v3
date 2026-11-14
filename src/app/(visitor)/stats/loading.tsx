import { SectionIcon } from "@/components/layout/section-icons"
import { ListSkeleton, PageLoading } from "@/components/ui/page-loading"
import { Skeleton } from "@/components/ui/skeleton"

/** A section heading as on the page, so the figures below it arrive under a heading already in place. */
function Heading({ children }: Readonly<{ children: string }>) {
  return <p className="mt-12 text-h2 text-foreground">{children}</p>
}

/** Shown while the figures load: four number blocks, the readers chart and rows, then the coding calendar. */
export default function Loading() {
  return (
    <PageLoading
      label="Loading the figures…"
      icon={<SectionIcon href="/stats" />}
      title="Stats"
      description="Readers, status and practice figures, refreshed every fifteen minutes."
    >
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex min-w-0 flex-col gap-1 rounded-lg border border-border p-4">
            <div className="flex h-10 flex-col justify-center gap-1.5 sm:h-5">
              <Skeleton className="h-3 w-full sm:w-3/4" />
              <Skeleton className="h-3 w-1/2 sm:hidden" />
            </div>
            <div className="flex h-10 items-center">
              <Skeleton className="h-7 w-16" />
            </div>
          </div>
        ))}
      </div>

      <Heading>Readers</Heading>
      <Skeleton className="mt-6 h-3.5 w-4/5" />
      <Skeleton className="mt-6 h-[4.5rem] w-full rounded-md" />
      <p className="mt-10 text-h4 text-foreground">Most read</p>
      <ListSkeleton rows={3} className="mt-2" />

      <Heading>Coding</Heading>
      <p className="mt-7 text-h4 text-foreground">GitHub, the last year</p>
      <Skeleton className="mt-3 h-3.5 w-2/3" />
      <Skeleton className="mt-4 h-28 w-full rounded-md" />
    </PageLoading>
  )
}
