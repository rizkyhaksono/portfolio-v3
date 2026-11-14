"use client"

import { useRef, useState } from "react"
import dynamic from "next/dynamic"
import { PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"

// The sheet pulls in Radix Dialog; load it on first open, not with every page.
const ContentsSheet = dynamic(() => import("./contents-sheet").then((module) => module.ContentsSheet), { ssr: false })

/** Notion's sidebar button in the top bar below lg, named "Menu" for screen readers. */
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
        className={cn("inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-tint hover:text-foreground", className)}
      >
        <PanelLeft aria-hidden className="size-5" strokeWidth={1.5} />
      </button>
      {loaded && <ContentsSheet open={open} onOpenChange={setOpen} returnFocus={trigger} />}
    </>
  )
}
