import { Skeleton } from "@/components/ui/skeleton"

/** A Notion page while the data loads: the icon and title, four number blocks and a few list rows. */
export default function AdminLoading() {
  return (
    <div aria-busy="true">
      <p className="sr-only">Loading</p>
      <Skeleton className="size-14" />
      <Skeleton className="mt-4 h-10 w-64 max-w-full" />
      <Skeleton className="mt-3 h-5 w-96 max-w-full" />
      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-3 rounded-lg border border-border p-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
      <Skeleton className="mt-12 h-7 w-40" />
      <div className="mt-3 space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between gap-6 py-1">
            <Skeleton className="h-5 w-2/3 max-w-md" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}
