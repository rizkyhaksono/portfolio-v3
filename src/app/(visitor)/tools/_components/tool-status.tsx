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

/** Inline failure: an italic ink line behind a cross, and a retry when one helps. */
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

/** Static ruled skeleton while a tool's code arrives. */
export function ToolSkeleton() {
  return (
    <div aria-busy="true" className="space-y-4">
      <span className="sr-only">Loading the tool…</span>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}
