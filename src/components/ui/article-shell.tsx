import { ChevronRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { InkLink } from "@/components/ui/ink-link"
import { Properties, type Property } from "@/components/ui/properties"
import { cn } from "@/lib/utils"

interface ArticleLink {
  href: string
  title: string
}

export interface ArticleShellProps {
  /** The page `h1`. */
  title: React.ReactNode
  /** Notion's page icon above the title (`<SectionIcon href=… />`). */
  icon?: React.ReactNode
  /** One muted line under the title. */
  standfirst?: React.ReactNode
  /** Notion's page properties under the title: Published, Reading time, Source, Tags. */
  properties?: Property[]
  /** A sentence, never a middle-dot string: "Published 3 March 2026. Six minutes to read." */
  dateline?: React.ReactNode
  /** Muted lines under the properties: reader count, where it was first published, outside links. */
  meta?: React.ReactNode
  /** Tags, as grey Notion tags. Prefer a "Tags" property. */
  chips?: string[]
  /** The contents ("On this page"), in a closed toggle under the properties. */
  rail?: React.ReactNode
  /** Summary of the contents toggle. */
  railLabel?: string
  /** The picture at the top of the page, above the icon and title (a post's cover, a project's screenshot). */
  cover?: React.ReactNode
  /** After the text, before previous / next (comments, claps). */
  footer?: React.ReactNode
  prev?: ArticleLink
  next?: ArticleLink
  /** The text, set in `.prose`. */
  children: React.ReactNode
  className?: string
}

/**
 * Article pattern, as a Notion page (server, no cookies): the picture, the icon and the 40px title, the page's
 * properties, a hairline, the text, then previous / next.
 */
export function ArticleShell({
  title,
  icon,
  standfirst,
  properties,
  dateline,
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
      {cover && <div className="mb-10">{cover}</div>}

      <header className="border-b border-border pb-6">
        {icon && (
          <div aria-hidden className="mb-4 text-foreground [&>svg]:size-14 [&>svg]:stroke-[1.25]">
            {icon}
          </div>
        )}
        <h1 className="text-title text-balance text-foreground sm:text-display">{title}</h1>
        {standfirst && <p className="mt-3 text-pretty text-body text-muted-foreground">{standfirst}</p>}
        {properties && properties.length > 0 && <Properties items={properties} className="mt-5" />}
        {dateline && <p className="mt-3 text-small tabular-nums text-muted-foreground">{dateline}</p>}
        {meta && <div className="mt-2 flex flex-col gap-1 text-small text-muted-foreground">{meta}</div>}
        {chips && chips.length > 0 && (
          <ul role="list" aria-label="Tags" className="mt-3 flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <li key={chip}>
                <Badge>{chip}</Badge>
              </li>
            ))}
          </ul>
        )}
        {rail && (
          <details className="group mt-4 text-small text-muted-foreground">
            <summary className="-mx-1.5 flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-md px-1.5 font-medium text-foreground transition-colors hover:bg-tint md:min-h-8 [&::-webkit-details-marker]:hidden">
              <ChevronRight className="size-4 text-muted-foreground transition-transform duration-ui ease-out group-open:rotate-90" strokeWidth={2} aria-hidden />
              {railLabel}
            </summary>
            <div className="flex flex-col gap-1 pb-1 pl-6 pt-1">{rail}</div>
          </details>
        )}
      </header>

      <div className="prose mt-8">{children}</div>

      {footer}

      {(prev || next) && (
        <nav aria-label="More to read" className="mt-16 grid gap-2 border-t border-border pt-4 sm:grid-cols-2">
          {prev && (
            <InkLink href={prev.href} className="group -mx-2 flex flex-col rounded-md px-2 py-2 no-underline transition-colors hover:bg-tint">
              <span className="text-caption text-muted-foreground">Previous</span>
              <span className="text-small font-medium">{prev.title}</span>
            </InkLink>
          )}
          {next && (
            <InkLink href={next.href} className="group -mx-2 flex flex-col rounded-md px-2 py-2 no-underline transition-colors hover:bg-tint sm:col-start-2 sm:text-right">
              <span className="text-caption text-muted-foreground">Next</span>
              <span className="text-small font-medium">{next.title}</span>
            </InkLink>
          )}
        </nav>
      )}
    </article>
  )
}

export default ArticleShell
