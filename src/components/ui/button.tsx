import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

// One ink: solid, outline, or underline. Destructive is an outline with a cross and a verb, never red.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none font-sans text-[15px] font-semibold not-italic leading-tight transition-[color,background-color,transform] [transition-duration:var(--dur-press)] [transition-timing-function:var(--ease-print)] active:translate-y-px disabled:pointer-events-none disabled:border-dashed disabled:border-rule-strong disabled:text-ink-soft [@media(pointer:coarse)]:min-h-11 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Disabled is a dashed empty slot in tokens, not a faded fill (opacity greys the ink in Night print).
        default: "bg-primary text-primary-foreground hover:bg-primary/90 disabled:border disabled:bg-tint",
        destructive:
          "border border-destructive bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground",
        outline: "border border-ink bg-transparent text-ink hover:bg-tint",
        secondary: "bg-secondary text-secondary-foreground hover:bg-rule/60",
        ghost: "text-ink decoration-1 underline-offset-[0.18em] hover:underline",
        link: "text-ink underline decoration-1 underline-offset-[0.18em] hover:decoration-2",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-small",
        lg: "h-11 px-6",
        xl: "h-12 px-7 text-base",
        icon: "h-10 w-10 [@media(pointer:coarse)]:min-w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {/* Slot needs exactly one child, so asChild never gets the cross (not even a `false` sibling). */}
        {asChild ? (
          children
        ) : (
          <>
            {variant === "destructive" && <X aria-hidden strokeWidth={1.5} />}
            {children}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
