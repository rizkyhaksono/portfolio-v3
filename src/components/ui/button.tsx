import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

// Notion buttons: 6px corners, 14px medium text, a flat fill or a translucent hover, no lift and no shadow.
// Destructive keeps its cross, so the danger never rests on colour alone.
const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-small font-medium transition-colors duration-press ease-out disabled:pointer-events-none disabled:opacity-40 [@media(pointer:coarse)]:min-h-11 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:bg-foreground/85",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-foreground/15 bg-background text-foreground hover:bg-tint",
        secondary: "bg-tint text-foreground hover:bg-tint-strong",
        ghost: "text-foreground hover:bg-tint",
        link: "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-3",
        sm: "h-7 px-2",
        lg: "h-10 px-4",
        xl: "h-11 px-5 text-body",
        icon: "size-8 [@media(pointer:coarse)]:min-w-11",
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
