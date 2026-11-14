import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: ReactNode
  /** Notion's page icon above the title: a lucide icon (`<SectionIcon href=… />`) or a picture. */
  icon?: ReactNode
  /** One or two sentences under the title, in muted text. */
  description?: ReactNode
  /** What sits between the title and the page body: `Properties`, a feed link, view tabs. */
  children?: ReactNode
  className?: string
}

/** The top of a Notion page: an optional icon, the 40px bold title, a muted line and the page's properties. */
export function PageHeader({ title, icon, description, children, className }: Readonly<PageHeaderProps>) {
  return (
    <header className={cn("mb-8", className)}>
      {icon && (
        <div aria-hidden className="mb-4 text-foreground [&>svg]:size-14 [&>svg]:stroke-[1.25]">
          {icon}
        </div>
      )}
      <h1 className="text-title text-balance text-foreground sm:text-display">{title}</h1>
      {description && <p className="mt-3 text-pretty text-body text-muted-foreground">{description}</p>}
      {children && <div className="mt-5">{children}</div>}
    </header>
  )
}

export default PageHeader
