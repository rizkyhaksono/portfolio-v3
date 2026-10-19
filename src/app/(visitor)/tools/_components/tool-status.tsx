"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

type Status = "loading" | "ready" | "error"

/**
 * Runs `load` on mount and whenever it changes (memoise it with useCallback), ignores answers that
 * arrive after a newer request, and keeps the last data while reloading so pagers stay put.
 */
export function useToolData<T>(load: () => Promise<T>) {
  const [state, setState] = useState<{ status: Status; data?: T }>({ status: "loading" })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let current = true
    setState((s) => ({ status: "loading", data: s.data }))
    load().then(
      (data) => current && setState({ status: "ready", data }),
      () => current && setState({ status: "error" }),
    )
    return () => {
      current = false
    }
  }, [load, attempt])

  return { ...state, retry: () => setAttempt((n) => n + 1) }
}

/** Inline failure: an italic ink line behind a cross, and a retry when one helps. */
export function ToolError({ children, onRetry }: Readonly<{ children: React.ReactNode; onRetry?: () => void }>) {
  return (
    <div role="alert" className="flex flex-col items-start gap-3 border border-ink p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex gap-2 font-display text-body text-ink">
        <X aria-hidden strokeWidth={1.5} className="mt-1 size-4 shrink-0" />
        <span>{children}</span>
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}

/** A word, not a spinner. */
export function ToolLoading({ children = "Loading…" }: Readonly<{ children?: React.ReactNode }>) {
  return (
    <p role="status" className="py-8 font-display text-caption text-ink-soft">
      {children}
    </p>
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
