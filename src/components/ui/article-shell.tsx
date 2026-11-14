import { ArrowLeft, ChevronDown } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { InkLink } from "@/components/ui/ink-link"
import { BREAKOUT } from "@/lib/design-system"
import { cn } from "@/lib/utils"

interface ArticleLink {
  href: string
  title: string
}

export interface ArticleShellProps {
  /** The page `h1`. */
  title: React.ReactNode
  /** One muted line under the title. */
  standfirst?: React.ReactNode
  /** A sentence, never a middle-dot string: "Published 3 March 2026. Six minutes to read." */
  dateline?: React.ReactNode
  /** The index this page belongs to, as a small link above the title ("All projects"). */
  back?: ArticleLink
  /** Muted lines under the dateline: reader count, where it was first published, outside links. */
  meta?: React.ReactNode
  /** Tags, as small chips under the dateline. */
  chips?: string[]
  /** The contents ("On this page"), in a closed disclosure under the dateline. */
  rail?: React.ReactNode
  /** Summary of the contents disclosure. */
  railLabel?: string
  /** The hero image tile, between the head and the text; it breaks out of the column on large screens. */
  cover?: React.ReactNode
  /** After the text, before previous / next (comments, claps). */
  footer?: React.ReactNode
  prev?: ArticleLink
  next?: ArticleLink
  /** The text, set in `.prose`. */
  children: React.ReactNode
  className?: string
}

const TARGET = "inline-flex min-h-11 items-center md:min-h-0"

/** Article pattern (server, no cookies): a quiet head in the reading column, the text, then previous / next. */
export function ArticleShell({
  title,
  standfirst,
  dateline,
  back,
  meta,
  chips,
  rail,
  railLabel = "On this page",
  cover,
  footer,
  prev,
  next,
  children,
  className,
}: Readonly<ArticleShellProps>) {
  return (
    <article className={className}>
      <header>
        {back && (
          <p className="mb-6 text-small">
            <InkLink
              href={back.href}
              icon={<ArrowLeft strokeWidth={1.5} />}
              className={cn(TARGET, "text-muted-foreground no-underline hover:text-foreground")}
            >
              {back.title}
            </InkLink>
          </p>
        )}
        <h1 className="text-h1 text-balance text-foreground">{title}</h1>
        {standfirst && <p className="mt-2 text-pretty text-body text-muted-foreground">{standfirst}</p>}
        {dateline && <p className="mt-2 text-small tabular-nums text-muted-foreground">{dateline}</p>}
        {meta && <div className="mt-1 flex flex-col gap-1 text-small text-muted-foreground">{meta}</div>}
        {chips && chips.length > 0 && (
          <ul role="list" aria-label="Tags" className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <li key={chip}>
                <Badge>{chip}</Badge>
              </li>
            ))}
          </ul>
        )}
        {rail && (
          <details className="group mt-6 text-small text-muted-foreground">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-foreground md:min-h-9 [&::-webkit-details-marker]:hidden">
              {railLabel}
              <ChevronDown className="size-4 transition-transform duration-ui ease-out group-open:rotate-180" strokeWidth={1.5} aria-hidden />
            </summary>
            <div className="flex flex-col gap-3 pb-2 pt-2">{rail}</div>
          </details>
        )}
      </header>

      {cover && <div className={cn("mt-8", BREAKOUT)}>{cover}</div>}

      <div className="prose mt-8">{children}</div>

      {footer}

      {(prev || next) && (
        <nav aria-label="More to read" className="mt-14 grid gap-6 sm:grid-cols-2">
          {prev && (
            <p className="text-small text-muted-foreground">
              <span className="block">Previous</span>
              <InkLink href={prev.href} className={cn(TARGET, "text-body")}>
                {prev.title}
              </InkLink>
            </p>
          )}
          {next && (
            <p className="text-small text-muted-foreground sm:col-start-2 sm:text-right">
              <span className="block">Next</span>
              <InkLink href={next.href} className={cn(TARGET, "text-body")}>
                {next.title}
              </InkLink>
            </p>
          )}
        </nav>
      )}
    </article>
  )
}

export default ArticleShell
