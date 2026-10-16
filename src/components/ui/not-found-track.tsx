"use client"

import { useEffect } from "react"
import { track } from "@/lib/analytics"

/** Sends `not-found` once with the pathname only. The tracker loads after hydration, so wait for it (up to 5 s). */
export function NotFoundTrack() {
  useEffect(() => {
    const path = window.location.pathname
    let tries = 0
    const id = window.setInterval(() => {
      if (!window.umami && ++tries < 20) return
      window.clearInterval(id)
      track("not-found", { path })
    }, 250)
    return () => window.clearInterval(id)
  }, [])
  return null
}
