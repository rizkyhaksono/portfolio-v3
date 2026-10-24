"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import { installTrackDelegation } from "@/lib/analytics"

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
    // Signed-in visitors are never recorded. Sessions from before the httpOnly cookie still show the token itself.
    if (loaded || /(?:^|; )(?:NATEE_SIGNED_IN|NATEE_V3_TOKEN)=/.test(document.cookie)) return

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

/** Where focus goes when a trigger-less dialog closes. From inside the menu sheet (gone by then), the menu button. */
function focusOrigin(from: Element | null): HTMLElement | null {
  if (from?.closest("[role=dialog]")) return document.querySelector<HTMLElement>("[data-contents-trigger]")
  return from instanceof HTMLElement ? from : null
}

/**
 * BaseLayout's client tools. The `data-track` listener installs at mount; the feedback dialog loads on a
 * `[data-open-feedback]` click; the terminal waits for the page to settle.
 */
export function DeferredClientUtilities() {
  const [ready, setReady] = useState(settledOnce)
  const [feedbackLoaded, setFeedbackLoaded] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  // The dialog has a Radix trigger, so focus goes back to the element that opened it by hand.
  const returnFocus = useRef<HTMLElement | null>(null)
  const restoreFocus = useCallback((event: Event) => {
    event.preventDefault()
    returnFocus.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => installTrackDelegation(), [])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null
      const feedback = target?.closest<HTMLElement>("[data-open-feedback]")
      if (feedback) {
        returnFocus.current = focusOrigin(feedback)
        setFeedbackLoaded(true)
        setFeedbackOpen(true)
      }
    }
    document.addEventListener("click", onClick)
    return () => {
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
      {feedbackLoaded && <FeedbackWidget open={feedbackOpen} onOpenChange={setFeedbackOpen} onCloseAutoFocus={restoreFocus} />}
      {ready && <TerminalOverlay />}
    </>
  )
}
