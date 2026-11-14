import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NotFoundViewProps {
  title?: string
  /** Replaces the default line. */
  children?: React.ReactNode
  /** A button set before the ways back, such as error.tsx's retry. */
  action?: React.ReactNode
  className?: string
}

/** Notion's empty page: a large muted icon, a short title, one muted line and the ways back as buttons. */
export function NotFoundView({ title = "There is no page at this address.", children, action, className }: Readonly<NotFoundViewProps>) {
  return (
    <section className={cn("w-full", className)}>
      <FileQuestion aria-hidden strokeWidth={1.25} className="mb-4 size-14 text-muted-foreground" />
      <h1 className="text-h1 text-balance text-foreground">{title}</h1>
      <div className="mt-2 text-pretty text-body text-muted-foreground">
        {children ?? <p>It may have moved, or the link has a typo.</p>}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {action}
        <Button asChild variant="outline" className="min-h-11 md:min-h-8">
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="ghost" className="min-h-11 md:min-h-8">
          <Link href="/project">See the projects</Link>
        </Button>
      </div>
    </section>
  )
}

export default NotFoundView
