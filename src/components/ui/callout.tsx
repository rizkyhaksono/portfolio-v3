import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Notion's grey callout: an icon and a short passage on a tinted block. One per page at most. */
export function Callout({ icon, children, className }: Readonly<{ icon?: ReactNode; children: ReactNode; className?: string }>) {
  return (
    <div className={cn("flex gap-3 rounded-md bg-tint px-4 py-3.5 text-body text-foreground", className)}>
      {icon && (
        <span aria-hidden className="mt-0.5 shrink-0 [&>svg]:size-5 [&>svg]:stroke-[1.5]">
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

export default Callout
