import { SectionIcon } from "@/components/layout/section-icons"
import { Gallery } from "@/components/ui/media-card"
import { PageHeader } from "@/components/ui/page-header"
import { Skeleton } from "@/components/ui/skeleton"

/** Shown while the projects load: the page head, then grey gallery cards. */
export default function Loading() {
  return (
    <div aria-busy="true">
      <PageHeader icon={<SectionIcon href="/project" />} title="Projects" />
      <p role="status" className="sr-only">
        Loading the projects…
      </p>
      <Skeleton className="mb-2 h-5 w-24" />
      <Gallery>
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="overflow-hidden rounded-lg border border-border">
            <Skeleton className="aspect-[16/10] rounded-none" />
            <div className="space-y-2 px-2.5 pb-3 pt-2.5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </li>
        ))}
      </Gallery>
    </div>
  )
}
