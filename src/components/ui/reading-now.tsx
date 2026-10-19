"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const POLL_MS = 60_000

/**
 * "N people here in the last five minutes." Fetches on mount, polls only while the tab is visible,
 * keeps its line reserved (no layout shift) and shows nothing at zero. Deliberately no aria-live.
 */
export function ReadingNow({ className }: Readonly<{ className?: string }>) {
  const [visitors, setVisitors] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let timer: ReturnType<typeof setInterval> | undefined

    const load = () =>
      fetch("/api/umami/active", { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { visitors?: number } | null) => setVisitors(Number(data?.visitors) || 0))
        .catch(() => {})
    const stop = () => {
      clearInterval(timer)
      timer = undefined
    }
    const start = () => {
      if (timer === undefined) timer = setInterval(load, POLL_MS)
    }
    const onVisibilityChange = () => {
      if (document.hidden) return stop()
      load()
      start()
    }

    load()
    if (!document.hidden) start()
    document.addEventListener("visibilitychange", onVisibilityChange)
    return () => {
      controller.abort()
      stop()
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [])

  return (
    <p className={cn("min-h-[1.35em] text-caption tabular-nums text-muted-foreground", className)}>
      {visitors > 0 &&
        `${visitors.toLocaleString("en")} ${visitors === 1 ? "person" : "people"} here in the last five minutes.`}
    </p>
  )
}

export default ReadingNow
