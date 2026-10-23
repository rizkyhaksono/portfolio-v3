"use client"

import { useEffect } from "react"
import { track } from "@/lib/analytics"

/** Sends `not-found` once; the pageview already carries the path. The tracker loads after hydration, so wait for it (up to 5 s). */
export function NotFoundTrack() {
  useEffect(() => {
    let tries = 0
    const id = window.setInterval(() => {
      if (!window.umami && ++tries < 20) return
      window.clearInterval(id)
      track("not-found")
    }, 250)
    return () => window.clearInterval(id)
  }, [])
  return null
}
