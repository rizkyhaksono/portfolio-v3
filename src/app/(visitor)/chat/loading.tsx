import { SectionIcon } from "@/components/layout/section-icons"
import { LoadingStatus } from "@/components/ui/page-loading"
import { PageHeader } from "@/components/ui/page-header"
import { Skeleton } from "@/components/ui/skeleton"

const MESSAGES = [
  ["w-20", "w-3/4"],
  ["w-24", "w-1/2"],
  ["w-16", "w-2/3"],
  ["w-20", "w-5/6"],
  ["w-28", "w-2/5"],
]

/** Shown while the messages load: the room's head, the count line, grey message rows at the bottom (where the newest show) and the composer's place. */
export default function Loading() {
  return (
    <div aria-busy="true" className="flex min-h-0 w-full flex-1 flex-col">
      <PageHeader
        icon={<SectionIcon href="/chat" />}
        title="Chat"
        description="A public room: say hello, ask a question or answer someone. Times are Jakarta time."
        className="mb-6 shrink-0"
      />
      <LoadingStatus>Loading the messages…</LoadingStatus>
      <div aria-hidden className="flex min-h-0 flex-1 flex-col">
        <div className="flex h-8 shrink-0 items-center justify-between border-b border-border pb-1.5 [@media(pointer:coarse)]:h-12">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3.5 w-16" />
        </div>
        <ol role="list" className="flex min-h-0 flex-1 flex-col justify-end gap-0.5 overflow-hidden py-3">
          {MESSAGES.map(([name, text], i) => (
            <li key={i} className="flex gap-2.5 py-2">
              <Skeleton className="mt-0.5 size-6 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <div className="flex h-5 items-center gap-2">
                  <Skeleton className={`h-3.5 ${name}`} />
                  <Skeleton className="h-3 w-10" />
                </div>
                <div className="mt-0.5 flex h-6 items-center">
                  <Skeleton className={`h-4 ${text}`} />
                </div>
              </div>
            </li>
          ))}
        </ol>
        <div className="flex h-8 shrink-0 items-center border-t border-border pt-3">
          <Skeleton className="h-3.5 w-3/5" />
        </div>
      </div>
    </div>
  )
}
