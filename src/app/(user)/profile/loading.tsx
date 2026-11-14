import { Skeleton } from "@/components/ui/skeleton"

/** Grey stand-in for the profile while the account server answers. */
export default function ProfileLoading() {
  return (
    <div role="status" className="w-full">
      <span className="sr-only">Loading your profile…</span>
      <div aria-hidden>
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 shrink-0 rounded-full" />
          <Skeleton className="h-8 flex-1 rounded-lg" />
        </div>
        <div className="mt-6 flex flex-col gap-4">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      </div>
    </div>
  )
}
