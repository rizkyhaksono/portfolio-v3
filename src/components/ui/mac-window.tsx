import { cn } from "@/lib/utils"

interface MacWindowProps {
  title?: string
  children: React.ReactNode
  className?: string
  bodyClassName?: string
  /** @deprecated Kept for call-site compatibility. The editorial panel has no backdrop filter. */
  backdrop?: boolean
}

/**
 * Legacy name retained for compatibility. This is now a quiet editorial panel:
 * square, solid, and free of decorative operating-system chrome.
 */
export function MacWindow({
  title,
  children,
  className,
  bodyClassName,
  backdrop: _backdrop = true,
}: Readonly<MacWindowProps>) {
  return (
    <section className={cn("border-y border-border bg-background", className)}>
      {title ? <h2 className="sr-only">{title.replace(/^~\//, "")}</h2> : null}
      <div className={cn("py-4 sm:py-5", bodyClassName)}>{children}</div>
    </section>
  )
}

export default MacWindow
