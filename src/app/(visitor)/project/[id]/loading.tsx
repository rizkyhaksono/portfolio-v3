import { Skeleton } from "@/components/ui/skeleton"

/** Shown while a project loads: a Notion page in grey bars (cover, title, properties, a few lines). */
export default function Loading() {
  return (
    <div aria-busy="true">
      <p role="status" className="sr-only">
        Loading the project…
      </p>
      <Skeleton className="mb-10 aspect-[16/10] w-full rounded-lg" />
      <Skeleton className="h-10 w-2/3" />
      <div className="mt-6 space-y-3 border-b border-border pb-6">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/5" />
      </div>
      <div className="mt-8 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
