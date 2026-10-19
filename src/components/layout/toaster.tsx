"use client"

import dynamic from "next/dynamic"

// Loaded after hydration: every toast follows a user action or a fetch, and pages that call toast()
// already ship sonner, so the Toaster is subscribed before their first toast.
const SonnerToaster = dynamic(() => import("sonner").then((module) => module.Toaster), { ssr: false })

export function Toaster() {
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
