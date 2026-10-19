import { Skeleton } from "@/components/ui/skeleton"

/** Static ruled skeleton at roughly the final height: a figure strip and a ledger. No pulse. */
export default function AdminLoading() {
  return (
    <div aria-busy="true" className="mx-auto w-full max-w-[60rem]">
      <p className="sr-only">Loading</p>
      <div className="grid grid-cols-2 border-y border-rule sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-3 border-rule px-4 py-5 [&:not(:last-child)]:border-r">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-10 w-16" />
          </div>
        ))}
      </div>
      <Skeleton className="mt-12 h-6 w-40" />
      <ul className="mt-3 divide-y divide-rule border-t border-ink">
        {[0, 1, 2, 3, 4].map((i) => (
          <li key={i} className="flex items-center justify-between gap-6 py-4">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-20" />
          </li>
        ))}
      </ul>
    </div>
  )
}
