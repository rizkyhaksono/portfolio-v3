import { RunningHead } from "@/components/layout/running-head"
import { Sky, SkyToggle } from "@/components/ui/sky"
import { PROSE_WIDTH } from "@/lib/design-system"
import { cn } from "@/lib/utils"

interface AuthShellProps {
  title: React.ReactNode
  /** One short muted line under the title. */
  description?: React.ReactNode
  /** Short muted lines under the form: the terms, a way back. */
  footer?: React.ReactNode
  children: React.ReactNode
}

/**
 * Auth pattern (server, no cookies). The same head as every page, then a narrow form left-aligned under the handle,
 * and the Langit Malang landscape as the ground the page ends on (no footer text: these pages stay on one task).
 */
export function AuthShell({ title, description, footer, children }: Readonly<AuthShellProps>) {
  return (
    <div className="flex min-h-svh flex-col">
      <RunningHead />

      <main id="main" className="flex-1">
        <div className={cn(PROSE_WIDTH, "pb-16 pt-12 sm:pt-16")}>
          <div className="max-w-sm">
            <header className="mb-10">
              <h1 className="text-h1 text-balance text-foreground">{title}</h1>
              {description && <p className="mt-2 text-pretty text-body text-muted-foreground">{description}</p>}
            </header>

            {children}

            {footer && <div className="mt-10 flex flex-col gap-2 text-small text-muted-foreground">{footer}</div>}
          </div>
        </div>
      </main>

      <div data-print-hide className="relative isolate h-72 overflow-hidden sm:h-96">
        <Sky />
        {/* Not shown on screen, reachable by keyboard and screen readers (WCAG 2.2.2), as in the footer. */}
        <SkyToggle className="sr-only left-4 top-4 text-small text-foreground focus-visible:not-sr-only focus-visible:absolute" />
      </div>
    </div>
  )
}

export default AuthShell
