import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: ReactNode
  /** One or two sentences under the title, in muted text. */
  description?: ReactNode
  /** What sits between the title and the page body: `Properties`, a feed link, view tabs. */
  children?: ReactNode
  className?: string
}

/** The top of a Notion page: the 40px bold title, a muted line and the page's properties. No page icon: the owner wants it simple. */
export function PageHeader({ title, description, children, className }: Readonly<PageHeaderProps>) {
  return (
    <header className={cn("mb-8", className)}>
      <h1 className="text-title text-balance text-foreground sm:text-display">{title}</h1>
      {description && <p className="mt-2 text-pretty text-small text-muted-foreground sm:mt-3 sm:text-body">{description}</p>}
      {children && <div className="mt-5">{children}</div>}
    </header>
  )
}

export default PageHeader
