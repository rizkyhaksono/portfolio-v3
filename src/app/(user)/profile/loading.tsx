import { Skeleton } from "@/components/ui/skeleton"

const ROWS = ["w-2/3", "w-1/3", "w-1/2", "w-1/3", "w-1/4"]

/** Notion skeleton of the profile while the account server answers: avatar, name, property rows. */
export default function ProfileLoading() {
  return (
    <div role="status" className="w-full">
      <span className="sr-only">Loading your profile…</span>
      <div aria-hidden>
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="mt-4 h-10 w-1/2 rounded-lg" />
        <div className="mt-5 flex flex-col gap-2">
          {ROWS.map((width, i) => (
            <div key={i} className="flex h-8 items-center gap-2">
              <Skeleton className="h-4 w-28 shrink-0" />
              <Skeleton className={`h-4 ${width}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
