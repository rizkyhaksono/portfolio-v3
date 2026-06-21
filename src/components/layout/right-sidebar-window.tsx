"use client"

import { useEffect, useState } from "react"
import { X, PanelRightOpen } from "lucide-react"

const STORAGE_KEY = "rh:right-sidebar-open"

export default function RightSidebarWindow({ children }: Readonly<{ children: React.ReactNode }>) {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "false") setOpen(false)
    } catch {
      // localStorage unavailable (private mode / blocked) — keep default open
    }
  }, [])

  const setOpenPersist = (next: boolean) => {
    setOpen(next)
    try {
      localStorage.setItem(STORAGE_KEY, String(next))
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  }

  // Collapsed → slim reopen button (lets the body reclaim the space).
  if (!open) {
    return (
      <div className="hidden lg:flex sticky top-16 items-start pt-1">
        <button
          onClick={() => setOpenPersist(true)}
          title="Show info panel"
          aria-label="Show info panel"
          className="flex items-center justify-center rounded-lg border border-border/60 bg-background/60 p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <PanelRightOpen size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className="hidden lg:flex lg:w-64 xl:w-72 flex-col sticky top-16 h-[calc(100vh-4rem)]">
      <div className="flex max-h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-background/40 shadow-sm backdrop-blur-sm">
        {/* mac title bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-border/60 bg-muted/40 px-3 py-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setOpenPersist(false)}
              aria-label="Close panel"
              className="group/dot flex h-3 w-3 items-center justify-center rounded-full bg-red-400/90 transition-colors hover:bg-red-400"
            >
              <X size={8} strokeWidth={3} className="text-red-950 opacity-0 transition-opacity group-hover/dot:opacity-100" />
            </button>
            <span className="h-3 w-3 rounded-full bg-yellow-400/90" />
            <span className="h-3 w-3 rounded-full bg-green-400/90" />
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">~/info</span>
        </div>

        {/* content */}
        <div className="space-y-4 overflow-y-auto p-3">{children}</div>
      </div>
    </div>
  )
}
