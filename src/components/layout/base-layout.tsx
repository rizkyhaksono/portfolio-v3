import type { ReactNode } from "react"
import Footer from "@/components/layout/footer"
import { DeferredClientUtilities } from "@/components/layout/deferred-client-utilities"
import { RunningHead } from "@/components/layout/running-head"
import { PROSE_WIDTH, WIDE_WIDTH } from "@/lib/design-system"
import { cn } from "@/lib/utils"

interface BaseLayoutProps {
  children: ReactNode
  /** `compact` on /chat. */
  footer?: "full" | "compact" | "none"
  /** App-like page that fills the viewport below the head and never scrolls itself (/chat). */
  fit?: boolean
  /** The 960px column for app-like pages (/tools, /chat); everything else reads in the 640px column. */
  width?: "prose" | "wide"
}

/** Visitor shell. Reads no cookies, so pages under it can be static or ISR. */
export default function BaseLayout({ children, footer = "full", fit = false, width = "prose" }: Readonly<BaseLayoutProps>) {
  const wide = width === "wide"
  const column = wide ? WIDE_WIDTH : PROSE_WIDTH

  if (fit) {
    // The page takes whatever the head and footer leave. Phones drop the footer for room; the menu carries its links.
    return (
      <div className="flex h-dvh flex-col">
        <RunningHead wide={wide} />
        <main id="main" className="flex min-h-0 flex-1 flex-col">
          <div className={cn(column, "flex min-h-0 flex-1 flex-col overflow-hidden pt-8 sm:pt-10")}>{children}</div>
        </main>
        {footer !== "none" && (
          <div className="hidden shrink-0 md:block">
            <Footer variant={footer} wide={wide} />
          </div>
        )}
        <DeferredClientUtilities />
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col">
      <RunningHead wide={wide} />
      <main id="main" className="flex-1">
        <div className={cn(column, "pb-24 pt-12 sm:pt-16")}>{children}</div>
      </main>
      {footer !== "none" && <Footer variant={footer} wide={wide} />}
      <DeferredClientUtilities />
    </div>
  )
}
