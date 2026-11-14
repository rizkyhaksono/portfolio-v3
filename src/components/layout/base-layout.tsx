import type { ReactNode } from "react"
import Footer from "@/components/layout/footer"
import { DeferredClientUtilities } from "@/components/layout/deferred-client-utilities"
import { Sidebar } from "@/components/layout/sidebar"
import { TopBar } from "@/components/layout/top-bar"
import { PROSE_WIDTH, WIDE_WIDTH } from "@/lib/design-system"
import { cn } from "@/lib/utils"

interface BaseLayoutProps {
  children: ReactNode
  /** `none` drops the closing line (/chat, the hidden /ai pages). `compact` is kept as an alias of `none`. */
  footer?: "full" | "compact" | "none"
  /** App-like page that fills the viewport below the top bar and never scrolls itself (/chat). */
  fit?: boolean
  /** Notion's full-width page for app-like pages (/tools, /chat); everything else reads in the 708px column. */
  width?: "prose" | "wide"
  /** Notion's page cover, full width above the column (the Langit Malang sky on home). */
  cover?: ReactNode
}

/** Visitor shell, after a Notion workspace: grey sidebar, top bar with the path, then the page. Reads no cookies. */
export default function BaseLayout({ children, footer = "full", fit = false, width = "prose", cover }: Readonly<BaseLayoutProps>) {
  const column = width === "wide" ? WIDE_WIDTH : PROSE_WIDTH

  return (
    <div className="flex min-h-svh">
      <Sidebar />
      <div className={cn("flex min-w-0 flex-1 flex-col", fit && "h-dvh")}>
        <TopBar />
        {fit ? (
          <main id="main" className="flex min-h-0 flex-1 flex-col">
            <div className={cn(column, "flex min-h-0 flex-1 flex-col overflow-hidden pb-4 pt-6 sm:pt-8")}>{children}</div>
          </main>
        ) : (
          <>
            <main id="main" className="flex-1">
              {cover}
              <div className={cn(column, "pb-24", !cover && "pt-12 sm:pt-20")}>{children}</div>
            </main>
            {footer === "full" && <Footer className={column} />}
          </>
        )}
      </div>
      <DeferredClientUtilities />
    </div>
  )
}
