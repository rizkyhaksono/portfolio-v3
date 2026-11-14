import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// The tag look shared by Badge and Chip. Status is shape plus word, never colour.
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-small font-medium text-foreground",
  {
    variants: {
      variant: {
        default: "bg-muted",
        secondary: "bg-muted",
        destructive: "bg-muted font-semibold",
        outline: "border border-border bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const STATUS_SQUARE = {
  filled: "bg-current",
  outline: "",
  dashed: "border-dashed",
} as const

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> {
  /** 8px square before the word: filled = on/live, outline = off, dashed = draft/archived. */
  status?: keyof typeof STATUS_SQUARE
}

function Badge({ className, variant, status, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {status && <span aria-hidden className={cn("size-2 shrink-0 border border-current", STATUS_SQUARE[status])} />}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
