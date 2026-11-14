"use client"

import { useEffect, useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusLine } from "@/components/ui/status-line"
import { cn } from "@/lib/utils"

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

/** A tool's row of settings: label-and-control blocks side by side, bottoms aligned, wrapping on phones. */
export const TOOL_CONTROLS = "flex flex-wrap items-end gap-x-6 gap-y-4"

interface ChoiceGroupProps<T extends string | number> {
  label: string
  options: readonly { id: T; name: string }[]
  value: T
  onChange: (id: T) => void
  disabled?: boolean
  /** Umami event sent by each option, with the option's id under `data-umami-event-<key>`. */
  event?: { name: string; key: string }
}

/** One-of-several choice as pressed buttons: the chosen one sits on the grey fill, as a Notion selected item. */
export function ChoiceGroup<T extends string | number>({ label, options, value, onChange, disabled, event }: Readonly<ChoiceGroupProps<T>>) {
  const labelId = useId()
  return (
    <div role="group" aria-labelledby={labelId}>
      <p id={labelId} className={GROUP_LABEL}>
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = o.id === value
          return (
            <Button
              key={o.id}
              type="button"
              variant={on ? "secondary" : "outline"}
              aria-pressed={on}
              disabled={disabled}
              onClick={() => onChange(o.id)}
              className={cn(on && "border border-transparent bg-tint-strong")}
              {...(event && { "data-umami-event": event.name, [`data-umami-event-${event.key}`]: o.id })}
            >
              {o.name}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

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
