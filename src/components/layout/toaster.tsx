"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const SonnerToaster = dynamic(() => import("sonner").then((module) => module.Toaster), { ssr: false })

// Mounted once the browser is idle: every toast follows a user action or a fetch, so the Toaster is
// subscribed before the first one without competing with the page's first paint.
export function Toaster() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 3000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(() => setReady(true), 1500)
    return () => window.clearTimeout(id)
  }, [])

  if (!ready) return null
  return (
    <SonnerToaster
      position="top-right"
      theme="system"
      toastOptions={{
        classNames: {
          toast: "!rounded-none !border !border-ink !bg-paper !text-ink !shadow-[3px_3px_0_hsl(var(--ink))] !font-sans",
          description: "!text-ink-soft",
          actionButton: "!rounded-none !bg-ink !text-paper",
          cancelButton: "!rounded-none !bg-tint !text-ink",
          closeButton: "!rounded-none !border-ink !bg-paper !text-ink",
        },
      }}
    />
  )
}
