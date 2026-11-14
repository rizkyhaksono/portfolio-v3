import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Notion's select tag, shared by Badge and Chip: a grey fill, 4px corners, 14px text. Status is shape plus word, never colour.
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded px-1.5 text-small leading-6 text-foreground",
  {
    variants: {
      variant: {
        default: "bg-tint-strong",
        secondary: "bg-tint",
        destructive: "bg-tint-strong font-medium",
        outline: "border border-border bg-transparent leading-[1.375rem]",
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
  extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof badgeVariants> {
  /** 8px square before the word: filled = on/live, outline = off, dashed = draft/archived. */
  status?: keyof typeof STATUS_SQUARE
}

// A span, so a badge can sit inside a line of text (a <div> in a <p> breaks hydration).
function Badge({ className, variant, status, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {status && <span aria-hidden className={cn("size-2 shrink-0 border border-current", STATUS_SQUARE[status])} />}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }
