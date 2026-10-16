import { cn } from "@/lib/utils"
import { badgeVariants } from "@/components/ui/badge"

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon?: React.ReactNode
}

/** Inline Tag (tech, category). Same look as `Badge variant="outline"`, as a span. */
export function Chip({ icon, className, children, ...props }: Readonly<ChipProps>) {
  return (
    <span className={cn(badgeVariants({ variant: "outline" }), className)} {...props}>
      {icon}
      {children}
    </span>
  )
}

export default Chip
