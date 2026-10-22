import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusLineProps {
  kind: "empty" | "failed" | "loading"
  children: React.ReactNode
  /** A retry button or link, set after the line. */
  action?: React.ReactNode
  className?: string
}

/** One left-aligned line for a list or feed that is empty, failed or still loading. Real 404s keep NotFoundView. */
export function StatusLine({ kind, children, action, className }: Readonly<StatusLineProps>) {
  if (kind === "failed") {
    return (
      <div role="alert" className={cn("flex flex-col items-start gap-3 border border-ink p-4 sm:flex-row sm:items-center sm:justify-between", className)}>
        <p className="flex gap-2 font-display text-body text-ink">
          <X aria-hidden strokeWidth={1.5} className="mt-1 size-4 shrink-0" />
          <span>{children}</span>
        </p>
        {action}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col items-start gap-3", className)}>
      <p
        role={kind === "loading" ? "status" : undefined}
        className={kind === "loading" ? "font-display text-caption text-ink-soft" : "text-body text-ink-soft"}
      >
        {children}
      </p>
      {action}
    </div>
  )
}
