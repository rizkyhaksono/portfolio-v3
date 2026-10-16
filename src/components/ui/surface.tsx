import {
  forwardRef,
  type HTMLAttributes,
} from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { SURFACE, SURFACE_PADDING } from "@/lib/design-system"

/** Frame (`solid`) and inset surfaces. `glass` variants are retired aliases of the frame. */
const surfaceVariants = cva("", {
  variants: {
    variant: {
      solid: cn(SURFACE.solid, SURFACE.solidHover),
      glass: SURFACE.glass,
      "glass-static": SURFACE.glassNoBlur,
      inset: SURFACE.inset,
    },
    padding: {
      none: "",
      default: SURFACE_PADDING.default,
      compact: SURFACE_PADDING.compact,
      cozy: SURFACE_PADDING.cozy,
    },
  },
  defaultVariants: {
    variant: "solid",
    padding: "none",
  },
})

export interface SurfaceProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof surfaceVariants> {}

/** Canonical content box. Prefer this (or Card) over ad-hoc bordered divs. */
export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div ref={ref} className={cn(surfaceVariants({ variant, padding }), className)} {...props} />
  ),
)
Surface.displayName = "Surface"

export { surfaceVariants }
