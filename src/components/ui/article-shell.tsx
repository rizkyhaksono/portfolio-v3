import { Minus, Plus } from "lucide-react"

import { InkLink } from "@/components/ui/ink-link"
import { cn } from "@/lib/utils"

interface ArticleLink {
  href: string
  title: string
}

export interface ArticleShellProps {
  /** Set as the page `h1`, display italic. */
  title: React.ReactNode
  /** One italic lead line under the title. */
  standfirst?: React.ReactNode
  /** A sentence, never a middle-dot string: "Published 3 March 2026. Six minutes to read." */
  dateline?: React.ReactNode
  /** Rail content (reader count, tags, contents). Sticky beside the text from lg, a disclosure below. */
  rail?: React.ReactNode
  /** Summary of the rail disclosure below lg. */
  railLabel?: string
  /** After the tail-piece, before previous / next (letters, claps). */
  footer?: React.ReactNode
  prev?: ArticleLink
  next?: ArticleLink
  /** The text, set in `.prose`. */
  children: React.ReactNode
  className?: string
}

/**
 * Article pattern (server, no cookies): head on a single ink rule, a 13rem sticky rail beside a 66ch column,
 * a tail-piece and previous / next. The reading hairline under the running head is CSS only (`.reading-hairline`); home renders it too.
 */
export function ArticleShell({
  title,
  standfirst,
  dateline,
  rail,
  railLabel = "About this page",
  footer,
  prev,
  next,
  children,
  className,
}: Readonly<ArticleShellProps>) {
  return (
    // The shell's full width, so an index and its articles share one left edge; `.prose` keeps the 66ch measure.
    <article className={cn("text-prose", className)}>
      <div aria-hidden data-print-hide className="reading-hairline" />

      <header className="pb-8">
        <h1 className="font-display text-h2 text-balance text-ink sm:text-h1">{title}</h1>
        {standfirst && <div className="mt-4 max-w-[46ch] font-display text-lead text-ink-soft">{standfirst}</div>}
        {dateline && <p className="mt-4 font-display text-caption tabular-nums text-ink-soft">{dateline}</p>}
      </header>
      <div aria-hidden className="border-t border-ink" />

      <div className={cn("mt-8 grid gap-y-8", rail && "lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-x-12")}>
        {rail && (
          <details className="article-rail group self-start border-b border-rule text-small text-ink-soft lg:sticky lg:top-[calc(var(--head-h)+1.5rem)] lg:border-0">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-ink [&::-webkit-details-marker]:hidden">
              {railLabel}
              <Plus className="size-4 group-open:hidden" strokeWidth={1.5} aria-hidden />
              <Minus className="hidden size-4 group-open:block" strokeWidth={1.5} aria-hidden />
            </summary>
            <div className="flex flex-col gap-4 pb-6 lg:pb-0">{rail}</div>
          </details>
        )}

        <div className="min-w-0">
          <div className="prose">{children}</div>

          <div aria-hidden className="tail-piece" />
          {footer}

          {(prev || next) && (
            <nav aria-label="More to read" className="mt-12 grid gap-6 border-t border-rule pt-6 sm:grid-cols-2">
              {prev && (
                <p className="text-small text-ink-soft">
                  <span className="block font-display text-caption">Previous</span>
                  <InkLink href={prev.href} className="inline-flex min-h-11 items-center font-display text-h4 md:min-h-0">
                    {prev.title}
                  </InkLink>
                </p>
              )}
              {next && (
                <p className="text-small text-ink-soft sm:col-start-2 sm:text-right">
                  <span className="block font-display text-caption">Next</span>
                  <InkLink href={next.href} className="inline-flex min-h-11 items-center font-display text-h4 md:min-h-0">
                    {next.title}
                  </InkLink>
                </p>
              )}
            </nav>
          )}
        </div>
      </div>
    </article>
  )
}

export default ArticleShell
