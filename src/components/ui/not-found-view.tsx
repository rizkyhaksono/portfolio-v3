import { InkLink } from "@/components/ui/ink-link"
import { cn } from "@/lib/utils"

interface NotFoundViewProps {
  title?: string
  /** Replaces the default line; error.tsx passes its message and a retry button here. */
  children?: React.ReactNode
  className?: string
}

/** Not found pattern: a quiet 24px title, one muted line, two ways back. */
export function NotFoundView({ title = "There is no page at this address.", children, className }: Readonly<NotFoundViewProps>) {
  return (
    <section className={cn("w-full", className)}>
      <h1 className="text-h1 text-balance text-foreground">{title}</h1>
      <div className="mt-2 text-pretty text-body text-muted-foreground">
        {children ?? <p>It may have moved, or the link has a typo.</p>}
      </div>
      <ul role="list" className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-body">
        <li>
          <InkLink href="/" className="inline-flex min-h-11 items-center md:min-h-0">Go home</InkLink>
        </li>
        <li>
          <InkLink href="/project" className="inline-flex min-h-11 items-center md:min-h-0">See the projects</InkLink>
        </li>
      </ul>
    </section>
  )
}

export default NotFoundView
