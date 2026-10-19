import type { ReactNode } from "react"
import Footer from "@/components/layout/footer"
import { DeferredClientUtilities } from "@/components/layout/deferred-client-utilities"
import { RunningHead, SHELL_WIDTH } from "@/components/layout/running-head"

interface BaseLayoutProps {
  children: ReactNode
  /** Full-width slot above the page wrapper, inside main (home masthead only). */
  bleed?: ReactNode
  /** `compact` on /ai. */
  footer?: "full" | "compact" | "none"
  /** App-like page that fills the viewport below the running head and never scrolls itself (/chat). */
  fit?: boolean
}

/** Visitor shell. Reads no cookies, so pages under it can be static or ISR. */
export default function BaseLayout({ children, bleed, footer = "full", fit = false }: Readonly<BaseLayoutProps>) {
  return (
    <>
      <RunningHead />
      <main id="main">
        {bleed}
        <div
          className={
            fit
              ? `${SHELL_WIDTH} flex h-[calc(100dvh-var(--head-h)-1px)] flex-col overflow-hidden pt-6 sm:pt-8`
              : `${SHELL_WIDTH} pb-16 pt-8 sm:pb-24 sm:pt-12`
          }
        >
          {children}
        </div>
      </main>
      {footer !== "none" && <Footer variant={footer} />}
      <DeferredClientUtilities />
    </>
  )
}
