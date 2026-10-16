"use client"

import { useRef, useState } from "react"
import dynamic from "next/dynamic"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// The sheet pulls in Radix Dialog, RadioGroup and next-themes (~25 KB gz); load it on first open, not with every page.
const ContentsSheet = dynamic(() => import("./contents-sheet").then((module) => module.ContentsSheet), { ssr: false })

/** The Contents button in the running head (below 1024px). */
export function ContentsTrigger({ className }: Readonly<{ className?: string }>) {
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button
        ref={trigger}
        type="button"
        data-umami-event="contents-open"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setLoaded(true)
          setOpen(true)
        }}
        className={cn(buttonVariants({ variant: "outline" }), "h-9 px-3", className)}
      >
        Contents
      </button>
      {loaded && <ContentsSheet open={open} onOpenChange={setOpen} returnFocus={trigger} />}
    </>
  )
}
