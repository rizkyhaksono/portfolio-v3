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
      position="bottom-center"
      theme="system"
      toastOptions={{
        classNames: {
          // Notion's toast: an inverted slab at the bottom of the page, no border and no shadow.
          toast: "!rounded-lg !border-0 !bg-foreground !text-background !font-sans !text-small !shadow-none",
          description: "!text-background/75",
          actionButton: "!rounded-md !bg-background !text-foreground",
          cancelButton: "!rounded-md !bg-background/15 !text-background",
          closeButton: "!rounded-full !border-0 !bg-foreground !text-background !shadow-none",
        },
      }}
    />
  )
}
