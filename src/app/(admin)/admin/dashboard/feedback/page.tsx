"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { InkLink } from "@/components/ui/ink-link"
import { getClientAuthorizationHeader } from "@/commons/helpers/client-auth-header"
import { updateFeedbackStatusClient, type AdminFeedback, type FeedbackStatus } from "@/services/admin/feedback"
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

// shortcut: services/admin/feedback.ts cannot ask for a page yet; move this there when that file is next touched.
async function fetchFeedback(filter: Filter, page: number): Promise<{ items: AdminFeedback[]; total: number }> {
  const query = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) })
  if (filter !== "all") query.set("status", filter)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/feedback?${query}`, {
    headers: getClientAuthorizationHeader(),
    cache: "no-store",
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || json?.status >= 400) throw new Error(json?.message || `Feedback did not load (${res.status}).`)
  return json.data
}

const sentence = (word: string) => word.charAt(0).toLocaleUpperCase("en") + word.slice(1)

/** Correspondence: one letter per message, newest first, with its status as a tag and the two moves it allows. */
export default function FeedbackAdminPage() {
  const [filter, setFilter] = useState<Filter>("new")
  const [items, setItems] = useState<AdminFeedback[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [state, setState] = useState<"loading" | "more" | "ready" | "failed">("loading")

  const load = useCallback(async (next: number) => {
    setState(next === 1 ? "loading" : "more")
    try {
      const data = await fetchFeedback(filter, next)
      setItems((prev) => (next === 1 ? data.items : [...prev, ...data.items]))
      setTotal(data.total)
      setPage(next)
      setState("ready")
    } catch (error) {
      if (next === 1) setState("failed")
      else {
        setState("ready")
        toast.error(error instanceof Error ? error.message : "Older feedback did not load.")
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
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The status did not change. Try again.")
    }
  }

  return (
    <div className="mx-auto w-full max-w-[46rem]">
      <div role="group" aria-label="Show feedback" className="flex flex-wrap gap-x-6 border-b border-rule">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
            className="-mb-px inline-flex min-h-10 items-center border-b-2 border-transparent pb-1.5 pt-2 text-[15px] font-semibold text-ink-soft transition-colors hover:text-ink aria-pressed:border-ink aria-pressed:text-ink [@media(pointer:coarse)]:min-h-11"
          >
            {f.label}
          </button>
        ))}
      </div>

      {state === "loading" && (
        <ul aria-busy="true" aria-label="Loading feedback" className="divide-y divide-rule">
          {[0, 1, 2].map((i) => (
            <li key={i} className="space-y-3 py-6">
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </li>
          ))}
        </ul>
      )}

      {state === "failed" && (
        <div className="py-10 text-center">
          <p className="text-small text-ink-soft">Feedback did not load. The API may be down for a moment.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => void load(1)}>
            Try again
          </Button>
        </div>
      )}

      {(state === "ready" || state === "more") &&
        (items.length === 0 ? (
          <p className="py-10 text-center font-display text-small text-ink-soft">
            {filter === "all" ? "No feedback yet." : `Nothing marked ${filter === "new" ? "new" : filter}.`}
          </p>
        ) : (
          <>
            <p className="mt-4 font-display text-caption tabular-nums text-ink-soft">
              Showing {items.length} of {total}.
            </p>
            <ol className="divide-y divide-rule">
              {items.map((f) => {
                const link = httpUrl(f.pageUrl)
                return (
                  <li key={f.id} className="py-6">
                    <article>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" status={STATUS_MARK[f.status]}>
                          {sentence(f.status)}
                        </Badge>
                        <Badge variant="outline">{sentence(f.category)}</Badge>
                      </div>
                      <p className="mt-2 font-display text-caption text-ink-soft">
                        Sent {formatDay(f.createdAt)}, {timeAgo(f.createdAt)}.
                      </p>
                      <p className="mt-3 whitespace-pre-wrap break-words text-body text-ink">{f.message}</p>
                      {(f.email || f.pageUrl) && (
                        <div className="mt-3 space-y-1 border-l border-ink pl-4 text-small text-ink-soft">
                          {f.email && (
                            <p>
                              From <InkLink href={`mailto:${f.email}`}>{f.email}</InkLink>
                            </p>
                          )}
                          {f.pageUrl && (
                            <p className="break-all">
                              On{" "}
                              {link ? (
                                <InkLink href={link} external>
                                  {link}
                                </InkLink>
                              ) : (
                                <span className="text-ink">{f.pageUrl}</span>
                              )}
                            </p>
                          )}
                        </div>
                      )}
                      <div className="mt-4 flex flex-wrap gap-3">
                        {f.status !== "read" && (
                          <Button size="sm" variant="outline" onClick={() => void setStatus(f, "read")}>
                            Mark as read
                          </Button>
                        )}
                        {f.status !== "archived" && (
                          <Button size="sm" variant="ghost" onClick={() => void setStatus(f, "archived")}>
                            Archive
                          </Button>
                        )}
                      </div>
                    </article>
                  </li>
                )
              })}
            </ol>
            {items.length < total && (
              <div className="border-t border-rule pt-6 text-center">
                <Button variant="outline" onClick={() => void load(page + 1)} disabled={state === "more"} aria-busy={state === "more"}>
                  {state === "more" ? "Loading…" : "Load older feedback"}
                </Button>
              </div>
            )}
          </>
        ))}
    </div>
  )
}
