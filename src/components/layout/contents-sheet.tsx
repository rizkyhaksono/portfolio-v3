"use client"

import type { RefObject } from "react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { SidebarNav } from "@/components/layout/sidebar-nav"

interface ContentsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The trigger lives outside Radix (see contents-trigger.tsx), so focus goes back to it by hand. */
  returnFocus: RefObject<HTMLButtonElement | null>
}

/** Below lg the sidebar slides in from the left, as Notion's does on a narrow window. Loaded on first open. */
export function ContentsSheet({ open, onOpenChange, returnFocus }: Readonly<ContentsSheetProps>) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        aria-describedby={undefined}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          returnFocus.current?.focus({ preventScroll: true })
        }}
        // Any link or button in the tree closes the sheet; the feedback dialog opens on its own.
        onClickCapture={(event) => {
          if ((event.target as HTMLElement).closest("a, button[data-open-feedback]")) onOpenChange(false)
        }}
        className="flex w-72 max-w-[85vw] flex-col gap-0 overflow-y-auto bg-muted p-0 pt-12 sm:max-w-72"
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SidebarNav area="menu" className="flex-1" />
      </SheetContent>
    </Sheet>
  )
}
