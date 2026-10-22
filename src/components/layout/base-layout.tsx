import type { ReactNode } from "react"
import Footer from "@/components/layout/footer"
import { DeferredClientUtilities } from "@/components/layout/deferred-client-utilities"
import { RunningHead, SHELL_WIDTH } from "@/components/layout/running-head"

interface BaseLayoutProps {
  children: ReactNode
  /** Full-width slot above the page wrapper, inside main (home masthead only). */
  bleed?: ReactNode
  /** `compact` on /ai and /chat. */
  footer?: "full" | "compact" | "none"
  /** App-like page that fills the viewport below the running head and never scrolls itself (/chat). */
  fit?: boolean
}

/** Visitor shell. Reads no cookies, so pages under it can be static or ISR. */
export default function BaseLayout({ children, bleed, footer = "full", fit = false }: Readonly<BaseLayoutProps>) {
  if (fit) {
    // The page takes whatever the head and footer leave. Phones drop the footer for room; the menu carries its links.
    return (
      <div className="flex h-dvh flex-col">
        <RunningHead />
        <main id="main" className="flex min-h-0 flex-1 flex-col">
          {bleed}
          <div className={`${SHELL_WIDTH} flex min-h-0 flex-1 flex-col overflow-hidden pt-6 sm:pt-8`}>{children}</div>
        </main>
        {footer !== "none" && (
          <div className="hidden shrink-0 md:block">
            <Footer variant={footer} />
          </div>
        )}
        <DeferredClientUtilities />
      </div>
    )
  }

  return (
    <>
      <RunningHead />
      <main id="main">
        {bleed}
        <div className={`${SHELL_WIDTH} pb-16 pt-8 sm:pb-24 sm:pt-12`}>{children}</div>
      </main>
      {footer !== "none" && <Footer variant={footer} />}
      <DeferredClientUtilities />
    </>
  )
}
