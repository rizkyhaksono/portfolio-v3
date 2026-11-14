import type { ComponentProps, HTMLAttributes, ReactNode } from "react"

import { cn } from "@/lib/utils"
import { SECTION_SPACING } from "@/lib/design-system"
import { SectionHeading } from "@/components/ui/section-heading"

interface PageSectionProps extends HTMLAttributes<HTMLElement> {
  /** Optional section heading props — when set, renders SectionHeading above children. */
  heading?: ComponentProps<typeof SectionHeading>
  /** Spacing between heading and content. Defaults to mt-6. */
  contentClassName?: string
  children?: ReactNode
}

/** A page section: the shared rhythm and an optional small label above the content. */
export function PageSection({
  heading,
  children,
  className,
  contentClassName,
  ...props
}: Readonly<PageSectionProps>) {
  return (
    <section className={cn(SECTION_SPACING.section, className)} {...props}>
      {heading && <SectionHeading {...heading} />}
      {children && (
        <div className={cn(heading ? SECTION_SPACING.sectionGap : undefined, contentClassName)}>{children}</div>
      )}
    </section>
  )
}

export default PageSection
