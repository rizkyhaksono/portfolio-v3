import { Skeleton } from "@/components/ui/skeleton"

/** Static ruled stand-in for the profile sheet while the account server answers. No pulse. */
export default function ProfileLoading() {
  return (
    <div role="status" className="mx-auto w-full max-w-[44rem] border border-ink p-[3px]">
      <span className="sr-only">Loading your profile…</span>
      <div aria-hidden className="border border-rule p-5 sm:p-8">
        <div className="flex items-end gap-5 pb-6">
          <Skeleton className="h-20 w-20 sm:h-24 sm:w-24" />
          <Skeleton className="h-10 flex-1" />
        </div>
        <div className="h-[5px] border-y border-b-rule border-t-ink" />
        <div className="mt-8 flex flex-col gap-4">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      </div>
    </div>
  )
}
