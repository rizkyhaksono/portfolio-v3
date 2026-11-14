import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// The Tag look shared by Badge and Chip: 12px roman in a 1px frame. Status is shape plus word, never colour.
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-none border px-2 py-0.5 text-xs leading-snug text-foreground",
  {
    variants: {
      variant: {
        default: "border-foreground",
        secondary: "border-input",
        destructive: "border-foreground font-semibold",
        outline: "border-input",
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
