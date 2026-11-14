import { PageHeader } from "@/components/ui/page-header"
import { Skeleton } from "@/components/ui/skeleton"

interface PageLoadingProps {
  /** The route's own h1, so the head is in place before the data arrives. Articles leave it out. */
  title?: string
  /** Read out to screen readers while the grey blocks stand in. */
  children: React.ReactNode
}

const LINES = ["w-full", "w-11/12", "w-4/5", "w-2/3"]

/** A route's `loading.tsx` as a Notion skeleton: icon square, title, a few grey lines. */
export function PageLoading({ title, children }: Readonly<PageLoadingProps>) {
  const icon = <Skeleton className="size-14 rounded-lg" />
  return (
    <div aria-busy="true">
      {title ? (
        <PageHeader icon={icon} title={title} />
      ) : (
        <div aria-hidden className="mb-8">
          {icon}
          <Skeleton className="mt-4 h-10 w-3/4 rounded-lg" />
        </div>
      )}
      <p role="status" className="sr-only">{children}</p>
      <div aria-hidden className="flex flex-col gap-3">
        {LINES.map((width) => (
          <Skeleton key={width} className={`h-4 ${width}`} />
        ))}
      </div>
    </div>
  )
}
