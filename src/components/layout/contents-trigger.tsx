"use client"

import { useRef, useState } from "react"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"

// The sheet pulls in Radix Dialog, RadioGroup and next-themes (~25 KB gz); load it on first open, not with every page.
const ContentsSheet = dynamic(() => import("./contents-sheet").then((module) => module.ContentsSheet), { ssr: false })

/** The menu button in the head on phones: two short lines, named "Menu" for screen readers. */
export function ContentsTrigger({ className }: Readonly<{ className?: string }>) {
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button
        ref={trigger}
        type="button"
        aria-label="Menu"
        data-umami-event="menu-open"
        data-contents-trigger
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setLoaded(true)
          setOpen(true)
        }}
        className={cn("inline-flex size-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted", className)}
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
          <path d="M3 9h18M3 15h18" />
        </svg>
      </button>
      {loaded && <ContentsSheet open={open} onOpenChange={setOpen} returnFocus={trigger} />}
    </>
  )
}
