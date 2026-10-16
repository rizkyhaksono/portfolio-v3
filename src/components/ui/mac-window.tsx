import { cn } from "@/lib/utils"

interface MacWindowProps {
  title?: string
  children: React.ReactNode
  className?: string
  bodyClassName?: string
  /** @deprecated Kept for call-site compatibility. The editorial panel has no backdrop filter. */
  backdrop?: boolean
}

/** Retired name kept for call sites: a section between two hairline rules, printed on the paper. */
export function MacWindow(props: Readonly<MacWindowProps>) {
  const { title, children, className, bodyClassName } = props

  return (
    <section className={cn("border-y border-rule", className)}>
      {title ? <h2 className="sr-only">{title.replace(/^~\//, "")}</h2> : null}
      <div className={cn("py-4 sm:py-5", bodyClassName)}>{children}</div>
    </section>
  )
}

export default MacWindow
