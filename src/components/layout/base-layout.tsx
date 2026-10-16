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
}

/** Visitor shell. Reads no cookies, so pages under it can be static or ISR. */
export default function BaseLayout({ children, bleed, footer = "full" }: Readonly<BaseLayoutProps>) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-2 focus:z-50 focus:border focus:border-ink focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
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
