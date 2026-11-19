import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Notion field: 36px, 6px corners, an ink edge on focus. The border keeps 3:1 on the page (WCAG 1.4.11), firmer than Notion's.
          "flex h-9 w-full py-1.5 rounded-md border border-transparent bg-tint px-3 text-base font-normal text-foreground transition-colors duration-75 ease-out placeholder:text-muted-foreground hover:bg-tint-strong focus-visible:border-border focus-visible:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/15 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive/60 sm:text-small file:border-0 file:bg-transparent file:text-small file:font-medium file:text-foreground [@media(pointer:coarse)]:min-h-11",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
