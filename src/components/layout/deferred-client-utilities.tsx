"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"

const CommandPalette = dynamic(
  () => import("@/components/ui/command-palette").then((module) => module.CommandPalette),
  { ssr: false },
)
const TerminalOverlay = dynamic(() => import("@/components/ui/terminal-overlay"), { ssr: false })
const FeedbackWidget = dynamic(() => import("@/components/ui/feedback-widget"), { ssr: false })

const RECORDER_SRC = process.env.NEXT_PUBLIC_UMAMI_RECORDER_SRC
const WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
const RECORDER_SAMPLE = 0.15
const PRIVATE_SECTIONS = new Set(["admin", "auth", "profile", "ai"])
const recorderSampled = typeof window !== "undefined" && Math.random() < RECORDER_SAMPLE

/** Umami replay/heatmap recorder: production visitor pages only, after idle, for a sample of visits. */
function useUmamiRecorder(pathname: string) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !RECORDER_SRC || !WEBSITE_ID || !recorderSampled) return
    const loaded = !!document.getElementById("umami-recorder")
    if (PRIVATE_SECTIONS.has(pathname.split("/")[1])) {
      // A loaded recorder can't be stopped, so client-side nav into a private section reloads to drop it.
      if (loaded) window.location.reload()
      return
    }
    // Signed-in visitors see their name and email in the sidebar, so they are never recorded.
    if (loaded || /(?:^|; )NATEE_V3_TOKEN=/.test(document.cookie)) return

    const load = () => {
      const script = document.createElement("script")
      script.id = "umami-recorder"
      script.defer = true
      script.src = RECORDER_SRC
      script.dataset.websiteId = WEBSITE_ID
      document.head.appendChild(script)
    }

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(load)
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(load, 2000)
    return () => window.clearTimeout(id)
  }, [pathname])
}

/** Defers non-essential global tools until the initial page has settled. */
export function DeferredClientUtilities() {
  const [ready, setReady] = useState(false)
  useUmamiRecorder(usePathname())

  useEffect(() => {
    const timeout = window.setTimeout(() => setReady(true), 1200)
    return () => window.clearTimeout(timeout)
  }, [])

  if (!ready) return null

  return (
    <>
      <CommandPalette />
      <TerminalOverlay />
      <FeedbackWidget />
    </>
  )
}
