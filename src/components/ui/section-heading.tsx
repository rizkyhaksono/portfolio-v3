import { cn } from "@/lib/utils"
import { Eyebrow } from "@/components/ui/eyebrow"

interface SectionHeadingProps {
  eyebrow?: React.ReactNode
  /** Optional step marker shown inside the eyebrow (e.g. "3"). */
  marker?: React.ReactNode
  title: React.ReactNode
  /** Serif-italic accent appended to the title, rendered in the accent colour. */
  accent?: React.ReactNode
  description?: React.ReactNode
  align?: "left" | "center"
  as?: "h1" | "h2" | "h3"
  className?: string
  titleClassName?: string
  children?: React.ReactNode
}

/**
 * Eyebrow + display heading (with optional serif-italic accent word) + description.
 * The one section-header pattern used across the whole site.
 */
export function SectionHeading({
  eyebrow,
  marker,
  title,
  accent,
  description,
  align = "left",
  as = "h2",
  className,
  titleClassName,
  children,
}: Readonly<SectionHeadingProps>) {
  const Tag = as
  const sizes =
    as === "h1"
      ? "text-3xl sm:text-4xl md:text-5xl"
      : "text-2xl sm:text-3xl"

  return (
    <div className={cn("flex flex-col gap-2", align === "center" && "items-center text-center", className)}>
      {eyebrow && <Eyebrow marker={marker}>{eyebrow}</Eyebrow>}
      <Tag className={cn("font-display font-bold leading-[1.05] tracking-tight text-balance", sizes, titleClassName)}>
        {title}
        {accent && <span className="font-serif font-normal italic tracking-normal text-primary"> {accent}</span>}
      </Tag>
      {description && (
        <p className={cn("max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm", align === "center" && "mx-auto")}>
          {description}
        </p>
      )}
      {children}
    </div>
  )
}

export default SectionHeading
