"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const CommandPalette = dynamic(
  () => import("@/components/ui/command-palette").then((module) => module.CommandPalette),
  { ssr: false },
)
const TerminalOverlay = dynamic(() => import("@/components/ui/terminal-overlay"), { ssr: false })
const FeedbackWidget = dynamic(() => import("@/components/ui/feedback-widget"), { ssr: false })

/** Defers non-essential global tools until the initial page has settled. */
export function DeferredClientUtilities() {
  const [ready, setReady] = useState(false)

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
