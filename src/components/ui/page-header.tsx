import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: ReactNode
  /** One or two sentences under the title, in muted text. */
  description?: ReactNode
  /** Links or controls that belong to the header (a feed link, a filter). */
  children?: ReactNode
  className?: string
}

/** The head of every index page: a quiet 24px title and an intro line, left-aligned in the reading column. */
export function PageHeader({ title, description, children, className }: Readonly<PageHeaderProps>) {
  return (
    <header className={cn("mb-10", className)}>
      <h1 className="text-h1 text-balance text-foreground">{title}</h1>
      {description && <p className="mt-2 text-pretty text-body text-muted-foreground">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </header>
  )
}

export default PageHeader
