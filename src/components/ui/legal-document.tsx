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

/** Legal pages on the Article pattern: § numbered sections, their contents in the rail. */
export function LegalDocument({ sections, ...shell }: Readonly<LegalDocumentProps>) {
  return (
    <ArticleShell
      {...shell}
      railLabel="Contents"
      rail={
        <ol role="list" className="flex flex-col gap-2">
          {sections.map(({ id, title }, index) => (
            <li key={id} className="grid grid-cols-[2.25rem_minmax(0,1fr)]">
              <span className="font-display tabular-nums">&sect;&nbsp;{index + 1}</span>
              <InkLink href={`#${id}`} className="inline-flex min-h-11 items-center md:min-h-0 no-underline hover:underline">
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
            <span className="tabular-nums">&sect;&nbsp;{index + 1}</span> {title}
          </h2>
          {body}
        </Fragment>
      ))}
    </ArticleShell>
  )
}

export default LegalDocument
