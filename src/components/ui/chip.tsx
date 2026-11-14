import { cn } from "@/lib/utils"
import { badgeVariants } from "@/components/ui/badge"

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon?: React.ReactNode
}

/** Inline tag (tech, category): Notion's grey select tag, as a span. */
export function Chip({ icon, className, children, ...props }: Readonly<ChipProps>) {
  return (
    <span className={cn(badgeVariants({ variant: "default" }), className)} {...props}>
      {icon}
      {children}
    </span>
  )
}

export default Chip
