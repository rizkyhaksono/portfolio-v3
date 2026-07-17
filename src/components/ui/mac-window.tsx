import { cn } from "@/lib/utils"
import { SURFACE } from "@/lib/design-system"

interface MacWindowProps {
  title?: string
  children: React.ReactNode
  className?: string
  bodyClassName?: string
  /**
   * When false, omits backdrop-blur so drag-and-drop libs that use
   * `position: fixed` (e.g. @hello-pangea/dnd) are not offset by a
   * filter-containing ancestor.
   */
  backdrop?: boolean
}

/**
 * macOS-style window chrome: a title bar with traffic-light dots and an optional
 * centered mono title, wrapping arbitrary content. Intentionally avoids
 * `overflow-hidden` so `position: sticky` children (e.g. the tools sidebar) keep working.
 *
 * Glass surface only — do not use for solid content cards (use Card / Surface / FeatureCard).
 */
export function MacWindow({
  title,
  children,
  className,
  bodyClassName,
  backdrop = true,
}: Readonly<MacWindowProps>) {
  return (
    <div className={cn(backdrop ? SURFACE.glass : SURFACE.glassNoBlur, className)}>
      <div className="flex items-center gap-3 rounded-t-2xl border-b border-border/60 bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400/90" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/90" />
          <span className="h-3 w-3 rounded-full bg-green-400/90" />
        </div>
        {title && <p className="flex-1 truncate text-center font-mono text-xs text-muted-foreground">{title}</p>}
        <div className="w-[46px] shrink-0" aria-hidden />
      </div>
      <div className={cn("p-4 sm:p-6", bodyClassName)}>{children}</div>
    </div>
  )
}

export default MacWindow
