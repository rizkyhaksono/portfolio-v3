interface ProfileSheetProps {
  title: React.ReactNode
  /** One muted line under the name. */
  description?: React.ReactNode
  /** The round avatar beside the name. */
  portrait?: React.ReactNode
  /** A wide picture above the head (the cover). */
  cover?: React.ReactNode
  children: React.ReactNode
}

/** Profile page: cover, avatar and name, then plain rows in the reading column. */
export function ProfileSheet({ title, description, portrait, cover, children }: Readonly<ProfileSheetProps>) {
  return (
    <article className="w-full">
      {cover && <div className="mb-6">{cover}</div>}
      <header className="flex items-center gap-4">
        {portrait}
        <div className="min-w-0">
          <h1 className="text-h1 text-balance text-foreground [overflow-wrap:anywhere]">{title}</h1>
          {description && <p className="mt-1 text-body text-muted-foreground">{description}</p>}
        </div>
      </header>
      <div className="mt-6">{children}</div>
    </article>
  )
}
