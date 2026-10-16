import { Engraving } from "@/components/ui/engraving"
import { InkLink } from "@/components/ui/ink-link"
import { cn } from "@/lib/utils"

interface NotFoundViewProps {
  title?: string
  /** Replaces the default standfirst; error.tsx passes its message and a retry button here. */
  children?: React.ReactNode
  className?: string
}

/** Not found pattern: italic title, one standfirst, two ways back, and the riders cut from the plate. */
export function NotFoundView({ title = "Page not found", children, className }: Readonly<NotFoundViewProps>) {
  return (
    <section className={cn("mx-auto grid w-full max-w-[60rem] items-center gap-10 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:py-24", className)}>
      <div>
        <h1 className="speckle font-display text-h1 text-balance text-ink">{title}</h1>
        <div className="mt-4 max-w-[46ch] font-display text-lead text-ink-soft">
          {children ?? <p>Nothing is printed at this address. The page may have moved, or the link has a typo.</p>}
        </div>
        <ul role="list" className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-body">
          <li>
            <InkLink href="/">Home</InkLink>
          </li>
          <li>
            <InkLink href="/project">Projects</InkLink>
          </li>
        </ul>
      </div>
      <Engraving crop="riders" />
    </section>
  )
}

export default NotFoundView
