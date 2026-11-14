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
          "flex h-9 w-full py-1.5 rounded-md border border-input bg-background px-2.5 text-base font-normal text-foreground transition-colors duration-ui ease-out placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-foreground sm:text-small file:border-0 file:bg-transparent file:text-small file:font-medium file:text-foreground [@media(pointer:coarse)]:min-h-11",
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
