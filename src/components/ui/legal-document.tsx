import { Fragment } from "react"

import { ArticleShell, type ArticleShellProps } from "@/components/ui/article-shell"
import { InkLink } from "@/components/ui/ink-link"

interface LegalSection {
  /** Anchor id, kebab-case. */
  id: string
  /** Sentence case, without the number: the § number comes from the order. */
  title: string
  /** Paragraphs and lists; they sit straight in `.prose`, so its spacing applies. */
  body: React.ReactNode
}

interface LegalDocumentProps extends Omit<ArticleShellProps, "rail" | "railLabel" | "children"> {
  sections: LegalSection[]
}

/** Legal pages as Notion pages: § numbered sections, their contents in the "On this page" toggle. */
export function LegalDocument({ sections, ...shell }: Readonly<LegalDocumentProps>) {
  return (
    <ArticleShell
      {...shell}
      rail={
        <ol role="list">
          {sections.map(({ id, title }, index) => (
            <li key={id}>
              <InkLink
                href={`#${id}`}
                className="-mx-1.5 flex min-h-11 items-center gap-2 rounded-md px-1.5 no-underline transition-colors hover:bg-tint md:min-h-8"
              >
                <span className="w-8 shrink-0 tabular-nums text-muted-foreground">&sect;&nbsp;{index + 1}</span>
                {title}
              </InkLink>
            </li>
          ))}
        </ol>
      }
    >
      {sections.map(({ id, title, body }, index) => (
        <Fragment key={id}>
          <h2 id={id}>
            <span className="tabular-nums text-muted-foreground">&sect;&nbsp;{index + 1}</span> {title}
          </h2>
          {body}
        </Fragment>
      ))}
    </ArticleShell>
  )
}

export default LegalDocument
