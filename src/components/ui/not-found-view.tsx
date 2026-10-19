import { Engraving } from "@/components/ui/engraving"
import { InkLink } from "@/components/ui/ink-link"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"

interface NotFoundViewProps {
  title?: string
  /** Replaces the default standfirst; error.tsx passes its message and a retry button here. */
  children?: React.ReactNode
  className?: string
}

/** Not found pattern: the seal, italic title, one standfirst, two ways back, and the riders cut from the plate. */
export function NotFoundView({ title = "Page not found", children, className }: Readonly<NotFoundViewProps>) {
  return (
    <section className={cn("mx-auto grid w-full max-w-[60rem] items-center gap-10 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:py-24", className)}>
      <div>
        <Logo variant="seal" label="Rizky Haksono printer's mark" className="mb-6 w-20 sm:w-24" />
        <h1 className="font-display text-h1 text-balance text-ink">{title}</h1>
        <div className="mt-4 max-w-[46ch] font-display text-lead text-ink-soft">
          {children ?? <p>Nothing is printed at this address. The page may have moved, or the link has a typo.</p>}
        </div>
        <ul role="list" className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-body">
          <li>
            <InkLink href="/" className="inline-flex min-h-11 items-center md:min-h-0">Home</InkLink>
          </li>
          <li>
            <InkLink href="/project" className="inline-flex min-h-11 items-center md:min-h-0">Projects</InkLink>
          </li>
        </ul>
      </div>
      <Engraving crop="riders" />
    </section>
  )
}

export default NotFoundView
