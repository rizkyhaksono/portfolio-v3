"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusLine } from "@/components/ui/status-line"

type Status = "loading" | "ready" | "error"

/**
 * Runs `load` on mount and whenever it changes (memoise it with useCallback), aborts the request a newer
 * one replaces, and keeps the last data while reloading or after a failure so pagers stay put.
 */
export function useToolData<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [state, setState] = useState<{ status: Status; data?: T }>({ status: "loading" })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setState((s) => ({ status: "loading", data: s.data }))
    load(controller.signal).then(
      (data) => !controller.signal.aborted && setState({ status: "ready", data }),
      () => !controller.signal.aborted && setState((s) => ({ status: "error", data: s.data })),
    )
    return () => controller.abort()
  }, [load, attempt])

  return { ...state, retry: () => setAttempt((n) => n + 1) }
}

/** Inline failure: one plain line behind a cross, and a retry when one helps. */
export function ToolError({ children, onRetry }: Readonly<{ children: React.ReactNode; onRetry?: () => void }>) {
  return (
    <StatusLine
      kind="failed"
      action={
        onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        )
      }
    >
      {children}
    </StatusLine>
  )
}

/** A word, not a spinner. */
export function ToolLoading({ children = "Loading…" }: Readonly<{ children?: React.ReactNode }>) {
  return (
    <StatusLine kind="loading" className="py-8">
      {children}
    </StatusLine>
  )
}

/** Grey rows in the shape of a table view, while its data loads. `label` is what a screen reader hears. */
export function TableSkeleton({ label, rows = 6 }: Readonly<{ label: string; rows?: number }>) {
  return (
    <div aria-busy="true">
      <span role="status" className="sr-only">
        {label}
      </span>
      <div className="border-b border-border py-2.5">
        <Skeleton className="h-3 w-24" />
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-6 border-b border-border py-3">
          <Skeleton className="h-4 w-1/3 sm:w-1/5" />
          <Skeleton className="ml-auto h-4 w-1/5" />
          <Skeleton className="hidden h-4 w-1/6 sm:block" />
        </div>
      ))}
    </div>
  )
}

/** The small muted name above a group of choice buttons, matching `Label`. */
export const GROUP_LABEL = "mb-1 text-caption font-medium text-muted-foreground"

/** Grey stand-ins while a tool's code arrives. */
export function ToolSkeleton() {
  return (
    <div aria-busy="true" className="space-y-4">
      <span className="sr-only">Loading the tool…</span>
      <Skeleton className="h-9 w-full max-w-xl" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  )
}
