"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import { installTrackDelegation, track } from "@/lib/analytics"

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

// BaseLayout remounts this on every section change; after the first settle, tools show at once.
let settledOnce = false

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
    // Signed-in visitors are never recorded.
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

/** Mounted once in the root layout so it also sees admin and auth routes, which have no BaseLayout. */
export function UmamiRecorder() {
  useUmamiRecorder(usePathname())
  return null
}

/**
 * BaseLayout's client tools. The `data-track` listener installs at mount; the command palette loads on
 * ⌘K or a `[data-open-search]` click; the terminal and feedback widget wait for the page to settle.
 */
export function DeferredClientUtilities() {
  const [ready, setReady] = useState(settledOnce)
  const [paletteLoaded, setPaletteLoaded] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const paletteOpenRef = useRef(false)
  paletteOpenRef.current = paletteOpen

  useEffect(() => installTrackDelegation(), [])

  useEffect(() => {
    const openPalette = (via: string) => {
      setPaletteLoaded(true)
      setPaletteOpen(true)
      track("search-open", { via })
    }
    const onKeyDown = (event: KeyboardEvent) => {
      // Autofill fires keydown without a key.
      if (event.key?.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return
      event.preventDefault()
      if (paletteOpenRef.current) setPaletteOpen(false)
      else openPalette("keyboard")
    }
    const onClick = (event: MouseEvent) => {
      const trigger = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-open-search]") : null
      if (trigger) openPalette(trigger.dataset.openSearch || "button")
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("click", onClick)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("click", onClick)
    }
  }, [])

  useEffect(() => {
    if (ready) return
    const timeout = window.setTimeout(() => {
      settledOnce = true
      setReady(true)
    }, 1200)
    return () => window.clearTimeout(timeout)
  }, [ready])

  return (
    <>
      {paletteLoaded && <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />}
      {ready && (
        <>
          <TerminalOverlay />
          <FeedbackWidget />
        </>
      )}
    </>
  )
}
