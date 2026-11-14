interface ProfileSheetProps {
  title: React.ReactNode
  /** One italic lead line under the title. */
  standfirst?: React.ReactNode
  /** Square duotone portrait beside the title. */
  portrait?: React.ReactNode
  /** A plate above the head (the cover). */
  cover?: React.ReactNode
  children: React.ReactNode
}

/** Profile card pattern: a double-rule sheet (1px ink, 3px paper, 1px rule) with its head on a single ink rule. */
export function ProfileSheet({ title, standfirst, portrait, cover, children }: Readonly<ProfileSheetProps>) {
  return (
    <article className="w-full border border-foreground p-[3px]">
      <div className="border border-border p-5 sm:p-8">
        {cover && <div className="mb-8">{cover}</div>}
        <header className="flex items-end gap-5 pb-6">
          {portrait}
          <div className="min-w-0">
            <h1 className="text-h2 text-balance text-foreground [overflow-wrap:anywhere]">{title}</h1>
            {standfirst && <p className="mt-2 text-lead text-muted-foreground">{standfirst}</p>}
          </div>
        </header>
        <div aria-hidden className="border-t border-foreground" />
        <div className="mt-8">{children}</div>
      </div>
    </article>
  )
}
