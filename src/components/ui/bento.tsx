import { cn } from "@/lib/utils"
import { SURFACE, SURFACE_PADDING } from "@/lib/design-system"

export function BentoGrid({ className, children }: Readonly<{ className?: string; children: React.ReactNode }>) {
  return <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-3", className)}>{children}</div>
}

interface FeatureCardProps {
  icon?: React.ReactNode
  title: React.ReactNode
  /** Serif-italic accent appended to the title. */
  accent?: React.ReactNode
  description?: React.ReactNode
  /** Large card spans 1 col + 2 rows (the anchor of a bento block). */
  large?: boolean
  className?: string
  children?: React.ReactNode
}

/**
 * Hairline-bordered solid feature card with a small icon top-left. Compose inside
 * <BentoGrid>; mark one card `large` for the Sapa 1-large + N-small layout.
 * Prefer this over inventing another bordered box for feature/platform grids.
 */
export function FeatureCard({ icon, title, accent, description, large, className, children }: Readonly<FeatureCardProps>) {
  return (
    <div
      className={cn(
        "group flex flex-col gap-3",
        SURFACE.solid,
        SURFACE.solidHover,
        SURFACE_PADDING.default,
        large && "md:row-span-2 md:justify-between",
        className,
      )}
    >
      {icon && (
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary text-primary [&_svg]:size-[18px]">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h3 className={cn("font-display font-bold tracking-tight", large ? "text-2xl sm:text-3xl" : "text-lg")}>
          {title}
          {accent && <span className="font-serif font-normal italic text-primary"> {accent}</span>}
        </h3>
        {description && <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{description}</p>}
      </div>
      {children}
    </div>
  )
}

export default BentoGrid
