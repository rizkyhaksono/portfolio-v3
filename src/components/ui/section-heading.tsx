import { cn } from "@/lib/utils"
import { Eyebrow } from "@/components/ui/eyebrow"

interface SectionHeadingProps {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  align?: "left" | "center"
  as?: "h1" | "h2" | "h3"
  className?: string
  titleClassName?: string
  children?: React.ReactNode
}

const TITLE_SIZE = { h1: "text-h1", h2: "text-h2", h3: "text-h3" } as const

/** Display heading with an optional caption above and a short description below. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as = "h2",
  className,
  titleClassName,
  children,
}: Readonly<SectionHeadingProps>) {
  const Tag = as

  return (
    <div className={cn("flex flex-col gap-2", align === "center" && "items-center text-center", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Tag className={cn("font-display text-balance text-ink", TITLE_SIZE[as], titleClassName)}>
        {title}
      </Tag>
      {description && (
        <p className={cn("max-w-[60ch] text-body text-ink-soft", align === "center" && "mx-auto")}>
          {description}
        </p>
      )}
      {children}
    </div>
  )
}

export default SectionHeading
