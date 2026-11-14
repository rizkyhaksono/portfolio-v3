import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: React.ReactNode
  description?: React.ReactNode
  as?: "h1" | "h2" | "h3"
  className?: string
  titleClassName?: string
  /** Right-hand slot on the title line: a "See all" link, a count. */
  aside?: React.ReactNode
  children?: React.ReactNode
}

const TITLE_SIZE = { h1: "text-h1", h2: "text-h2", h3: "text-h3" } as const

/** A small section label in the reading column, with an optional link on its right. */
export function SectionHeading({ title, description, as = "h2", className, titleClassName, aside, children }: Readonly<SectionHeadingProps>) {
  const Tag = as

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <Tag className={cn("text-balance text-foreground", TITLE_SIZE[as], titleClassName)}>{title}</Tag>
        {aside && <div className="shrink-0 text-small text-muted-foreground">{aside}</div>}
      </div>
      {description && <p className="text-body text-muted-foreground">{description}</p>}
      {children}
    </div>
  )
}

export default SectionHeading
