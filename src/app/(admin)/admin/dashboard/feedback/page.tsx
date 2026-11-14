"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { InkLink } from "@/components/ui/ink-link"
import { StatusLine } from "@/components/ui/status-line"
import { PageHeader } from "@/components/ui/page-header"
import { AdminPageIcon } from "@/components/layout/admin/admin-spine"
import { ViewTabs } from "@/components/layout/admin/view-tabs"
import { getFeedbackClient, updateFeedbackStatusClient, type AdminFeedback, type FeedbackStatus } from "@/services/admin/feedback"
import { formatDay, httpUrl, timeAgo } from "@/components/layout/admin/admin-format"

type Filter = FeedbackStatus | "all"

const PAGE_SIZE = 20
const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Read", value: "read" },
  { label: "Archived", value: "archived" },
]
const STATUS_MARK = { new: "filled", read: "outline", archived: "dashed" } as const

const sentence = (word: string) => word.charAt(0).toLocaleUpperCase("en") + word.slice(1)

/** Correspondence: one letter per message, newest first, with its status as a tag and the two moves it allows. */
export default function FeedbackAdminPage() {
  const [filter, setFilter] = useState<Filter>("new")
  const [items, setItems] = useState<AdminFeedback[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [state, setState] = useState<"loading" | "more" | "ready" | "failed">("loading")
  // Switching filters while a page loads must not let the older answer land on the new list.
  const latest = useRef(0)

  const load = useCallback(async (next: number) => {
    const request = ++latest.current
    setState(next === 1 ? "loading" : "more")
    try {
      const data = await getFeedbackClient({ status: filter === "all" ? undefined : filter, page: next, limit: PAGE_SIZE })
      if (request !== latest.current) return
      setItems((prev) => (next === 1 ? data.items : [...prev, ...data.items]))
      setTotal(data.total)
      setPage(next)
      setState("ready")
    } catch {
      if (request !== latest.current) return
      if (next === 1) setState("failed")
      else {
        setState("ready")
        toast.error("Older feedback did not load. Try again.")
      }
    }
  }, [filter])

  useEffect(() => {
    void load(1)
  }, [load])

  const setStatus = async (item: AdminFeedback, status: FeedbackStatus) => {
    try {
      await updateFeedbackStatusClient(item.id, status)
      toast.success(status === "read" ? "Marked as read." : "Archived.")
      const leaves = filter !== "all" && filter !== status
      setItems((prev) => (leaves ? prev.filter((f) => f.id !== item.id) : prev.map((f) => (f.id === item.id ? { ...f, status } : f))))
      if (leaves) setTotal((n) => n - 1)
    } catch {
      toast.error("The status did not change. Try again.")
    }
  }

  return (
    <>
      <PageHeader icon={<AdminPageIcon href="/admin/dashboard/feedback" />} title="Feedback" description="Messages from the feedback form on the site, newest first." />
      <ViewTabs
        label="Show feedback"
        tabs={FILTERS.map((f) => ({ label: f.label, current: filter === f.value, onSelect: () => setFilter(f.value) }))}
        actions={
          (state === "ready" || state === "more") && items.length > 0 ? (
            <span className="text-small tabular-nums text-muted-foreground">
              {items.length} of {total}
            </span>
          ) : undefined
        }
      />

      {state === "loading" && (
        <ul aria-busy="true" aria-label="Loading feedback" className="mt-2">
          {[0, 1, 2].map((i) => (
            <li key={i} className="space-y-2 border-b border-border px-2 py-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full max-w-xl" />
              <Skeleton className="h-4 w-2/3 max-w-md" />
            </li>
          ))}
        </ul>
      )}

      {state === "failed" && (
        <StatusLine
          kind="failed"
          className="mt-6"
          action={
            <Button variant="outline" size="sm" onClick={() => { void load(1) }}>
              Try again
            </Button>
          }
        >
          Feedback did not load. The API may be down for a moment.
        </StatusLine>
      )}

      {(state === "ready" || state === "more") &&
        (items.length === 0 ? (
          <StatusLine kind="empty" className="mt-6">
            {filter === "all" ? "No feedback yet." : `Nothing marked ${filter === "new" ? "new" : filter}.`}
          </StatusLine>
        ) : (
          <>
            <ol role="list" className="mt-2">
              {items.map((f) => {
                const link = httpUrl(f.pageUrl)
                return (
                  <li key={f.id} className="-mx-2 rounded-md border-b border-border px-2 py-4 transition-colors duration-ui ease-out last:border-b-0 hover:bg-tint">
                    <article className="grid gap-x-6 sm:grid-cols-[minmax(0,1fr)_auto]">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge status={STATUS_MARK[f.status]}>{sentence(f.status)}</Badge>
                          <Badge variant="secondary">{sentence(f.category)}</Badge>
                        </div>
                        <p className="mt-2 max-w-prose whitespace-pre-wrap break-words text-body text-foreground">{f.message}</p>
                        {(f.email || f.pageUrl) && (
                          <p className="mt-1 break-all text-small text-muted-foreground">
                            {f.email && (
                              <>
                                From <InkLink href={`mailto:${f.email}`}>{f.email}</InkLink>
                              </>
                            )}
                            {f.email && f.pageUrl && ", "}
                            {f.pageUrl && (
                              <>
                                {f.email ? "on " : "On "}
                                {link ? (
                                  <InkLink href={link} external>
                                    {link}
                                  </InkLink>
                                ) : (
                                  <span className="text-foreground">{f.pageUrl}</span>
                                )}
                              </>
                            )}
                          </p>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1 sm:mt-0 sm:flex-col sm:items-end">
                        <p className="text-small tabular-nums text-muted-foreground">
                          <time dateTime={f.createdAt} data-tip={formatDay(f.createdAt)}>{timeAgo(f.createdAt)}</time>
                          <span className="sr-only">, {formatDay(f.createdAt)}</span>
                        </p>
                        <div className="ml-auto flex gap-1 sm:ml-0">
                          {f.status !== "read" && (
                            <Button size="sm" variant="ghost" onClick={() => { void setStatus(f, "read") }}>
                              Mark as read
                            </Button>
                          )}
                          {f.status !== "archived" && (
                            <Button size="sm" variant="ghost" onClick={() => { void setStatus(f, "archived") }}>
                              Archive
                            </Button>
                          )}
                        </div>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ol>
            {items.length < total && (
              <div className="mt-4">
                <Button variant="outline" onClick={() => { void load(page + 1) }} disabled={state === "more"} aria-busy={state === "more"}>
                  {state === "more" ? "Loading…" : "Load older feedback"}
                </Button>
              </div>
            )}
          </>
        ))}
    </>
  )
}
